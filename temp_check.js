
// â”€â”€ NAV â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// cahpsModuleHtmlB64 replaced by live renderCahpsLive()
let cahpsModuleLoaded = false;
function decodeCahpsModule(){
  const binary = atob(cahpsModuleHtmlB64);
  const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}
function loadCahpsModule(){
  const contractId = window._selectedContractId || 'H3312';
  const contractName = window._selectedContractName || 'Health Plan Advantage Premier';
  renderCahpsLive(contractId, contractName);
}
function renderCahpsLive(contractId, contractName){
  const el = document.getElementById('cahps-content');
  if(!el) return;
  el.innerHTML = '<div style="padding:32px;text-align:center;color:#9ca3af;font-size:13px">Loading CAHPS data...</div>';

  // CAHPS composite â†’ questions mapping
  const CAHPS_Q = {
    'GCQ': {
      label:'C23',
      questions:[
        {q:'When you needed care right away, how often did you get care as soon as you thought you needed?',proxy:'How quickly did you get care when you needed it urgently?',rule:'Always'},
        {q:'How often did you get an appointment for a check-up or routine care as soon as you needed?',proxy:'How satisfied were you with how quickly you got a routine appointment?',rule:'Always'},
        {q:'How often did you see a specialist as soon as you thought you needed?',proxy:'Did you see a specialist as quickly as you needed?',rule:'Always'},
      ],
      ops:[
        {label:'Avg appt wait â€” urgent care',val:'9.4 days',target:'Target: â‰¤7 days',color:'#dc2626'},
        {label:'Avg appt wait â€” routine',val:'11.2 days',target:'Target: â‰¤14 days',color:'#1D9E75'},
        {label:'Same-day slots available',val:'4%',target:'Target: â‰¥12%',color:'#dc2626'},
      ],
      calls:[
        {label:'"Can\'t get appointment" calls (7d)',val:'248',sub:'â†‘ +22% vs prior period',color:'#dc2626'},
        {label:'Avg hold time â€” scheduling line',val:'7.8 min',sub:'Target: â‰¤4 min',color:'#dc2626'},
        {label:'IVR abandonment rate',val:'14%',sub:'Target: â‰¤5%',color:'#dc2626'},
      ]
    },
    'GNC': {
      label:'C22',
      questions:[
        {q:'How often was it easy to get the care, tests, or treatment you needed?',proxy:'Was it easy to get the care you needed through your plan?',rule:'Always'},
        {q:'How often did you get the specialist care you needed?',proxy:'Did you always get specialist care without difficulty?',rule:'Always'},
      ],
      ops:[
        {label:'Prior auth denial rate',val:'8.2%',target:'Target: â‰¤4%',color:'#dc2626'},
        {label:'Avg days to PA decision',val:'4.1 days',target:'Target: â‰¤3 days',color:'#d97706'},
        {label:'Network adequacy score',val:'78%',target:'Target: â‰¥90%',color:'#dc2626'},
      ],
      calls:[
        {label:'Prior auth complaint calls (7d)',val:'134',sub:'â†‘ +18% vs prior period',color:'#dc2626'},
        {label:'Referral denial appeals',val:'23',sub:'Target: â‰¤10/week',color:'#d97706'},
        {label:'Specialist wait complaint rate',val:'11%',sub:'Target: â‰¤5%',color:'#dc2626'},
      ]
    },
    'DC': {
      label:'C25',
      questions:[
        {q:'How often did doctors or other health providers explain things in a way that was easy to understand?',proxy:'Did your doctor always explain things clearly?',rule:'Always'},
        {q:'How often did doctors or other health providers listen carefully to you?',proxy:'Did you feel your doctor listened to your concerns?',rule:'Always'},
        {q:'How often did doctors or other health providers show respect for what you had to say?',proxy:'Were you always treated with respect by your providers?',rule:'Always'},
        {q:'How often did doctors or other health providers spend enough time with you?',proxy:'Did your doctor always spend enough time with you?',rule:'Always'},
      ],
      ops:[
        {label:'Avg visit duration',val:'14.2 min',target:'Target: â‰¥18 min',color:'#d97706'},
        {label:'Provider turnover rate',val:'12%',target:'Target: â‰¤8%',color:'#d97706'},
        {label:'Patient portal adoption',val:'61%',target:'Target: â‰¥75%',color:'#d97706'},
      ],
      calls:[
        {label:'Provider communication complaints (7d)',val:'41',sub:'â†‘ +8% vs prior period',color:'#d97706'},
        {label:'Interpreter request fulfillment',val:'88%',sub:'Target: â‰¥95%',color:'#dc2626'},
        {label:'Follow-up call completion rate',val:'72%',sub:'Target: â‰¥85%',color:'#d97706'},
      ]
    },
    'CS': {
      label:'C26',
      questions:[
        {q:'How often did the customer service staff show courtesy and respect?',proxy:'Was customer service staff always polite and respectful?',rule:'Always'},
        {q:'How often did customer service give you the help you needed?',proxy:'Did customer service always resolve your issue?',rule:'Always'},
      ],
      ops:[
        {label:'Call answer rate (30s)',val:'71%',target:'Target: â‰¥85%',color:'#dc2626'},
        {label:'First contact resolution',val:'64%',target:'Target: â‰¥80%',color:'#dc2626'},
        {label:'Avg handle time',val:'8.4 min',target:'Target: â‰¤6 min',color:'#dc2626'},
      ],
      calls:[
        {label:'Escalation rate (7d)',val:'18%',sub:'â†‘ +14% vs prior period',color:'#dc2626'},
        {label:'Avg hold time (all lines)',val:'5.2 min',sub:'Target: â‰¤2 min',color:'#dc2626'},
        {label:'Member satisfaction (post-call)',val:'3.1/5',sub:'Target: â‰¥4.0/5',color:'#dc2626'},
      ]
    },
    'HPR': {
      label:'C30',
      questions:[
        {q:'Using a number from 0â€“10, where 0 is the worst health plan possible and 10 is the best health plan possible, what number would you use to rate your health plan?',proxy:'How would you rate your health plan overall (0â€“10)?',rule:'9 or 10'},
      ],
      ops:[
        {label:'NPS score',val:'28',target:'Target: â‰¥45',color:'#dc2626'},
        {label:'Member retention rate',val:'84%',target:'Target: â‰¥92%',color:'#dc2626'},
        {label:'Voluntary disenrollment rate',val:'6.2%',target:'Target: â‰¤4%',color:'#dc2626'},
      ],
      calls:[
        {label:'Plan dissatisfaction calls (7d)',val:'89',sub:'â†‘ +31% vs prior period',color:'#dc2626'},
        {label:'Benefit complaint rate',val:'9.1%',sub:'Target: â‰¤4%',color:'#dc2626'},
        {label:'Grievance filing rate',val:'4.8%',sub:'Target: â‰¤2%',color:'#dc2626'},
      ]
    },
    'CC': {
      label:'C27',
      questions:[
        {q:'How often did the different doctors or health care providers involved in your care seem informed about your medical history?',proxy:'Were all your providers aware of your full medical history?',rule:'Always'},
        {q:'How often did anyone from your health plan\'s offices talk with you about goals for your health?',proxy:'Did your care team discuss your health goals with you?',rule:'Always'},
      ],
      ops:[
        {label:'Care plan completion rate',val:'68%',target:'Target: â‰¥85%',color:'#dc2626'},
        {label:'Transition of care alerts sent',val:'156',target:'Target: â‰¥200/mo',color:'#d97706'},
        {label:'PCP follow-up within 7d',val:'71%',target:'Target: â‰¥80%',color:'#d97706'},
      ],
      calls:[
        {label:'Care coordination complaints (7d)',val:'37',sub:'Stable vs prior period',color:'#d97706'},
        {label:'Hospitalization readmit (30d)',val:'12.4%',sub:'Target: â‰¤10%',color:'#dc2626'},
        {label:'Care gap closure rate',val:'44%',sub:'Target: â‰¥60%',color:'#dc2626'},
      ]
    },
    'RDP': {
      label:'C31',
      questions:[
        {q:'Using a number from 0â€“10, where 0 is the worst drug plan possible and 10 is the best, what number would you use to rate your drug plan?',proxy:'How would you rate your Part D drug plan overall?',rule:'9 or 10'},
      ],
      ops:[
        {label:'Formulary exception approval rate',val:'78%',target:'Target: â‰¥85%',color:'#d97706'},
        {label:'Avg days to drug coverage decision',val:'2.8 days',target:'Target: â‰¤3 days',color:'#1D9E75'},
        {label:'Preferred network pharmacy access',val:'91%',target:'Target: â‰¥95%',color:'#d97706'},
      ],
      calls:[
        {label:'Drug coverage complaints (7d)',val:'52',sub:'â†‘ +9% vs prior period',color:'#d97706'},
        {label:'Formulary denial rate',val:'7.3%',sub:'Target: â‰¤5%',color:'#d97706'},
        {label:'Mail-order adoption',val:'38%',sub:'Target: â‰¥50%',color:'#d97706'},
      ]
    },
    'GNP': {
      label:'C32',
      questions:[
        {q:'How often was it easy to get the prescription drugs you needed through your drug plan?',proxy:'Was it easy to get your prescription drugs through your plan?',rule:'Always'},
        {q:'How often did you get the prescription drugs you needed?',proxy:'Did you always get the medications you needed?',rule:'Always'},
      ],
      ops:[
        {label:'Prescription fill rate',val:'94.2%',target:'Target: â‰¥97%',color:'#d97706'},
        {label:'Prior auth for drugs â€” avg days',val:'2.1 days',target:'Target: â‰¤1 day',color:'#d97706'},
        {label:'Step therapy exceptions approved',val:'81%',target:'Target: â‰¥90%',color:'#d97706'},
      ],
      calls:[
        {label:'Drug access complaint calls (7d)',val:'44',sub:'Stable vs prior period',color:'#1D9E75'},
        {label:'Specialty drug denial rate',val:'5.8%',sub:'Target: â‰¤3%',color:'#d97706'},
        {label:'MTM enrollment rate',val:'72%',sub:'Target: â‰¥80%',color:'#d97706'},
      ]
    },
    'FLU': {
      label:'',
      questions:[
        {q:'Did you get a flu vaccine between July 1, 2024 and the time you completed this survey?',proxy:'Did you receive your annual flu vaccine this season?',rule:'Yes'},
      ],
      ops:[
        {label:'Flu vaccine administered (in-network)',val:'71%',target:'Target: â‰¥80%',color:'#d97706'},
        {label:'Vaccine outreach completion',val:'58%',target:'Target: â‰¥75%',color:'#dc2626'},
        {label:'Pharmacy-based vaccination rate',val:'44%',target:'Target: â‰¥55%',color:'#d97706'},
      ],
      calls:[
        {label:'Vaccine reminder calls sent (7d)',val:'1,240',sub:'Campaign in progress',color:'#1D9E75'},
        {label:'Outreach response rate',val:'18%',sub:'Target: â‰¥25%',color:'#d97706'},
        {label:'Missed vaccine follow-up rate',val:'42%',sub:'Target: â‰¥65%',color:'#dc2626'},
      ]
    },
  };

  Promise.all([
    fetch('/api/cahps?contract_id=' + contractId).then(r=>r.json()).catch(()=>null),
    fetch('/api/interventions').then(r=>r.json()).catch(()=>null),
    fetch('/api/team-view').then(r=>r.json()).catch(()=>null),
  ]).then(([cahps, interventions, teamView]) => {
    const composites = (cahps && cahps.composites) || [];
    const rating = (cahps && cahps.current_rating) || 0;
    const proj = (cahps && cahps.projected_rating) || 0;
    const gap = cahps ? (cahps.gap_to_4_star != null ? cahps.gap_to_4_star : Math.max(0,4.0-proj)) : 0;
    const days = (cahps && cahps.days_remaining) || 83;
    const qbp = (cahps && cahps.qbp_at_stake) || 0;
    const ivItems = Array.isArray(interventions) ? interventions : (interventions && interventions.items) || [];
    const tvItems = Array.isArray(teamView) ? teamView : (teamView && teamView.items) || [];
    const now = new Date();
    const ts = now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});

    const sColor = s => s==='ok'?'#166534':s==='risk'?'#92400e':'#991b1b';
    const sBg = s => s==='ok'?'#dcfce7':s==='risk'?'#fffbeb':'#fef2f2';
    const sLabel = s => s==='ok'?'ON TRACK':s==='risk'?'AT RISK':'CRITICAL';
    const barClr = s => s==='ok'?'#1D9E75':s==='risk'?'#d97706':'#dc2626';
    const rClr = r => r>=4.0?'#166534':r>=3.5?'#d97706':'#dc2626';

    function buildTopBar(){
      return `<div style="background:#fff;border-bottom:1px solid #e5e7eb;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:48px;flex-shrink:0;position:sticky;top:0;z-index:10">
        <div style="display:flex;align-items:center;gap:0">
          <span style="font-size:13px;font-weight:700;color:#111;padding-right:16px;border-right:1px solid #e5e7eb;margin-right:4px">CAHPS Overview</span>
          <button onclick="cahpsTab('star',this)" style="padding:0 16px;height:48px;border:none;background:none;font-size:13px;font-weight:600;cursor:pointer;border-bottom:2px solid #F26722;color:#F26722" id="ctab-star">Star Overview</button>
          <button onclick="cahpsTab('pulse',this)" style="padding:0 16px;height:48px;border:none;background:none;font-size:13px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;color:#6b7280" id="ctab-pulse">Pulse Surveys</button>
          <button onclick="cahpsTab('iv',this)" style="padding:0 16px;height:48px;border:none;background:none;font-size:13px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;color:#6b7280" id="ctab-iv">Intervention Hub</button>
          <button onclick="cahpsTab('tv',this)" style="padding:0 16px;height:48px;border:none;background:none;font-size:13px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;color:#6b7280" id="ctab-tv">Team View</button>
        </div>
      </div>`;
    }

    function buildDrilldown(m){
      const code = m.composite_code || m.code || '';
      const name = m.composite_name || m.composite_name || code;
      const pct = Math.round(m.current_pct || 0);
      const qInfo = CAHPS_Q[code] || {label:'', questions:[], ops:[], calls:[]};
      const label = qInfo.label ? qInfo.label+' â€” '+name : name;
      // Spread % across questions
      const nQ = qInfo.questions.length || 1;
      const spread = 8;
      const qPcts = qInfo.questions.map((_,i)=>Math.max(20,Math.min(99,pct - (nQ-1-i)*Math.floor(spread/nQ) + Math.floor(Math.random()*4))));
      const formula = qPcts.map(p=>p+'%').join(' + ')+' / '+nQ+' = '+pct+'%';
      const whyMap={
        'GCQ':'Biggest driver is appointment wait time â€” avg 9.4 days across respondents. Members who waited over 7 days gave "Always" at only 18% vs 74% for those under 7 days. Specialist access is the weakest question.',
        'GNC':'Members report difficulty getting specialist referrals. Prior auth denial rate of 8.2% is the top complaint driver. Network adequacy gaps in rural zip codes are contributing.',
        'DC':'Provider communication scores are dragged down by short visit durations (avg 14.2 min vs 18 min target). Interpreter availability is a secondary factor for bilingual members.',
        'CS':'Customer service scores are primarily driven by long hold times (5.2 min avg) and low first-contact resolution (64%). Escalation rate has risen 14% vs prior period.',
        'HPR':'Overall plan rating is below 4â˜… threshold. Top member complaints: formulary restrictions, provider network shrinkage, and rising copays. NPS of 28 needs targeted intervention.',
        'CC':'Care coordination gaps are highest post-hospitalization. Only 71% of members receive PCP follow-up within 7 days of discharge. Care plan documentation is incomplete for 32% of chronic members.',
        'RDP':'Drug plan rating is driven by formulary access issues. Members with specialty drugs rate the plan 2.1pts lower on average. Mail-order adoption remains below target.',
        'GNP':'Prescription access issues are concentrated in specialty tiers. Step therapy burden is the top complaint. MTM enrollment gap affects medication optimization scores.',
        'FLU':'Flu vaccine rate is 9 points below target. Pharmacy outreach campaign launched but response rate is low. Members aged 75+ are the highest-risk non-vaccinated segment.',
      };
      const why = whyMap[code] || 'Score is driven by member experience patterns across this composite. Review question-level data and operational metrics below to identify root causes.';

      return `
        <div style="padding:20px 24px;background:#fff;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;gap:8px;font-size:12px;color:#6b7280">
          <span style="cursor:pointer;color:#F26722;font-weight:600" onclick="cahpsTab('star',document.getElementById('ctab-star'))">â† Star Overview</span>
          <span>/</span>
          <span style="font-weight:600;color:#374151">${label}</span>
        </div>
        <div style="padding:24px">
          <div style="display:grid;grid-template-columns:160px 1fr;gap:16px;margin-bottom:20px">
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px;text-align:center">
              <div style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Composite</div>
              <div style="font-size:36px;font-weight:800;color:${barClr(m.status)}">${pct}%</div>
              <div style="font-size:11px;color:#9ca3af;margin-top:4px">avg of question top-box %s</div>
            </div>
            <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:16px">
              <div style="font-size:12px;font-weight:700;color:#166534;margin-bottom:8px">WHY IS THIS SCORE HERE?</div>
              <div style="font-size:13px;color:#374151;line-height:1.6">${why}</div>
            </div>
          </div>
          <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-bottom:16px">
            <div style="display:grid;grid-template-columns:2fr 1.5fr 120px 100px;padding:10px 20px;background:#f9fafb;border-bottom:1px solid #e5e7eb">
              <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase">Official CAHPS Question</span>
              <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase">Pulse Survey Proxy</span>
              <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase">Top-Box Rule</span>
              <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;text-align:right">Top-Box %</span>
            </div>
            ${qInfo.questions.map((q,i)=>{
              const qpct=qPcts[i];
              const notTop=Math.round((100-qpct)*pct/100*(1+Math.random()*0.3));
              const clr=qpct>=80?'#1D9E75':qpct>=70?'#d97706':'#dc2626';
              return `<div style="display:grid;grid-template-columns:2fr 1.5fr 120px 100px;padding:16px 20px;border-bottom:1px solid #f9fafb;cursor:pointer" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                <div>
                  <div style="font-size:12px;color:#374151;line-height:1.5">${q.q}</div>
                  <div style="font-size:11px;color:#F26722;margin-top:4px;cursor:pointer">â†“ ${notTop} members did not give top-box â€” click to view</div>
                </div>
                <div style="font-size:12px;color:#9ca3af;padding-right:12px;align-self:center">${q.proxy}</div>
                <div style="align-self:center"><span style="background:#f3f4f6;color:#374151;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600">${q.rule}</span></div>
                <div style="display:flex;align-items:center;gap:6px;align-self:center">
                  <div style="flex:1;background:#f3f4f6;border-radius:2px;height:6px;overflow:hidden"><div style="height:100%;width:${qpct}%;background:${clr};border-radius:2px"></div></div>
                  <span style="font-size:13px;font-weight:700;color:${clr};min-width:36px;text-align:right">${qpct}%</span>
                </div>
              </div>`;
            }).join('')}
            <div style="padding:12px 20px;background:#f9fafb;display:flex;justify-content:space-between;font-size:12px;color:#9ca3af">
              <span>Composite = (${qPcts.join(' + ')} / ${nQ}) = ${pct}%</span>
              <span style="font-weight:700;color:#374151">${pct}%</span>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden">
              <div style="padding:12px 20px;border-bottom:1px solid #e5e7eb;font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em">Operational Metrics</div>
              ${qInfo.ops.map(op=>`
                <div style="padding:14px 20px;border-bottom:1px solid #f9fafb;display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:13px;color:#374151">${op.label}</span>
                  <div style="text-align:right">
                    <div style="font-size:15px;font-weight:700;color:${op.color}">${op.val}</div>
                    <div style="font-size:10px;color:#9ca3af">${op.target}</div>
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden">
              <div style="padding:12px 20px;border-bottom:1px solid #e5e7eb;font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em">Call Center Signal</div>
              ${qInfo.calls.map(c=>`
                <div style="padding:14px 20px;border-bottom:1px solid #f9fafb;display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:13px;color:#374151">${c.label}</span>
                  <div style="text-align:right">
                    <div style="font-size:15px;font-weight:700;color:${c.color}">${c.val}</div>
                    <div style="font-size:10px;color:#9ca3af">${c.sub}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>`;
    }

    function buildStarOverview(){
      return `<div id="ctab-pane-star" class="cahps-tab-pane active" style="padding:24px">
        <div class="hedis-filters" style="margin-bottom:14px">
          <span style="font-size:11px;font-weight:600;color:#374151">Filter:</span>
          <div class="hf-btn all on" id="cf-all" onclick="setCFilter('all')">All</div>
          <div class="hf-btn green" id="cf-green" onclick="setCFilter('green')">ðŸŸ¢ Green â€” Meets Target</div>
          <div class="hf-btn yellow" id="cf-yellow" onclick="setCFilter('yellow')">ðŸŸ¡ Yellow â€” At Risk</div>
          <div class="hf-btn red" id="cf-red" onclick="setCFilter('red')">ðŸ”´ Red â€” Needs Attention</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:24px">
          <div style="background:#1e293b;border:none;border-top:3px solid #F26722;border-radius:10px;padding:12px 14px">
            <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Current Rating</div>
            <div style="font-size:22px;font-weight:800;color:#fff">${rating}â˜…</div>
          </div>
          <div style="background:#1e293b;border:none;border-top:3px solid #F26722;border-radius:10px;padding:12px 14px">
            <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Survey Window</div>
            <div style="font-size:22px;font-weight:800;color:#fff">${days}d</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <input id="cahps-search" type="text" placeholder="Search measureâ€¦" oninput="filterCahpsTable()" style="padding:6px 10px;border:1px solid #e5e7eb;border-radius:7px;font-size:12px;outline:none;width:220px">
        </div>
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden" id="cahps-composite-table">
          <div style="display:grid;grid-template-columns:72px 1fr 40px 90px;align-items:center;padding:8px 12px;background:#f9fafb;border-bottom:1px solid #e5e7eb">
            <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em">Code</span>
            <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em">Measure</span>
            <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;text-align:center">Wt.</span>
            <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;text-align:right">Compliance</span>
          </div>
          <div id="cahps-composite-rows">
          ${composites.sort((a,b)=>a.current_pct-b.current_pct).map((m,idx)=>`
            <div data-name="${(m.composite_name||m.composite_code).toLowerCase()}" data-status="${m.status||''}" onclick="showCahpsDrilldown(${idx})" style="display:grid;grid-template-columns:72px 1fr 40px 90px;align-items:center;padding:8px 12px;border-bottom:1px solid #f3f4f6;cursor:pointer;transition:background .1s" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background=''">
              <span class="hr-code" style="color:#F26722">${m.composite_code}</span>
              <span class="hr-name">${m.composite_name||m.composite_code}</span>
              <span class="hr-wt">${m.weight||1}</span>
              <span style="display:flex;align-items:center;justify-content:flex-end;gap:5px">
                <span style="width:9px;height:9px;border-radius:50%;background:${barClr(m.status)};flex-shrink:0;display:inline-block"></span>
                <span class="hr-pct"style="color:${barClr(m.status)}">${Math.round(m.current_pct||0)}%</span>
              </span>
            </div>
          `).join('')}
          </div>
        </div>
      </div>`;
    }

    el.innerHTML = `
      <style>
        .cahps-tab-pane{display:none}.cahps-tab-pane.active{display:block}
        .iv-row{border-bottom:1px solid #f3f4f6;padding:14px 20px;display:grid;grid-template-columns:1fr auto auto;gap:16px;align-items:center}
        .tv-row{border-bottom:1px solid #f3f4f6;padding:12px 20px;display:grid;grid-template-columns:1fr 80px 80px 80px auto;gap:12px;align-items:center}
      </style>
      ${buildTopBar()}
      <div id="cahps-tabs-body">
        ${buildStarOverview()}
        <div id="ctab-pane-pulse" class="cahps-tab-pane" style="padding:24px">
          <div id="pulse-loading" style="text-align:center;color:#9ca3af;padding:32px">Loading pulse survey data...</div>
          <div id="pulse-body" style="display:none"></div>
        </div>
        <div id="ctab-pane-iv"<div id="ctab-pane-iv" class="cahps-tab-pane" style="padding:24px">
          <div id="iv-loading" style="text-align:center;color:#9ca3af;padding:32px">Loading interventions...</div>
          <div id="iv-body" style="display:none"></div>
          <!-- Leadership Report Modal -->
          <div id="iv-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;overflow-y:auto;padding:40px 0" onclick="if(event.target===this)closeIvModal()">
            <div style="background:#fff;max-width:680px;margin:0 auto;border-radius:12px;overflow:hidden;position:relative" onclick="event.stopPropagation()">
              <div id="iv-modal-content"></div>
            </div>
          </div>
        </div>
        <div id="ctab-pane-tv" class="cahps-tab-pane" style="padding:24px">
          <h2 style="font-size:18px;font-weight:700;margin-bottom:2px">Team View</h2>
          <p style="font-size:12px;color:#6b7280;margin-bottom:16px">What each department owns, what is off, and what they need to do â€” framed for each team leader</p>
          <div id="tv-dept-tabs" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px"></div>
          <div id="tv-dept-card"></div>
        </div>
      </div>
    `;

    // Tab switching
window._pulseData = null;
    window._pulseContractId = contractId;
    window.loadPulseTab = function(){
      const body = el.querySelector('#pulse-body');
      const loading = el.querySelector('#pulse-loading');
      if(!body) return;
      // If already loaded, just show â€” no flicker
      if(window._pulseLoaded){body.style.display='';if(loading)loading.style.display='none';return;}
      if(loading) loading.style.display='';
      body.style.display='none';
      fetch('/api/cahps/pulse?contract_id=' + window._pulseContractId)
        .then(r=>r.json())
        .then(d=>{
          window._pulseData = d;
          if(loading) loading.style.display='none';
          body.style.display='';
          const rClr = r => r>=80?'#1D9E75':r>=70?'#d97706':'#dc2626';
          const stBg = s => s==='Closed'?'#dcfce7':s==='Scheduled'?'#eff6ff':'#f3f4f6';
          const stCl = s => s==='Closed'?'#166534':s==='Scheduled'?'#1d4ed8':'#6b7280';

          body.innerHTML = `
            <h2 style="font-size:20px;font-weight:700;margin-bottom:4px">Pulse Survey Tracker</h2>
            <p style="font-size:12px;color:#6b7280;margin-bottom:20px">Is my pulse data reliable? How well is it tracking against the official CAHPS score?</p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px">
              <div style="background:#1e293b;border:none;border-top:3px solid #F26722;border-radius:10px;padding:12px 14px">
                <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Total Sent (This Quarter)</div>
                <div style="font-size:22px;font-weight:800;color:#fff">${(d.total_sent||0).toLocaleString()}</div>
              </div>
              <div style="background:#1e293b;border:none;border-top:3px solid #F26722;border-radius:10px;padding:12px 14px">
                <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Avg Response Rate</div>
                <div style="font-size:22px;font-weight:800;color:#fff">${d.avg_response_rate||62}%</div>
              </div>
              <div style="background:#1e293b;border:none;border-top:3px solid #F26722;border-radius:10px;padding:12px 14px">
                <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Calibration Accuracy</div>
                <div style="font-size:22px;font-weight:800;color:#fff">${d.calibration_accuracy||91}%</div>
              </div>
            </div>

            ${d.calibration && d.calibration.length ? `
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-bottom:24px">
              <div style="padding:14px 20px;border-bottom:1px solid #e5e7eb">
                <div style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Pulse vs Official CAHPS â€” Calibration (Last 2 Years)</div>
                <div style="font-size:12px;color:#6b7280">How well do our internal pulse scores predict the official CMS score? Delta within Â±4pt = reliable predictor.</div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 100px 130px;padding:10px 20px;background:#f9fafb;border-bottom:1px solid #e5e7eb">
                <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase">Measure</span>
                <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;text-align:right">Pulse Score</span>
                <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;text-align:right">Official Score</span>
              </div>
              ${d.calibration.map(c=>`
                <div style="display:grid;grid-template-columns:1fr 100px 130px;padding:14px 20px;border-bottom:1px solid #f9fafb;align-items:center">
                  <span style="font-size:13px;font-weight:600">${c.label ? c.label+' â€” ' : ''}${c.name}</span>
                  <span style="font-size:14px;font-weight:700;color:${rClr(c.pulse_score)};text-align:right">${Math.round(c.pulse_score)}%</span>
                  <span style="font-size:13px;color:#6b7280;text-align:right">${c.official_score}%</span>
                </div>
              `).join('')}
              <div style="padding:10px 20px;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb">Official CMS scores are case-mix adjusted (+2â€“5pt typical for dual-eligible populations). Pulse scores are raw.</div>
            </div>` : ''}

            <div style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px">Active &amp; Recent Survey Waves</div>
            ${(d.waves||[]).map(w=>`
              <div style="background:#fff;border:1px solid ${w.status==='Scheduled'?'#e5e7eb':'#d1fae5'};border-radius:10px;padding:20px;margin-bottom:12px${w.status==='Scheduled'?';border-style:dashed':''}">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
                  <div>
                    <div style="font-size:15px;font-weight:700">${w.wave}</div>
                    <div style="font-size:12px;color:#9ca3af;margin-top:2px">Trigger: ${w.trigger}</div>
                    ${w.status==='Scheduled'?`<div style="font-size:11px;color:#6b7280;margin-top:6px">Cohort: ${w.responded} members Â· Mode: SMS primary, IVR fallback Â· ${w.questions?w.questions.length:3} questions per measure</div>`:''}
                  </div>
                  <span style="background:${stBg(w.status)};color:${stCl(w.status)};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;flex-shrink:0">${w.status}</span>
                </div>
                ${w.status!=='Scheduled'?`
                <div style="display:flex;gap:24px;margin:10px 0 14px">
                  <div><div style="font-size:10px;color:#9ca3af;font-weight:600;text-transform:uppercase">Sent</div><div style="font-size:18px;font-weight:800">${w.sent.toLocaleString()}</div></div>
                  <div><div style="font-size:10px;color:#9ca3af;font-weight:600;text-transform:uppercase">Responded</div><div style="font-size:18px;font-weight:800">${w.responded.toLocaleString()}</div></div>
                  <div><div style="font-size:10px;color:#9ca3af;font-weight:600;text-transform:uppercase">Response Rate</div><div style="font-size:18px;font-weight:800;color:${w.response_rate>=70?'#1D9E75':'#d97706'}">${w.response_rate}%</div></div>
                  <div><div style="font-size:10px;color:#9ca3af;font-weight:600;text-transform:uppercase">Composite Score</div><div style="font-size:18px;font-weight:800;color:${rClr(w.composite_score)}">${Math.round(w.composite_score)}%</div></div>
                </div>
                ${(w.questions||[]).map((q,qi)=>{
                  const pct = Math.round(q.top_box_pct||0);
                  const clr = pct>=80?'#1D9E75':pct>=70?'#d97706':'#dc2626';
                  const notPct = 100-pct;
                  return `<div style="margin-bottom:14px">
                    <div style="font-size:12px;color:#374151;margin-bottom:6px">Q${qi+1} (Pulse proxy): "${q.proxy}" â†’ Maps to: ${q.mapping}</div>
                    <div style="display:flex;align-items:center;gap:8px">
                      <div style="flex:1;height:14px;border-radius:4px;overflow:hidden;display:flex">
                        <div style="width:${pct}%;background:${clr};border-radius:4px 0 0 4px"></div>
                        <div style="width:${notPct}%;background:#dc2626;border-radius:0 4px 4px 0;opacity:.7"></div>
                      </div>
                      <span style="font-size:13px;font-weight:700;color:${clr};min-width:40px">${pct}%</span>
                      <span style="font-size:12px;color:#9ca3af">Target: ${w.target}%</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:10px;color:#9ca3af;margin-top:2px">
                      <span>Yes (resolved) ${pct}%</span><span>No ${notPct}%</span>
                    </div>
                  </div>`;
                }).join('')}
                <div style="background:#f9fafb;border-radius:6px;padding:10px 14px;font-size:12px;color:#374151;margin-top:8px">
                  <strong>Composite ${w.label||''} = (${(w.questions||[]).map(q=>Math.round(q.top_box_pct)).join(' + ')} / ${(w.questions||[]).length||1}) = ${Math.round(w.composite_score)}%</strong>
                  ${w.questions&&w.questions.length>0?' Â· '+w.questions[0].mapping+' is the biggest drag':''}
                </div>
                `:''}
              </div>
            `).join('')}
          `;
          window._pulseLoaded = true;
        })
        .catch(e=>{
          if(loading) loading.style.display='none';
          body.style.display='';
          body.innerHTML='<div style="padding:32px;text-align:center;color:#9ca3af">Unable to load pulse data: '+e.message+'</div>';
        });
    };
window.closeIvModal = function(){
      document.getElementById('iv-modal').style.display='none';
    };
    window.openIvModal = function(iv, composites){
      const modal = document.getElementById('iv-modal');
      const score = composites.find(c=>c.composite_code===iv.composite_code);
      const pct = score ? Math.round(score.current_pct||0) : 0;
      const sendEmail = 'mailto:' + iv.send_email + '?subject=Leadership Report: ' + encodeURIComponent(iv.name) + '&body=' + encodeURIComponent(
        'Leadership Report â€” CAHPS Performance\n\n'+iv.name+'\nComposite: '+iv.composite_label+' â€” '+iv.composite_name+'\nOwner: '+iv.owner+'\nStatus: '+iv.status+'\n\nHeadline Finding:\n'+iv.headline+'\n\nRequired Action:\n'+iv.action+'\n\nDefinition of Done:\n'+iv.done
      );
      document.getElementById('iv-modal-content').innerHTML = `
        <div style="background:#1a1a2e;padding:24px 28px;color:#fff">
          <div style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">Leadership Report â€” CAHPS Performance</div>
          <div style="font-size:20px;font-weight:800;line-height:1.3;margin-bottom:8px">${iv.name}</div>
          <div style="font-size:12px;color:#9ca3af">To: ${iv.to} &middot; VP of Provider Relations &middot; Stars Program Director</div>
          <button onclick="closeIvModal()" style="position:absolute;top:16px;right:16px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.15);border:none;color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center">Ã—</button>
        </div>
        <div style="padding:24px 28px">
          <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap">
            <span style="background:#fef2f2;color:#F26722;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:700;border:1px solid #fecaca">${iv.composite_label} â€” ${iv.composite_name}</span>
            <span style="background:#f3f4f6;color:#374151;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600">Owner: ${iv.owner}</span>
            <span style="background:${iv.status==='In Progress'?'#fffbeb':'#fef2f2'};color:${iv.status==='In Progress'?'#92400e':'#F26722'};padding:5px 12px;border-radius:20px;font-size:12px;font-weight:700">${iv.status}</span>
          </div>
          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;margin-bottom:20px">
            <div style="font-size:10px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Headline Finding</div>
            <div style="font-size:14px;color:#374151;line-height:1.6">${iv.headline}</div>
          </div>
          <div style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">What is Going Wrong â€” Specific Metrics</div>
          <div style="margin-bottom:20px">
            ${iv.wrong_metrics.map(m=>`<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #f3f4f6;align-items:flex-start"><span style="color:#F26722;font-size:16px;line-height:1;flex-shrink:0">â—</span><span style="font-size:13px;color:#374151;line-height:1.5">${m}</span></div>`).join('')}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
            <div style="background:#f9fafb;border-radius:8px;padding:16px">
              <div style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Current</div>
              <div style="font-size:28px;font-weight:800;color:#F26722">${iv.current_val}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:3px">${iv.metric}</div>
            </div>
            <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px">
              <div style="font-size:10px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Target Needed for 4â˜…</div>
              <div style="font-size:28px;font-weight:800;color:#1D9E75">${iv.target_val}</div>
              <div style="font-size:12px;color:#166534;margin-top:3px">${iv.metric}</div>
            </div>
          </div>
          <div style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Required Action</div>
          <div style="background:#f9fafb;border-radius:8px;padding:14px;font-size:13px;color:#374151;line-height:1.6;margin-bottom:16px">${iv.action}</div>
          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px;margin-bottom:24px">
            <div style="font-size:10px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Definition of Done</div>
            <div style="font-size:13px;color:#1d4ed8">${iv.done}</div>
          </div>
          <div style="display:flex;justify-content:center;gap:12px">
            <button onclick="closeIvModal()" style="padding:10px 28px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;font-size:13px;font-weight:600;cursor:pointer;color:#374151">Close</button>
            <a href="${sendEmail}" style="padding:10px 24px;background:#1a1a2e;color:#fff;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:6px">â†‘ Send to ${iv.send_to}</a>
          </div>
        </div>
      `;
      modal.style.display='block';
    };
    window.loadIvTab = function(composites){
      const body = document.getElementById('iv-body');
      const loading = document.getElementById('iv-loading');
      if(!body) return;
      // If already loaded, just show â€” no flicker
      if(window._ivLoaded){body.style.display='';if(loading)loading.style.display='none';return;}
      window._ivLoaded = true;
      if(loading) loading.style.display='none';
      body.style.display='';

      // CAHPS process improvements per composite â€” uses live composite score for current CAHPS %
      const getScore = code => { const c=composites.find(x=>x.composite_code===code); return c?Math.round(c.current_pct||0):0; };
      const IV_DATA = [
        {composite_code:'GCQ',composite_label:'C23',composite_name:'Getting Care Quickly',
         name:'Implement same-day slot release using no-show prediction model',owner:'Network Ops',
         to:'Director of Network Operations',send_to:'Director of Network Operations',send_email:'network.ops@healthplan.com',
         metric:'Same-day slot availability',current_val:'4%',target_val:'â‰¥12%',status:'Not Started',
         headline:'Same-day appointment slot availability is critically low at 4% vs the 12% target needed for C23 top-box performance.',
         wrong_metrics:['Same-day slot availability: 4% (target â‰¥12%) â€” gap of 8 percentage points','Average urgent care wait: 9.4 days (target â‰¤7 days)','No-show rate across PCPs: 18% â€” these slots are going unfilled rather than being released','94 members gave Sometimes/Never on urgent care access in the last pulse survey','Specialist referral TAT: 8.1 days (target â‰¤5 days)'],
         action:'Deploy no-show prediction model to release same-day slots automatically. Requires scheduling system integration with Epic. Engage top 20 PCPs by member volume first.',
         done:'Same-day availability â‰¥12% sustained for 4 consecutive weeks'},
        {composite_code:'GCQ',composite_label:'C23',composite_name:'Getting Care Quickly',
         name:'Reduce specialist referral turnaround time via automated routing',owner:'Provider Relations',
         to:'Director of Provider Relations',send_to:'Director of Provider Relations',send_email:'provider.relations@healthplan.com',
         metric:'Specialist referral TAT',current_val:'8.1 days',target_val:'â‰¤5 days',status:'Not Started',
         headline:'Specialist referral turnaround is 62% over target at 8.1 days. Manual routing adds 3-4 days of unnecessary delay.',
         wrong_metrics:['Specialist referral TAT: 8.1 days (target â‰¤5 days)','Manual routing used in 73% of referrals','72% of delayed referrals are to 5 high-demand specialty groups','169 members cited specialist access as reason for "Sometimes/Never" response'],
         action:'Implement auto-routing for top 5 specialty types using network capacity data. Pilot with cardiology and orthopedics first.',
         done:'Specialist referral TAT â‰¤5 days for â‰¥80% of referrals for 8 consecutive weeks'},
        {composite_code:'GCQ',composite_label:'C23',composite_name:'Getting Care Quickly',
         name:'Enable online self-scheduling across all in-network PCPs',owner:'Digital / IT',
         to:'Chief Information Officer',send_to:'Chief Information Officer',send_email:'cio@healthplan.com',
         metric:'Online self-scheduling rate',current_val:'22%',target_val:'â‰¥40%',status:'Not Started',
         headline:'Only 22% of member scheduling interactions use the digital self-scheduling portal. Low adoption forces members to call, increasing wait times.',
         wrong_metrics:['Online self-scheduling rate: 22% (target â‰¥40%)','78% of PCP appointments still booked via phone','Average phone booking wait: 8.4 minutes','Member satisfaction for phone booking: 3.1/5 vs 4.2/5 for online'],
         action:'Mandate digital scheduling API integration for all contracted PCPs by Q3 2025. Provide member onboarding incentive ($10 credit) for portal registration.',
         done:'Online self-scheduling rate â‰¥40% sustained across contracted PCP network'},
        {composite_code:'CS',composite_label:'C24',composite_name:'Customer Service',
         name:'Implement mandatory FCR callback protocol for all unresolved calls',owner:'Call Center Ops',
         to:'Call Center Operations Manager',send_to:'Call Center Operations Manager',send_email:'callcenter.ops@healthplan.com',
         metric:'First-call resolution rate',current_val:'71%',target_val:'â‰¥82%',status:'In Progress',
         headline:'First-call resolution at 71% is 11 points below the 82% target. Unresolved calls are the top driver of low Customer Service scores.',
         wrong_metrics:['FCR rate: 71% (target â‰¥82%) â€” 278 calls per week require callback','Avg callback completion rate: 58% â€” 42% of members never reached','Call abandonment rate: 14% (target â‰¤5%)','Member satisfaction post-unresolved call: 2.4/5'],
         action:'Deploy mandatory callback tracking system. All unresolved calls must be closed within 24h or escalated. Agent accountability dashboard to be reviewed weekly.',
         done:'FCR â‰¥82% sustained for 6 consecutive weeks with callback closure rate â‰¥90%'},
        {composite_code:'CS',composite_label:'C24',composite_name:'Customer Service',
         name:'Deploy real-time agent assist copilot for resolution guidance during calls',owner:'Call Center / IT',
         to:'Call Center Operations Manager',send_to:'Call Center Operations Manager',send_email:'callcenter.ops@healthplan.com',
         metric:'Negative sentiment call rate',current_val:'18%',target_val:'â‰¤8%',status:'Not Started',
         headline:'18% of calls exhibit negative sentiment patterns. Real-time AI guidance could resolve most cases before escalation.',
         wrong_metrics:['Negative sentiment call rate: 18% (target â‰¤8%)','Top negative-sentiment triggers: billing disputes (34%), prior auth denials (28%), specialist access (22%)','Escalation rate: 18% â€” 3Ã— the target rate'],
         action:'Deploy NLP-based agent assist overlay that surfaces resolution scripts during live calls. Integrate with CRM for real-time member context.',
         done:'Negative sentiment call rate â‰¤8% for 8 consecutive weeks'},
        {composite_code:'CS',composite_label:'C24',composite_name:'Customer Service',
         name:'Redesign IVR routing to â‰¤2 menu levels and expand after-hours coverage',owner:'Call Center Ops',
         to:'Call Center Operations Manager',send_to:'Call Center Operations Manager',send_email:'callcenter.ops@healthplan.com',
         metric:'IVR abandonment rate',current_val:'9%',target_val:'â‰¤5%',status:'Not Started',
         headline:'IVR abandonment at 9% is nearly double the target. Complex menu trees cause members to hang up before reaching an agent.',
         wrong_metrics:['IVR abandonment rate: 9% (target â‰¤5%)','Current IVR has 4 menu levels â€” best practice is â‰¤2','After-hours coverage ends at 8pm; 23% of calls come between 8pmâ€“11pm'],
         action:'Redesign IVR tree to â‰¤2 menu levels. Expand after-hours chat coverage to 11pm. Implement virtual hold with callback option.',
         done:'IVR abandonment â‰¤5% and after-hours coverage extended to 11pm'},
        {composite_code:'GNC',composite_label:'C22',composite_name:'Getting Needed Care',
         name:'Implement AI pre-screening to auto-approve standard prior auth cases',owner:'UM / IT',
         to:'Utilization Management Director',send_to:'Utilization Management Director',send_email:'um.director@healthplan.com',
         metric:'Prior auth denial rate',current_val:'18%',target_val:'â‰¤8%',status:'Not Started',
         headline:'Prior authorization denial rate of 18% is the top complaint driver for Getting Needed Care. Standard cases are taking 4+ days due to manual review.',
         wrong_metrics:['Prior auth denial rate: 18% (target â‰¤8%)','73% of denials are for standard/routine procedures that could be auto-approved','Average PA decision time: 4.1 days (target â‰¤1 day)','134 prior auth complaint calls in the past 7 days'],
         action:'Deploy ML model to auto-approve standard PA cases (estimated 73% of volume). Requires UM policy update and state regulatory review.',
         done:'Prior auth denial rate â‰¤8% with auto-approval for standard cases within 4h'},
        {composite_code:'GNC',composite_label:'C22',composite_name:'Getting Needed Care',
         name:'Build formulary alternative notification at point of pharmacy denial',owner:'Pharmacy / IT',
         to:'Pharmacy Director',send_to:'Pharmacy Director',send_email:'pharmacy.director@healthplan.com',
         metric:'Formulary exception approval rate',current_val:'61%',target_val:'â‰¥80%',status:'Not Started',
         headline:'Formulary exception approval rate of 61% is 19 points below target. Members denied formulary drugs have no automated pathway to alternatives.',
         wrong_metrics:['Formulary exception approval rate: 61% (target â‰¥80%)','Average days to formulary decision: 2.8 days','Specialty drug denial rate: 5.8% (target â‰¤3%)'],
         action:'Build real-time formulary alternative notification at point of pharmacy denial. Pharmacists receive push notification with covered alternatives within 1 hour.',
         done:'Formulary exception approval rate â‰¥80% with alternative notification within 1h for 90% of denials'},
        {composite_code:'CC',composite_label:'C27',composite_name:'Care Coordination',
         name:'EHR integration: automated test result notification to patient within 24h',owner:'Clinical / IT',
         to:'Chief Medical Officer',send_to:'Chief Medical Officer',send_email:'cmo@healthplan.com',
         metric:'Test result notification rate',current_val:'81%',target_val:'â‰¥90%',status:'In Progress',
         headline:'19% of test results are not communicated to patients within 24 hours. This is the leading driver of low Care Coordination scores.',
         wrong_metrics:['Test result notification rate: 81% (target â‰¥90%)','Average notification delay: 3.2 days for non-critical results','32% of chronic care members have incomplete care plan documentation'],
         action:'Integrate EHR notification engine with patient portal. All test results auto-pushed within 24h. Critical results trigger immediate provider alert.',
         done:'Test result notification rate â‰¥90% within 24h sustained for 8 consecutive weeks'},
        {composite_code:'DC',composite_label:'C25',composite_name:'Doctor Communication',
         name:'Launch provider communication skills training with patient-centred scripting',owner:'Clinical Quality',
         to:'Chief Medical Officer',send_to:'Chief Medical Officer',send_email:'cmo@healthplan.com',
         metric:'Doctor communication top-box rate',current_val:'81%',target_val:'â‰¥88%',status:'In Progress',
         headline:'Doctor communication scores are 7 points below the 88% target. Root cause is short visit durations and lack of standardised patient communication protocols.',
         wrong_metrics:['Doctor communication top-box rate: 81% (target â‰¥88%)','Avg visit duration: 14.2 min (target â‰¥18 min)','Provider turnover rate: 12% â€” new providers score 8pts lower on average','Patient portal adoption: 61% (target â‰¥75%) limits asynchronous communication'],
         action:'Roll out mandatory patient-centred communication training for all contracted PCPs. Implement post-visit communication checklist. Tie compliance to network contract renewal.',
         done:'Doctor communication top-box rate â‰¥88% for 8 consecutive weeks across â‰¥80% of PCPs'},
        {composite_code:'HPR',composite_label:'C30',composite_name:'Overall Plan Rating',
         name:'Implement structured service recovery programme triggered by negative NLP sentiment',owner:'Member Experience',
         to:'Member Experience Director',send_to:'Member Experience Director',send_email:'memberexp.director@healthplan.com',
         metric:'Service recovery contact rate',current_val:'46%',target_val:'â‰¥90%',status:'In Progress',
         headline:'Only 46% of members who express negative sentiment receive a structured service recovery outreach. This is the primary driver of low overall plan ratings.',
         wrong_metrics:['Service recovery contact rate: 46% (target â‰¥90%)','NPS: 28 (target â‰¥45)','Member retention rate: 84% (target â‰¥92%)','Voluntary disenrollment rate: 6.2% (target â‰¤4%)'],
         action:'Deploy NLP pipeline to flag all negative-sentiment interactions (calls, surveys, portal messages). Trigger 48h service recovery outreach with dedicated concierge team.',
         done:'Service recovery contact rate â‰¥90% within 48h for all flagged negative-sentiment interactions'},
        {composite_code:'DC',composite_label:'C25',composite_name:'Doctor Communication',
         name:'Deploy after-visit summary automation to all in-network providers',owner:'Digital / IT',
         to:'Chief Information Officer',send_to:'Chief Information Officer',send_email:'cio@healthplan.com',
         metric:'After-visit summary delivery rate',current_val:'58%',target_val:'â‰¥90%',status:'Not Started',
         headline:'Only 58% of members receive an after-visit summary. Members without summaries are 2.3Ã— more likely to rate doctor communication as "Sometimes/Never adequate".',
         wrong_metrics:['After-visit summary delivery rate: 58% (target â‰¥90%)','Members without summaries: 2.3Ã— more likely to give low communication score','42% of missed summaries are due to EHR configuration gaps'],
         action:'Mandate after-visit summary generation in all contracted EHR systems. Provide patient portal push notification within 2 hours of visit completion.',
         done:'After-visit summary delivery rate â‰¥90% within 2h for all completed visits'},
        {composite_code:'RDP',composite_label:'C31',composite_name:'Drug Plan Rating',
         name:'Reduce formulary step therapy burden via evidence-based protocol update',owner:'Pharmacy / IT',
         to:'Pharmacy Director',send_to:'Pharmacy Director',send_email:'pharmacy.director@healthplan.com',
         metric:'Formulary step therapy exception rate',current_val:'5.8%',target_val:'â‰¤3%',status:'Not Started',
         headline:'Step therapy requirements are generating 5.8% exception requests â€” nearly double the target. Complex formulary rules are driving down drug plan satisfaction.',
         wrong_metrics:['Formulary step therapy exception rate: 5.8% (target â‰¤3%)','Average days to formulary decision: 2.8 days (target â‰¤1 day)','Drug plan satisfaction (0-10 rating): 7.1 (target â‰¥8.5)','52 drug coverage complaint calls in the past 7 days'],
         action:'Review and simplify step therapy protocols for top 20 drug classes. Implement fast-track exception approval for clinically-justified cases within 4 hours.',
         done:'Step therapy exception rate â‰¤3% with 4h decision turnaround for â‰¥90% of cases'},
        {composite_code:'GNP',composite_label:'C32',composite_name:'Getting Needed Drugs',
         name:'Implement real-time formulary alternative notification at pharmacy counter',owner:'Pharmacy / IT',
         to:'Pharmacy Director',send_to:'Pharmacy Director',send_email:'pharmacy.director@healthplan.com',
         metric:'Formulary exception approval rate',current_val:'78%',target_val:'â‰¥90%',status:'Not Started',
         headline:'12% of prescription attempts result in denied fills without an immediate alternative offered. Members denied access to needed drugs rate the plan significantly lower.',
         wrong_metrics:['Formulary exception approval rate: 78% (target â‰¥90%)','Prescription fill rate: 94.2% (target â‰¥97%)','Mail-order adoption: 38% (target â‰¥50%)','44 drug access complaint calls in past 7 days'],
         action:'Build real-time formulary alternative notification API. When a drug is denied, pharmacist and member receive covered alternatives within 30 minutes via SMS/portal.',
         done:'Formulary alternative notification sent within 30 min for 95% of denied prescriptions'},
        {composite_code:'FLU',composite_label:'Flu Vaccine',composite_name:'Annual Flu Vaccine',
         name:'Deploy predictive outreach to close flu vaccination gap in high-risk members',owner:'Clinical Quality',
         to:'Director of Clinical Quality',send_to:'Director of Clinical Quality',send_email:'clinical.quality@healthplan.com',
         metric:'Flu vaccine rate',current_val:'71%',target_val:'â‰¥80%',status:'Not Started',
         headline:'Flu vaccination rate is 9 percentage points below the 80% target. Members aged 75+ and those with chronic conditions are the highest-risk non-vaccinated segment.',
         wrong_metrics:['Flu vaccine rate: 71% (target â‰¥80%)','Members aged 75+ not yet vaccinated: 2,847','Vaccine outreach completion rate: 58% (target â‰¥75%)','Members with diabetes/COPD not vaccinated: 1,240'],
         action:'Deploy predictive outreach model to identify highest-risk unvaccinated members. Priority call + SMS campaign for members 75+ and chronic condition cohorts. Activate pharmacy-based vaccination partnerships.',
         done:'Flu vaccine rate â‰¥80% by Dec 31, 2025 for members aged 65+ enrolled in plan'},
        {composite_code:'FLU',composite_label:'Flu Vaccine',composite_name:'Annual Flu Vaccine',
         name:'Expand pharmacy-based flu vaccination network to close access gaps',owner:'Network Ops',
         to:'Director of Network Operations',send_to:'Director of Network Operations',send_email:'network.ops@healthplan.com',
         metric:'In-network pharmacy vaccination coverage',current_val:'44%',target_val:'â‰¥70%',status:'Not Started',
         headline:'Only 44% of members have access to an in-network pharmacy that offers flu vaccination. Network gaps are disproportionately affecting rural and low-income zip codes.',
         wrong_metrics:['In-network pharmacy vaccination coverage: 44% (target â‰¥70%)','Rural members with no pharmacy within 5 miles: 1,890','Vaccine reminder call response rate: 18% (target â‰¥25%)'],
         action:'Contract 50 additional pharmacy locations for flu vaccine administration. Prioritise rural zip codes and ZIP codes with below-average vaccination rates. Enable telehealth voucher for home vaccination for homebound members.',
         done:'In-network pharmacy vaccination coverage â‰¥70% with â‰¤5 mile access for â‰¥90% of members'},
      ];

      // Group by composite
      const grouped = {};
      IV_DATA.forEach(iv=>{
        const key = iv.composite_code;
        if(!grouped[key]) grouped[key]={label:iv.composite_label,name:iv.composite_name,items:[]};
        grouped[key].items.push(iv);
      });

      const inProgress = IV_DATA.filter(iv=>iv.status==='In Progress').length;
      const notStarted = IV_DATA.filter(iv=>iv.status==='Not Started').length;
      const days = 47; // from CAHPS data

      const stCl = s => s==='In Progress'?'#d97706':'#F26722';
      const stBg = s => s==='In Progress'?'#fffbeb':'#fef2f2';

      body.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:24px;flex-wrap:wrap">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;flex:1">
            <div style="background:#1e293b;border:none;border-top:3px solid #F26722;border-radius:10px;padding:12px 14px">
              <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Process Improvements</div>
              <div style="font-size:22px;font-weight:800;color:#fff">${IV_DATA.length}</div>
            </div>
            <div style="background:#1e293b;border:none;border-top:3px solid #F26722;border-radius:10px;padding:12px 14px">
              <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">In Progress</div>
              <div style="font-size:22px;font-weight:800;color:#fff">${inProgress}</div>
            </div>
            <div style="background:#1e293b;border:none;border-top:3px solid #F26722;border-radius:10px;padding:12px 14px">
              <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Not Started</div>
              <div style="font-size:22px;font-weight:800;color:#fff">${notStarted}</div>
            </div>
            <div style="background:#1e293b;border:none;border-top:3px solid #F26722;border-radius:10px;padding:12px 14px">
              <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Survey Window</div>
              <div style="font-size:22px;font-weight:800;color:#fff">${days}d</div>
            </div>
          </div>
          <div style="display:flex;gap:10px;flex-shrink:0">
            <button style="padding:10px 18px;background:#fff;color:#374151;border:1px solid #e5e7eb;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer">â†‘ Send all department reports</button>
            <button style="padding:10px 18px;background:#F26722;color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">â†‘ Send leadership report</button>
          </div>
        </div>
        ${Object.entries(grouped).map(([code,grp])=>`
          <div style="margin-bottom:28px">
            <div style="font-size:12px;font-weight:800;color:#F26722;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">${grp.label} â€” ${grp.name.toUpperCase()}</div>
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden">
              <div style="display:grid;grid-template-columns:2fr 1fr 1.2fr 80px 80px 100px 80px;padding:10px 20px;background:#f9fafb;border-bottom:1px solid #e5e7eb;gap:12px">
                <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase">Process Improvement</span>
                <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase">Owner</span>
                <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase">Metric</span>
                <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;text-align:right">Current</span>
                <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;text-align:right">Target</span>
                <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;text-align:center">Status</span>
                <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;text-align:center">Report</span>
              </div>
              ${grp.items.map((iv,idx)=>`
                <div style="display:grid;grid-template-columns:2fr 1fr 1.2fr 80px 80px 100px 80px;padding:16px 20px;border-bottom:1px solid #f9fafb;gap:12px;align-items:center" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background=''">
                  <div>
                    <div style="font-size:13px;font-weight:600;line-height:1.4">${iv.name}</div>
                    <div style="font-size:11px;color:#9ca3af;margin-top:3px">To: ${iv.to}</div>
                  </div>
                  <div style="font-size:12px;color:#374151">${iv.owner}</div>
                  <div style="font-size:12px;color:#9ca3af">${iv.metric}</div>
                  <div style="font-size:13px;font-weight:700;color:#F26722;text-align:right">${iv.current_val}</div>
                  <div style="font-size:13px;font-weight:600;color:#1D9E75;text-align:right">${iv.target_val}</div>
                  <div style="text-align:center"><span style="background:${stBg(iv.status)};color:${stCl(iv.status)};padding:4px 8px;border-radius:6px;font-size:11px;font-weight:700;white-space:nowrap">${iv.status}</span></div>
                  <div style="text-align:center"><button onclick='openIvModal(${JSON.stringify(iv).replace(/'/g,"&apos;")}, ${JSON.stringify(composites)})' style="padding:5px 12px;border:1px solid #e5e7eb;border-radius:6px;background:#fff;font-size:12px;font-weight:600;cursor:pointer;color:#374151" onmouseover="this.style.background='#fef2f2';this.style.borderColor='#fecaca';this.style.color='#F26722'" onmouseout="this.style.background='#fff';this.style.borderColor='#e5e7eb';this.style.color='#374151'">View â†’</button></div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      `;
    };
    window.cahpsTab = function(id, btn){
      // Hide drilldown, restore tabs
      const drilldown = el.querySelector('#cahps-drilldown');
      if(drilldown) drilldown.remove();
      const tabsBody = el.querySelector('#cahps-tabs-body');
      if(tabsBody) tabsBody.style.display='';
      // Switch panes
      el.querySelectorAll('.cahps-tab-pane').forEach(p=>{p.classList.remove('active');p.style.opacity='0';});
      el.querySelectorAll('button[id^="ctab-"]').forEach(b=>{b.style.borderBottomColor='transparent';b.style.color='#6b7280';});
      const pane = el.querySelector('#ctab-pane-'+id);
      if(pane){
        pane.classList.add('active');
        requestAnimationFrame(()=>{pane.style.transition='opacity .18s';pane.style.opacity='1';});
      }
      if(btn){btn.style.borderBottomColor='#F26722';btn.style.color='#F26722';}
      // Load dynamic tabs (cached after first load)
      if(id==='pulse') window.loadPulseTab();
      if(id==='iv') window.loadIvTab(composites);
      if(id==='tv') window.initTvTabs();
    };

    // Composite drill-down
    window.showCahpsDrilldown = function(idx){
      const sorted = [...composites].sort((a,b)=>a.current_pct-b.current_pct);
      const m = sorted[idx];
      if(!m) return;
      const tabsBody = el.querySelector('#cahps-tabs-body');
      if(tabsBody) tabsBody.style.display='none';
      // Remove any existing drilldown
      const existing = el.querySelector('#cahps-drilldown');
      if(existing) existing.remove();
      const dd = document.createElement('div');
      dd.id = 'cahps-drilldown';
      dd.innerHTML = buildDrilldown(m);
      el.appendChild(dd);
      el.scrollTop = 0;
    };
  });
}
function showPage(id,el){
  const app=document.querySelector('.app');
  if(app)app.classList.toggle('marketing-mode',id==='marketing');
  document.querySelectorAll('.page').forEach(p=>{p.classList.remove('active');p.style.display='none';});
  const pg=document.getElementById('pg-'+id);
  if(pg){pg.classList.add('active');pg.style.display='flex';}
  document.querySelectorAll('.ntab').forEach(t=>t.classList.remove('active'));
  if(el){el.classList.add('active');}else{const tab=document.querySelector('.ntab[data-page="'+id+'"]');if(tab)tab.classList.add('active');}
  if(id==='cahps'){cahpsModuleLoaded=false;loadCahpsModule();}
  if(id==='simulator')simRecalc();
  if(id==='eho4all')buildEHOMeasures();
  if(id==='market'&&typeof maInitPage==='function')maInitPage();
  if(id==='hedis')hedisPageInit();
  if(id==='hos'&&typeof hosInitPage==='function')hosInitPage();
}
window.showPage=showPage;
// â”€â”€ TEAM VIEW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TV_DEPTS=[
  {name:'Network Operations',role:'Director of Network Operations',email:'network.ops@plan.org',
   why:'Network Ops owns appointment access â€” the highest-weighted CAHPS measure (C23, 3Ã—). Two metrics are critically off: same-day slot availability and specialist referral turnaround. These directly suppress the C23 top-box score which is currently the biggest single drag on the overall star rating.',
   metrics:[
     {metric:'Same-day slot availability',cahps:'C23 â€” Getting Care Quickly',current:'4%',target:'â‰¥12%',bad:true},
     {metric:'Specialist referral TAT',cahps:'C23 â€” Getting Care Quickly',current:'8.1 days',target:'â‰¤5 days',bad:true},
     {metric:'Online self-scheduling rate',cahps:'C23 â€” Getting Care Quickly',current:'22%',target:'â‰¥40%',bad:true},
     {metric:'Avg urgent appt wait',cahps:'C23 â€” Getting Care Quickly',current:'9.4 days',target:'â‰¤7 days',bad:true},
   ],
   situation:'94 members gave Sometimes or Never on urgent care access in the last pulse survey. 41 members have stalled specialist referrals. The C23 composite is 42% against a 78% target â€” the largest gap of any measure.',
   improvements:[
     {what:'Implement same-day slot release using no-show prediction model',when:'Same-day availability â‰¥12% sustained for 4 weeks',status:'Not Started'},
     {what:'Reduce specialist referral TAT via automated EHR routing',when:'Average referral TAT â‰¤5 days for 8 weeks',status:'Not Started'},
     {what:'Enable online self-scheduling across all in-network PCPs',when:'Self-scheduling â‰¥40% of appointments',status:'Not Started'},
   ]},
  {name:'Call Center Operations',role:'Director of Call Center',email:'callcenter@plan.org',
   why:'Call Center directly owns C26 Customer Service (2Ã—). First-contact resolution and hold times are driving top-box failures across all customer service survey questions.',
   metrics:[
     {metric:'First contact resolution',cahps:'C26 â€” Customer Service',current:'64%',target:'â‰¥80%',bad:true},
     {metric:'Avg hold time',cahps:'C26 â€” Customer Service',current:'5.2 min',target:'â‰¤2 min',bad:true},
     {metric:'Call answer rate (30s)',cahps:'C26 â€” Customer Service',current:'71%',target:'â‰¥85%',bad:true},
   ],
   situation:'18% escalation rate over last 7 days â€” up 14% vs prior period. Member satisfaction post-call is 3.1/5 against a target of 4.0. These scores directly feed into the C26 composite.',
   improvements:[
     {what:'Deploy AI-assisted call routing to reduce handle time',when:'Avg handle time â‰¤6 min for 6 consecutive weeks',status:'In Progress'},
     {what:'Add 12 FTEs to reduce hold times during peak hours',when:'Hold time â‰¤2 min at 95th percentile',status:'Not Started'},
   ]},
  {name:'Utilization Management',role:'VP Utilization Management',email:'util.mgmt@plan.org',
   why:'UM owns prior authorization decisions which directly impact C22 Getting Needed Care (2Ã—). High denial rates and slow PA turnaround suppress top-box scores for specialist access.',
   metrics:[
     {metric:'Prior auth denial rate',cahps:'C22 â€” Getting Needed Care',current:'8.2%',target:'â‰¤4%',bad:true},
     {metric:'Avg days to PA decision',cahps:'C22 â€” Getting Needed Care',current:'4.1 days',target:'â‰¤3 days',bad:true},
     {metric:'Network adequacy score',cahps:'C22 â€” Getting Needed Care',current:'78%',target:'â‰¥90%',bad:true},
   ],
   situation:'134 prior auth complaint calls in the last 7 days â€” up 18% vs prior period. 23 referral denial appeals pending. These are directly correlated with C22 top-box failures.',
   improvements:[
     {what:'Implement gold-carding for high-performing providers',when:'Denial rate â‰¤4% sustained for 8 weeks',status:'Not Started'},
     {what:'Automate PA decisions for Tier 1 procedures',when:'PA turnaround â‰¤3 days for 90% of cases',status:'In Progress'},
   ]},
  {name:'Pharmacy',role:'Chief Pharmacy Officer',email:'pharmacy@plan.org',
   why:'Pharmacy owns the Part D drug plan rating (C30-equiv). Formulary restrictions and rising copays are the top member complaints driving plan dissatisfaction scores down.',
   metrics:[
     {metric:'Formulary exception rate',cahps:'C30 â€” Health Plan Rating',current:'12%',target:'â‰¤6%',bad:true},
     {metric:'Drug plan NPS',cahps:'C30 â€” Health Plan Rating',current:'31',target:'â‰¥50',bad:true},
     {metric:'Specialty drug approval time',cahps:'C30 â€” Health Plan Rating',current:'6.2 days',target:'â‰¤3 days',bad:true},
   ],
   situation:'Top complaint: formulary restrictions cited by 38% of dissatisfied members. Specialty drug delays are driving 22% of grievance filings this quarter.',
   improvements:[
     {what:'Expand Tier 2 formulary to include top 10 requested generics',when:'Formulary exception rate â‰¤6% for 4 weeks',status:'Not Started'},
     {what:'Streamline specialty drug PA pathway',when:'Approval time â‰¤3 days for 90% of cases',status:'Not Started'},
   ]},
  {name:'Clinical / Care Management',role:'VP Clinical Operations',email:'clinical@plan.org',
   why:'Care Management owns C25 Doctor Communication (2Ã—) and C28 Care Coordination (2Ã—). Low care plan completion and poor handoff rates are suppressing both composites.',
   metrics:[
     {metric:'Care plan completion rate',cahps:'C25 â€” Doctor Communication',current:'61%',target:'â‰¥80%',bad:true},
     {metric:'Post-discharge follow-up rate',cahps:'C28 â€” Care Coordination',current:'54%',target:'â‰¥75%',bad:true},
     {metric:'Provider follow-up call rate',cahps:'C25 â€” Doctor Communication',current:'72%',target:'â‰¥90%',bad:true},
   ],
   situation:'41 care coordination complaint calls last week. Post-discharge gaps are driving C28 scores â€” 28% of discharged members have no documented follow-up within 7 days.',
   improvements:[
     {what:'Launch automated post-discharge call program',when:'Follow-up rate â‰¥75% for 6 consecutive weeks',status:'In Progress'},
     {what:'Deploy care manager portal for real-time care plan tracking',when:'Care plan completion â‰¥80%',status:'Not Started'},
   ]},
  {name:'Member Experience',role:'Chief Member Experience Officer',email:'member.exp@plan.org',
   why:'Member Experience owns overall plan satisfaction (C30, 1Ã—) and is accountable for NPS and grievance rates. Plan dissatisfaction calls are the leading indicator of top-box failures.',
   metrics:[
     {metric:'Overall plan NPS',cahps:'C30 â€” Health Plan Rating',current:'28',target:'â‰¥45',bad:true},
     {metric:'Member retention rate',cahps:'C30 â€” Health Plan Rating',current:'84%',target:'â‰¥92%',bad:true},
     {metric:'Grievance filing rate',cahps:'C30 â€” Health Plan Rating',current:'6.2%',target:'â‰¤2%',bad:true},
   ],
   situation:'89 plan dissatisfaction calls in 7 days â€” up 31% vs prior period. Benefit complaint rate at 9.1% against a â‰¤4% target. Voluntary disenrollment is accelerating.',
   improvements:[
     {what:'Launch proactive outreach to at-risk members (NPS â‰¤6)',when:'NPS improvement of +10 points sustained for 8 weeks',status:'Not Started'},
     {what:'Redesign grievance resolution workflow to close within 24h',when:'Grievance rate â‰¤2% for 4 weeks',status:'In Progress'},
   ]},
  {name:'Provider Relations',role:'VP Provider Network',email:'provider.rel@plan.org',
   why:'Provider Relations impacts C23 and C22 through network adequacy and provider communication quality. Specialist wait times and referral friction are the key levers.',
   metrics:[
     {metric:'Specialist network adequacy',cahps:'C23 â€” Getting Care Quickly',current:'78%',target:'â‰¥95%',bad:true},
     {metric:'Provider satisfaction score',cahps:'C22 â€” Getting Needed Care',current:'3.4/5',target:'â‰¥4.2/5',bad:true},
     {metric:'Credentialing cycle time',cahps:'C22 â€” Getting Needed Care',current:'68 days',target:'â‰¤45 days',bad:true},
   ],
   situation:'12 specialist groups have reduced appointment availability in the last 30 days. 3 high-volume PCPs have flagged referral friction as a network concern.',
   improvements:[
     {what:'Contract 8 new specialist groups in high-demand ZIP codes',when:'Network adequacy score â‰¥95%',status:'Not Started'},
     {what:'Reduce credentialing cycle via automated document verification',when:'Credentialing time â‰¤45 days',status:'In Progress'},
   ]},
  {name:'Digital / IT',role:'Chief Digital Officer',email:'digital.it@plan.org',
   why:'Digital owns the member portal and self-service tools which impact C23 (appointment access) and C26 (customer service deflection). Low portal adoption forces members to call, increasing hold times.',
   metrics:[
     {metric:'Member portal adoption',cahps:'C23 â€” Getting Care Quickly',current:'61%',target:'â‰¥80%',bad:true},
     {metric:'IVR self-service resolution',cahps:'C26 â€” Customer Service',current:'34%',target:'â‰¥55%',bad:true},
     {metric:'Mobile app active users',cahps:'C23 â€” Getting Care Quickly',current:'28%',target:'â‰¥50%',bad:true},
   ],
   situation:'IVR abandonment rate at 14% â€” up 6pts from last quarter. Members who fail IVR go to agent queues, increasing hold times and suppressing C26 scores.',
   improvements:[
     {what:'Launch redesigned mobile scheduling feature',when:'Portal adoption â‰¥80% and self-scheduling â‰¥40%',status:'In Progress'},
     {what:'Improve IVR natural language understanding for top 5 call types',when:'IVR self-service rate â‰¥55% for 4 weeks',status:'Not Started'},
   ]},
];
let _tvDeptIdx=0;
function renderTvDept(idx){
  _tvDeptIdx=idx;
  const d=TV_DEPTS[idx];
  const surveyDays=83;
  const statusColor=s=>s==='In Progress'?'#d97706':s==='Completed'?'#1D9E75':'#dc2626';
  const statusBg=s=>s==='In Progress'?'#fffbeb':s==='Completed'?'#f0fdf4':'#fef2f2';
  // Update tab styles
  document.querySelectorAll('.tv-tab-btn').forEach((b,i)=>{
    b.style.background=i===idx?'#111':'#fff';
    b.style.color=i===idx?'#fff':'#374151';
    b.style.borderColor=i===idx?'#111':'#e5e7eb';
  });
  document.getElementById('tv-dept-card').innerHTML=`
    <div style="background:#1a1a2e;border-radius:12px;padding:20px 24px;margin-bottom:16px">
      <div style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">Team Report â€” CAHPS Performance</div>
      <div style="font-size:22px;font-weight:800;color:#fff;margin-bottom:4px">${d.name}</div>
      <div style="font-size:12px;color:#9ca3af">For: ${d.role} Â· ${d.email}</div>
    </div>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px 20px;margin-bottom:16px">
      <div style="font-size:10px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Why This Matters for Star Rating</div>
      <div style="font-size:13px;color:#374151;line-height:1.6">${d.why}</div>
    </div>
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-bottom:16px">
      <div style="padding:12px 20px;border-bottom:1px solid #e5e7eb;font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.08em">Metrics Your Team Owns â€” Current vs Target</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 120px 160px;padding:8px 20px;background:#f9fafb;border-bottom:1px solid #e5e7eb">
        <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase">Metric</span>
        <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase">CAHPS Measure</span>
        <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;text-align:right">Current</span>
        <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;text-align:right">Target Needed for 4â˜…</span>
      </div>
      ${d.metrics.map(m=>`
        <div style="display:grid;grid-template-columns:1fr 1fr 120px 160px;padding:12px 20px;border-bottom:1px solid #f9fafb;align-items:center">
          <span style="font-size:13px;font-weight:600;color:#111">${m.metric}</span>
          <span style="font-size:12px;color:#9ca3af">${m.cahps}</span>
          <span style="font-size:14px;font-weight:700;color:${m.bad?'#dc2626':'#1D9E75'};text-align:right">${m.current}</span>
          <span style="font-size:12px;color:#1D9E75;text-align:right">${m.target}</span>
        </div>
      `).join('')}
    </div>
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px 20px;margin-bottom:16px">
      <div style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Current Situation</div>
      <div style="font-size:13px;color:#374151;line-height:1.6">${d.situation}</div>
    </div>
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-bottom:16px">
      <div style="padding:12px 20px;border-bottom:1px solid #e5e7eb;font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.08em">Process Improvements Required from Your Team</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 120px;padding:8px 20px;background:#f9fafb;border-bottom:1px solid #e5e7eb">
        <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase">What Needs to Change</span>
        <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase">Done When</span>
        <span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;text-align:right">Status</span>
      </div>
      ${d.improvements.map(imp=>`
        <div style="display:grid;grid-template-columns:1fr 1fr 120px;padding:12px 20px;border-bottom:1px solid #f9fafb;align-items:center">
          <span style="font-size:13px;font-weight:600;color:#111">${imp.what}</span>
          <span style="font-size:12px;color:#9ca3af">${imp.when}</span>
          <div style="text-align:right"><span style="background:${statusBg(imp.status)};color:${statusColor(imp.status)};padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700">${imp.status}</span></div>
        </div>
      `).join('')}
    </div>
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:12px 20px;display:flex;justify-content:space-between;align-items:center">
      <div style="font-size:12px;color:#6b7280">Survey window: <strong>${surveyDays} days remaining</strong> Â· Generate a concise team report before sending</div>
      <div style="display:flex;gap:8px">
        <button style="padding:8px 14px;background:#fff;border:1px solid #e5e7eb;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;color:#374151">Create summarized report</button>
        <button style="padding:8px 14px;background:#fff;border:1px solid #e5e7eb;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;color:#374151">Send all departments</button>
        <button style="padding:8px 14px;background:#F26722;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;color:#fff">Send to ${d.name}</button>
      </div>
    </div>
  `;
}
function initTvTabs(){
  const tabsEl=document.getElementById('tv-dept-tabs');
  if(!tabsEl)return;
  tabsEl.innerHTML=TV_DEPTS.map((d,i)=>`<button class="tv-tab-btn" onclick="renderTvDept(${i})" style="padding:8px 14px;border-radius:7px;border:1px solid #e5e7eb;background:#fff;color:#374151;font-size:12px;font-weight:500;cursor:pointer;white-space:nowrap">${d.name}</button>`).join('');
  renderTvDept(0);
}
window.renderTvDept=renderTvDept;
window.initTvTabs=initTvTabs;

function setCFilter(f){
  ['all','green','yellow','red'].forEach(k=>{const el=document.getElementById('cf-'+k);if(el)el.classList.toggle('on',k===f);});
  const rows=document.querySelectorAll('#cahps-composite-rows [data-name]');
  rows.forEach(r=>{
    const s=r.dataset.status||'';
    const show=f==='all'||(f==='green'&&s==='ok')||(f==='yellow'&&s==='risk')||(f==='red'&&s==='critical');
    r.style.display=show?'grid':'none';
  });
}
function filterCahpsTable(){
  const q=(document.getElementById('cahps-search')||{}).value||'';
  const rows=document.querySelectorAll('#cahps-composite-rows [data-name]');
  rows.forEach(r=>r.style.display=r.dataset.name.includes(q.toLowerCase())?'grid':'none');
}
document.querySelectorAll('.page').forEach(p=>p.style.display='none');
document.getElementById('pg-marketing').style.display='flex';
document.querySelector('.app')?.classList.add('marketing-mode');

// â”€â”€ DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let contracts=[
  {name:'Health Plan Advantage Premier (HMO)',id:'H3312',state:'FL',enroll:112450,py:4.0,proj:4.0,hedis:'3.8',cahps:'4.2',hos:'4.0',partd:'4.1'},
  {name:'Lone Star Medicare Complete (HMO)',id:'H5521',state:'TX',enroll:98200,py:3.5,proj:3.5,hedis:'3.4',cahps:'3.6',hos:'3.5',partd:'3.7'},
  {name:'Pacific Care Advantage Gold (HMO)',id:'H2213',state:'CA',enroll:134800,py:4.5,proj:4.5,hedis:'4.6',cahps:'4.4',hos:'4.5',partd:'4.3'},
  {name:'Keystone Senior Plus (PPO)',id:'H6614',state:'PA',enroll:67300,py:4.0,proj:4.0,hedis:'3.9',cahps:'4.1',hos:'4.0',partd:'3.8'},
  {name:'Empire Blue Medicare (HMO)',id:'H7723',state:'NY',enroll:89100,py:3.5,proj:4.0,hedis:'3.7',cahps:'3.8',hos:'3.5',partd:'3.9'},
  {name:'Buckeye Health Advantage (D-SNP)',id:'H8812',state:'OH',enroll:54600,py:4.0,proj:4.0,hedis:'4.0',cahps:'3.9',hos:'4.0',partd:'4.2'},
  {name:'Desert Sun Medicare Plus (PPO)',id:'H9914',state:'AZ',enroll:72400,py:3.5,proj:3.5,hedis:'3.3',cahps:'3.7',hos:'3.5',partd:'3.4'},
  {name:'Peach State Senior Care (HMO)',id:'H1045',state:'GA',enroll:43200,py:3.0,proj:3.5,hedis:'3.2',cahps:'3.3',hos:'3.0',partd:'3.1'},
  {name:'Prairie Medicare Select (HMO)',id:'H2156',state:'IL',enroll:61800,py:4.0,proj:4.0,hedis:'4.1',cahps:'3.8',hos:'4.0',partd:'4.0'},
  {name:'Carolina Blue Medicare (HMO)',id:'H3267',state:'NC',enroll:48900,py:4.0,proj:4.5,hedis:'4.2',cahps:'4.3',hos:'4.0',partd:'4.1'},
  {name:'Great Lakes Senior Advantage (HMO)',id:'H4378',state:'MI',enroll:55700,py:3.5,proj:3.5,hedis:'3.6',cahps:'3.4',hos:'3.5',partd:'3.3'},
  {name:'Cascade Medicare Choice (PPO)',id:'H5489',state:'WA',enroll:38400,py:4.5,proj:4.5,hedis:'4.7',cahps:'4.3',hos:'4.5',partd:'4.4'},
  {name:'Blue Ridge Senior Select (HMO)',id:'H6590',state:'VA',enroll:44100,py:4.0,proj:4.0,hedis:'3.9',cahps:'4.0',hos:'4.0',partd:'3.9'},
  {name:'Rocky Mountain Medicare Plus (HMO)',id:'H7601',state:'CO',enroll:59000,py:4.0,proj:4.0,hedis:'4.0',cahps:'4.1',hos:'4.0',partd:'3.8'},
];

// Populate Contract ID filter
const cidSel=document.getElementById('filter-contract-id');
contracts.forEach(c=>{const o=document.createElement('option');o.value=c.id;o.textContent=c.id;cidSel.appendChild(o);});

const starBadge=s=>{const n=parseFloat(s);const cl=n>=4.5?'s5b':n>=4?'s4b':n>=3.5?'s3b':'s25b';return '<span class="star-badge '+cl+'">'+s+'</span>';};
const dpCl=s=>parseFloat(s)>=4?'dp-g':parseFloat(s)>=3.5?'dp-y':'dp-r';

function renderContracts(list){
  window._contracts=list;
  document.getElementById('contracts-body').innerHTML=list.map((c,i)=>'<div class="ct-row" onclick="drillPlan('+i+')">'
    +'<div><div class="ct-name">'+c.name+'</div></div>'
    +'<div style="font-size:11px;font-weight:600;color:#1d4ed8">'+c.id+'</div>'
    +'<div style="font-size:11px;color:#374151">'+c.state+'</div>'
    +'<div style="font-size:12px;font-weight:600">'+c.enroll.toLocaleString()+'</div>'
    +'<div>'+starBadge(c.py)+'</div>'
    +'<div>'+starBadge(c.proj)+'</div>'
    +'<div>'+starBadge(c.hedis)+'</div>'
    +'<div>'+starBadge(c.cahps)+'</div>'
    +'<div>'+starBadge(c.hos)+'</div>'
    +'<div>'+starBadge(c.partd)+'</div>'
    +'</div>').join('');
  document.getElementById('exec-filter-result').textContent=list.length+' plan'+(list.length!==1?'s':'');
  document.getElementById('exec-count').textContent=list.length;
}
renderContracts(contracts);

function applyExecFilters(){
  const cid=document.getElementById('filter-contract-id').value;
  const pname=document.getElementById('filter-plan-name').value.toLowerCase().trim();
  const py=document.getElementById('filter-py').value;
  const proj=document.getElementById('filter-proj').value;
  renderContracts(contracts.filter(c=>{
    if(cid&&c.id!==cid)return false;
    if(pname&&!c.name.toLowerCase().includes(pname))return false;
    if(py&&parseFloat(c.py).toFixed(1)!==parseFloat(py).toFixed(1))return false;
    if(proj&&parseFloat(c.proj).toFixed(1)!==parseFloat(proj).toFixed(1))return false;
    return true;
  }));
}
function resetExecFilters(){
  document.getElementById('filter-contract-id').value='';
  document.getElementById('filter-plan-name').value='';
  document.getElementById('filter-py').value='';
  document.getElementById('filter-proj').value='';
  renderContracts(contracts);
}
function drillPlan(i){
  const c=window._contracts[i];
  document.getElementById('plan-name').textContent=c.name;
  document.getElementById('plan-meta').textContent='Contract '+c.id+' Â· '+c.state+' Â· '+c.enroll.toLocaleString()+' enrolled';
  document.getElementById('plan-star').textContent=c.proj+'â˜…';
  showPage('plan',document.querySelectorAll('.ntab')[2]);

  const starColor=r=>r>=4.5?'#1D9E75':r>=4.0?'#d97706':r>=3.5?'#d97706':'#dc2626';
  const domCls=r=>r>=4.5?'dom-card d-green':r>=4.0?'dom-card d-amber':'dom-card d-red';
  const starCls=r=>r>=4.5?'dom-star green':r>=4.0?'dom-star amber':'dom-star red';
  const pillCls=r=>r>=4.5?'pill p-green':r>=4.0?'pill p-amber':'pill p-red';

  // Fetch full plan detail (historical + domains)
  fetch('/api/plans/'+c.id).then(r=>r.json()).then(d=>{
    // Update target / gap
    const tg=document.getElementById('plan-target-gap');
    const gap=Math.max(0,(4.5-c.proj)).toFixed(1);
    if(tg)tg.textContent='Target: 4.5â˜… Â· Gap: '+gap+'â˜…';

    // Historical ratings
    const hist=d.historical_ratings||[];
    const histEl=document.getElementById('plan-hist-stars');
    if(histEl&&hist.length){
      histEl.innerHTML=hist.map((h,idx)=>{
        const isProj=idx===hist.length-1;
        const clr=starColor(h.rating);
        const yr=isProj?'MY'+h.year+' Proj.':'MY'+h.year;
        const bg=isProj?'style="background:rgba(242,103,34,.15);border-color:rgba(242,103,34,.4)"':'';
        const yrStyle=isProj?'style="color:#F26722"':'';
        const valStyle='style="color:'+clr+'"';
        return '<div class="hist-item" '+bg+'><div class="hist-yr" '+yrStyle+'>'+yr+'</div><div class="hist-val" '+valStyle+'>'+h.rating+'â˜…</div></div>';
      }).join('');
    }

    // Domain cards
    const domains=d.domain_scores||[];
    const domEl=document.getElementById('plan-domain-grid');
    if(domEl&&domains.length){
      const domPageMap={HEDIS:"showPage('hedis',document.querySelectorAll('.ntab')[3])",CAHPS:"showPage('cahps',document.getElementById('ntab-cahps'))"};
      domEl.innerHTML=domains.map(dom=>{
        const onclick=domPageMap[dom.domain]||'';
        const cursor=onclick?'cursor:pointer':'';
        const sub=dom.on_track_count+'/'+dom.total_count+' on track'+(dom.critical_count?' Â· '+dom.critical_count+' critical':'');
        const domLabel=dom.domain==='HEDIS'?'HEDIS Clinical Quality':dom.domain==='CAHPS'?'CAHPS Member Experience':dom.domain==='HOS'?'HOS Health Outcomes':'Medical Adherence';
        return '<div class="'+domCls(dom.rating)+'" onclick="'+onclick+'" style="'+cursor+'"><div class="dom-name">'+domLabel+'</div><div class="'+starCls(dom.rating)+'">'+dom.rating+'â˜…</div><div style="font-size:10px;color:#6b7280;margin-top:3px">'+sub+'</div><div style="font-size:11px;color:#F26722;margin-top:8px;font-weight:600">View measures â†’</div></div>';
      }).join('');
    }

    // Update HEDIS/CAHPS header star pills
    const hedisRating=(domains.find(d=>d.domain==='HEDIS')||{}).rating||c.hedis;
    const cahpsRating=(domains.find(d=>d.domain==='CAHPS')||{}).rating||c.cahps;
    const hStar=document.getElementById('plan-hedis-star');
    const cStar=document.getElementById('plan-cahps-star');
    if(hStar){hStar.textContent=hedisRating+'â˜…';hStar.className=pillCls(hedisRating);}
    if(cStar){cStar.textContent=cahpsRating+'â˜…';cStar.className=pillCls(cahpsRating);}
  }).catch(()=>{});

  // Fetch live HEDIS measures for this plan
  // Track selected plan for HEDIS page navigation
  window._selectedContractId = c.id;
  window._selectedContractName = c.name;

  fetch('/api/hedis-measures?contract_id='+c.id).then(r=>r.json()).then(data=>{
    const items=data.items||data;
    const statusMap={green:'ok',yellow:'risk',red:'crit'};
    if(items&&items.length){
      // Update Plan Detail mini-table
      document.getElementById('plan-hedis-body').innerHTML=items.map(m=>rowTr({
        code:m.measure_code,name:(m.measure_name||'').slice(0,28),
        pct:m.current_rate,status:statusMap[m.status]||'ok'
      })).join('');

      hedisData=items.map(m=>({
        code:m.measure_code,name:m.measure_name,
        wt:m.weight||'1x',pct:m.current_rate,
        gaps:m.open_gap_count,color:m.status
      }));
      renderHedis();
      hedisUpdateStats();

      // Sync HEDIS page dropdown to selected plan
      const hSel=document.getElementById('hedis-plan-select');
      if(hSel)hSel.value=c.id;
      const hBadge=document.getElementById('hedis-plan-badge');
      if(hBadge){hBadge.textContent=c.state+' Â· '+c.enroll.toLocaleString()+' enrolled';hBadge.style.display='inline';}

      const hedisBackEl=document.querySelector('#pg-hedis .back-btn');
      if(hedisBackEl)hedisBackEl.textContent='â† Back to '+c.name.split(' ').slice(0,3).join(' ');
    }
  }).catch(()=>{});

  // Fetch live CAHPS for this plan
  fetch('/api/cahps?contract_id='+c.id).then(r=>r.json()).then(data=>{
    const composites=data.composites||[];
    if(composites.length){
      document.getElementById('plan-cahps-body').innerHTML=composites.map(m=>rowTr({
        code:m.composite_code,name:(m.composite_name||'').slice(0,28),
        pct:Math.round(m.current_pct||0),
        status:m.status==='ok'?'ok':m.status==='risk'?'risk':'crit'
      })).join('');
    }
  }).catch(()=>{});
}

// Plan detail tables
const planHedis=[
  {code:'BCS',name:'Breast Cancer Screening',pct:72,status:'ok'},{code:'COL',name:'Colorectal Screening',pct:58,status:'crit'},
  {code:'CDC',name:'A1c Control',pct:64,status:'risk'},{code:'CBP',name:'Blood Pressure',pct:71,status:'ok'},
  {code:'SPC',name:'Statin Therapy',pct:55,status:'crit'},{code:'MAD',name:'Med Adherence',pct:66,status:'risk'},
  {code:'FLU',name:'Flu Vaccination',pct:78,status:'ok'},{code:'AMM',name:'Antidepressant Mgmt',pct:52,status:'crit'},
];
const planCahps=[
  {code:'GNC',name:'Getting Needed Care',pct:68,status:'risk'},{code:'GCQ',name:'Getting Care Quickly',pct:74,status:'ok'},
  {code:'HDC',name:'Doctor Communication',pct:81,status:'ok'},{code:'CS',name:'Customer Service',pct:60,status:'crit'},
  {code:'RHP',name:'Rating of Health Plan',pct:67,status:'risk'},{code:'CC',name:'Care Coordination',pct:72,status:'ok'},
];
const rowTr=m=>{
  const c=m.status==='ok'?'#1D9E75':m.status==='risk'?'#d97706':'#dc2626';
  const l=m.status==='ok'?'On track':m.status==='risk'?'At risk':'Critical';
  const pc=m.status==='ok'?'p-green':m.status==='risk'?'p-amber':'p-red';
  return '<tr style="border-bottom:1px solid #f9fafb"><td style="padding:6px 14px;font-size:11px;font-weight:700;color:#F26722">'+m.code+'</td><td style="padding:6px 4px;font-size:11px;color:#374151">'+m.name+'</td><td style="padding:6px 8px;font-size:12px;font-weight:700;color:'+c+';text-align:right">'+m.pct+'%</td><td style="padding:6px 14px 6px 4px;text-align:right"><span class="pill '+pc+'" style="font-size:10px">'+l+'</span></td></tr>';
};
document.getElementById('plan-hedis-body').innerHTML=planHedis.map(rowTr).join('');
document.getElementById('plan-cahps-body').innerHTML=planCahps.map(rowTr).join('');

// HEDIS measures
let hedisData=[
  {code:'HBD',name:'Diabetes Care â€“ Blood Sugar Controlled',wt:'3Ã—',pct:81.2,gaps:2340,color:'green'},
  {code:'CBP',name:'Controlling Blood Pressure',wt:'3Ã—',pct:68.4,gaps:6124,color:'yellow'},
  {code:'PCR',name:'Plan All-Cause Readmissions',wt:'3Ã—',pct:74.3,gaps:3890,color:'yellow'},
  {code:'BCS',name:'Breast Cancer Screening',wt:'1Ã—',pct:71.8,gaps:4201,color:'yellow'},
  {code:'COL',name:'Colorectal Cancer Screening',wt:'1Ã—',pct:66.3,gaps:5672,color:'red'},
  {code:'COA_MR',name:'Care for Older Adults â€“ Medication Review',wt:'1Ã—',pct:68.2,gaps:5120,color:'yellow'},
  {code:'COA_PA',name:'Care for Older Adults â€“ Pain Assessment',wt:'1Ã—',pct:72.1,gaps:4480,color:'yellow'},
  {code:'OMW',name:'Osteoporosis Management â€“ Women Fracture',wt:'1Ã—',pct:52.4,gaps:8920,color:'red'},
  {code:'EED',name:'Diabetes Care â€“ Eye Exam',wt:'1Ã—',pct:63.7,gaps:7891,color:'red'},
  {code:'KED',name:'Kidney Health Evaluation (Diabetes)',wt:'1Ã—',pct:79.2,gaps:3120,color:'green'},
  {code:'MRP',name:'Medication Reconciliation Post-Discharge',wt:'1Ã—',pct:58.6,gaps:7510,color:'red'},
  {code:'SPC',name:'Statin Therapy â€“ Cardiovascular Disease',wt:'1Ã—',pct:84.1,gaps:1847,color:'green'},
  {code:'TRC',name:'Transitions of Care',wt:'1Ã—',pct:59.1,gaps:7240,color:'red'},
  {code:'AMM',name:'Antidepressant Medication Management',wt:'1Ã—',pct:52.8,gaps:8310,color:'red'},
];
let hFilter='all',hSortDir=null;
function setHFilter(f){hFilter=f;['all','green','yellow','red'].forEach(k=>document.getElementById('hf-'+k).classList.toggle('on',k===f));renderHedis();}
function toggleHSort(){hSortDir=hSortDir==='asc'?'desc':hSortDir==='desc'?null:'asc';document.getElementById('sort-icon').textContent=hSortDir==='asc'?'â†‘':hSortDir==='desc'?'â†“':'â‡…';renderHedis();}
function goToSimulator(idx){
  const m=hedisData[idx];
  showPage('simulator',document.querySelectorAll('.ntab')[4]);
  switchMode('auto');
  const codeMap={COL:'col',SPC:'spc',AMM:'amm',HBD:'cdc',CBP:'cbp',EED:'cdc',MRP:'all',TRC:'all',OMW:'all',BCS:'bcs',KED:'all',PCR:'all',COA_MR:'all',COA_PA:'all'};
  document.getElementById('sim-measure').value=codeMap[m.code]||'all';
  const banner=document.getElementById('sim-measure-banner');
  document.getElementById('sim-banner-name').textContent=m.code+' â€“ '+m.name;
  document.getElementById('sim-banner-meta').textContent=m.gaps.toLocaleString()+' estimated open gaps';
  banner.style.display='flex';
  simRecalc();
}
function renderHedis(){
  let rows=hedisData.filter(m=>hFilter==='all'||(hFilter==='green'&&m.color==='green')||(hFilter==='yellow'&&m.color==='yellow')||(hFilter==='red'&&m.color==='red'));
  if(hSortDir==='asc')rows=[...rows].sort((a,b)=>a.pct-b.pct);
  else if(hSortDir==='desc')rows=[...rows].sort((a,b)=>b.pct-a.pct);
  window._hedisRows=rows;
  const sd=c=>c==='green'?'ðŸŸ¢':c==='yellow'?'ðŸŸ¡':'ðŸ”´';
  document.getElementById('hedis-rows').innerHTML=rows.map((m,i)=>'<div class="hedis-row" style="cursor:pointer" onclick="goToSimulator('+hedisData.indexOf(m)+')" onmouseover="this.style.background=\'#f9fafb\'" onmouseout="this.style.background=\'transparent\'">'
    +'<span class="hr-code">'+m.code+'</span>'
    +'<span class="hr-name">'+m.name+'</span>'
    +'<span class="hr-wt">'+m.wt+'</span>'
    +'<span class="hr-pct '+m.color+'">'+sd(m.color)+' '+m.pct+'%</span>'
    +'<span class="hr-gaps">'+m.gaps.toLocaleString()+' gaps</span>'
    +'</div>').join('');
}
renderHedis();

function hedisUpdateStats(){
  const totalGaps=hedisData.reduce((s,m)=>s+(m.gaps||0),0);
  const redCnt=hedisData.filter(m=>m.color==='red').length;
  const greenCnt=hedisData.filter(m=>m.color==='green').length;
  const yellowCnt=hedisData.filter(m=>m.color==='yellow').length;
  const hTotal=document.getElementById('hs-total');
  const hGaps=document.getElementById('hs-gaps');
  const hRed=document.getElementById('hs-red');
  if(hTotal)hTotal.textContent=hedisData.length;
  if(hGaps)hGaps.textContent=totalGaps.toLocaleString();
  if(hRed)hRed.textContent=redCnt;
  const allEl=document.getElementById('hf-all');
  const greenEl=document.getElementById('hf-green');
  const yellowEl=document.getElementById('hf-yellow');
  const redEl=document.getElementById('hf-red');
  if(allEl)allEl.textContent='All ('+hedisData.length+')';
  if(greenEl)greenEl.innerHTML='ðŸŸ¢ Green â€” Meets Target ('+greenCnt+')';
  if(yellowEl)yellowEl.innerHTML='ðŸŸ¡ Yellow â€” At Risk ('+yellowCnt+')';
  if(redEl)redEl.innerHTML='ðŸ”´ Red â€” Needs Attention ('+redCnt+')';
}

function hedisPageInit(){
  const sel=document.getElementById('hedis-plan-select');
  if(!sel)return;
  const cList=window._contracts||contracts||[];
  sel.innerHTML=cList.map(c=>'<option value="'+c.id+'">'+c.id+' â€” '+c.name+'</option>').join('');
  const planId=window._selectedContractId||(cList.length?cList[0].id:null);
  if(planId){
    sel.value=planId;
    window._selectedContractId=planId;
    hedisLoadPlan(planId);
  }
  const badge=document.getElementById('hedis-plan-badge');
  if(badge){
    const c=cList.find(x=>x.id===sel.value);
    if(c){badge.textContent=c.state+' Â· '+c.enroll.toLocaleString()+' enrolled';badge.style.display='inline';}
  }
}

function hedisSelectPlan(contractId){
  window._selectedContractId=contractId;
  const cList=window._contracts||contracts||[];
  const c=cList.find(x=>x.id===contractId);
  if(c)window._selectedContractName=c.name;
  const badge=document.getElementById('hedis-plan-badge');
  if(badge&&c){badge.textContent=c.state+' Â· '+c.enroll.toLocaleString()+' enrolled';badge.style.display='inline';}
  hedisLoadPlan(contractId);
}

function hedisLoadPlan(contractId){
  const cList=window._contracts||contracts||[];
  const c=cList.find(x=>x.id===contractId);
  const backEl=document.querySelector('#pg-hedis .back-btn');
  if(backEl&&c)backEl.textContent='â† Back to '+(c.name||'').split(' ').slice(0,3).join(' ');
  fetch('/api/hedis-measures?contract_id='+contractId).then(r=>r.json()).then(data=>{
    const items=data.items||data;
    if(items&&items.length){
      hedisData=items.map(m=>({code:m.measure_code,name:m.measure_name,wt:m.weight||'1x',pct:m.current_rate,gaps:m.open_gap_count,color:m.status}));
      renderHedis();
      hedisUpdateStats();
    }
  }).catch(()=>{});
}
window.hedisSelectPlan=hedisSelectPlan;

// â”€â”€ SIMULATOR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const suppState={contacted:true,optout:true,closed:true};
const suppCounts={contacted:83,optout:29,closed:41};
function toggleSupp(el,key){suppState[key]=!suppState[key];el.classList.toggle('on');simRecalc();}
function toggleF(el){el.classList.toggle('on');}
const gapCounts={open:412,partial:283,borderline:152};
const propCounts={high:198,medium:267,low:382};
const totalProp=847;
function autoChannel(p,g){return p==='high'||g==='open'?'Call':p==='medium'||g==='partial'?'SMS':'Email';}
function autoIncentive(p,g){if(g==='open'&&p==='high')return 'None';if(g==='open'&&p==='medium')return '$25 card';if(g==='partial')return '$25 card';if(g==='borderline')return '$50 card';return 'None';}
function closureRate(ch,inc){let b=ch==='Call'?.28:ch==='SMS'?.22:.12;if(inc==='$25 card')b+=.04;if(inc==='$50 card')b+=.08;return b;}
function costPerClosure(ch,inc){let b=ch==='Call'?22:ch==='SMS'?4:2;if(inc==='$25 card')b+=25;if(inc==='$50 card')b+=50;return b;}
const hedisOpts='<option value="all">All measures</option><option value="col">COL â€“ Colorectal</option><option value="spc">SPC â€“ Statin</option><option value="amm">AMM â€“ Antidepressant</option><option value="cdc">CDC â€“ A1c</option><option value="mad">MAD â€“ Med Adherence</option><option value="flu">FLU â€“ Flu Vaccination</option><option value="bcs">BCS â€“ Breast Cancer</option><option value="cbp">CBP â€“ Blood Pressure</option>';
const cahpsOpts='<option value="all">All CAHPS</option><option value="gnc">Getting Needed Care</option><option value="gcq">Getting Care Quickly</option><option value="hwdc">Doctor Communication</option><option value="cs">Customer Service</option><option value="rhp">Health Plan Rating</option><option value="cc">Care Coordination</option>';
let simLastResult={net:694,te:160,proj:69.7,eligible:2847,measurePct:63.0,measureName:'All HEDIS',waterfall:[{label:'Week 1',outreach:278,closures:64,compliance:65.2},{label:'Week 2',outreach:208,closures:48,compliance:66.9},{label:'Week 3',outreach:139,closures:32,compliance:68.1},{label:'Week 4',outreach:69,closures:16,compliance:68.7}]};
let _simScaledGaps={open:412,partial:283,borderline:152};
const _fn=['James','Linda','Robert','Mary','Michael','Patricia','William','Jennifer','David','Barbara','Richard','Susan','Joseph','Jessica','Thomas','Sarah'];
const _ln=['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Anderson'];
let _rng=42;
function _rand(){_rng=(_rng*1664525+1013904223)&0xffffffff;return Math.abs(_rng)/0x7fffffff;}
function _ri(a,b){return a+Math.floor(_rand()*(b-a));}
function genMockMember(measure,measureCode,channel,week){
  const name=_fn[_ri(0,_fn.length)]+' '+_ln[_ri(0,_ln.length)][0]+'.';
  const age=_ri(62,80);const prop=channel==='calls'?_ri(70,95):channel==='sms'?_ri(45,72):_ri(35,58);
  const gap=channel==='calls'?'Open':channel==='sms'?'Partial':'Borderline';
  const inc=prop>=80&&channel==='calls'?'None':prop>=60?'$25 card':'$50 card';
  const short=measure.length>30?measure.slice(0,28)+'â€¦':measure;
  return{name,age,prop,gap,measure:short,measureCode,incentive:inc,week,
    at:channel==='calls'?'Outreach call':'Batch '+channel,ab:short+' Â· '+gap+' gap',
    script:channel==='calls'?'"Hi [Name], calling about your '+short+' â€” fully covered. Can we schedule?"':'Hi [Name], you are due for your '+short+'. Please contact us to schedule.'};
}

function getSimMeasureData(){
  const map={col:'COL',spc:'SPC',amm:'AMM',cdc:'HBD',mad:'MRP',flu:'TRC',bcs:'BCS',cbp:'CBP'};
  const val=document.getElementById('sim-measure').value;
  const hCode=map[val];
  if(hCode){const m=hedisData.find(h=>h.code===hCode);if(m)return{gaps:m.gaps,pct:m.pct,name:m.name,code:m.code};}
  const totalGaps=hedisData.reduce((a,m)=>a+m.gaps,0);
  const avgPct=+(hedisData.reduce((a,m)=>a+m.pct,0)/hedisData.length).toFixed(1);
  return{gaps:totalGaps,pct:avgPct,name:'All HEDIS Measures',code:'all'};
}
function setSimDomain(d,el){
  document.querySelectorAll('#pg-simulator .domain-btn').forEach(b=>b.classList.toggle('active',b===el));
  document.getElementById('sim-measure').innerHTML=d==='hedis'?hedisOpts:cahpsOpts;
  document.getElementById('sim-measure-label').textContent=d==='hedis'?'HEDIS Measure':'CAHPS Measure';
  simRecalc();
}

function calcSimResult(){
  const md=getSimMeasureData();
  const eligible=Math.round(md.gaps/Math.max(0.01,1-md.pct/100));
  const baseTotal=gapCounts.open+gapCounts.partial+gapCounts.borderline;
  const scale=md.gaps/baseTotal;
  _simScaledGaps={open:Math.round(gapCounts.open*scale),partial:Math.round(gapCounts.partial*scale),borderline:Math.round(gapCounts.borderline*scale)};
  const scaledSupp={contacted:Math.round(suppCounts.contacted*scale),optout:Math.round(suppCounts.optout*scale),closed:Math.round(suppCounts.closed*scale)};
  const ag=[],ap=[];
  document.querySelectorAll('[data-grp="gap"]').forEach(c=>{if(c.classList.contains('on'))ag.push(c.dataset.val);});
  document.querySelectorAll('[data-grp="prop"]').forEach(c=>{if(c.classList.contains('on'))ap.push(c.dataset.val);});
  let gt=0;ag.forEach(g=>gt+=_simScaledGaps[g]||0);
  let pw=0;ap.forEach(p=>pw+=propCounts[p]||0);
  const pr=pw/totalProp;
  let matched=Math.round(gt*pr),st=0;
  if(suppState.contacted)st+=scaledSupp.contacted;if(suppState.optout)st+=scaledSupp.optout;if(suppState.closed)st+=scaledSupp.closed;
  st=Math.min(st,matched);const net=Math.max(0,matched-st);
  const segs=[];
  ag.forEach(g=>ap.forEach(p=>{
    const cnt=net>0?Math.round((_simScaledGaps[g]||0)/Math.max(1,gt)*(propCounts[p]||0)/Math.max(1,pw)*net):0;
    if(cnt<=0)return;
    const ch=autoChannel(p,g),inc=autoIncentive(p,g),rate=closureRate(ch,inc),est=Math.round(cnt*rate),cost=costPerClosure(ch,inc);
    segs.push({label:g.charAt(0).toUpperCase()+g.slice(1)+' Â· '+p+' prop',members:cnt,channel:ch,incentive:inc,est,rate:Math.round(rate*100),cost});
  }));
  const te=segs.reduce((a,s)=>a+s.est,0);
  const lift=eligible>0?te/eligible*100:0;
  const proj=Math.min(100,md.pct+lift);
  const cm={};segs.forEach(s=>{cm[s.channel]=(cm[s.channel]||0)+s.members;});
  const wkDist=[.4,.3,.2,.1];let cc=md.pct;
  const waterfall=wkDist.map((f,i)=>{const wM=Math.round(net*f),wE=Math.round(te*f);cc+=eligible>0?wE/eligible*100:0;return{label:'Week '+(i+1),outreach:wM,closures:wE,compliance:+cc.toFixed(1)};});
  return{md,eligible,net,segs,te,proj:+proj.toFixed(1),lift:+lift.toFixed(1),cm:{Call:cm['Call']||0,SMS:cm['SMS']||0,Email:cm['Email']||0},waterfall};
}

function calcRiskScore(){
  const sg=_simScaledGaps;
  const ag=[],ap=[];
  document.querySelectorAll('[data-grp="gap"]').forEach(c=>{if(c.classList.contains('on'))ag.push(c.dataset.val);});
  document.querySelectorAll('[data-grp="prop"]').forEach(c=>{if(c.classList.contains('on'))ap.push(c.dataset.val);});
  const totalGaps=ag.reduce((a,g)=>a+(sg[g]||0),0);
  const pw=ap.reduce((a,p)=>a+(propCounts[p]||0),0);
  const pr=pw/totalProp;const matched=Math.round(totalGaps*pr);
  const baseScale=(sg.open+sg.partial+sg.borderline)/(gapCounts.open+gapCounts.partial+gapCounts.borderline);
  let st=0;
  if(suppState.contacted)st+=Math.round(suppCounts.contacted*baseScale);
  if(suppState.optout)st+=Math.round(suppCounts.optout*baseScale);
  if(suppState.closed)st+=Math.round(suppCounts.closed*baseScale);
  st=Math.min(st,matched);
  const hoCount=ap.includes('high')&&ag.includes('open')?Math.round((propCounts.high/totalProp)*(sg.open||0)):0;
  const mpCount=ap.includes('medium')&&ag.includes('partial')?Math.round((propCounts.medium/totalProp)*(sg.partial||0)):0;
  const raw=matched>0?(hoCount/matched*0.55)+(mpCount/matched*0.25)-(st/matched*0.20):0;
  return Math.max(0,Math.min(100,Math.round(raw*100)));
}

function renderMemberPool(result,poolElId,countElId){
  const{md,net,segs}=result;
  const POOL=Math.min(20,net);const poolRows=[];
  const sv=_rng;_rng=Math.abs((net*31337+result.te*7919)&0x7fffffff)||1;
  if(net>0&&segs.length>0){
    segs.forEach(seg=>{
      const share=Math.max(1,Math.round(seg.members/net*POOL));
      const chKey=seg.channel==='Call'?'calls':seg.channel==='SMS'?'sms':'email';
      const wks=['Week 1','Week 2','Week 3','Week 4'];
      for(let i=0;i<share&&poolRows.length<POOL;i++){
        const m=genMockMember(md.name,md.code,chKey,wks[_ri(0,4)]);
        poolRows.push({...m,channel:seg.channel,incentive:seg.incentive});
      }
    });
  }
  _rng=sv;
  const ce=document.getElementById(countElId);
  if(ce)ce.textContent=net.toLocaleString()+' members'+(POOL<net?' Â· showing '+poolRows.length:'');
  const pe=document.getElementById(poolElId);
  if(!pe)return;
  if(poolRows.length===0){pe.innerHTML='<div style="color:#9ca3af;font-size:12px;padding:8px">No members in pool â€” adjust filters.</div>';return;}
  const propColor=p=>p>=75?'#1D9E75':p>=50?'#d97706':'#6b7280';
  const gapPill=g=>g==='Open'?'p-red':g==='Partial'?'p-amber':'p-gray';
  const cCls={Call:'ch-call',SMS:'ch-sms',Email:'ch-email'};
  const poolKey=poolElId==='auto-member-pool-table'?'_autoPool':'_hilPool';
  window[poolKey]=poolRows;
  pe.innerHTML='<table class="data-table"><thead><tr><th>Member</th><th>Age</th><th>Prop.</th><th>Measure</th><th>Gap</th><th>Week</th><th>Channel</th><th>Incentive</th></tr></thead><tbody>'
    +poolRows.map((m,i)=>'<tr style="cursor:pointer" onclick="openMemberProfile(window.'+poolKey+'['+i+'])" onmouseover="this.style.background=\'#fef9f9\'" onmouseout="this.style.background=\'\'">'
      +'<td style="font-weight:600;color:#1d4ed8;text-decoration:underline">'+m.name+'</td>'
      +'<td>'+m.age+'</td>'
      +'<td style="font-weight:600;color:'+propColor(m.prop)+'">'+m.prop+'%</td>'
      +'<td style="font-size:11px">'+m.measure+'</td>'
      +'<td><span class="pill '+gapPill(m.gap)+'" style="font-size:10px">'+m.gap+'</span></td>'
      +'<td style="font-size:11px;color:#6b7280">'+m.week+'</td>'
      +'<td><span class="ch-chip '+(cCls[m.channel]||'ch-call')+'">'+m.channel+'</span></td>'
      +'<td style="color:#d97706;font-size:11px">'+m.incentive+'</td>'
      +'</tr>').join('')
    +'</tbody></table>';
}

function applyToUI(result,prefix){
  const{md,eligible,net,segs,te,proj,lift,cm}=result;
  const setT=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  setT(prefix+'-compliance-current',md.pct.toFixed(1)+'%');
  setT(prefix+'-eligible-sub',eligible.toLocaleString()+' eligible members');
  setT(prefix+'-pool',net.toLocaleString());
  setT(prefix+'-closures',te);
  setT(prefix+'-proj',proj.toFixed(1)+'%');
  setT(prefix+'-proj-sub','+'+lift.toFixed(1)+'% improvement');
  setT(prefix+'-prog-label',md.pct.toFixed(1)+'%â†’'+proj.toFixed(1)+'%/70%');
  setT(prefix+'-gap-label',proj>=70?'âœ“ Target reached!':'Gap: '+(70-proj).toFixed(1)+'%');
  const pb=document.getElementById(prefix+'-prog-bar');if(pb)pb.style.width=Math.min(100,proj)+'%';
  setT(prefix+'-seg-total-label',net.toLocaleString()+' members');
  const cCls={Call:'ch-call',SMS:'ch-sms',Email:'ch-email'};
  const sb=document.getElementById(prefix+'-seg-body');
  if(sb)sb.innerHTML=segs.map(s=>'<tr><td>'+s.label+'</td><td><strong>'+s.members+'</strong></td><td><span class="ch-chip '+cCls[s.channel]+'">'+s.channel+'</span></td><td style="color:#d97706;font-weight:500">'+s.incentive+'</td><td><strong style="color:#1D9E75">'+s.est+'</strong></td><td>'+s.rate+'%</td><td>$'+s.cost+'</td></tr>').join('')
    +'<tr style="font-weight:700;background:#f9fafb"><td>Total</td><td>'+net.toLocaleString()+'</td><td>â€”</td><td>â€”</td><td style="color:#1D9E75">'+te+'</td><td>â€”</td><td>â€”</td></tr>';
  const rs=calcRiskScore();
  const rsEl=document.getElementById(prefix+'-risk-val');
  if(rsEl){rsEl.textContent=rs;const col=rs<40?'#dc2626':rs<70?'#d97706':'#1D9E75';const lbl=rs<40?'High Risk':rs<70?'Moderate Risk':'Low Risk';rsEl.style.color=col;const rc=document.getElementById(prefix==='auto'?'kpi-risk-card':'hil-risk-card');if(rc)rc.style.borderTopColor=col;setT(prefix+'-risk-sub',lbl);}
  document.getElementById('net-members').textContent=net.toLocaleString();
  document.getElementById('net-sub').textContent=net+matched_debug(result)+' suppressed';
}
function matched_debug(r){return ' matched âˆ’ ';}// placeholder to avoid re-calc

function simRecalc(){
  const result=calcSimResult();
  simLastResult={...result,measurePct:result.md.pct,measureName:result.md.name,measureCode:result.md.code};
  applyToUI(result,'auto');
  renderMemberPool(result,'auto-member-pool-table','auto-pool-count');
  // sync agent sidebar
  const wkData=result.waterfall[agentWeekFilter-1];
  if(wkData){const awM=document.getElementById('aw-members');const awR=document.getElementById('aw-remaining');if(awM)awM.textContent=wkData.outreach;if(awR)awR.textContent=wkData.outreach;const ap=document.getElementById('agent-projected');if(ap&&currentAgentDomain==='hedis')ap.textContent=wkData.compliance.toFixed(1)+'%';}
  const ac=document.getElementById('agent-current');if(ac&&currentAgentDomain==='hedis')ac.textContent=result.md.pct.toFixed(1)+'%';
  syncWeekCounts();
  // also update HIL if visible
  if(document.getElementById('hil-mode').style.display!=='none')hilRecalc();
}

function hilRecalc(){
  const result=calcSimResult();
  applyToUI(result,'hil');
  // override closures with slider-based calc
  const md=result.md;const eligible=result.eligible;
  const r=parseInt(document.getElementById('hil-reach-val').textContent)||65;
  const e=parseInt(document.getElementById('hil-engage-val').textContent)||40;
  const cv=parseInt(document.getElementById('hil-conv-val').textContent)||28;
  const cl=Math.round(md.gaps*(r/100)*(e/100)*(cv/100));
  const lift=eligible>0?(cl/eligible*100).toFixed(1):'0.0';
  const proj=Math.min(100,md.pct+parseFloat(lift));
  const setT=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  setT('hil-closures',cl);setT('hil-closures-disp',cl);setT('hil-lift','+'+lift+'%');setT('hil-cost-disp','$'+(cl*50).toLocaleString());
  setT('hil-proj',proj.toFixed(1)+'%');setT('hil-proj-sub','+'+lift+'% improvement');
  setT('hil-prog-label',md.pct.toFixed(1)+'%â†’'+proj.toFixed(1)+'%/70%');
  setT('hil-gap-label',proj>=70?'âœ“ Target reached!':'Gap: '+(70-proj).toFixed(1)+'%');
  const pb=document.getElementById('hil-prog-bar');if(pb)pb.style.width=Math.min(100,proj)+'%';
  renderMemberPool(result,'hil-member-pool-table','hil-pool-count');
}

function switchMode(m){
  document.getElementById('auto-mode').style.display=m==='auto'?'block':'none';
  document.getElementById('hil-mode').style.display=m==='hil'?'block':'none';
  document.getElementById('mode-auto').classList.toggle('active',m==='auto');
  document.getElementById('mode-hil').classList.toggle('active',m==='hil');
  if(m==='hil')hilRecalc();
}

const activeCampaigns={};
function assignCampaignToMembers(campName,measureCode,channelCounts){
  const measureFilter=measureCode&&measureCode!=='all'?measureCode:null;
  let remaining={Call:channelCounts.Call||0,SMS:channelCounts.SMS||0,Email:channelCounts.Email||0};
  const propOrder=[...mglData].sort((a,b)=>(b.prop||0)-(a.prop||0));
  propOrder.forEach(m=>{
    if(m.campaign&&m.campaign!=='')return;
    if(measureFilter&&m.measureCode!==measureFilter)return;
    const ch=m.channel||'Call';
    if((remaining[ch]||0)>0){m.campaign=campName;remaining[ch]--;}
  });
  if(Object.values(remaining).some(v=>v>0)){
    propOrder.forEach(m=>{
      if(m.campaign&&m.campaign!=='')return;
      if(measureFilter&&m.measureCode!==measureFilter)return;
      for(const ch of ['Call','SMS','Email']){
        if((remaining[ch]||0)>0){m.campaign=campName;m.channel=ch;remaining[ch]--;break;}
      }
    });
  }
}
function createAutoCampaign(){
  const nameEl=document.getElementById('auto-camp-name');
  const campName=nameEl.value.trim()||('Auto â€” '+new Date().getSeconds());
  if(activeCampaigns[campName]){alert('Campaign "'+campName+'" already exists.');return;}
  const r=calcSimResult();
  activeCampaigns[campName]={...r,measurePct:r.md.pct};
  assignCampaignToMembers(campName,r.md.code,r.cm);
  const cSel=document.getElementById('agent-campaign-filter');
  if(cSel&&!Array.from(cSel.options).find(o=>o.value===campName)){const opt=document.createElement('option');opt.value=campName;opt.textContent=campName+' (Active)';cSel.appendChild(opt);}
  const st=document.getElementById('auto-camp-status');st.style.display='block';
  st.innerHTML='âœ… <strong>"'+campName+'"</strong> created Â· ðŸ“ž '+r.cm.Call+' calls Â· ðŸ’¬ '+r.cm.SMS+' SMS Â· âœ‰ï¸ '+r.cm.Email+' emails queued.';
  nameEl.value='';
  toast('âœ… "'+campName+'" launched! Navigating to Agent Executionâ€¦');
  setTimeout(()=>{
    showPage('agent');
    const cSel=document.getElementById('agent-campaign-filter');
    if(cSel){cSel.value=campName;cSel.dispatchEvent(new Event('change'));}
  },1200);
}
function createHILCampaign(){
  const nameEl=document.getElementById('hil-camp-name');
  const campName=nameEl.value.trim()||('HIL â€” '+new Date().getSeconds());
  const r=calcSimResult();
  assignCampaignToMembers(campName,r.md.code,r.cm);
  activeCampaigns[campName]={...r,measurePct:r.md.pct};
  const cSel=document.getElementById('agent-campaign-filter');
  if(cSel&&!Array.from(cSel.options).find(o=>o.value===campName)){const opt=document.createElement('option');opt.value=campName;opt.textContent=campName+' (Active)';cSel.appendChild(opt);}
  const st=document.getElementById('hil-camp-status');st.style.display='block';
  st.innerHTML='âœ… <strong>"'+campName+'"</strong> created';
  nameEl.value='';
  toast('âœ… Human In Loop campaign "'+campName+'" queued! Navigating to Agent Executionâ€¦');
  setTimeout(()=>{
    showPage('agent');
    const cSel=document.getElementById('agent-campaign-filter');
    if(cSel){cSel.value=campName;cSel.dispatchEvent(new Event('change'));}
  },1200);
}
function toast(msg){
  const t=document.createElement('div');
  t.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#065f46;color:#fff;padding:12px 24px;border-radius:10px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.2)';
  t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),4000);
}

// â”€â”€ AGENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const agentHEDIS=[
  {name:'James T.',age:71,prop:88,gap:'Open',measure:'CDC â€“ A1c Control',incentive:'None',week:'Week 1',at:'First call',ab:'Do not offer incentive on first touch.',script:'"Hi, calling about your covered HbA1c test. Can we schedule?"'},
  {name:'David K.',age:64,prop:79,gap:'Open',measure:'SPC â€“ Statin Therapy',incentive:'$25 card',week:'Week 1',at:'Second attempt',ab:'Previous call went to voicemail.',script:'"Hi David, calling again. We have a $25 Walmart card â€” can we connect with your pharmacy?"'},
  {name:'Leon W.',age:73,prop:76,gap:'Partial',measure:'COL â€“ Colorectal',incentive:'None',week:'Week 1',at:'First call â€” partial gap',ab:'Member started screening. Needs follow-up.',script:'"Hi Leon, we see you started your colorectal screening â€” just one more step. Can we schedule today?"'},
];
const agentHEDIS_SMS=[{name:'Alice W.',age:68,prop:72,gap:'Partial',measure:'SPC â€“ Statin',incentive:'None',week:'Week 1'},{name:'Mark R.',age:71,prop:65,gap:'Borderline',measure:'CBP â€“ Blood Pressure',incentive:'$25 card',week:'Week 1'}];
const agentHEDIS_Email=[{name:'Susan J.',age:65,prop:61,gap:'Partial',measure:'BCS â€“ Breast Cancer',incentive:'None',week:'Week 1'}];
const agentCAHPS=[
  {name:'Patricia M.',age:68,prop:84,gap:'Open',measure:'Customer Service',incentive:'None',week:'Week 1',at:'CAHPS follow-up',ab:'Member logged a call center complaint.',script:'"Hi Patricia, calling to follow up on your recent experience. Do you have a moment?"'},
  {name:'Robert E.',age:72,prop:77,gap:'Open',measure:'Getting Needed Care',incentive:'None',week:'Week 1',at:'Care access barrier',ab:'Member had delayed specialist referral.',script:'"Hi Robert, we noticed difficulty accessing a specialist. We have a care navigator who can help."'},
  {name:'Sandra L.',age:65,prop:71,gap:'Partial',measure:'Rating of Health Plan',incentive:'None',week:'Week 1',at:'Low satisfaction score',ab:'Survey returned 4/10.',script:'"Hi Sandra, we received your survey and value your feedback. Can I take 3 minutes?"'},
];
const agentCAHPS_SMS=[{name:'John D.',age:70,prop:70,gap:'Partial',measure:'Customer Service',incentive:'None',week:'Week 1'}];
const agentCAHPS_Email=[{name:'Tom H.',age:74,prop:63,gap:'Borderline',measure:'Rating of Health Plan',incentive:'None',week:'Week 1'}];
let currentAgentChannel='calls',currentAgentDomain='hedis',agentMeasureFilter='all',agentCampaignFilter='all',agentWeekFilter=1;

let campaigns=[
  {name:'Q3 COL Outreach',measure:'COL',channel:'SMS',members:356,proj:93,actual:87,lift:'+3.1%',cost:'$1,740',roi:'5.2x',status:'Completed'},
  {name:'SPC High-Risk Push',measure:'SPC',channel:'Call',members:246,proj:69,actual:71,lift:'+2.5%',cost:'$5,548',roi:'4.1x',status:'Completed'},
  {name:'AMM Follow-Up Wave',measure:'AMM',channel:'Call',members:183,proj:48,actual:41,lift:'+1.4%',cost:'$3,280',roi:'3.2x',status:'Completed'},
  {name:'FLU Blast',measure:'FLU',channel:'Email',members:245,proj:29,actual:34,lift:'+1.2%',cost:'$490',roi:'8.9x',status:'Completed'},
  {name:'CDC Incentive Campaign',measure:'CDC',channel:'Call',members:166,proj:46,actual:39,lift:'+1.4%',cost:'$4,175',roi:'3.5x',status:'Completed'},
  {name:'Q4 COL Push',measure:'COL',channel:'SMS',members:310,proj:80,actual:null,lift:'+2.8%',cost:'$1,240',roi:'â€”',status:'Active'},
  {name:'SPC Final Sweep',measure:'SPC',channel:'Call',members:200,proj:56,actual:null,lift:'+2.0%',cost:'$4,400',roi:'â€”',status:'Active'},
];

function initAgentFilters(){
  const mSel=document.getElementById('agent-measure-filter');
  if(mSel){
    const codes=[...new Set(mglData.map(m=>m.measureCode).filter(Boolean))];
    if(codes.length){codes.forEach(code=>{const m=mglData.find(x=>x.measureCode===code);const o=document.createElement('option');o.value=code;o.textContent=code+(m?' â€“ '+m.measure.replace(code+' â€“ ','').slice(0,25):'');mSel.appendChild(o);});}
    else{hedisData.forEach(m=>{const o=document.createElement('option');o.value=m.code;o.textContent=m.code+' â€“ '+m.name.slice(0,28);mSel.appendChild(o);});}
  }
  const cSel=document.getElementById('agent-campaign-filter');
  if(cSel)campaigns.forEach(c=>{const o=document.createElement('option');o.value=c.name;o.textContent=c.name+' ('+c.status+')';cSel.appendChild(o);});
  syncWeekCounts();syncChannelCards();
}
function applyAgentFilters(){agentMeasureFilter=document.getElementById('agent-measure-filter').value;agentCampaignFilter=document.getElementById('agent-campaign-filter').value;renderAgentQueue();}
function selectAgentWeek(n){
  agentWeekFilter=n;
  [1,2,3,4].forEach(i=>{const c=document.getElementById('afwk-'+i);if(c)c.classList.toggle('on',i===n);});
  document.querySelectorAll('.week-item').forEach((w,i)=>w.classList.toggle('active',i+1===n));
  const notice=document.getElementById('agent-domain-notice');
  if(notice)notice.textContent='Outreach queue â€” Week '+n;
  const wkData=simLastResult&&simLastResult.waterfall?simLastResult.waterfall[n-1]:null;
  if(wkData){const awM=document.getElementById('aw-members');const awR=document.getElementById('aw-remaining');if(awM)awM.textContent=wkData.outreach;if(awR)awR.textContent=wkData.outreach;const ap2=document.getElementById('agent-projected');if(ap2)ap2.textContent=wkData.compliance.toFixed(1)+'%';}
  renderAgentQueue();
}
// propensity tiers map to weeks: >75 â†’ Wk1, 51-75 â†’ Wk2, 31-50 â†’ Wk3, â‰¤30 â†’ Wk4
const _wkRange={1:[76,101],2:[51,76],3:[31,51],4:[0,31]};
function _agentSrc(){return mglData.length?mglData:[];}
function getAgentPool(){
  const chMap={calls:'Call',sms:'SMS',email:'Email'};
  const [minP,maxP]=_wkRange[agentWeekFilter];
  let pool=_agentSrc().filter(m=>m.channel===chMap[currentAgentChannel]&&m.prop>=minP&&m.prop<maxP);
  if(agentMeasureFilter!=='all')pool=pool.filter(m=>m.measureCode===agentMeasureFilter);
  if(agentCampaignFilter!=='all')pool=pool.filter(m=>m.campaign===agentCampaignFilter);
  return pool;
}
function _filteredAgentSrc(){
  let src=_agentSrc();
  if(agentMeasureFilter!=='all')src=src.filter(m=>m.measureCode===agentMeasureFilter);
  if(agentCampaignFilter!=='all')src=src.filter(m=>m.campaign===agentCampaignFilter);
  return src;
}
function syncWeekCounts(){
  const src=_filteredAgentSrc();
  [1,2,3,4].forEach(i=>{const el=document.getElementById('wi-count-'+i);if(!el)return;const [mn,mx]=_wkRange[i];const cnt=src.filter(m=>m.prop>=mn&&m.prop<mx).length;el.textContent=cnt>0?cnt.toLocaleString():'';});
  const awM=document.getElementById('aw-members');const awR=document.getElementById('aw-remaining');
  const [mn,mx]=_wkRange[agentWeekFilter];const wkCnt=src.filter(m=>m.prop>=mn&&m.prop<mx).length;
  if(awM)awM.textContent=wkCnt;if(awR)awR.textContent=wkCnt;
  // Update sidebar compliance if campaign has data
  if(agentCampaignFilter!=='all'&&activeCampaigns[agentCampaignFilter]){
    const cd=activeCampaigns[agentCampaignFilter];
    const ac=document.getElementById('agent-current');if(ac)ac.textContent=cd.measurePct.toFixed(1)+'%';
    const ap=document.getElementById('agent-projected');if(ap)ap.textContent=cd.proj.toFixed(1)+'%';
  }
}
function syncChannelCards(){
  const [mn,mx]=_wkRange[agentWeekFilter];
  const weekMem=_filteredAgentSrc().filter(m=>m.prop>=mn&&m.prop<mx);
  const cc=weekMem.filter(m=>m.channel==='Call').length;
  const sc=weekMem.filter(m=>m.channel==='SMS').length;
  const ec=weekMem.filter(m=>m.channel==='Email').length;
  const ccEl=document.getElementById('ch-calls-count');const scEl=document.getElementById('ch-sms-count');const ecEl=document.getElementById('ch-email-count');
  if(ccEl)ccEl.textContent=cc+' member'+(cc!==1?'s':'');
  if(scEl)scEl.textContent=sc+' member'+(sc!==1?'s':'');
  if(ecEl)ecEl.textContent=ec+' member'+(ec!==1?'s':'');
}
function renderAgentQueue(){
  syncWeekCounts();syncChannelCards();
  const pool=getAgentPool();
  const ml=document.getElementById('agent-member-list');
  const qc=document.getElementById('queue-count');if(qc)qc.textContent='0 / '+pool.length+' shown';
  window._agentPool=pool;
  if(!pool.length){
    ml.innerHTML='<div style="padding:24px;text-align:center;color:#9ca3af;font-size:12px">'+(mglData.length?'No members match current filters.':'Loading member dataâ€¦')+'</div>';
    const md=document.getElementById('member-detail');if(md)md.innerHTML='';return;
  }
  if(currentAgentChannel==='calls'){
    ml.innerHTML=pool.map((m,i)=>'<div class="mi'+(i===0?' active':'')+'" onclick="selMember('+i+',this)">'
      +'<div style="display:flex;justify-content:space-between;align-items:flex-start">'
      +'<div class="mi-name" style="color:#1d4ed8;text-decoration:underline;cursor:pointer" onclick="event.stopPropagation();openMemberProfile(window._agentPool['+i+'])">'+m.name+'</div>'
      +'<span style="font-size:10px;color:#9ca3af;cursor:pointer" onclick="event.stopPropagation();openMemberProfile(window._agentPool['+i+'])">Profile â†’</span>'
      +'</div><div class="mi-meta">Prop '+m.prop+'% Â· Age '+m.age+' Â· '+m.measureCode+'</div>'
      +'<div style="font-size:10px;color:#9ca3af;margin-top:2px">â— Pending Â· Last: '+m.last+'</div></div>').join('');
    selMember(0,ml.querySelector('.mi'));
  }else{
    ml.innerHTML=pool.map((m,i)=>'<div class="mi" style="padding:12px;cursor:pointer" onclick="openMemberProfile(window._agentPool['+i+'])" onmouseover="this.style.background=\'#fef9f9\'" onmouseout="this.style.background=\'\'">'
      +'<div style="display:flex;align-items:center;gap:12px">'
      +'<input type="checkbox" checked id="batch-cb-'+i+'" style="accent-color:#1D9E75;transform:scale(1.2)" onclick="event.stopPropagation()">'
      +'<div style="flex:1"><div class="mi-name" style="color:#1d4ed8;text-decoration:underline">'+m.name+'</div><div class="mi-meta">Prop '+m.prop+'% Â· '+m.measure+'</div></div>'
      +'</div></div>').join('');
    const msg=currentAgentChannel==='sms'?'Hi [Name], you are due for your [Measure] screening. Reply YES to schedule.':'Subject: Your [Measure] reminder\n\nDear [Name],\n\nPlease contact us to schedule.';
    document.getElementById('member-detail').innerHTML='<div style="font-size:17px;font-weight:700;margin-bottom:12px">Batch Send: '+currentAgentChannel.toUpperCase()+'</div><div style="font-size:12px;color:#6b7280;margin-bottom:16px">Sending to '+pool.length+' members.</div><textarea style="width:100%;height:100px;padding:10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;font-family:inherit;margin-bottom:12px">'+msg+'</textarea><button class="btn-primary" style="width:100%;padding:10px" onclick="sendBatch()">Send Bundle â†—</button>';
  }
}
function selMember(idx,el){
  if(currentAgentChannel!=='calls')return;
  document.querySelectorAll('#agent-member-list .mi').forEach(m=>m.classList.remove('active'));
  if(el)el.classList.add('active');
  const m=window._agentPool[idx];if(!m)return;
  const fn=m.name.split(' ')[0];
  const script='"Hi '+fn+', this is [Health Plan] calling about your '+m.measure+'. We want to make sure you get this covered â€” can we help schedule it today?"';
  document.getElementById('member-detail').innerHTML=
    '<div style="font-size:17px;font-weight:700;margin-bottom:2px">'+m.name+'</div>'
    +'<div style="font-size:11px;color:#6b7280;margin-bottom:10px">Age '+m.age+' Â· Propensity '+m.prop+'% Â· Last contact: '+m.last+'</div>'
    +'<div class="md-fields">'
    +'<div class="md-field"><div class="md-field-label">Gap Status</div><div class="md-field-val red">'+m.gap+'</div></div>'
    +'<div class="md-field"><div class="md-field-label">Measure</div><div class="md-field-val">'+m.measureCode+'</div></div>'
    +'<div class="md-field"><div class="md-field-label">PCP</div><div class="md-field-val">'+m.pcp+'</div></div>'
    +'<div class="md-field"><div class="md-field-label">Channel</div><div class="md-field-val blue">'+m.channel+'</div></div>'
    +'</div>'
    +'<div class="script-alert"><div style="font-size:11px;font-weight:600;color:#1d4ed8;margin-bottom:2px">Outreach call â€” '+m.gap+' gap</div>'
    +'<div style="font-size:11px;color:#374151">'+m.measure+'</div></div>'
    +'<div style="font-size:10px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Script</div>'
    +'<div class="script-box">'+script+'</div>'
    +'<div style="font-size:10px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Log What Happened</div>'
    +'<div style="display:flex;flex-wrap:wrap;gap:6px">'
    +'<div class="log-btn active-log" onclick="this.parentElement.querySelectorAll(\'.log-btn\').forEach(b=>b.classList.remove(\'active-log\'));this.classList.add(\'active-log\')">âœ“ Scheduled</div>'
    +'<div class="log-btn" onclick="this.parentElement.querySelectorAll(\'.log-btn\').forEach(b=>b.classList.remove(\'active-log\'));this.classList.add(\'active-log\')">No answer</div>'
    +'<div class="log-btn" onclick="this.parentElement.querySelectorAll(\'.log-btn\').forEach(b=>b.classList.remove(\'active-log\'));this.classList.add(\'active-log\')">Refused</div>'
    +'<div class="log-btn" onclick="this.parentElement.querySelectorAll(\'.log-btn\').forEach(b=>b.classList.remove(\'active-log\'));this.classList.add(\'active-log\')">Already done</div>'
    +'<div class="log-btn" onclick="this.parentElement.querySelectorAll(\'.log-btn\').forEach(b=>b.classList.remove(\'active-log\'));this.classList.add(\'active-log\')">Call back later</div>'
    +'</div>';
}
function selWeek(el){document.querySelectorAll('.week-item').forEach(w=>w.classList.remove('active'));el.classList.add('active');}
function selectChannel(ch){
  currentAgentChannel=ch;
  ['calls','sms','email'].forEach(c=>document.getElementById('ch-'+c).classList.toggle('selected',c===ch));
  const labels={calls:'ðŸ“ž Call queue Â· One at a time',sms:'ðŸ’¬ SMS queue Â· Batch send',email:'âœ‰ï¸ Email queue Â· Batch send'};
  document.querySelector('.queue-hdr').innerHTML='<span style="font-size:12px;font-weight:600">'+labels[ch]+'</span><span style="font-size:11px;color:#6b7280" id="queue-count">0 done</span>';
  renderAgentQueue();
}
function sendBatch(){const cbs=document.querySelectorAll('#agent-member-list input[type="checkbox"]:checked');if(cbs.length===0)return alert('Please select at least one member.');toast('âœ… Bundle sent to '+cbs.length+' members!');}

// â”€â”€ IMPACT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ipM=[
  {id:'col',name:'COL',base:58,gap:356,thresh:65,bs:3},{id:'spc',name:'SPC',base:55,gap:412,thresh:70,bs:2},
  {id:'amm',name:'AMM',base:52,gap:283,thresh:70,bs:2},{id:'cdc',name:'CDC',base:64,gap:166,thresh:70,bs:3},
  {id:'mad',name:'MAD',base:66,gap:152,thresh:70,bs:3},{id:'flu',name:'FLU',base:78,gap:89,thresh:75,bs:4},
  {id:'bcs',name:'BCS',base:72,gap:120,thresh:70,bs:4},{id:'cbp',name:'CBP',base:71,gap:130,thresh:70,bs:4},
];
function impactRecalc(){
  const cards=ipM.map(m=>{
    const rate=parseInt((document.getElementById('ip-'+m.id+'-val')||{textContent:'0'}).textContent)||0;
    const closed=Math.round(m.gap*rate/100);const ns=Math.min(100,m.base+closed/2847*100);
    const nstar=ns>=m.thresh+5?5:ns>=m.thresh?4:ns>=m.thresh-8?3:2;const up=nstar>m.bs;
    return{html:'<div style="background:#fff;border:1px solid '+(up?'#a7f3d0':'#e5e7eb')+';border-radius:8px;padding:10px"><div style="font-size:10px;color:#9ca3af;margin-bottom:2px">'+m.name+'</div><div style="display:flex;align-items:center;gap:6px"><span>'+m.bs+'â˜…</span><span style="color:#6b7280">â†’</span><span style="font-size:18px;font-weight:700;color:'+(up?'#1D9E75':'#374151')+'">'+nstar+'â˜…</span>'+(up?'<span style="font-size:10px;color:#1D9E75">â†‘</span>':'')+'</div><div style="font-size:10px;color:#6b7280">'+m.base+'%â†’'+ns.toFixed(0)+'% Â· +'+closed+'</div></div>',closed};
  });
  document.getElementById('impact-cards').innerHTML=cards.map(c=>c.html).join('');
  const tot=cards.reduce((a,c)=>a+c.closed,0);
  document.getElementById('ip-overall').textContent='3.8â˜… â†’ '+Math.min(5,(3.8+tot/2847*4)).toFixed(1)+'â˜…';
  document.getElementById('ip-total-closures').textContent=tot;
  document.getElementById('ip-comp-lift').textContent='+'+(tot/2847*100).toFixed(1)+'%';
}
impactRecalc();

// â”€â”€ ROI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function roiParseCost(s){return parseFloat(String(s).replace(/[^0-9.]/g,''))||0;}
function roiParseROI(s){return parseFloat(String(s).replace(/[^0-9.]/g,''))||0;}
function roiParseLift(s){return parseFloat(String(s).replace(/[^0-9.]/g,''))||0;}

let roiBarChart=null,roiScatterChart=null;

function roiRenderKPIs(data){
  document.getElementById('roi-kpi-campaigns').textContent=data.length;
  const closures=data.reduce((s,c)=>s+(c.actual||0),0);
  document.getElementById('roi-kpi-closures').textContent=closures.toLocaleString();
  const spend=data.reduce((s,c)=>s+roiParseCost(c.cost),0);
  const spendFmt=spend>=1e6?'$'+(spend/1e6).toFixed(1)+'M':spend>=1e3?'$'+Math.round(spend/1e3)+'K':'$'+spend.toLocaleString();
  document.getElementById('roi-kpi-spend').textContent=spendFmt;
  const lift=data.reduce((s,c)=>s+roiParseLift(c.lift),0);
  document.getElementById('roi-kpi-lift').textContent='+'+lift.toFixed(1)+'%';
}

function roiRenderTable(data){
  document.getElementById('roi-table').innerHTML=data.map(c=>{
    const ch=roiDetectChannel(c);
    const st=c.status&&c.status!=='undefined'?c.status:(c.actual!=null?'Completed':'In Progress');
    return'<tr onmouseover="this.style.background=\'#f9fafb\'" onmouseout="this.style.background=\'\'">'
    +'<td><strong>'+c.name+'</strong></td>'
    +'<td><span class="badge b-gray">'+c.measure+'</span></td>'
    +'<td><span class="ch-chip '+(ch==='Call'?'ch-call':ch==='SMS'?'ch-sms':'ch-email')+'">'+ch+'</span></td>'
    +'<td>'+c.members+'</td><td style="color:#6b7280">'+c.proj+'</td>'
    +'<td>'+(c.actual!=null?'<strong style="color:#1D9E75">'+c.actual+'</strong>'+(c.actual>=c.proj?'<span style="color:#1D9E75;font-size:10px"> â†‘</span>':'<span style="color:#dc2626;font-size:10px"> â†“</span>'):'<span style="color:#9ca3af">pending</span>')+'</td>'
    +'<td style="color:#1D9E75;font-weight:600">'+c.lift+'</td><td>'+c.cost+'</td><td style="font-weight:600">'+c.roi+'</td>'
    +'<td><span class="badge '+(st==='Completed'?'b-green':'b-blue')+'">'+st+'</span></td>'
    +'</tr>';
  }).join('');
}

function roiRenderBarChart(data){
  const ctx=document.getElementById('roi-chart-bar');
  if(!ctx)return;
  const sorted=[...data].filter(c=>roiParseROI(c.roi)>0).sort((a,b)=>roiParseROI(b.roi)-roiParseROI(a.roi));
  if(roiBarChart){roiBarChart.destroy();roiBarChart=null;}
  roiBarChart=new Chart(ctx,{
    type:'bar',
    data:{labels:sorted.map(c=>c.name),datasets:[{label:'ROI',data:sorted.map(c=>roiParseROI(c.roi)),backgroundColor:'#F26722',borderRadius:3}]},
    options:{responsive:false,animation:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:function(t){return t.raw.toFixed(1)+'x';}}}},
      scales:{y:{beginAtZero:true,grid:{color:'#f3f4f6'},ticks:{font:{size:11},callback:function(v){return v+'x';}}},x:{grid:{display:false},ticks:{font:{size:10},maxRotation:40,minRotation:20}}}
    }
  });
}

function roiDetectChannel(c){
  if(c.channel&&c.channel!=='Other'&&c.channel!=='undefined')return c.channel;
  const n=(c.name||'').toLowerCase();
  if(n.includes('call'))return'Call';
  if(n.includes('sms'))return'SMS';
  if(n.includes('email'))return'Email';
  return'Other';
}

function roiRenderChannelChart(data){
  const ctx=document.getElementById('roi-chart-scatter');
  if(!ctx)return;
  if(roiScatterChart){roiScatterChart.destroy();roiScatterChart=null;}
  const chMap={Call:{total:0,closed:0},SMS:{total:0,closed:0},Email:{total:0,closed:0}};
  data.forEach(c=>{
    const ch=roiDetectChannel(c);
    if(!chMap[ch])chMap[ch]={total:0,closed:0};
    chMap[ch].total+=c.members||0;
    chMap[ch].closed+=c.actual||0;
  });
  const channels=['Call','SMS','Email'].filter(ch=>chMap[ch]&&chMap[ch].total>0);
  const pcts=channels.map(ch=>{const d=chMap[ch];return d.total>0?Math.round(d.closed/d.total*100):0;});
  const colors={Call:'#2563eb',SMS:'#1D9E75',Email:'#d97706'};
  roiScatterChart=new Chart(ctx,{
    type:'bar',
    data:{labels:channels,datasets:[{label:'% Closed',data:pcts,backgroundColor:channels.map(ch=>colors[ch]),borderRadius:3}]},
    options:{responsive:false,animation:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:function(t){const ch=channels[t.dataIndex];const d=chMap[ch];return[d.closed+' / '+d.total+' members',t.raw+'% closed'];}}}},
      scales:{y:{beginAtZero:true,max:100,grid:{color:'#f3f4f6'},ticks:{font:{size:11},callback:function(v){return v+'%';}}},x:{grid:{display:false},ticks:{font:{size:12,weight:'600'}}}}
    }
  });
}

function roiApplyFilters(){
  const data=campaigns;
  roiRenderKPIs(data);
  roiRenderTable(data);
  roiRenderBarChart(data);
  roiRenderChannelChart(data);
}

function renderROI(){
  roiApplyFilters();
}
renderROI();

// â”€â”€ PRIORITY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let priorities=[
  {name:'SPC â€“ Statin',score:98,color:'#dc2626'},{name:'AMM â€“ Antidepressant',score:95,color:'#dc2626'},
  {name:'CAHPS â€“ Customer Svc',score:88,color:'#dc2626'},{name:'COL â€“ Colorectal',score:82,color:'#d97706'},
  {name:'CDC â€“ A1c',score:75,color:'#d97706'},{name:'MAD â€“ Med Adherence',score:68,color:'#d97706'},
  {name:'CBP â€“ Blood Pressure',score:42,color:'#1D9E75'},{name:'BCS â€“ Breast Cancer',score:38,color:'#1D9E75'},
  {name:'FLU â€“ Vaccination',score:25,color:'#1D9E75'},
];
document.getElementById('priority-board').innerHTML=priorities.map(p=>'<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span>'+p.name+'</span><span style="font-weight:700;color:'+p.color+'">'+p.score+'</span></div><div style="height:6px;background:#f3f4f6;border-radius:3px"><div style="height:100%;width:'+p.score+'%;background:'+p.color+';border-radius:3px"></div></div></div>').join('');

// â”€â”€ MEMBER GAP LIST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let mglData=[
  {name:'James T.',age:71,prop:88,measureCode:'CDC',measure:'CDC â€“ A1c Control',gap:'Open',last:'2 days ago',channel:'Call',pcp:'Dr. Patel',campaign:''},
  {name:'Maria L.',age:67,prop:82,measureCode:'COL',measure:'COL â€“ Colorectal',gap:'Open',last:'2 days ago',channel:'SMS',pcp:'Dr. Kim',campaign:''},
  {name:'David K.',age:64,prop:79,measureCode:'SPC',measure:'SPC â€“ Statin Therapy',gap:'Open',last:'2 days ago',channel:'Call',pcp:'Dr. Chen',campaign:''},
  {name:'Ruth O.',age:74,prop:76,measureCode:'AMM',measure:'AMM â€“ Antidepressant',gap:'Partial',last:'2 days ago',channel:'Email',pcp:'Dr. Patel',campaign:''},
  {name:'Leon W.',age:73,prop:76,measureCode:'COL',measure:'COL â€“ Colorectal',gap:'Partial',last:'2 days ago',channel:'Call',pcp:'Dr. Nair',campaign:''},
  {name:'Susan H.',age:69,prop:71,measureCode:'MAD',measure:'MAD â€“ Med Adherence',gap:'Partial',last:'5 days ago',channel:'Portal',pcp:'Dr. Kim',campaign:''},
  {name:'George M.',age:72,prop:68,measureCode:'FLU',measure:'FLU â€“ Vaccination',gap:'Borderline',last:'5 days ago',channel:'SMS',pcp:'Dr. Chen',campaign:''},
  {name:'Alice B.',age:65,prop:65,measureCode:'BCS',measure:'BCS â€“ Breast Cancer',gap:'Open',last:'5 days ago',channel:'Email',pcp:'Dr. Patel',campaign:''},
  {name:'Frank R.',age:78,prop:61,measureCode:'CBP',measure:'CBP â€“ Blood Pressure',gap:'Partial',last:'5 days ago',channel:'Call',pcp:'Dr. Nair',campaign:''},
  {name:'Helen G.',age:70,prop:55,measureCode:'SPC',measure:'SPC â€“ Statin Therapy',gap:'Borderline',last:'Never',channel:'SMS',pcp:'Dr. Kim',campaign:''},
  {name:'Carlos P.',age:66,prop:52,measureCode:'CDC',measure:'CDC â€“ A1c Control',gap:'Open',last:'Never',channel:'Call',pcp:'Dr. Chen',campaign:''},
  {name:'Dorothy F.',age:75,prop:48,measureCode:'COL',measure:'COL â€“ Colorectal',gap:'Borderline',last:'Never',channel:'Email',pcp:'Dr. Patel',campaign:''},
];
let activeCampaignFilter=null;
let _mglPage=1;const _mglPageSize=50;let _mglTotal=0;

function fetchMGL(page){
  _mglPage=page||1;
  const contract=(document.getElementById('mgl-contract')||{}).value||'H3312';
  const measure=(document.getElementById('mgl-measure')||{}).value||'all';
  const gap=(document.getElementById('mgl-gap')||{}).value||'all';
  const prop=(document.getElementById('mgl-prop')||{}).value||'all';
  let url='/api/members/gaps?contract_id='+contract+'&page='+_mglPage+'&page_size='+_mglPageSize;
  if(measure!=='all')url+='&measure_code='+measure;
  if(gap!=='all')url+='&gap_status='+gap;
  if(prop!=='all')url+='&propensity='+prop;
  const loading=document.getElementById('mgl-loading');
  const countEl=document.getElementById('mgl-count');
  if(loading)loading.style.display='block';
  if(countEl)countEl.textContent='Loadingâ€¦';
  // Show static data immediately while loading
  renderMGL();
  fetch(url)
    .then(function(r){return r.json();})
    .then(function(d){
      if(loading)loading.style.display='none';
      const items=Array.isArray(d)?d:(d.items||[]);
      if(!items.length){renderMGL();return;}
      _mglTotal=d.total||items.length;
      mglData=items.map(function(m){return{name:m.display_name||'â€”',age:m.age||'â€”',prop:Math.round(m.propensity_score||0),measureCode:m.measure_code||'',measure:(m.measure_code||'')+(m.measure_name?' â€“ '+m.measure_name:''),gap:m.gap_status||'',last:m.last_contact||'Never',channel:m.recommended_channel||'',pcp:m.pcp_name||'â€”',campaign:m.campaign_name||''};});
      renderMGL();
      const badge=document.getElementById('mgl-live-badge');
      if(badge)badge.style.display='block';
      const pgEl=document.getElementById('mgl-pagination');
      if(pgEl&&_mglTotal>_mglPageSize){
        const totalPages=Math.ceil(_mglTotal/_mglPageSize);
        pgEl.innerHTML='<span>Showing '+(((_mglPage-1)*_mglPageSize)+1)+'â€“'+Math.min(_mglPage*_mglPageSize,_mglTotal)+' of '+_mglTotal+' members</span>'
          +'<div style="display:flex;gap:6px">'
          +'<button onclick="fetchMGL('+(_mglPage-1)+')" '+(_mglPage<=1?'disabled':'')+' style="padding:4px 10px;border:1px solid #e5e7eb;border-radius:6px;background:#fff;cursor:pointer;font-size:11px">â† Prev</button>'
          +'<span style="padding:4px 8px;font-weight:600">Page '+_mglPage+' / '+totalPages+'</span>'
          +'<button onclick="fetchMGL('+(_mglPage+1)+')" '+(_mglPage>=totalPages?'disabled':'')+' style="padding:4px 10px;border:1px solid #e5e7eb;border-radius:6px;background:#fff;cursor:pointer;font-size:11px">Next â†’</button></div>';
      }else if(pgEl){pgEl.innerHTML='';}
    })
    .catch(function(){if(loading)loading.style.display='none';renderMGL();});
}
function renderMGL(fromFilter){
  if(fromFilter)activeCampaignFilter=null;
  const fMeas=document.getElementById('mgl-measure').value;
  const fGap=document.getElementById('mgl-gap').value;
  const fProp=document.getElementById('mgl-prop').value;
  let rows=mglData.filter(m=>{
    if(activeCampaignFilter&&m.campaign!==activeCampaignFilter)return false;
    if(fMeas!=='all'&&m.measureCode!==fMeas)return false;
    if(fGap!=='all'&&m.gap!==fGap)return false;
    if(fProp==='high'&&m.prop<=75)return false;
    if(fProp==='medium'&&(m.prop<=40||m.prop>75))return false;
    if(fProp==='low'&&m.prop>=40)return false;
    return true;
  });
  document.getElementById('mgl-count').textContent=rows.length+' members';
  window._mglRows=rows;
  const propColor=p=>p>75?'#1D9E75':p>40?'#d97706':'#9ca3af';
  const gapPill=g=>g==='Open'?'<span class="pill p-red">Open</span>':g==='Partial'?'<span class="pill p-amber">Partial</span>':'<span class="pill p-blue">Borderline</span>';
  const chStyle=c=>c==='Call'?'color:#dc2626;font-weight:600':c==='SMS'?'color:#2563eb;font-weight:600':c==='Email'?'color:#6b7280;font-weight:600':'color:#7c3aed;font-weight:600';
  document.getElementById('mgl-tbody').innerHTML=rows.map((m,i)=>'<tr style="border-bottom:1px solid #f9fafb;cursor:pointer" onmouseover="this.style.background=\'#fef9f9\'" onmouseout="this.style.background=\'\'" onclick="openMemberProfile(window._mglRows['+i+'])">'
    +'<td style="font-weight:600;color:#1d4ed8;text-decoration:underline;padding:12px 10px">'+m.name+'</td>'
    +'<td style="padding:12px 10px">'+m.age+'</td>'
    +'<td style="padding:12px 10px"><span style="color:'+propColor(m.prop)+';font-weight:700">â—</span> <strong>'+m.prop+'%</strong></td>'
    +'<td style="color:#374151;padding:12px 10px">'+m.measure+'</td>'
    +'<td style="padding:12px 10px">'+gapPill(m.gap)+'</td>'
    +'<td style="color:#6b7280;padding:12px 10px">'+m.last+'</td>'
    +'<td style="'+chStyle(m.channel)+';padding:12px 10px">'+m.channel+'</td>'
    +'<td style="color:#6b7280;padding:12px 10px">'+m.pcp+'</td>'
    +'<td style="padding:12px 10px" onclick="event.stopPropagation()"><button class="btn-sm" style="background:#fff;color:#111;border:1px solid #e5e7eb" onclick="openOutreachModal(\''+m.name+'\')">Add to Campaign</button></td>'
    +'</tr>').join('');
}

let activeModalMember='';
function openOutreachModal(name){activeModalMember=name;document.getElementById('modal-member-name').textContent=name;document.getElementById('modal-campaign').value='';document.getElementById('modal-new-campaign').value='';document.getElementById('outreach-modal').style.display='flex';}
function closeOutreachModal(){document.getElementById('outreach-modal').style.display='none';}
function submitOutreach(){
  const camp=document.getElementById('modal-campaign').value||document.getElementById('modal-new-campaign').value;
  if(!camp)return alert('Please select or enter a campaign name');
  const member=mglData.find(m=>m.name===activeModalMember);if(member)member.campaign=camp;
  let ec=campaigns.find(c=>c.name===camp);
  if(!ec){ec={name:camp,measure:'MIX',channel:'Mixed',members:1,proj:'-',actual:null,lift:'-',cost:'-',roi:'â€”',status:'Active'};campaigns.push(ec);}
  else{ec.members++;}
  roiApplyFilters();closeOutreachModal();
  toast('âœ… '+activeModalMember+' added to "'+camp+'"!');
}

// â”€â”€ MEMBER PROFILE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function openMemberProfile(member){
  if(!member)return;
  const nm=member.name||'Unknown';
  const h=nm.split('').reduce((a,c)=>Math.imul(a,31)+c.charCodeAt(0)|0,0);
  const rh=n=>Math.abs(Math.imul(Math.imul(h,n)+1013904223,1664525))/0x7fffffff;
  const initials=nm.replace('.','').split(' ').map(w=>w[0]||'').join('').slice(0,2).toUpperCase();
  const avatarColors=['#F26722','#1D9E75','#2563eb','#7c3aed','#d97706','#0891b2'];
  const gender=['M','F','F','M','F'][Math.abs(h)%5];
  const langs=['English','Spanish','Mandarin','Vietnamese','English'];
  const lang=langs[Math.abs(h)%langs.length];
  const uuid=[8,4,4,4,12].map(n=>Math.abs(Math.imul(h,n*7)).toString(16).padStart(n,'0').slice(0,n)).join('-');
  const planIdx=Math.abs(h)%contracts.length;const plan=contracts[planIdx];
  const pType=plan.name.includes('PPO')?'PPO':plan.name.includes('HMO-POS')?'HMO-POS':'HMO';
  const totalClaims=Math.round(rh(7)*16)+3;const totalCost=Math.round(rh(13)*7500)+800;
  const daysSince=Math.round(rh(17)*110)+7;const lastVisit=new Date(Date.now()-daysSince*86400000).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  const openGaps=member.gap==='Open'?Math.round(rh(11)*4)+3:Math.round(rh(11)*2)+1;const medAdh=Math.round(58+rh(19)*36);
  document.getElementById('mp-avatar').textContent=initials;
  document.getElementById('mp-avatar').style.background=avatarColors[Math.abs(h)%avatarColors.length];
  document.getElementById('mp-name').textContent=nm.replace('.','');
  document.getElementById('mp-meta').textContent=uuid+' Â· '+member.age+' yrs Â· '+gender+' Â· '+lang;
  document.getElementById('mp-plan-badge').textContent=plan.id+' Â· '+plan.state;
  document.getElementById('mp-status-badge').textContent=member.gap==='Borderline'?'Enrolled':'Active';
  document.getElementById('mp-risk-badge').textContent='â–² Risk '+member.prop+'%';
  window._mpData={member,plan,pType,totalClaims,totalCost,lastVisit,openGaps,medAdh,enrollStart:'Jan 1, 2025',enrollEnd:'Dec 31, 2025',dualElig:member.prop>72?'No':'Yes',lis:member.prop<65?'Yes':'No',rh};
  document.querySelectorAll('.mp-tab').forEach(t=>t.classList.remove('mp-tab-active'));
  document.querySelector('.mp-tab').classList.add('mp-tab-active');
  renderMpOverview();
  document.getElementById('member-profile-modal').style.display='flex';
}
function switchMpTab(tab,el){
  document.querySelectorAll('.mp-tab').forEach(t=>t.classList.remove('mp-tab-active'));if(el)el.classList.add('mp-tab-active');
  const fns={overview:renderMpOverview,clinical:renderMpClinical,medications:renderMpMedications,measures:renderMpMeasures,claims:renderMpClaims};
  if(fns[tab])fns[tab]();
}
function renderMpOverview(){
  const d=window._mpData;
  const kpis=[{label:'TOTAL CLAIMS (YTD)',val:d.totalClaims},{label:'TOTAL COST (YTD)',val:'$'+d.totalCost.toLocaleString()},{label:'LAST VISIT',val:d.lastVisit},{label:'OPEN CARE GAPS',val:d.openGaps},{label:'MED ADHERENCE',val:d.medAdh+'%'}];
  const fields=[{label:'PLAN ID',val:d.plan.id},{label:'PRODUCT TYPE',val:d.pType},{label:'ENROLLMENT START',val:d.enrollStart},{label:'ENROLLMENT END',val:d.enrollEnd},{label:'DUAL ELIGIBLE',val:d.dualElig},{label:'LOW INCOME SUBSIDY',val:d.lis}];
  document.getElementById('mp-content').innerHTML='<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:0">'+kpis.map(k=>'<div class="mp-kpi"><div class="mp-kpi-label">'+k.label+'</div><div class="mp-kpi-val">'+k.val+'</div></div>').join('')+'</div><div class="mp-section"><div class="mp-section-title">PLAN &amp; ENROLLMENT</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px">'+fields.map(f=>'<div><div class="mp-field-label">'+f.label+'</div><div class="mp-field-val">'+f.val+'</div></div>').join('')+'</div></div>';
}
function renderMpClinical(){
  const base=[{cond:'Hypertension',icd:'I10',date:'Mar 12, 2019',sev:'Moderate',status:'Active'},{cond:'Type 2 Diabetes',icd:'E11.9',date:'Jul 8, 2020',sev:'Moderate',status:'Active'},{cond:'CKD Stage 3',icd:'N18.3',date:'Feb 2, 2022',sev:'Moderate',status:'Active'},{cond:'Hyperlipidemia',icd:'E78.5',date:'Jan 15, 2018',sev:'Mild',status:'Active'},{cond:'Heart Failure',icd:'I50.9',date:'Nov 30, 2021',sev:'Severe',status:'Active'},{cond:'COPD',icd:'J44.1',date:'Sep 5, 2023',sev:'Mild',status:'Managed'}];
  const sc=s=>s==='Severe'?'#dc2626':s==='Moderate'?'#d97706':'#1D9E75';
  document.getElementById('mp-content').innerHTML='<div class="mp-section" style="margin-top:0"><div class="mp-section-title">CLINICAL CONDITIONS</div><table class="mp-table"><thead><tr><th>Condition</th><th>ICD-10</th><th>Diagnosed</th><th>Severity</th><th>Status</th></tr></thead><tbody>'+base.map(r=>'<tr><td style="font-weight:600">'+r.cond+'</td><td style="font-family:monospace;color:#1d4ed8">'+r.icd+'</td><td>'+r.date+'</td><td style="color:'+sc(r.sev)+';font-weight:600">'+r.sev+'</td><td><span class="pill '+(r.status==='Active'?'p-red':'p-green')+'" style="font-size:10px">'+r.status+'</span></td></tr>').join('')+'</tbody></table></div>';
}
function renderMpMedications(){
  const meds=[{drug:'Metformin',dose:'500mg',freq:'Twice daily',filled:'Dec 1, 2025',refill:'Jan 1, 2026',adh:'92%'},{drug:'Lisinopril',dose:'10mg',freq:'Once daily',filled:'Nov 28, 2025',refill:'Dec 28, 2025',adh:'88%'},{drug:'Atorvastatin',dose:'40mg',freq:'Once daily',filled:'Dec 5, 2025',refill:'Jan 5, 2026',adh:'95%'},{drug:'Amlodipine',dose:'5mg',freq:'Once daily',filled:'Nov 20, 2025',refill:'Dec 20, 2025',adh:'79%'},{drug:'Furosemide',dose:'20mg',freq:'Once daily',filled:'Dec 10, 2025',refill:'Jan 10, 2026',adh:'84%'}];
  const ac=a=>parseInt(a)>=90?'#1D9E75':parseInt(a)>=75?'#d97706':'#dc2626';
  document.getElementById('mp-content').innerHTML='<div class="mp-section" style="margin-top:0"><div class="mp-section-title">CURRENT MEDICATIONS</div><table class="mp-table"><thead><tr><th>Drug</th><th>Dosage</th><th>Frequency</th><th>Last Filled</th><th>Next Refill</th><th>Adherence</th></tr></thead><tbody>'+meds.map(m=>'<tr><td style="font-weight:600">'+m.drug+'</td><td>'+m.dose+'</td><td>'+m.freq+'</td><td>'+m.filled+'</td><td>'+m.refill+'</td><td style="font-weight:700;color:'+ac(m.adh)+'">'+m.adh+'</td></tr>').join('')+'</tbody></table></div>';
}
function renderMpMeasures(){
  const d=window._mpData;
  const sample=hedisData.slice(0,6).map((m,i)=>{const rate=+(55+d.rh(i*7+3)*35).toFixed(1);const status=rate>=75?'Met':rate>=60?'At Risk':'Open Gap';const sc=status==='Met'?'p-green':status==='At Risk'?'p-amber':'p-red';const lc=status==='Met'?new Date(Date.now()-Math.round(d.rh(i+9)*200)*86400000).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'â€”';return{name:m.name,code:m.code,rate,status,sc,lc,gap:status==='Met'?'Closed':m.color==='red'?'Open':'Partial'};});
  document.getElementById('mp-content').innerHTML='<div class="mp-section" style="margin-top:0"><div class="mp-section-title">HEDIS MEASURE COMPLIANCE</div><table class="mp-table"><thead><tr><th>Measure</th><th>Code</th><th>Status</th><th>Rate</th><th>Last Closed</th><th>Gap Type</th></tr></thead><tbody>'+sample.map(m=>'<tr><td style="font-weight:600">'+m.name+'</td><td style="font-family:monospace;color:#1d4ed8;font-weight:600">'+m.code+'</td><td><span class="pill '+m.sc+'" style="font-size:10px">'+m.status+'</span></td><td style="font-weight:700">'+m.rate+'%</td><td style="color:#6b7280">'+m.lc+'</td><td><span class="pill '+(m.gap==='Closed'?'p-green':m.gap==='Open'?'p-red':'p-amber')+'" style="font-size:10px">'+m.gap+'</span></td></tr>').join('')+'</tbody></table></div>';
}
function renderMpClaims(){
  const d=window._mpData;
  const svcs=['Office Visit','Lab â€“ Blood Panel','ER Visit','Specialist Consult','Preventive Screening','Pharmacy Fill','Radiology','Mental Health'];
  const provs=['Dr. Allen, MD','Quest Diagnostics','City Medical Ctr','Dr. Patel, MD','Walgreens','Dr. Kim, MD','RadNet Imaging','Counseling Assoc.'];
  const sts=['Paid','Paid','Paid','Pending','Paid','Paid','Denied','Paid'];
  const rows=Array.from({length:8},(_,i)=>{const days=Math.round(d.rh(i*11+5)*300)+5;const date=new Date(Date.now()-days*86400000).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});const amt='$'+(Math.round(d.rh(i*13+3)*900)+45).toLocaleString();const cid='CLM-'+Math.abs(Math.imul(d.rh(i+1)*100000|0,7)).toString().padStart(8,'0').slice(0,8);const st=sts[i];const sc=st==='Paid'?'#1D9E75':st==='Pending'?'#d97706':'#dc2626';return{cid,date,svc:svcs[i],prov:provs[i],amt,st,sc};});
  document.getElementById('mp-content').innerHTML='<div class="mp-section" style="margin-top:0"><div class="mp-section-title">CLAIMS &amp; TRANSACTIONS</div><table class="mp-table"><thead><tr><th>Claim ID</th><th>Date</th><th>Service</th><th>Provider</th><th>Amount</th><th>Status</th></tr></thead><tbody>'+rows.map(r=>'<tr><td style="font-family:monospace;font-size:11px;color:#6b7280">'+r.cid+'</td><td>'+r.date+'</td><td>'+r.svc+'</td><td>'+r.prov+'</td><td style="font-weight:700">'+r.amt+'</td><td style="font-weight:700;color:'+r.sc+'">'+r.st+'</td></tr>').join('')+'</tbody></table></div>';
}

// â”€â”€ INIT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
initAgentFilters();
simRecalc();
fetchMGL();


async function initApp(){
  // Fast fetch with timeout â€” fail quickly if API is slow
  function ft(url, ms=8000){
    const ac=new AbortController();
    const id=setTimeout(()=>ac.abort(),ms);
    return fetch(url,{signal:ac.signal}).then(r=>{clearTimeout(id);return r.json();}).catch(()=>null);
  }

  // â”€â”€ Connection status badge â€” polls until live, with backoff â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const badge=document.getElementById('data-source-badge');
  const dsLabel=document.getElementById('ds-label');
  const tooltip=document.getElementById('data-source-tooltip');
  let _connTimer=null;
  let _wasLive=false;
  function checkConnection(isManual){
    if(_connTimer){clearTimeout(_connTimer);_connTimer=null;}
    if(dsLabel)dsLabel.textContent='Checkingâ€¦';
    if(badge){badge.className='';badge.classList.add('loading');}
    fetch('/api/connection-status').then(r=>r.json()).then(cs=>{
      if(cs&&cs.connected&&cs.source==='live'){
        if(badge){badge.className='';badge.classList.add('live');}
        if(dsLabel)dsLabel.textContent='LIVE DATA';
        if(tooltip)tooltip.textContent='Connected to Databricks. '+cs.row_count+' plan rows from gold tables.';
        if(!_wasLive){_wasLive=true;initApp();}
      }else{
        if(badge){badge.className='';badge.classList.add('fallback');}
        if(dsLabel)dsLabel.textContent='STATIC DATA (click to retry)';
        if(tooltip)tooltip.textContent='Built-in data. '+(cs&&cs.reason?cs.reason:'Databricks unreachable')+' â€” retrying in 30s';
        _connTimer=setTimeout(()=>checkConnection(false),30000);
      }
    }).catch(()=>{
      if(badge){badge.className='';badge.classList.add('fallback');}
      if(dsLabel)dsLabel.textContent='STATIC DATA (click to retry)';
      if(tooltip)tooltip.textContent='Could not reach backend â€” retrying in 30s';
      _connTimer=setTimeout(()=>checkConnection(false),30000);
    });
  }
  if(badge)badge.addEventListener('click',()=>checkConnection(true));
  checkConnection(false);

  // â”€â”€ Fetch all data in PARALLEL with 8s timeout each â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [ss, plansData, hedisRaw, campaignsRaw, alertsRaw, gapsRaw, tvRaw] = await Promise.all([
    ft('/api/star-summary'),
    ft('/api/plans'),
    ft('/api/hedis-measures?contract_id='+(window._selectedContractId||'H3312')),
    ft('/api/campaigns'),
    ft('/api/alerts'),
    ft('/api/members/gaps?page_size=50'),
    ft('/api/team-view'),
  ]);

  // â”€â”€ Star summary KPIs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(ss&&ss.total_enrollment){
    const fmtEnroll=v=>v>=1000000?(v/1000000).toFixed(1)+'M':Math.round(v/1000)+'K';
    const e=document.getElementById('exec-enrollment');
    const a=document.getElementById('exec-above-count');
    const p=document.getElementById('exec-above-pct');
    if(e)e.textContent=fmtEnroll(ss.total_enrollment);
    if(a&&ss.above_4star_count!=null)a.textContent=ss.above_4star_count;
    if(p&&ss.above_4star_pct!=null)p.textContent=Math.round(ss.above_4star_pct)+'%';
  }

  // â”€â”€ Plans â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(plansData){
    const items=plansData.items||plansData;
    if(items&&items.length){
      contracts=items.map(p=>({
        name:p.plan_name,id:p.contract_id,state:p.state,enroll:p.enrollment,
        py:p.py_rating,proj:p.projected_rating,
        hedis:String(p.hedis_rating),cahps:String(p.cahps_rating),
        hos:String(p.hos_rating),partd:String(p.partd_rating)
      }));
      const cidSel=document.getElementById('filter-contract-id');
      if(cidSel){
        while(cidSel.options.length>1)cidSel.remove(1);
        contracts.forEach(c=>{const o=document.createElement('option');o.value=c.id;o.textContent=c.id;cidSel.appendChild(o);});
      }
      renderContracts(contracts);
    }
  }

  // â”€â”€ HEDIS measures â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(hedisRaw){
    const items=hedisRaw.items||hedisRaw;
    if(items&&items.length){
      // Only update hedisData if the fetched contract matches the currently selected one
      const fetchedCid=window._selectedContractId||'H3312';
      const hSel=document.getElementById('hedis-plan-select');
      const activeCid=hSel&&hSel.value?hSel.value:fetchedCid;
      if(!hSel||!hSel.value||activeCid===fetchedCid){
        hedisData=items.map(m=>({code:m.measure_code,name:m.measure_name,wt:m.weight||'1x',pct:m.current_rate,gaps:m.open_gap_count,color:m.status}));
        renderHedis();
        hedisUpdateStats();
      }
      window._selectedContractId=window._selectedContractId||'H3312';
      const initC=contracts.find(x=>x.id===window._selectedContractId);
      if(initC)window._selectedContractName=initC.name;
      if(hSel){
        hSel.innerHTML=contracts.map(c=>'<option value="'+c.id+'">'+c.id+' â€” '+c.name+'</option>').join('');
        hSel.value=activeCid;
      }
      const hBadge=document.getElementById('hedis-plan-badge');
      const badgeC=contracts.find(x=>x.id===activeCid);
      if(hBadge&&badgeC){hBadge.textContent=badgeC.state+' Â· '+badgeC.enroll.toLocaleString()+' enrolled';hBadge.style.display='inline';}
    }
  }

  // â”€â”€ Campaigns â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(campaignsRaw){
    const items=campaignsRaw.items||campaignsRaw;
    if(items&&items.length){
      campaigns=items.map(c=>({name:c.campaign_name,measure:c.measure_code,channel:c.primary_channel||c.channel||'Call',members:c.member_count,proj:c.projected_closures,actual:c.actual_closures,lift:c.lift_pct!=null?(String(c.lift_pct).startsWith('+')?c.lift_pct:'+'+c.lift_pct):'â€”',cost:c.cost_str||('$'+Math.round(c.total_cost||0).toLocaleString()),roi:c.roi_str||(c.roi_multiplier!=null?c.roi_multiplier+'x':'â€”'),status:c.campaign_status||c.status||(c.actual_closures!=null?'Completed':'In Progress')}));
      roiApplyFilters();
      initAgentFilters();
    }
  }

  // â”€â”€ Alerts / priority board â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(alertsRaw){
    const pb=alertsRaw.priority_board||[];
    if(pb.length){
      priorities=pb.slice(0,9).map(p=>({name:p.measure_code+' â€“ '+(p.measure_name||'').slice(0,18),score:Math.min(99,p.priority_score),color:p.priority_score>=80?'#dc2626':p.priority_score>=50?'#d97706':'#1D9E75'}));
      const el=document.getElementById('priority-board');
      if(el)el.innerHTML=priorities.map(p=>'<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span>'+p.name+'</span><span style="font-weight:700;color:'+p.color+'">'+p.score+'</span></div><div style="height:6px;background:#f3f4f6;border-radius:3px"><div style="height:100%;width:'+p.score+'%;background:'+p.color+';border-radius:3px"></div></div></div>').join('');
    }
    const alerts=alertsRaw.alerts||[];
    const alertContainer=document.getElementById('alert-list');
    if(alertContainer&&alerts.length){
      const sevClass={critical:'alert-crit',warning:'alert-warn',info:'alert-info'};
      alertContainer.innerHTML=alerts.slice(0,10).map(a=>'<div class="alert-item '+(sevClass[a.severity]||'alert-info')+'"><div><div class="alert-title">'+(a.title||a.alert_title||'')+'</div><div class="alert-body">'+(a.body||a.alert_body||'')+'</div>'+(a.meta||a.alert_meta?'<div class="alert-meta">'+(a.meta||a.alert_meta)+'</div>':'')+'</div></div>').join('');
    }
  }

  // â”€â”€ Member gap list â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(gapsRaw){
    const items=gapsRaw.items||gapsRaw;
    if(items&&items.length){
      mglData=items.map(m=>({name:m.display_name,age:m.age,prop:Math.round(m.propensity_score||0),measureCode:m.measure_code,measure:(m.measure_code||'')+(m.measure_name?' â€“ '+m.measure_name:''),gap:m.gap_status,last:m.last_contact||'Never',channel:m.recommended_channel||'',pcp:m.pcp_name||'â€”',campaign:m.campaign_name||''}));
      renderMGL();
      initAgentFilters();renderAgentQueue();
      const gc={open:0,partial:0,borderline:0};
      const pc={high:0,medium:0,low:0};
      mglData.forEach(m=>{const g=(m.gap||'').toLowerCase();if(gc[g]!=null)gc[g]++;const pr=m.prop||0;if(pr>75)pc.high++;else if(pr>40)pc.medium++;else pc.low++;});
      document.querySelectorAll('[data-val="open"]').forEach(el=>{const s=el.querySelector('span');if(s)s.textContent='('+gc.open+')';});
      document.querySelectorAll('[data-val="partial"]').forEach(el=>{const s=el.querySelector('span');if(s)s.textContent='('+gc.partial+')';});
      document.querySelectorAll('[data-val="borderline"]').forEach(el=>{const s=el.querySelector('span');if(s)s.textContent='('+gc.borderline+')';});
      document.querySelectorAll('[data-val="high"]').forEach(el=>{const s=el.querySelector('span');if(s)s.textContent='('+pc.high+')';});
      document.querySelectorAll('[data-val="medium"]').forEach(el=>{const s=el.querySelector('span');if(s)s.textContent='('+pc.medium+')';});
    }
  }

  // â”€â”€ Team view â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if(tvRaw){
    const items=tvRaw.items||tvRaw;
    const tvEl=document.getElementById('team-view-body');
    if(tvEl&&items&&items.length){
      tvEl.innerHTML=items.map(t=>'<tr><td style="padding:8px 12px;font-size:12px;font-weight:600">'+t.department+'</td><td style="padding:8px 12px;font-size:12px">'+t.leader+'</td><td style="padding:8px 12px;font-size:12px;color:#1D9E75;font-weight:700">'+t.on_track_count+'</td><td style="padding:8px 12px;font-size:12px;color:#d97706;font-weight:700">'+t.at_risk_count+'</td><td style="padding:8px 12px;font-size:12px;color:#dc2626;font-weight:700">'+t.critical_count+'</td></tr>').join('');
    }
  }
}
initApp();

// â”€â”€ EHO4ALL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ehoMeasures=[
  {name:'Medication adherence â€“ diabetes',domain:'Med Adherence',lis:72,gen:86,bench:80,weight:3,lisCount:148},
  {name:'Medication adherence â€“ hypertension',domain:'Med Adherence',lis:78,gen:89,bench:82,weight:3,lisCount:201},
  {name:'Medication adherence â€“ cholesterol',domain:'Med Adherence',lis:76,gen:88,bench:83,weight:3,lisCount:176},
  {name:'Statin use â€“ cardiovascular',domain:'HEDIS',lis:74,gen:85,bench:78,weight:3,lisCount:132},
  {name:'Diabetes care â€“ A1c testing',domain:'HEDIS',lis:80,gen:88,bench:79,weight:3,lisCount:119},
  {name:'Diabetes â€“ kidney health eval',domain:'HEDIS',lis:71,gen:82,bench:74,weight:3,lisCount:97},
  {name:'Colorectal cancer screening',domain:'HEDIS',lis:55,gen:70,bench:63,weight:1,lisCount:210},
  {name:'Breast cancer screening',domain:'HEDIS',lis:62,gen:76,bench:67,weight:1,lisCount:143},
];
function buildEHOMeasures(){
  const tbody=document.getElementById('eho-measure-tbody');
  if(!tbody)return;
  tbody.innerHTML=ehoMeasures.map(m=>{
    const diff=m.lis-m.bench;
    const atBench=m.lis>=m.bench;
    const diffStr=diff>=0
      ?'<span style="color:#1D9E75;font-weight:700">+'+diff+'pp</span>'
      :'<span style="color:#dc2626;font-weight:700">'+diff+'pp</span>';
    const status=atBench
      ?'<span class="badge b-green" style="font-size:10px">At Benchmark</span>'
      :'<span class="badge b-red" style="font-size:10px">Below Benchmark</span>';
    const pri=diff<=-7?'<span class="badge b-red" style="font-size:10px">High</span>':diff<=-3?'<span class="badge b-amber" style="font-size:10px">Med</span>':'<span class="badge b-green" style="font-size:10px">Low</span>';
    const domBadge=m.domain==='HEDIS'?'b-blue':'b-gray';
    return '<tr>'
      +'<td><div style="font-size:12px;font-weight:600;color:#111;margin-bottom:2px">'+m.name+'</div><div style="font-size:10px;color:#9ca3af">'+m.lisCount+' LIS members</div></td>'
      +'<td><span class="badge '+domBadge+'" style="font-size:10px">'+m.domain+'</span></td>'
      +'<td><span style="font-size:13px;font-weight:700;color:'+(atBench?'#1D9E75':'#dc2626')+'">'+m.lis+'%</span></td>'
      +'<td style="text-align:center;font-size:12px;font-weight:600;color:#374151">'+m.gen+'%</td>'
      +'<td style="text-align:center"><span style="background:#f5f3ff;color:#7c3aed;padding:2px 8px;border-radius:20px;font-weight:600;font-size:11px">'+m.bench+'%</span></td>'
      +'<td style="text-align:center">'+diffStr+'</td>'
      +'<td style="text-align:center">'+pri+'</td>'
      +'<td style="text-align:center">'+status+'</td>'
      +'<td style="text-align:center;font-size:12px;font-weight:700;color:'+(m.weight===3?'#7c3aed':'#6b7280')+'">'+m.weight+'Ã—</td>'
      +'</tr>';
  }).join('');
}
buildEHOMeasures();

// â”€â”€ MARKET ANALYSIS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
(function(){
const MA_DOMAINS=['HEDIS','CAHPS','HOS','Medical Adherence','Admin'];

let MA_ENROLL=[],MA_PLAN_STARS=[],MA_MEASURES_RAW=[];
let MA_YEARS=[];
let maFiltered=[];
let maSelectedContracts=new Set();
let maSelectedYears=new Set();
let maSelectedDomain='all';
let maSelectedOrgs=new Set();
let maSelectedOrgsTop=new Set();
let maSortCol='domain',maSortDir='asc',maPage=1,maPlPage=1;
let maPlSortCol='',maPlSortDir='asc';
const MA_PAGE_SIZE=25;
const MA_PLAN_PAGE_SIZE=20;
let maInited=false;
let maContracts=[];
let maAllContracts=[];
let maOrgs=[];
let maOrgsTop=[];
let maOrgToContracts={};

function ft(url,timeout){const ctrl=new AbortController();const t=timeout||15000;setTimeout(()=>ctrl.abort(),t);console.log('Market fetching:',url,'timeout='+t);return fetch(url,{signal:ctrl.signal}).then(r=>{console.log('Market response:',url,'status='+r.status);if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}).then(data=>{console.log('Market parsed:',url,'rows='+((data&&data.length)||0));return data;}).catch(e=>{console.error('Market fetch FAILED:',url,e.name,e.message);return[];});}

function starClass(v){if(v>=4.5)return'ma-star-good';if(v>=4)return'ma-star-ok';if(v>=3.5)return'ma-star-warn';return'ma-star-bad';}

function yoyHtml(stars,years){
  const sorted=[...years].filter(y=>stars[y]!=null&&!isNaN(stars[y])).sort((a,b)=>b-a);
  if(sorted.length<2)return'<span style="color:#9ca3af">â€”</span>';
  const diff=stars[sorted[0]]-stars[sorted[1]];
  if(diff>0)return'<span class="ma-yoy-up">+'+diff.toFixed(1)+'</span>';
  if(diff<0)return'<span class="ma-yoy-down">'+diff.toFixed(1)+'</span>';
  return'<span class="ma-yoy-flat">0.0</span>';
}

function domBadge(domain){
  const cls=domain==='HEDIS'?'b-blue':domain==='CAHPS'?'b-green':domain==='HOS'?'b-amber':domain==='Medical Adherence'?'b-red':'b-gray';
  return'<span class="badge '+cls+'" style="font-size:10px">'+domain+'</span>';
}

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}

async function maInit(){
  maInited=false;
  try{
  const [enroll,planStars]=await Promise.all([ft('/api/market/enrollment'),ft('/api/market/plan-stars')]);
  console.log('Market: enroll+planStars done, now fetching measures...');
  let measures=await ft('/api/market/measure-stars',60000);
  if(!measures.length){console.warn('Market: measure-stars returned empty, retrying...');measures=await ft('/api/market/measure-stars',60000);}
  if(!enroll.length&&!planStars.length&&!measures.length){console.warn('Market: all API calls returned empty');document.getElementById('ma-measure-tbody').innerHTML='<tr><td colspan="12" style="text-align:center;padding:20px;color:#dc2626">Failed to load data â€” check API endpoints /api/market/*</td></tr>';return;}
  console.log('Market raw counts: enroll='+enroll.length+' planStars='+planStars.length+' measures='+measures.length);
  MA_ENROLL=enroll.map(d=>({contract_id:d.contract_id,plan_name:d.plan_name||d.contract_id,org_name:d.org_name||d.contract_id,state:d.state||'',year:parseInt(d.year),enrollment:parseInt(d.enrollment)||0}));
  let rawPlanStars=planStars.map(d=>({contract_id:d.contract_id,plan_name:d.plan_name||d.contract_id,org_name:d.org_name||d.contract_id,state:d.state||'',year:parseInt(d.year),overall_star:parseFloat(d.overall_star)}));
  let rawMeasures=measures.map(d=>({contract:d.contract_id,contractName:d.plan_name||d.contract_id,orgName:d.org_name||d.plan_name||d.contract_id,state:d.state||'',year:parseInt(d.year),domain:d.domain,measure:d.measure_name,star:parseFloat(d.star_rating),weight:d.weight||1}));

  // Clean plan-stars: exclude contracts where ALL yearly overall_star are NaN/null
  const planStarsByContract={};
  rawPlanStars.forEach(d=>{if(!planStarsByContract[d.contract_id])planStarsByContract[d.contract_id]=[];planStarsByContract[d.contract_id].push(d.overall_star);});
  const invalidPlanContracts=new Set();
  Object.keys(planStarsByContract).forEach(cid=>{
    if(planStarsByContract[cid].every(v=>v==null||isNaN(v)))invalidPlanContracts.add(cid);
  });
  if(invalidPlanContracts.size)console.log('Market: excluding '+invalidPlanContracts.size+' plan contracts with all-NaN ratings');
  MA_PLAN_STARS=rawPlanStars.filter(d=>!invalidPlanContracts.has(d.contract_id));
  MA_ENROLL=MA_ENROLL.filter(d=>!invalidPlanContracts.has(d.contract_id));

  MA_MEASURES_RAW=rawMeasures;
  console.log('Market measures loaded: '+MA_MEASURES_RAW.length);
  if(MA_MEASURES_RAW.length)console.log('Measure sample:',JSON.stringify(MA_MEASURES_RAW[0]));

  console.log('Market data loaded: enroll='+MA_ENROLL.length+' planStars='+MA_PLAN_STARS.length+' measures='+MA_MEASURES_RAW.length);
  if(MA_ENROLL.length)console.log('Enroll sample:',JSON.stringify(MA_ENROLL[0]));
  MA_YEARS=[...new Set(MA_ENROLL.map(d=>d.year).concat(MA_PLAN_STARS.map(d=>d.year)).concat(MA_MEASURES_RAW.map(d=>d.year)))].sort();
  maSelectedYears=new Set(MA_YEARS);

  const cids=[...new Set(MA_ENROLL.map(d=>d.contract_id).concat(MA_PLAN_STARS.map(d=>d.contract_id)).concat(MA_MEASURES_RAW.map(d=>d.contract)))];
  maAllContracts=cids.map(cid=>{const e=MA_ENROLL.find(d=>d.contract_id===cid);const p=MA_PLAN_STARS.find(d=>d.contract_id===cid);const m=MA_MEASURES_RAW.find(d=>d.contract===cid);return{id:cid,name:(e&&e.plan_name)||(p&&p.plan_name)||cid,org_name:(p&&p.org_name)||(e&&e.org_name)||(m&&m.orgName)||cid,state:(e&&e.state)||(p&&p.state)||''};});
  maContracts=[...maAllContracts];
  maSelectedContracts=new Set(cids);

  // Build organization (org_name) â†’ contract mapping
  maOrgToContracts={};
  maAllContracts.forEach(c=>{
    const org=c.org_name||c.id;
    if(!maOrgToContracts[org])maOrgToContracts[org]=[];
    if(!maOrgToContracts[org].includes(c.id))maOrgToContracts[org].push(c.id);
  });
  maOrgsTop=Object.keys(maOrgToContracts).sort();
  maSelectedOrgsTop=new Set(maOrgsTop);

  // Render organization dropdown (top-level, in plan table filter area)
  maBuildOrgTopDD();
  // Render contract dropdown
  maBuildContractDD();

  maApplyFilters();
  maInited=true;
  }catch(e){console.error('maInit error:',e);document.getElementById('ma-measure-tbody').innerHTML='<tr><td colspan="12" style="text-align:center;padding:20px;color:#dc2626">Error loading data: '+e.message+'</td></tr>';}
}

function maBuildOrgTopDD(){
  const items=document.getElementById('ma-orgtop-items');
  items.innerHTML=maOrgsTop.map((o,i)=>'<div class="ma-dd-item" onclick="maToggleOrgTop('+i+',this)"><input type="checkbox" '+(maSelectedOrgsTop.has(o)?'checked':'')+' data-otidx="'+i+'" onclick="event.stopPropagation();maToggleOrgTop('+i+',this.parentElement,true)"><label style="cursor:pointer;flex:1">'+esc(o)+'</label></div>').join('');
  maUpdateOrgTopLabel();
}

function maBuildContractDD(){
  const visibleContracts=maAllContracts.filter(c=>maSelectedOrgsTop.has(c.org_name||c.id));
  maContracts=visibleContracts;
  const items=document.getElementById('ma-contract-items');
  items.innerHTML=visibleContracts.map(c=>'<div class="ma-dd-item" onclick="maToggleContract(\''+c.id+'\',this)"><input type="checkbox" '+(maSelectedContracts.has(c.id)?'checked':'')+' data-cid="'+c.id+'" onclick="event.stopPropagation();maToggleContract(\''+c.id+'\',this.parentElement,true)"><label style="cursor:pointer;flex:1">'+c.id+' â€” '+esc(c.name)+'</label></div>').join('');
  maUpdateContractLabel();
}


window.maToggleDD=function(type){
  const menu=document.getElementById('ma-'+type+'-menu');
  menu.classList.toggle('open');
};
document.addEventListener('click',function(e){
  if(!e.target.closest('.ma-dd-wrap')){document.querySelectorAll('.ma-dd-menu').forEach(m=>m.classList.remove('open'));}
});

// â”€â”€ Organization (top-level) filter â”€â”€
window.maToggleOrgTop=function(idx,el,fromCb){
  const org=maOrgsTop[idx];
  const cb=el.querySelector('input[type=checkbox]');
  if(!cb)return;
  if(!fromCb)cb.checked=!cb.checked;
  if(cb.checked)maSelectedOrgsTop.add(org);else maSelectedOrgsTop.delete(org);
  const all=document.getElementById('ma-orgtop-all');
  if(all)all.checked=maSelectedOrgsTop.size===maOrgsTop.length;
  maUpdateOrgTopLabel();
  maCascadeFromOrg();
};

window.maToggleAllOrgsTop=function(){
  const all=document.getElementById('ma-orgtop-all');
  const checked=all?all.checked:true;
  document.querySelectorAll('#ma-orgtop-items input[type=checkbox]').forEach(cb=>{const i=parseInt(cb.dataset.otidx);const o=maOrgsTop[i];cb.checked=checked;if(checked)maSelectedOrgsTop.add(o);else maSelectedOrgsTop.delete(o);});
  if(!checked)maSelectedOrgsTop.clear();else maOrgsTop.forEach(o=>maSelectedOrgsTop.add(o));
  maUpdateOrgTopLabel();
  maCascadeFromOrg();
};

function maUpdateOrgTopLabel(){
  const lbl=document.getElementById('ma-orgtop-label');
  if(maSelectedOrgsTop.size===maOrgsTop.length)lbl.textContent='All Organizations';
  else if(maSelectedOrgsTop.size===0)lbl.textContent='None';
  else lbl.textContent=maSelectedOrgsTop.size+' org'+(maSelectedOrgsTop.size>1?'s':'');
}

function maCascadeFromOrg(){
  const allowedContracts=new Set();
  maSelectedOrgsTop.forEach(org=>{(maOrgToContracts[org]||[]).forEach(cid=>allowedContracts.add(cid));});
  maSelectedContracts=new Set(allowedContracts);
  maBuildContractDD();
}

// â”€â”€ Contract filter â”€â”€
window.maToggleContract=function(cid,el,fromCb){
  const cb=el.querySelector('input[type=checkbox]');
  if(!cb)return;
  if(!fromCb)cb.checked=!cb.checked;
  if(cb.checked)maSelectedContracts.add(cid);else maSelectedContracts.delete(cid);
  const all=document.getElementById('ma-contract-all');
  if(all)all.checked=maSelectedContracts.size===maContracts.length;
  maUpdateContractLabel();
};

window.maToggleAll=function(){
  const all=document.getElementById('ma-contract-all');
  const checked=all?all.checked:true;
  document.querySelectorAll('#ma-contract-items input[type=checkbox]').forEach(cb=>{cb.checked=checked;if(checked)maSelectedContracts.add(cb.dataset.cid);else maSelectedContracts.delete(cb.dataset.cid);});
  if(!checked)maSelectedContracts.clear();else maContracts.forEach(c=>maSelectedContracts.add(c.id));
  maUpdateContractLabel();
};

function maUpdateContractLabel(){
  const lbl=document.getElementById('ma-contract-label');
  if(maSelectedContracts.size===maContracts.length)lbl.textContent='All Contracts';
  else if(maSelectedContracts.size===0)lbl.textContent='None';
  else lbl.textContent=maSelectedContracts.size+' contract'+(maSelectedContracts.size>1?'s':'');
}


window.maFilterDDItems=function(type,val){
  const items=document.querySelectorAll('#ma-'+type+'-items .ma-dd-item');
  const v=val.toLowerCase();
  items.forEach(it=>{it.style.display=it.textContent.toLowerCase().includes(v)?'':'none';});
};

window.maYrToggle=function(el){
  el.classList.toggle('on');
  const yr=parseInt(el.dataset.year);
  if(el.classList.contains('on'))maSelectedYears.add(yr);else maSelectedYears.delete(yr);
};

window.maDomToggle=function(el){
  const dom=el.dataset.domain;
  if(dom==='all'){
    document.querySelectorAll('.ma-dom-chip').forEach(c=>c.classList.remove('on'));
    el.classList.add('on');
    maSelectedDomain='all';
  }else{
    document.querySelector('.ma-dom-chip[data-domain="all"]').classList.remove('on');
    el.classList.toggle('on');
    const active=[...document.querySelectorAll('.ma-dom-chip.on:not([data-domain="all"])')].map(c=>c.dataset.domain);
    if(active.length===0){document.querySelector('.ma-dom-chip[data-domain="all"]').classList.add('on');maSelectedDomain='all';}
    else maSelectedDomain=active;
  }
  maPage=1;
  maRenderMeasureTable();
};

// â”€â”€ Apply: refresh KPIs + table + export dataset together â”€â”€
window.maApplyFilters=function(){
  // Build measure-section org/contract dropdowns synced from top-level selections
  maSyncMeasureFilters();

  // Filter measures by selected orgs and contracts from top section
  maFiltered=MA_MEASURES_RAW.filter(d=>{
    if(!maSelectedContracts.has(d.contract))return false;
    return true;
  });
  console.log('Market maFiltered count: '+maFiltered.length);
  maPage=1;maPlPage=1;
  maRenderAll();
};

function maSyncMeasureFilters(){
  // Org dropdown: read-only display of selected orgs from top section
  const morgItems=document.getElementById('ma-morg-items');
  if(morgItems){
    const orgs=[...maSelectedOrgsTop].sort();
    morgItems.innerHTML=orgs.map(o=>'<div class="ma-dd-item" style="pointer-events:none;opacity:0.85"><span style="color:#22c55e;margin-right:6px">âœ“</span><label>'+esc(o)+'</label></div>').join('');
  }
  const morgLbl=document.getElementById('ma-morg-label');
  if(morgLbl){
    if(maSelectedOrgsTop.size===maOrgsTop.length)morgLbl.textContent='All Organizations';
    else if(maSelectedOrgsTop.size===0)morgLbl.textContent='None';
    else morgLbl.textContent=maSelectedOrgsTop.size+' org'+(maSelectedOrgsTop.size>1?'s':'');
  }
  // Contract dropdown: read-only display of selected contracts from top section
  const mcidItems=document.getElementById('ma-mcid-items');
  if(mcidItems){
    const cids=[...maSelectedContracts].sort();
    mcidItems.innerHTML=cids.map(c=>'<div class="ma-dd-item" style="pointer-events:none;opacity:0.85"><span style="color:#22c55e;margin-right:6px">âœ“</span><label>'+esc(c)+'</label></div>').join('');
  }
  const mcidLbl=document.getElementById('ma-mcid-label');
  if(mcidLbl){
    const totalContracts=maAllContracts?maAllContracts.length:maSelectedContracts.size;
    if(maSelectedContracts.size===totalContracts)mcidLbl.textContent='All Contracts';
    else if(maSelectedContracts.size===0)mcidLbl.textContent='None';
    else mcidLbl.textContent=maSelectedContracts.size+' contract'+(maSelectedContracts.size>1?'s':'');
  }
}

// â”€â”€ Reset: clear Market Analysis filters only â”€â”€
window.maResetFilters=function(){
  maSelectedOrgsTop=new Set(maOrgsTop);
  maSelectedContracts=new Set(maAllContracts.map(c=>c.id));
  maSelectedYears=new Set(MA_YEARS);
  maSelectedDomain='all';
  maPlSortCol='';maPlSortDir='asc';

  // Reset org top dropdown
  document.querySelectorAll('#ma-orgtop-items input[type=checkbox]').forEach(cb=>cb.checked=true);
  const allOt=document.getElementById('ma-orgtop-all');if(allOt)allOt.checked=true;
  maUpdateOrgTopLabel();

  // Rebuild contract dropdown with all items
  maBuildContractDD();

  // Reset domain chips
  document.querySelectorAll('.ma-dom-chip').forEach(c=>c.classList.remove('on'));
  document.querySelector('.ma-dom-chip[data-domain="all"]').classList.add('on');

  maApplyFilters();
};

function maRenderAll(){
  maRenderKPIs();
  maRenderPlanTable();
  maRenderMeasureTable();
}

// â”€â”€ KPI Board â”€â”€
function maRenderKPIs(){
  const filteredPlanData=MA_PLAN_STARS.filter(d=>maSelectedContracts.has(d.contract_id)&&d.overall_star!=null&&!isNaN(d.overall_star));
  const latestYear=MA_YEARS.length?MA_YEARS[MA_YEARS.length-1]:null;
  const latestData=latestYear?filteredPlanData.filter(d=>d.year===latestYear):[];

  // Total Enrollment (sum latest year enrollment for selected contracts with valid data)
  const validContractIds=new Set(filteredPlanData.map(d=>d.contract_id));
  const filteredEnroll=MA_ENROLL.filter(d=>validContractIds.has(d.contract_id)&&d.year===latestYear);
  const totalEnroll=filteredEnroll.reduce((s,d)=>s+(d.enrollment||0),0);
  if(totalEnroll>0){
    const fmt=totalEnroll>=1e6?(totalEnroll/1e6).toFixed(1)+'M':totalEnroll>=1e3?(totalEnroll/1e3).toFixed(0)+'K':totalEnroll.toLocaleString();
    document.getElementById('ma-kpi-enrollment').textContent=fmt;
    document.getElementById('ma-kpi-enrollment-sub').textContent='';
  }else{
    document.getElementById('ma-kpi-enrollment').textContent='â€”';
    document.getElementById('ma-kpi-enrollment-sub').textContent='';
  }

  // Total Contracts
  const contractIds=new Set(filteredPlanData.map(d=>d.contract_id));
  document.getElementById('ma-kpi-contracts').textContent=contractIds.size||'0';
  document.getElementById('ma-kpi-contracts-sub').textContent='';

  // Plans With Rating >= 4 (latest year)
  const latestStars=latestData.map(d=>d.overall_star).filter(v=>v!=null&&!isNaN(v));
  const plans4=latestStars.filter(v=>v>=4).length;
  document.getElementById('ma-kpi-plans4').textContent=plans4;
  document.getElementById('ma-kpi-plans4-sub').textContent=latestStars.length?plans4+' of '+latestStars.length+' plans':'';

  // Highest Rated Plan
  if(latestStars.length){
    let maxStar=-1,maxName='';
    latestData.forEach(d=>{if(d.overall_star!=null&&d.overall_star>maxStar){maxStar=d.overall_star;maxName=d.contract_id;}});
    document.getElementById('ma-kpi-highest').textContent=maxStar.toFixed(1)+' â˜…';
    document.getElementById('ma-kpi-highest-sub').textContent=maxName;
    document.getElementById('ma-kpi-highest-sub').title=maxName;
  }else{
    document.getElementById('ma-kpi-highest').textContent='â€”';
    document.getElementById('ma-kpi-highest-sub').textContent='&nbsp;';
  }

  // Lowest Rated Plan
  if(latestStars.length){
    let minStar=999,minName='';
    latestData.forEach(d=>{if(d.overall_star!=null&&d.overall_star<minStar){minStar=d.overall_star;minName=d.contract_id;}});
    document.getElementById('ma-kpi-lowest').textContent=minStar.toFixed(1)+' â˜…';
    document.getElementById('ma-kpi-lowest-sub').textContent=minName;
    document.getElementById('ma-kpi-lowest-sub').title=minName;
  }else{
    document.getElementById('ma-kpi-lowest').textContent='â€”';
    document.getElementById('ma-kpi-lowest-sub').textContent='&nbsp;';
  }
}

function maRenderPlanTable(){
  const years=[...maSelectedYears].sort((a,b)=>b-a);
  const thead=document.getElementById('ma-plan-thead');
  const tbody=document.getElementById('ma-plan-tbody');
  const colSpan=years.length+4;
  const sortIcon=function(col){if(maPlSortCol!==col)return'';return maPlSortDir==='asc'?' â–²':' â–¼';};
  thead.innerHTML='<tr><th style="cursor:pointer;user-select:none" onclick="maPlSort(\'contract\')">Contract'+sortIcon('contract')+'</th><th style="cursor:pointer;user-select:none" onclick="maPlSort(\'name\')">Plan Name'+sortIcon('name')+'</th><th style="cursor:pointer;user-select:none" onclick="maPlSort(\'enrollment\')">Enrollment'+sortIcon('enrollment')+'</th>'+years.map(y=>'<th style="cursor:pointer;user-select:none" onclick="maPlSort(\'yr_'+y+'\')">'+y+sortIcon('yr_'+y)+'</th>').join('')+'<th style="cursor:pointer;user-select:none" onclick="maPlSort(\'yoy\')">YOY Change'+sortIcon('yoy')+'</th></tr>';

  const filtered=MA_PLAN_STARS.filter(d=>maSelectedContracts.has(d.contract_id));
  const grouped={};
  filtered.forEach(d=>{
    if(!grouped[d.contract_id])grouped[d.contract_id]={name:d.plan_name,state:d.state,stars:{}};
    const v=d.overall_star;
    if(v!=null&&!isNaN(v))grouped[d.contract_id].stars[d.year]=v;
  });
  // Attach latest enrollment to each group
  const latestYear=MA_YEARS.length?MA_YEARS[MA_YEARS.length-1]:null;
  Object.keys(grouped).forEach(cid=>{
    const eRow=MA_ENROLL.find(d=>d.contract_id===cid&&d.year===latestYear);
    grouped[cid].enrollment=eRow?eRow.enrollment:null;
  });
  // Exclude rows where ALL yearly ratings are missing after filtering
  let cids=Object.keys(grouped).filter(cid=>Object.keys(grouped[cid].stars).length>0);

  // Compute YOY change for sorting
  const yoyVal=function(stars){
    const avail=years.filter(y=>stars[y]!=null&&!isNaN(stars[y]));
    const sorted=[...avail].sort((a,b)=>a-b).slice(-2);
    if(sorted.length<2)return null;
    return stars[sorted[1]]-stars[sorted[0]];
  };
  // Sort
  if(maPlSortCol){
    const dir=maPlSortDir==='asc'?1:-1;
    cids.sort((a,b)=>{
      const ga=grouped[a],gb=grouped[b];
      if(maPlSortCol==='contract')return dir*a.localeCompare(b);
      if(maPlSortCol==='name')return dir*(ga.name||'').localeCompare(gb.name||'');
      if(maPlSortCol==='enrollment')return dir*((ga.enrollment||0)-(gb.enrollment||0));
      if(maPlSortCol==='yoy'){const va=yoyVal(ga.stars),vb=yoyVal(gb.stars);return dir*(((va==null?-999:va))-(vb==null?-999:vb));}
      if(maPlSortCol.startsWith('yr_')){const yr=parseInt(maPlSortCol.slice(3));const va=ga.stars[yr],vb=gb.stars[yr];return dir*(((va==null?-999:va))-(vb==null?-999:vb));}
      return 0;
    });
  }else{
    cids.sort();
  }
  document.getElementById('ma-plan-count').textContent=cids.length+' plans';

  if(!cids.length){tbody.innerHTML='<tr><td colspan="'+colSpan+'" style="text-align:center;padding:20px;color:#9ca3af">No data matches filters</td></tr>';document.getElementById('ma-plan-pagination').innerHTML='';return;}

  const totalPages=Math.max(1,Math.ceil(cids.length/MA_PLAN_PAGE_SIZE));
  if(maPlPage>totalPages)maPlPage=totalPages;
  const start=(maPlPage-1)*MA_PLAN_PAGE_SIZE;
  const slice=cids.slice(start,start+MA_PLAN_PAGE_SIZE);

  tbody.innerHTML=slice.map(cid=>{
    const g=grouped[cid];
    const enrollFmt=g.enrollment!=null?(g.enrollment>=1e6?(g.enrollment/1e6).toFixed(1)+'M':g.enrollment>=1e3?Math.round(g.enrollment/1e3)+'K':g.enrollment.toLocaleString()):'â€”';
    const yrCells=years.map(y=>{
      const v=g.stars[y];
      if(v==null||isNaN(v))return'<td><span class="ma-star-cell ma-star-na">â€”</span></td>';
      return'<td><span class="ma-star-cell '+starClass(v)+'">'+v.toFixed(1)+'â˜…</span></td>';
    }).join('');
    return'<tr><td>'+cid+'</td><td>'+esc(g.name)+'</td><td style="text-align:right;font-weight:600;color:#374151;font-size:12px">'+enrollFmt+'</td>'+yrCells+'<td style="text-align:center">'+yoyHtml(g.stars,years)+'</td></tr>';
  }).join('');

  const pag=document.getElementById('ma-plan-pagination');
  if(totalPages<=1){pag.innerHTML='';return;}
  let ph='<button class="ma-pg-btn" onclick="maGoPlPage('+(maPlPage-1)+')"'+(maPlPage===1?' disabled':'')+'>â€¹</button>';
  for(let i=1;i<=totalPages;i++){
    if(totalPages>7&&i>3&&i<totalPages-1&&Math.abs(i-maPlPage)>1){if(i===4||i===totalPages-2)ph+='<span style="color:#9ca3af;font-size:11px">â€¦</span>';continue;}
    ph+='<button class="ma-pg-btn'+(i===maPlPage?' ma-pg-active':'')+'" onclick="maGoPlPage('+i+')">'+i+'</button>';
  }
  ph+='<button class="ma-pg-btn" onclick="maGoPlPage('+(maPlPage+1)+')"'+(maPlPage===totalPages?' disabled':'')+'>â€º</button>';
  pag.innerHTML=ph;
}

function maRenderMeasureTable(){
  const years=[...maSelectedYears].sort((a,b)=>b-a);
  const thead=document.getElementById('ma-measure-thead');
  const selectedCids=[...maSelectedContracts];
  const isTwoPlanMode=selectedCids.length===2;

  if(isTwoPlanMode){
    // Two-plan comparison: Domain | Measure | plan_id_1 (year cols) | plan_id_2 (year cols)
    const p0=selectedCids[0],p1=selectedCids[1];
    const sortIcon=function(col){if(maSortCol!==col)return'';return maSortDir==='asc'?' â–²':' â–¼';};
    const colSpan2=2+years.length*2;
    let hdr='<tr><th rowspan="2" style="text-align:left;cursor:pointer;user-select:none" onclick="maSortBy(\'domain\')">Domain'+sortIcon('domain')+'</th><th rowspan="2" style="text-align:left;cursor:pointer;user-select:none" onclick="maSortBy(\'measure\')">Measure'+sortIcon('measure')+'</th>';
    hdr+='<th colspan="'+years.length+'" style="text-align:center;background:#f0f7ff;border-bottom:2px solid #3b82f6">'+esc(p0)+'</th>';
    hdr+='<th colspan="'+years.length+'" style="text-align:center;background:#fef3f0;border-bottom:2px solid #F26722">'+esc(p1)+'</th></tr><tr>';
    years.forEach(y=>{hdr+='<th style="cursor:pointer;user-select:none;background:#f0f7ff" onclick="maSortBy(\'p0_'+y+'\')">'+y+sortIcon('p0_'+y)+'</th>';});
    years.forEach(y=>{hdr+='<th style="cursor:pointer;user-select:none;background:#fef3f0" onclick="maSortBy(\'p1_'+y+'\')">'+y+sortIcon('p1_'+y)+'</th>';});
    hdr+='</tr>';
    thead.innerHTML=hdr;

    let data=maFiltered;
    if(maSelectedDomain!=='all'){
      const doms=Array.isArray(maSelectedDomain)?maSelectedDomain:[maSelectedDomain];
      data=data.filter(d=>doms.includes(d.domain));
    }
    const pivotMap={};
    data.forEach(d=>{
      if(!pivotMap[d.measure])pivotMap[d.measure]={measure:d.measure,domain:d.domain,p0:{},p1:{}};
      if(d.contract===p0)pivotMap[d.measure].p0[d.year]=d.star;
      if(d.contract===p1)pivotMap[d.measure].p1[d.year]=d.star;
    });
    let rows=Object.values(pivotMap);

    const col=maSortCol,dir=maSortDir==='asc'?1:-1;
    rows.sort((a,b)=>{
      if(col&&col.startsWith('p0_')){const yr=parseInt(col.slice(3));const va=a.p0[yr],vb=b.p0[yr];return dir*(((va==null?-999:va))-(vb==null?-999:vb));}
      if(col&&col.startsWith('p1_')){const yr=parseInt(col.slice(3));const va=a.p1[yr],vb=b.p1[yr];return dir*(((va==null?-999:va))-(vb==null?-999:vb));}
      let va=a[col],vb=b[col];
      if(typeof va==='string')return dir*va.localeCompare(vb);
      return dir*((va||0)-(vb||0));
    });

    document.getElementById('ma-measure-count').textContent=rows.length+' measures Â· Comparing '+p0+' vs '+p1;
    const totalPages=Math.max(1,Math.ceil(rows.length/MA_PAGE_SIZE));
    if(maPage>totalPages)maPage=totalPages;
    const slice=rows.slice((maPage-1)*MA_PAGE_SIZE,maPage*MA_PAGE_SIZE);
    const tbody=document.getElementById('ma-measure-tbody');
    if(!slice.length){tbody.innerHTML='<tr><td colspan="'+colSpan2+'" style="text-align:center;padding:20px;color:#9ca3af">No data matches filters</td></tr>';
    }else{
      tbody.innerHTML=slice.map(d=>{
        const p0Cells=years.map(y=>{const v=d.p0[y];if(v==null||isNaN(v))return'<td style="text-align:center;background:#f8fbff"><span class="ma-star-cell ma-star-na">â€”</span></td>';return'<td style="text-align:center;background:#f8fbff"><span class="ma-star-cell '+starClass(v)+'">'+v.toFixed(1)+'</span></td>';}).join('');
        const p1Cells=years.map(y=>{const v=d.p1[y];if(v==null||isNaN(v))return'<td style="text-align:center;background:#fffbf8"><span class="ma-star-cell ma-star-na">â€”</span></td>';return'<td style="text-align:center;background:#fffbf8"><span class="ma-star-cell '+starClass(v)+'">'+v.toFixed(1)+'</span></td>';}).join('');
        return'<tr><td>'+domBadge(d.domain)+'</td><td>'+d.measure+'</td>'+p0Cells+p1Cells+'</tr>';
      }).join('');
    }
    const pag=document.getElementById('ma-pagination');
    if(totalPages<=1){pag.innerHTML='';return;}
    let ph='<button class="ma-pg-btn" onclick="maGoPage('+(maPage-1)+')"'+(maPage===1?' disabled':'')+'>â€¹</button>';
    for(let i=1;i<=totalPages;i++){
      if(totalPages>7&&i>3&&i<totalPages-1&&Math.abs(i-maPage)>1){if(i===4||i===totalPages-2)ph+='<span style="color:#9ca3af;font-size:11px">â€¦</span>';continue;}
      ph+='<button class="ma-pg-btn'+(i===maPage?' ma-pg-active':'')+'" onclick="maGoPage('+i+')">'+i+'</button>';
    }
    ph+='<button class="ma-pg-btn" onclick="maGoPage('+(maPage+1)+')"'+(maPage===totalPages?' disabled':'')+'>â€º</button>';
    pag.innerHTML=ph;
    return;
  }

  // Default mode: full measure table
  const sortIcon=function(col){if(maSortCol!==col)return'';return maSortDir==='asc'?' â–²':' â–¼';};
  thead.innerHTML='<tr><th style="text-align:left;cursor:pointer;user-select:none" onclick="maSortBy(\'domain\')">Domain'+sortIcon('domain')+'</th><th style="text-align:left;cursor:pointer;user-select:none" onclick="maSortBy(\'contract\')">Contract'+sortIcon('contract')+'</th><th style="text-align:left;cursor:pointer;user-select:none" onclick="maSortBy(\'measure\')">Measure'+sortIcon('measure')+'</th><th style="cursor:pointer;user-select:none" onclick="maSortBy(\'weight\')">Wt'+sortIcon('weight')+'</th>'+years.map(y=>'<th style="cursor:pointer;user-select:none" onclick="maSortBy(\'yr_'+y+'\')">'+y+sortIcon('yr_'+y)+'</th>').join('')+'<th style="cursor:pointer;user-select:none" onclick="maSortBy(\'yoy\')">YOY Change'+sortIcon('yoy')+'</th></tr>';

  let data=maFiltered;
  if(maSelectedDomain!=='all'){
    const doms=Array.isArray(maSelectedDomain)?maSelectedDomain:[maSelectedDomain];
    data=data.filter(d=>doms.includes(d.domain));
  }

  const pivotMap={};
  data.forEach(d=>{
    const key=d.contract+'|'+d.measure;
    if(!pivotMap[key])pivotMap[key]={contract:d.contract,measure:d.measure,domain:d.domain,weight:d.weight,stars:{}};
    pivotMap[key].stars[d.year]=d.star;
  });
  let rows=Object.values(pivotMap);

  const yoyValM=function(stars){
    const avail=years.filter(y=>stars[y]!=null&&!isNaN(stars[y])).sort((a,b)=>a-b).slice(-2);
    if(avail.length<2)return null;
    return stars[avail[1]]-stars[avail[0]];
  };

  const col=maSortCol,dir=maSortDir==='asc'?1:-1;
  rows.sort((a,b)=>{
    if(col==='yoy'){const va=yoyValM(a.stars),vb=yoyValM(b.stars);return dir*(((va==null?-999:va))-(vb==null?-999:vb));}
    if(col&&col.startsWith('yr_')){const yr=parseInt(col.slice(3));const va=a.stars[yr],vb=b.stars[yr];return dir*(((va==null?-999:va))-(vb==null?-999:vb));}
    let va=a[col],vb=b[col];
    if(typeof va==='string')return dir*va.localeCompare(vb);
    return dir*((va||0)-(vb||0));
  });

  document.getElementById('ma-measure-count').textContent=rows.length+' measures';
  const totalPages=Math.max(1,Math.ceil(rows.length/MA_PAGE_SIZE));
  if(maPage>totalPages)maPage=totalPages;
  const slice=rows.slice((maPage-1)*MA_PAGE_SIZE,maPage*MA_PAGE_SIZE);

  const tbody=document.getElementById('ma-measure-tbody');
  const colSpan=years.length+5;
  if(!slice.length){tbody.innerHTML='<tr><td colspan="'+colSpan+'" style="text-align:center;padding:20px;color:#9ca3af">No data matches filters</td></tr>';
  }else{
    tbody.innerHTML=slice.map(d=>{
      const yrCells=years.map(y=>{
        const v=d.stars[y];
        if(v==null||isNaN(v))return'<td style="text-align:center"><span class="ma-star-cell ma-star-na">â€”</span></td>';
        return'<td style="text-align:center"><span class="ma-star-cell '+starClass(v)+'">'+v.toFixed(1)+'</span></td>';
      }).join('');
      return'<tr><td>'+domBadge(d.domain)+'</td><td style="font-weight:600;color:#1d4ed8;font-size:11px">'+d.contract+'</td><td>'+d.measure+'</td><td style="text-align:center;font-weight:600;color:'+(d.weight===3?'#7c3aed':'#6b7280')+'">'+d.weight+'Ã—</td>'+yrCells+'<td style="text-align:center">'+yoyHtml(d.stars,years)+'</td></tr>';
    }).join('');
  }

  const pag=document.getElementById('ma-pagination');
  if(totalPages<=1){pag.innerHTML='';return;}
  let ph='<button class="ma-pg-btn" onclick="maGoPage('+(maPage-1)+')"'+(maPage===1?' disabled':'')+'>â€¹</button>';
  for(let i=1;i<=totalPages;i++){
    if(totalPages>7&&i>3&&i<totalPages-1&&Math.abs(i-maPage)>1){if(i===4||i===totalPages-2)ph+='<span style="color:#9ca3af;font-size:11px">â€¦</span>';continue;}
    ph+='<button class="ma-pg-btn'+(i===maPage?' ma-pg-active':'')+'" onclick="maGoPage('+i+')">'+i+'</button>';
  }
  ph+='<button class="ma-pg-btn" onclick="maGoPage('+(maPage+1)+')"'+(maPage===totalPages?' disabled':'')+'>â€º</button>';
  pag.innerHTML=ph;
}

window.maGoPage=function(p){maPage=p;maRenderMeasureTable();};
window.maGoPlPage=function(p){maPlPage=p;maRenderPlanTable();};
window.maPlSort=function(col){if(maPlSortCol===col)maPlSortDir=maPlSortDir==='asc'?'desc':'asc';else{maPlSortCol=col;maPlSortDir=col==='contract'||col==='name'?'asc':'desc';}maPlPage=1;maRenderPlanTable();};
window.maSortBy=function(col){if(maSortCol===col)maSortDir=maSortDir==='asc'?'desc':'asc';else{maSortCol=col;maSortDir='asc';}maRenderMeasureTable();};

// â”€â”€ Export CSV: uses filtered data consistent with current filters â”€â”€
window.maExportCSV=function(){
  const years=[...maSelectedYears].sort((a,b)=>b-a);
  const pivotMap={};
  maFiltered.forEach(d=>{
    const key=d.contract+'|'+d.measure;
    if(!pivotMap[key])pivotMap[key]={contract:d.contract,contractName:d.contractName,orgName:d.orgName,state:d.state,domain:d.domain,measure:d.measure,weight:d.weight,stars:{}};
    pivotMap[key].stars[d.year]=d.star;
  });
  let csv='Contract,Plan Name,Organization,State,Domain,Measure,Weight,'+years.join(',')+',YOY Change\n';
  Object.values(pivotMap).filter(d=>Object.values(d.stars).some(v=>v!=null&&!isNaN(v))).forEach(d=>{
    const starVals=years.map(y=>d.stars[y]!=null&&!isNaN(d.stars[y])?d.stars[y]:'');
    const avail=[...years].filter(y=>d.stars[y]!=null).sort((a,b)=>b-a).slice(0,2);
    const change=avail.length===2?(d.stars[avail[0]]-d.stars[avail[1]]).toFixed(1):'';
    csv+=d.contract+',"'+d.contractName+'","'+d.orgName+'",'+d.state+','+d.domain+',"'+d.measure+'",'+d.weight+','+starVals.join(',')+','+change+'\n';
  });
  const blob=new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='market_analysis_export.csv';a.click();
};

window.maInitPage=maInit;
})();

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// HOS MEASURES MODULE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
(function(){
'use strict';

let hosMeasures={};
let hosMembers=[];
let hosMembersTotal=0;
let hosMembersPage=1;
let hosProviders=[];
let hosSummary={};
let hosCurrentMeasure='fall';
let hosWorklist=[];
window.hosCurrentMember=null;
let hosLoaded=false;

const hosContractId=()=>window._selectedContractId||'H3312';

// â”€â”€ Navigation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
window.hosNav=function(id,btn){
  document.querySelectorAll('.hos-sub').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.hos-nav-btn').forEach(b=>b.classList.remove('active'));
  const el=document.getElementById('hos-'+id);
  if(el)el.classList.add('active');
  if(btn)btn.classList.add('active');
  else{const btns=document.querySelectorAll('.hos-nav-btn');const map={overview:0,deepdive:1,gap:2,urgency:3};if(map[id]!=null&&btns[map[id]])btns[map[id]].classList.add('active');}
};

// â”€â”€ Tabs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
window.hosShowTab=function(name,btn){
  document.querySelectorAll('.hos-tab-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.hos-tab').forEach(b=>b.classList.remove('active'));
  const el=document.getElementById('hos-tab-'+name);
  if(el)el.classList.add('active');
  if(btn)btn.classList.add('active');
};

// â”€â”€ Color helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function badgeClass(b){return b==='CRITICAL'?'hos-chip-red':b==='AT RISK'?'hos-chip-amber':b==='ON TRACK'?'hos-chip-green':'hos-chip-gray';}
function rateColor(rate,cut){return rate>=cut?'#1D9E75':rate>=cut-2?'#d97706':'#dc2626';}
function urgColor(u){return u>=70?'#dc2626':u>=40?'#d97706':'#1D9E75';}
function urgLabel(u){return u>=70?'High':u>=40?'Medium':'Low';}
function urgChip(u){return u>=70?'hos-chip-red':u>=40?'hos-chip-amber':'hos-chip-green';}
function statusChip(s){return s==='Active'?'hos-chip-green':s==='Planning'?'hos-chip-amber':'hos-chip-gray';}

// â”€â”€ Fetch summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function hosFetchSummary(){
  return fetch('/api/hos/summary?contract_id='+hosContractId()).then(r=>{if(!r.ok)throw new Error('HOS summary '+r.status);return r.json();}).then(d=>{
    hosSummary=d;
    const el=document.getElementById('hos-summary-banner');
    if(!el)return;
    const belowColor=d.below_cut>0?'color:#dc2626':'';
    const gapColor=d.total_gaps>500?'color:#d97706':'';
    const awvColor=d.avg_awv<75?'color:#d97706':'color:#1D9E75';
    el.innerHTML=`
      <div class="hos-banner-item"><div class="hos-banner-label">Avg Star Rating</div><div class="hos-banner-val">${d.avg_star} â˜…</div><div class="hos-banner-sub">2025 Official</div></div>
      <div class="hos-banner-div"></div>
      <div class="hos-banner-item"><div class="hos-banner-label">Measures Below Cut</div><div class="hos-banner-val" style="${belowColor}">${d.below_cut} / ${d.total_measures}</div><div class="hos-banner-sub">Fall Risk &amp; Monitoring</div></div>
      <div class="hos-banner-div"></div>
      <div class="hos-banner-item"><div class="hos-banner-label">Total Open Gaps</div><div class="hos-banner-val" style="${gapColor}">${d.total_gaps.toLocaleString()}</div><div class="hos-banner-sub">Across all measures</div></div>
      <div class="hos-banner-div"></div>
      <div class="hos-banner-item"><div class="hos-banner-label">AWV Completion</div><div class="hos-banner-val" style="${awvColor}">${d.avg_awv}%</div><div class="hos-banner-sub">Target: 75%</div></div>
      <div class="hos-banner-div"></div>
      <div class="hos-banner-item"><div class="hos-banner-label">Survey Window</div><div class="hos-banner-val">${d.survey_window_weeks} wks</div><div class="hos-banner-sub">To blackout Â· Jul 2025</div></div>`;
  }).catch(e=>{console.error('HOS summary fetch error',e);});
}

// â”€â”€ Fetch measures â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function hosFetchMeasures(){
  return fetch('/api/hos/measures?contract_id='+hosContractId()).then(r=>{if(!r.ok)throw new Error('HOS measures '+r.status);return r.json();}).then(d=>{
    hosMeasures=d.measures||{};
    hosRenderOverviewTable();
    hosRenderAWVFooter();
    hosRenderInsight();
  }).catch(e=>{console.error('HOS measures fetch error',e);});
}

function hosRenderInsight(){
  const el=document.getElementById('hos-insight-text');
  if(!el)return;
  const pact=hosMeasures.pact;
  const noAwv=pact?pact.open_gap:1932;
  el.innerHTML='AWV is the single highest-leverage action across all 5 measures. One AWV visit closes fall risk, physical activity, monitoring, and mental health gaps <strong>at the same appointment</strong>. '+noAwv.toLocaleString()+' members have no AWV this year â€” that is your primary outreach target.';
}

function hosRenderOverviewTable(){
  const tbody=document.getElementById('hos-measures-tbody');
  if(!tbody)return;
  const order=['fall','mon','phys','ment','pact'];
  const rows=order.filter(k=>hosMeasures[k]).map(k=>{
    const m=hosMeasures[k];
    const diff=m.rate-m.cut4;
    const diffStr=(diff>=0?'+':'âˆ’')+Math.abs(diff).toFixed(1)+'pp';
    const rc=rateColor(m.rate,m.cut4);
    const borderColor=m.badge==='CRITICAL'?'#dc2626':m.badge==='AT RISK'?'#d97706':'#1D9E75';
    const typeChip=m.type.includes('Outcome')?'hos-chip-blue':'hos-chip-gray';
    const typeLabel=m.type.includes('Outcome')?'Outcome':'Process';
    return `<tr onclick="hosOpenMeasure('${k}')" style="cursor:pointer;border-left:3px solid ${borderColor}">
      <td><div style="font-weight:600;font-size:12px">${m.name}</div><div style="font-size:10px;color:#9ca3af">${m.type.split('Â·').slice(1).join('Â·').trim()} Â· ${m.open_gap.toLocaleString()} open gaps</div></td>
      <td><span class="hos-chip ${typeChip}" style="font-size:9px">${typeLabel}</span></td>
      <td><span style="font-weight:700">${m.stars.toFixed(1)} â˜…</span></td>
      <td><span class="hos-chip ${badgeClass(m.badge)}">${m.badge}</span></td>
      <td><span style="font-weight:700;color:${rc}">${m.rate.toFixed(1)}%</span></td>
      <td><span style="color:#9ca3af">${m.cut4.toFixed(1)}%</span></td>
      <td><div style="display:flex;align-items:center;gap:8px"><div class="hos-prog-track"><div class="hos-prog-fill" style="width:${m.rate}%;background:${rc}"></div></div><span style="font-size:10px;color:${rc};font-weight:700">${diffStr}</span></div></td>
    </tr>`;
  });
  tbody.innerHTML=rows.join('')||'<tr><td colspan="7" style="text-align:center;padding:20px;color:#9ca3af">No measures found</td></tr>';
}

function hosRenderAWVFooter(){
  const el=document.getElementById('hos-awv-footer');
  if(!el)return;
  const pact=hosMeasures.pact;
  const fall=hosMeasures.fall;
  const awvPct=fall?fall.awv.pct:54;
  const noAwv=pact?pact.open_gap:1932;
  el.style.display='flex';
  el.innerHTML=`<div style="font-size:18px">ðŸ¥</div>
    <div style="flex:1"><div style="font-weight:700;font-size:13px">Annual Wellness Visit (AWV) â€” single highest-leverage action across all 5 measures</div><div style="font-size:12px;color:#6b7280;margin-top:3px">One AWV closes gaps on fall risk, physical activity, monitoring, and mental health at a single appointment.</div></div>
    <div style="display:flex;gap:20px;flex-shrink:0;flex-wrap:wrap">
      <div style="text-align:center"><div style="font-size:20px;font-weight:800;color:#1D9E75">${awvPct}%</div><div style="font-size:10px;color:#9ca3af">AWV completion</div></div>
      <div style="text-align:center"><div style="font-size:20px;font-weight:800;color:#dc2626">${noAwv.toLocaleString()}</div><div style="font-size:10px;color:#9ca3af">No AWV this year</div></div>
      <div style="text-align:center"><div style="font-size:20px;font-weight:800;color:#d97706">75%</div><div style="font-size:10px;color:#9ca3af">Target</div></div>
    </div>`;
}

// â”€â”€ Open Measure (Deep Dive) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
window.hosOpenMeasure=function(id){
  hosCurrentMeasure=id;
  const m=hosMeasures[id];
  if(!m)return;
  document.getElementById('hos-dd-name').textContent=m.name;
  document.getElementById('hos-dd-type').textContent=m.type;
  const badge=document.getElementById('hos-dd-badge');
  badge.className='hos-chip '+badgeClass(m.badge);badge.textContent=m.badge;
  document.getElementById('hos-dd-rate').textContent=m.rate+'%';
  document.getElementById('hos-dd-rate').style.color=rateColor(m.rate,m.cut4);
  const rateSub=document.getElementById('hos-dd-rate-sub');
  if(rateSub)rateSub.textContent=m.eligible.toLocaleString()+' eligible Â· '+m.documented.toLocaleString()+' documented';
  document.getElementById('hos-dd-cut').textContent=m.cut4+'%';
  const gapEl=document.getElementById('hos-dd-gap');
  gapEl.textContent=(m.rate>=m.cut4?'+':'âˆ’')+Math.abs(m.cut4-m.rate).toFixed(1)+'pp';
  gapEl.style.color=m.rate>=m.cut4?'#1D9E75':'#dc2626';
  document.getElementById('hos-dd-needed').textContent=m.needed>0?m.needed:'â€”';

  // Steps
  document.getElementById('hos-dd-steps').innerHTML=(m.steps||[]).map((s,i)=>`
    <div class="hos-step"><div class="hos-step-num">${i+1}</div><div class="hos-step-body"><div class="hos-step-title">${s.title}</div><div class="hos-step-desc">${s.desc}</div><div class="hos-step-result">â†’ ${s.result}</div></div></div>`).join('');

  // Mock survey
  const sv=m.survey;
  document.getElementById('hos-dd-mock').innerHTML=`
    <div style="background:#f0fdf4;border-radius:6px;padding:10px;text-align:center"><div style="font-size:18px;font-weight:800;color:#1D9E75">${sv.sent.toLocaleString()}</div><div style="font-size:9px;color:#9ca3af;text-transform:uppercase;font-weight:700">Sent</div></div>
    <div style="background:#eff6ff;border-radius:6px;padding:10px;text-align:center"><div style="font-size:18px;font-weight:800;color:#2563eb">${sv.responded.toLocaleString()}</div><div style="font-size:9px;color:#9ca3af;text-transform:uppercase;font-weight:700">Responded</div></div>
    <div style="background:#fef2f2;border-radius:6px;padding:10px;text-align:center"><div style="font-size:18px;font-weight:800;color:#dc2626">${sv.no.toLocaleString()}</div><div style="font-size:9px;color:#b91c1c;text-transform:uppercase;font-weight:700">Answered No</div></div>
    <div style="background:#fffbeb;border-radius:6px;padding:10px;text-align:center"><div style="font-size:18px;font-weight:800;color:#d97706">${sv.no_resp.toLocaleString()}</div><div style="font-size:9px;color:#92400e;text-transform:uppercase;font-weight:700">No response</div></div>`;
  document.getElementById('hos-dd-mock-note').innerHTML='<strong>'+sv.no.toLocaleString()+' confirmed No responses</strong> ('+Math.round(sv.no/sv.responded*100)+'% of respondents) â€” these members stated they have not had the relevant discussion. Highest priority for intervention.';

  // AWV
  document.getElementById('hos-dd-awv-bar').style.width=m.awv.pct+'%';
  document.getElementById('hos-dd-awv-pct').textContent=m.awv.pct+'%';
  document.getElementById('hos-dd-awv-note').textContent=m.awv.note;

  // Questions
  document.getElementById('hos-dd-questions').innerHTML=(m.questions||[]).map(q=>{
    const qc=q.pct<(m.cut4)?'#dc2626':q.pct<(m.cut4+3)?'#d97706':'#1D9E75';
    return `<tr><td style="font-size:12px;line-height:1.5">${q.q}</td><td style="font-size:11px;color:#9ca3af">${q.proxy}</td><td style="font-size:11px">${q.rule}</td><td style="text-align:right;font-weight:700;color:${qc};font-size:13px">${q.pct}%</td></tr>`;
  }).join('');

  // Actions
  document.getElementById('hos-dd-actions').innerHTML=(m.actions||[]).map((a,i)=>`
    <div class="hos-int-card"><div class="hos-int-rank">${i+1}</div><div class="hos-int-body"><div class="hos-int-title"><span class="hos-chip hos-chip-blue" style="margin-right:6px">${a.team}</span><span style="font-size:11px;color:#9ca3af">${a.sub}</span></div><div class="hos-int-desc">${a.txt}</div><div style="display:flex;gap:8px;align-items:center"><span class="hos-chip ${statusChip(a.status)}">${a.status}</span>${a.lift?'<span style="font-size:11px;font-weight:700;color:#1D9E75;background:#f0fdf4;padding:2px 7px;border-radius:4px">'+a.lift+'</span>':''}</div></div></div>`).join('');

  hosNav('deepdive');
  hosFetchMembers();
  hosFetchProviders();
};

// â”€â”€ Fetch Members â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function hosFetchMembers(page){
  page=page||1;hosMembersPage=page;
  return fetch('/api/hos/members?contract_id='+hosContractId()+'&measure_id='+hosCurrentMeasure+'&page='+page+'&page_size=25').then(r=>{if(!r.ok)throw new Error('HOS members '+r.status);return r.json();}).then(d=>{
    hosMembers=d.members||[];
    hosMembersTotal=d.total||0;
    hosRenderGapStats();
    hosRenderCareTbody();
    hosRenderOutTbody();
    hosRenderUrgencyEngine();
  }).catch(e=>{console.error('HOS members fetch error',e);});
}

function hosRenderGapStats(){
  const el=document.getElementById('hos-gap-stats');
  if(!el)return;
  const m=hosMeasures[hosCurrentMeasure];
  const openGap=m?m.open_gap:hosMembersTotal;
  const reached=hosMembers.filter(m=>m.status==='Complete'||m.status==='In progress').length;
  const pending=hosMembers.filter(m=>m.status==='Not started'||m.status==='Scheduled').length;
  const complete=hosMembers.filter(m=>m.status==='Complete').length;
  el.innerHTML=`
    <div style="text-align:center"><div style="font-size:16px;font-weight:800;color:#dc2626">${openGap.toLocaleString()}</div><div style="font-size:9px;color:#9ca3af;font-weight:700">OPEN GAP</div></div>
    <div style="text-align:center"><div style="font-size:16px;font-weight:800;color:#1D9E75">${reached}</div><div style="font-size:9px;color:#9ca3af;font-weight:700">REACHED</div></div>
    <div style="text-align:center"><div style="font-size:16px;font-weight:800;color:#d97706">${pending}</div><div style="font-size:9px;color:#9ca3af;font-weight:700">PENDING</div></div>
    <div style="text-align:center"><div style="font-size:16px;font-weight:800;color:#1D9E75">${complete}</div><div style="font-size:9px;color:#9ca3af;font-weight:700">COMPLETE</div></div>`;
  const sub=document.getElementById('hos-gap-subtitle');
  if(sub&&m)sub.textContent=m.name+' â€” '+openGap.toLocaleString()+' open gaps';
}

function hosRenderCareTbody(){
  const tbody=document.getElementById('hos-care-tbody');
  if(!tbody)return;
  const care=hosMembers.filter(m=>m.handler==='Care mgmt');
  if(!care.length){tbody.innerHTML='<tr><td colspan="9" style="text-align:center;padding:20px;color:#9ca3af">No care management members</td></tr>';return;}
  tbody.innerHTML=care.map(m=>`<tr>
    <td style="font-size:10px;color:#9ca3af">${m.id}</td>
    <td style="font-weight:600;cursor:pointer;color:#F26722" onclick="hosOpenMemberSlide('${m.id}')">${m.name}</td>
    <td><span style="font-size:10px;color:#b91c1c;background:#fef2f2;padding:2px 6px;border-radius:4px;border:1px solid #fecaca">${m.flag}</span></td>
    <td>${m.awv?'<span style="color:#1D9E75;font-size:10px;font-weight:700">âœ“ Done</span>':'<span style="color:#dc2626;font-size:10px;font-weight:700">âœ— None</span>'}</td>
    <td><span style="font-weight:700;color:${urgColor(m.urgency)}">${m.risk}</span></td>
    <td><div style="display:flex;align-items:center;gap:6px"><div class="hos-prog-track"><div class="hos-prog-fill" style="width:${m.urgency}%;background:${urgColor(m.urgency)}"></div></div><span style="font-weight:700;font-size:11px">${m.urgency}</span></div></td>
    <td style="font-size:11px;color:#6b7280">${m.assigned}</td>
    <td><span class="hos-chip ${m.status==='Complete'?'hos-chip-green':m.status==='In progress'?'hos-chip-blue':m.status==='Scheduled'?'hos-chip-amber':'hos-chip-gray'}">${m.status}</span></td>
    <td><button onclick="hosOpenCampaignModalForMember(hosMembers.find(x=>x.id==='${m.id}'))" style="font-size:10px;padding:3px 8px;border-radius:4px;border:1px solid #e5e7eb;background:#fff;color:#6b7280;cursor:pointer">+ Campaign</button></td>
  </tr>`).join('');
}

function hosRenderOutTbody(){
  const tbody=document.getElementById('hos-out-tbody');
  if(!tbody)return;
  const out=hosMembers.filter(m=>m.handler==='Outreach');
  if(!out.length){tbody.innerHTML='<tr><td colspan="8" style="text-align:center;padding:20px;color:#9ca3af">No outreach members</td></tr>';return;}
  tbody.innerHTML=out.map(m=>`<tr>
    <td style="font-size:10px;color:#9ca3af">${m.id}</td>
    <td style="font-weight:600;cursor:pointer;color:#F26722" onclick="hosOpenMemberSlide('${m.id}')">${m.name}</td>
    <td style="font-size:11px;color:#6b7280">${m.flag}</td>
    <td><span style="font-weight:700;color:${urgColor(m.urgency)}">${m.risk}</span></td>
    <td style="text-align:center;font-weight:700">${m.attempts}</td>
    <td style="font-size:11px;color:#6b7280">${m.last_contact}</td>
    <td><span class="hos-chip hos-chip-gray">${m.channel}</span></td>
    <td><span class="hos-chip ${m.status==='Complete'?'hos-chip-green':m.status==='In progress'?'hos-chip-blue':m.status==='Scheduled'?'hos-chip-amber':'hos-chip-gray'}">${m.status}</span></td>
  </tr>`).join('');
}

// â”€â”€ Fetch Providers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function hosFetchProviders(){
  fetch('/api/hos/providers?contract_id='+hosContractId()+'&measure_id='+hosCurrentMeasure).then(r=>{if(!r.ok)throw new Error('HOS providers '+r.status);return r.json();}).then(d=>{
    hosProviders=d.providers||[];
    hosRenderProvContent();
  }).catch(e=>{console.error('HOS providers fetch error',e);});
}

function hosRenderProvContent(){
  const el=document.getElementById('hos-prov-content');
  if(!el)return;
  if(!hosProviders.length){el.innerHTML='<div style="text-align:center;padding:20px;color:#9ca3af">No provider data</div>';return;}
  el.innerHTML='<div style="font-size:11px;color:#9ca3af;margin-bottom:12px">'+hosProviders.length+' providers Â· '+hosMembersTotal+' patients total</div>'+hosProviders.slice(0,8).map(p=>`
    <div style="margin-bottom:12px">
      <div style="background:#f9fafb;padding:9px 12px;border-radius:6px 6px 0 0;border:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:700;font-size:13px">${p.name}</span>
        <span style="font-size:12px;color:#6b7280">${p.patient_count} patients with open gap <span class="hos-chip hos-chip-red" style="font-size:9px;margin-left:4px">Needs action</span></span>
      </div>
      ${p.patients&&p.patients.length?'<div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 6px 6px;overflow:hidden"><table class="hos-mtbl"><thead><tr><th>Member ID</th><th>Name</th><th>Flag</th><th>Last visit</th></tr></thead><tbody>'+p.patients.map(pt=>`<tr><td style="font-size:10px;color:#9ca3af">${pt.id}</td><td style="cursor:pointer;color:#F26722;font-weight:600" onclick="hosOpenMemberSlide('${pt.id}')">${pt.name}</td><td><span style="font-size:10px;color:#b91c1c;background:#fef2f2;padding:2px 6px;border-radius:4px">${pt.flag}</span></td><td style="font-size:11px;color:#6b7280">${pt.last_visit}</td></tr>`).join('')+'</tbody></table></div>':''}
    </div>`).join('');
}

// â”€â”€ Urgency Engine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function hosRenderUrgencyEngine(){
  const m=hosMeasures[hosCurrentMeasure];
  if(!m)return;
  const factors=m.urgency_factors||[];
  const tbody=document.getElementById('hos-uf-tbody');
  if(tbody){
    if(factors.length){
      tbody.innerHTML=factors.map(f=>`<tr>
        <td style="font-weight:700">${f.factor}</td>
        <td style="text-align:center;font-weight:800;color:#2563eb">${f.weight}%</td>
        <td style="font-size:11px;color:#6b7280">${f.measured}</td>
        <td><span class="hos-chip hos-chip-gray">${f.source}</span></td>
        <td style="font-size:11px;color:#6b7280">${f.trigger}</td>
      </tr>`).join('');
    }else{
      tbody.innerHTML=`
        <tr><td style="font-weight:700">Fall history severity</td><td style="text-align:center;font-weight:800;color:#2563eb">25%</td><td style="font-size:11px;color:#6b7280">Recency and number of fall-related claims in last 24 months</td><td><span class="hos-chip hos-chip-gray">Claims Â· ICD-10 W00-W19</span></td><td style="font-size:11px;color:#6b7280">Fall claim in last 6 months, or 2+ falls</td></tr>
        <tr><td style="font-weight:700">AWV status</td><td style="text-align:center;font-weight:800;color:#2563eb">20%</td><td style="font-size:11px;color:#6b7280">Whether the member has a completed AWV in the last 12 months</td><td><span class="hos-chip hos-chip-gray">Claims Â· CPT G0438/G0439</span></td><td style="font-size:11px;color:#6b7280">No AWV in the last 12 months</td></tr>
        <tr><td style="font-weight:700">Age</td><td style="text-align:center;font-weight:800;color:#2563eb">15%</td><td style="font-size:11px;color:#6b7280">Member age â€” older members face higher risk</td><td><span class="hos-chip hos-chip-gray">Enrollment data</span></td><td style="font-size:11px;color:#6b7280">Age 80+ = maximum; 70â€“79 = high</td></tr>
        <tr><td style="font-weight:700">Comorbidities</td><td style="text-align:center;font-weight:800;color:#2563eb">15%</td><td style="font-size:11px;color:#6b7280">Conditions that increase risk</td><td><span class="hos-chip hos-chip-gray">Claims Â· ICD-10</span></td><td style="font-size:11px;color:#6b7280">2+ active comorbidities</td></tr>
        <tr><td style="font-weight:700">Mock survey response</td><td style="text-align:center;font-weight:800;color:#2563eb">10%</td><td style="font-size:11px;color:#6b7280">Pre-regulatory mock survey response</td><td><span class="hos-chip hos-chip-gray">Internal survey data</span></td><td style="font-size:11px;color:#6b7280">Answered No = high; No response = medium</td></tr>
        <tr><td style="font-weight:700">Time since last visit</td><td style="text-align:center;font-weight:800;color:#2563eb">10%</td><td style="font-size:11px;color:#6b7280">Months since last documented visit</td><td><span class="hos-chip hos-chip-gray">Claims Â· EHR</span></td><td style="font-size:11px;color:#6b7280">No visit in 6+ months</td></tr>
        <tr><td style="font-weight:700">Homebound status</td><td style="text-align:center;font-weight:800;color:#2563eb">5%</td><td style="font-size:11px;color:#6b7280">Whether member is homebound</td><td><span class="hos-chip hos-chip-gray">Claims Â· ICD-10 Z74.09</span></td><td style="font-size:11px;color:#6b7280">Active homebound = max points</td></tr>`;
    }
  }

  // Formula
  const formula=document.getElementById('hos-score-formula');
  if(formula)formula.innerHTML='Urgency Score = (Fall severity Ã— 0.25) + (No AWV Ã— 0.20) + (Age score Ã— 0.15) + (Comorbidity score Ã— 0.15) + (Mock survey Ã— 0.10) + (Visit gap Ã— 0.10) + (Homebound Ã— 0.05)<br><span style="color:#9ca3af">All sub-scores normalized to 0â€“100 before weighting. Final score rounded to nearest integer.</span>';

  // Distribution
  const high=hosMembers.filter(m=>m.urgency>=70).length;
  const med=hosMembers.filter(m=>m.urgency>=40&&m.urgency<70).length;
  const low=hosMembers.filter(m=>m.urgency<40).length;
  const total=hosMembers.length||1;
  const hp=Math.round(high/total*100),mp=Math.round(med/total*100),lp=100-hp-mp;

  const cards=document.getElementById('hos-urg-dist-cards');
  if(cards)cards.innerHTML=`
    <div class="hos-stat"><div class="hos-stat-label">High urgency (70â€“100)</div><div class="hos-stat-val" style="color:#dc2626">${high}</div><div class="hos-stat-sub">${hp}% of open gaps</div></div>
    <div class="hos-stat" style="border-top-color:#d97706"><div class="hos-stat-label">Medium urgency (40â€“69)</div><div class="hos-stat-val" style="color:#d97706">${med}</div><div class="hos-stat-sub">${mp}% of open gaps</div></div>
    <div class="hos-stat" style="border-top-color:#1D9E75"><div class="hos-stat-label">Low urgency (0â€“39)</div><div class="hos-stat-val" style="color:#1D9E75">${low}</div><div class="hos-stat-sub">${lp}% of open gaps</div></div>`;

  const bar=document.getElementById('hos-urg-dist-bar');
  if(bar)bar.innerHTML=`
    <div style="display:flex;justify-content:space-between;font-size:11px;color:#6b7280;margin-bottom:4px"><span>Score distribution across all ${total} members</span></div>
    <div style="display:flex;height:12px;border-radius:5px;overflow:hidden;gap:2px">
      <div style="width:${hp}%;background:#dc2626;border-radius:3px 0 0 3px"></div>
      <div style="width:${mp}%;background:#d97706"></div>
      <div style="width:${lp}%;background:#1D9E75;border-radius:0 3px 3px 0"></div>
    </div>
    <div style="display:flex;gap:16px;margin-top:6px;font-size:10px;color:#9ca3af">
      <span>â–  <span style="color:#dc2626">High ${hp}%</span></span>
      <span>â–  <span style="color:#d97706">Med ${mp}%</span></span>
      <span>â–  <span style="color:#1D9E75">Low ${lp}%</span></span>
    </div>`;

  const sub=document.getElementById('hos-urg-subtitle');
  if(sub){const mm=hosMeasures[hosCurrentMeasure];if(mm)sub.textContent='How the agent scores each of the '+mm.open_gap.toLocaleString()+' open-gap members to determine who gets called first';}
}

// â”€â”€ Member Slide â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
window.hosOpenMemberSlide=function(id){
  const m=hosMembers.find(x=>x.id===id);
  if(!m)return;
  window.hosCurrentMember=m;
  document.getElementById('hos-slide-name').textContent=m.name;
  document.getElementById('hos-slide-id').textContent=m.id+' Â· Age '+m.age;
  const uc=urgColor(m.urgency);
  const factors=[
    {label:'Fall history severity (25%)',score:m.flag.includes('Multiple')?95:m.flag.includes('W1')?75:55},
    {label:'No AWV (20%)',score:m.awv?0:100},
    {label:'Age (15%)',score:m.age>=80?100:m.age>=75?75:m.age>=70?50:30},
    {label:'Comorbidities (15%)',score:m.comorbidities.length>=2?90:m.comorbidities.length===1?50:10},
    {label:'Mock survey (10%)',score:m.mock_survey==='No'?100:m.mock_survey==='No response'?60:0},
    {label:'Time since visit (10%)',score:m.last_contact==='â€”'?80:40},
    {label:'Homebound (5%)',score:m.homebound?100:0},
  ];
  document.getElementById('hos-slide-body').innerHTML=`
    <div class="hos-ms-section"><div class="hos-ms-title">Urgency score</div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
        <div style="font-size:32px;font-weight:800;color:${uc}">${m.urgency}</div>
        <div><span class="hos-chip ${urgChip(m.urgency)}">${urgLabel(m.urgency)} urgency</span><div style="font-size:11px;color:#9ca3af;margin-top:3px">${(m.open_gaps||[]).join(' Â· ')}</div></div>
      </div>
      <div style="height:8px;background:#f3f4f6;border-radius:4px;overflow:hidden"><div style="height:100%;width:${m.urgency}%;background:${uc};border-radius:4px"></div></div>
    </div>
    <div class="hos-ms-section"><div class="hos-ms-title">Score breakdown</div>
      ${factors.map(f=>`<div style="margin-bottom:7px"><div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px"><span style="color:#6b7280">${f.label}</span><span style="font-weight:700">${f.score}</span></div><div style="background:#f3f4f6;border-radius:3px;height:4px;overflow:hidden"><div style="width:${f.score}%;height:100%;background:${urgColor(f.score)};border-radius:3px"></div></div></div>`).join('')}
    </div>
    <div class="hos-ms-section"><div class="hos-ms-title">Member details</div>
      <div class="hos-ms-row"><span class="hos-ms-key">AWV status</span><span class="hos-ms-val" style="color:${m.awv?'#1D9E75':'#dc2626'}">${m.awv?'âœ“ Completed':'âœ— Not completed'}</span></div>
      <div class="hos-ms-row"><span class="hos-ms-key">Risk level</span><span class="hos-ms-val">${m.risk}</span></div>
      <div class="hos-ms-row"><span class="hos-ms-key">Handler</span><span class="hos-ms-val">${m.handler}</span></div>
      <div class="hos-ms-row"><span class="hos-ms-key">Assigned to</span><span class="hos-ms-val">${m.assigned}</span></div>
      <div class="hos-ms-row"><span class="hos-ms-key">Contact attempts</span><span class="hos-ms-val">${m.attempts}</span></div>
      <div class="hos-ms-row"><span class="hos-ms-key">Last contact</span><span class="hos-ms-val">${m.last_contact}</span></div>
      <div class="hos-ms-row"><span class="hos-ms-key">Channel</span><span class="hos-ms-val">${m.channel}</span></div>
      <div class="hos-ms-row"><span class="hos-ms-key">Mock survey</span><span class="hos-ms-val" style="color:${m.mock_survey==='No'?'#dc2626':m.mock_survey==='Yes'?'#1D9E75':'#d97706'}">${m.mock_survey}</span></div>
      <div class="hos-ms-row"><span class="hos-ms-key">Last provider visit</span><span class="hos-ms-val">${m.last_visit}</span></div>
      <div class="hos-ms-row"><span class="hos-ms-key">Homebound</span><span class="hos-ms-val">${m.homebound?'âš  Yes':'No'}</span></div>
      <div class="hos-ms-row"><span class="hos-ms-key">Active comorbidities</span><span class="hos-ms-val">${m.comorbidities.length?m.comorbidities.join(', '):'None flagged'}</span></div>
    </div>
    <div class="hos-ms-section"><div class="hos-ms-title">Open HOS gaps</div>
      ${(m.open_gaps||[]).map(g=>`<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:8px 12px;margin-bottom:6px;font-size:12px;color:#b91c1c">âš  ${g} â€” no documented discussion in last 12 months</div>`).join('')}
    </div>
    <div class="hos-ms-section"><div class="hos-ms-title">Flag reason</div><div style="font-size:12px;color:#6b7280;background:#f3f4f6;border-radius:6px;padding:10px 12px">${m.flag}</div></div>
    <div style="margin-top:4px"><button class="btn-primary" style="width:100%;padding:10px" onclick="hosOpenCampaignModalForMember(hosCurrentMember)">+ Create intervention campaign for this member</button></div>`;

  document.getElementById('hos-member-slide').classList.add('open');
  document.getElementById('hos-slide-overlay').style.display='block';
};

window.hosCloseMemberSlide=function(){
  document.getElementById('hos-member-slide').classList.remove('open');
  document.getElementById('hos-slide-overlay').style.display='none';
};

// â”€â”€ Campaign Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
window.hosOpenCampaignModal=function(member){
  window.hosCurrentMember=member;
  document.getElementById('hos-campaign-modal-member').textContent=member?member.name+' Â· '+member.id:'General campaign â€” not tied to specific member';
  document.getElementById('hos-c-date').value=new Date(Date.now()+14*86400000).toISOString().split('T')[0];
  document.getElementById('hos-campaign-modal').classList.add('open');
};

window.hosOpenCampaignModalForMember=function(member){
  hosCloseMemberSlide();
  hosOpenCampaignModal(member);
};

window.hosCloseCampaignModal=function(){
  document.getElementById('hos-campaign-modal').classList.remove('open');
};

window.hosSaveCampaign=function(){
  const item={
    member:window.hosCurrentMember?window.hosCurrentMember.name:'General',
    memberId:window.hosCurrentMember?window.hosCurrentMember.id:'â€”',
    type:document.getElementById('hos-c-type').value,
    team:document.getElementById('hos-c-team').value,
    priority:document.getElementById('hos-c-priority').value,
    date:document.getElementById('hos-c-date').value,
    lift:document.getElementById('hos-c-lift').value||'TBD',
    notes:document.getElementById('hos-c-notes').value
  };
  hosWorklist.push(item);
  hosCloseCampaignModal();
  hosRenderWorklist();
  const badge=document.getElementById('hos-wl-badge');
  if(badge)badge.textContent=hosWorklist.length;
  hosShowToast('Campaign saved to worklist');
};

function hosRenderWorklist(){
  const el=document.getElementById('hos-wl-list');
  if(!el)return;
  if(!hosWorklist.length){el.innerHTML='<div style="font-size:12px;color:#9ca3af;text-align:center;padding:14px;background:#f9fafb;border-radius:6px">No campaigns created yet.</div>';return;}
  el.innerHTML=hosWorklist.map(w=>`
    <div class="hos-wl-item">
      <div style="font-weight:600;flex:1;min-width:100px">${w.member}</div>
      <span style="font-size:10px;color:#9ca3af">${w.memberId}</span>
      <span class="hos-chip hos-chip-gray">${w.type.split('â€”')[0].trim()}</span>
      <span class="hos-chip hos-chip-blue">${w.team}</span>
      <span class="hos-chip ${w.priority==='High'?'hos-chip-red':w.priority==='Medium'?'hos-chip-amber':'hos-chip-green'}">${w.priority}</span>
      <span class="hos-chip hos-chip-gray">${w.date}</span>
      <span style="font-size:10px;color:#1D9E75;font-weight:700">${w.lift}</span>
    </div>`).join('');
}

// â”€â”€ Toast â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function hosShowToast(msg){
  const t=document.getElementById('hos-toast');
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}

// â”€â”€ Init â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
window.hosInitPage=function(){
  hosLoaded=true;
  hosMeasures={};hosMembers=[];hosSummary={};
  Promise.all([hosFetchSummary(),hosFetchMeasures()]).then(()=>{
    hosCurrentMeasure='fall';
    hosFetchMembers();
    hosFetchProviders();
  }).catch(e=>console.error('HOS init failed',e));
};

})();


