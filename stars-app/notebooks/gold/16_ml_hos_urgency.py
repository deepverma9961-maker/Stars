# Databricks notebook source
# COMMAND ----------
# MAGIC %md
# MAGIC # Gold Layer: ML HOS Urgency Score
# MAGIC
# MAGIC Trains a RandomForestRegressor that predicts a 15-98 urgency score for HOS
# MAGIC fall-risk members from the seven factors documented in the StarPulse UI:
# MAGIC fall_history_severity · awv_status · age · comorbidities · mock_survey ·
# MAGIC time_since_visit · homebound (weights 25/20/15/15/10/10/5).
# MAGIC
# MAGIC Overwrites `gold_hos_members.urgency_score` for the current measurement year
# MAGIC with model predictions. The notebook 14 must run first (it produces the row
# MAGIC set; this notebook only replaces one column).

# COMMAND ----------
dbutils.widgets.text("catalog", "medicare_stars")
CATALOG = dbutils.widgets.get("catalog")
YEAR = 2025

# COMMAND ----------
from pyspark.sql import SparkSession, functions as F
from pyspark.sql.types import DoubleType, IntegerType
import pandas as pd
import numpy as np
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error

spark = SparkSession.builder.getOrCreate()

# COMMAND ----------
# MAGIC %md
# MAGIC ## 1. Pull current HOS member roster and member-level features

# COMMAND ----------
hos_members = spark.table(f"{CATALOG}.gold.gold_hos_members").filter(
    F.col("measurement_year") == YEAR
).toPandas()
print(f"HOS members: {len(hos_members):,}")

# Comorbidities count
hos_members["comorbidities_count"] = (
    hos_members["comorbidities"].fillna("").apply(lambda s: 0 if not s else len([x for x in s.split(",") if x]))
)

# Categoricals
SURVEY_MAP = {"Yes": 0, "No response": 1, "No": 2}
hos_members["survey_score"] = hos_members["mock_survey_response"].map(SURVEY_MAP).fillna(1).astype(int)

# Parse last_visit (e.g. "Apr 15") to month-distance from May 2025
MONTH_MAP = {"Jan":1,"Feb":2,"Mar":3,"Apr":4,"May":5,"Jun":6,"Jul":7,"Aug":8,"Sep":9,"Oct":10,"Nov":11,"Dec":12}
def _months_since_visit(s):
    if not isinstance(s, str) or " " not in s:
        return 6
    mo = MONTH_MAP.get(s.split()[0], 5)
    return max(0, 5 - mo)
hos_members["months_since_visit"] = hos_members["last_provider_visit"].apply(_months_since_visit)

# Fall history severity proxy from claims (W00-W19 in last 24 months)
member_ids = hos_members["member_id"].dropna().unique().tolist()
if member_ids:
    claims = spark.table(f"{CATALOG}.silver.silver_claim").filter(
        F.col("member_id").isin(member_ids) &
        F.col("icd10_primary").rlike("^W(0[0-9]|1[0-9])")
    ).groupBy("member_id").agg(F.count("*").alias("fall_history_severity")).toPandas()
    hos_members = hos_members.merge(claims, on="member_id", how="left")
else:
    hos_members["fall_history_severity"] = 0
hos_members["fall_history_severity"] = hos_members["fall_history_severity"].fillna(0).astype(int)

# Coerce booleans to int
hos_members["awv_completed"] = hos_members["awv_completed"].fillna(False).astype(int)
hos_members["homebound"] = hos_members["homebound"].fillna(False).astype(int)
hos_members["age"] = hos_members["age"].fillna(75).astype(int)

# COMMAND ----------
# MAGIC %md
# MAGIC ## 2. Build factor-weighted training target (recovers the published schema)

# COMMAND ----------
# Normalised factor scores in [0,1]
def _norm(s, lo, hi):
    s = s.astype(float).clip(lo, hi)
    return (s - lo) / (hi - lo) if hi > lo else s * 0.0

age_score = _norm(hos_members["age"], 65, 92)
fall_score = _norm(hos_members["fall_history_severity"], 0, 4)
comorbid_score = _norm(hos_members["comorbidities_count"], 0, 4)
visit_score = _norm(hos_members["months_since_visit"], 0, 6)
survey_score = hos_members["survey_score"] / 2.0  # 0..1

# Published weights (sum to 100)
target = (
    25 * fall_score
  + 20 * (1 - hos_members["awv_completed"])
  + 15 * age_score
  + 15 * comorbid_score
  + 10 * survey_score
  + 10 * visit_score
  +  5 * hos_members["homebound"]
)
rng = np.random.RandomState(42)
target = (target + rng.normal(0, 4, len(target))).clip(15, 98)
hos_members["urgency_target"] = target

FEATURES = [
    "fall_history_severity", "awv_completed", "age", "comorbidities_count",
    "survey_score", "months_since_visit", "homebound",
]
X = hos_members[FEATURES].values
y = hos_members["urgency_target"].values

# COMMAND ----------
# MAGIC %md
# MAGIC ## 3. Train + log

# COMMAND ----------
mlflow.set_experiment("/Shared/medicare_stars/hos_urgency")
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

with mlflow.start_run(run_name=f"hos_urgency_{YEAR}") as run:
    mlflow.log_params({
        "algo": "RandomForestRegressor",
        "n_estimators": 200,
        "max_depth": 6,
        "measurement_year": YEAR,
    })
    model = RandomForestRegressor(n_estimators=200, max_depth=6, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    pred = model.predict(X_val)
    mae = mean_absolute_error(y_val, pred)
    rmse = float(np.sqrt(mean_squared_error(y_val, pred)))
    mlflow.log_metrics({"mae": mae, "rmse": rmse})
    for fn, imp in zip(FEATURES, model.feature_importances_):
        mlflow.log_metric(f"feat_imp__{fn}", float(imp))
    mlflow.sklearn.log_model(model, "model", registered_model_name="medicare_stars_hos_urgency")
    print(f"MAE={mae:.2f}  RMSE={rmse:.2f}")
    print("Feature importances:", dict(zip(FEATURES, model.feature_importances_.round(3).tolist())))

# COMMAND ----------
# MAGIC %md
# MAGIC ## 4. Score every HOS member and overwrite urgency_score

# COMMAND ----------
preds = model.predict(hos_members[FEATURES].values).clip(15, 98).round().astype(int)
hos_members["urgency_score_new"] = preds
hos_members["risk_level_new"] = np.where(preds >= 70, "High", np.where(preds >= 40, "Medium", "Low"))
hos_members["handler_new"] = np.where(preds >= 55, "Care mgmt", "Outreach")

update_df = hos_members[["member_key", "urgency_score_new", "risk_level_new", "handler_new"]]
spark.createDataFrame(update_df).createOrReplaceTempView("hos_urgency_update")

spark.sql(f"""
    MERGE INTO {CATALOG}.gold.gold_hos_members h
    USING hos_urgency_update u
      ON h.member_key = u.member_key
    WHEN MATCHED THEN UPDATE SET
        h.urgency_score = u.urgency_score_new,
        h.risk_level    = u.risk_level_new,
        h.handler       = u.handler_new
""")
print(f"gold_hos_members.urgency_score updated for {len(update_df):,} rows.")
