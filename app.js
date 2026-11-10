/*!
 * CareBoard AI — application script (vanilla JavaScript, no build step)
 *
 * Structure of this file
 *   1. Storage + i18n (English / Arabic, RTL)
 *   2. Demo data: 10 fictional inpatients, imaging, timed tasks, nursing scores
 *   3. Clinical calculators (CALCS): each has inputs, bands, source, version
 *   4. Trust layer ("Why" registry) and built-in explanation engine
 *   5. Views: ward board, patient summary, CareBoard AI, calculators,
 *      smart handover, hospital intelligence, access and trust
 *   6. Rendering and event handling
 *
 * All patient data is fictional. No data leaves the browser; edits are kept
 * in localStorage on the viewer's device only.
 */
"use strict";
/* ---------------- storage ---------------- */
const store={get(k,d){try{const v=localStorage.getItem("cb3_"+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem("cb3_"+k,JSON.stringify(v))}catch(e){}}};

/* ---------------- i18n ---------------- */
const T={
en:{host:"Demo General Hospital · Hospital EHR",patient:"Patient",user:"Dr. Kamel Azhar, Consultant, Family Medicine Team B",
 g_patient:"Patient",g_hospital:"Hospital",nav_ehr:"Patient summary",nav_cb:"CareBoard AI",nav_calc:"Clinical calculators",nav_ho:"Smart handover",nav_radar:"Hospital intelligence",nav_gov:"Access and trust",nav_biz:"Go-to-market",
 summary:"Summary",results:"Results",orders:"Orders",medications:"Medications",notes:"Notes",careplan:"Care plan",
 allergies:"Allergies",code:"Code status",los:"Admission day",exposure:"Exposure history",
 vitals:"Vitals",vitals_sub:"Latest set with change since 06:00",problems:"Problems and key complaints",complaints:"Key complaints",history:"Background",res_box:"Recent results",meds_box:"Current medications",imaging:"Imaging",cds:"Clinical decision support to-dos",soap:"SOAP note",
 layer:"CareBoard layer",layerOn:"On",layerOff:"Off",cbPanelSub:"Intelligence layer over this record",openCB:"Open full CareBoard view",
 nursing:"Nursing notes",nursing_sub:"Important points recorded by nursing this shift",changes:"Recent changes",changes_sub:"New or worsening since last medical review at 08:00",matters:"New updates",matters_sub:"Latest items that need attention this hour",open:"Still open",open_sub:"Items waiting for follow-up or results",
 causes:"Reversible cause intelligence",causes_sub:"Ranked by weight of evidence in the chart. Supports clinical judgment; it does not diagnose.",support:"Supporting",against:"Against",missingInfo:"Missing information",investigate:"Suggested next step",evidence:"Evidence weight",
 ask:"Ask CareBoard",askSub:"Live AI answers only from this chart. Name and MRN are never sent.",askPh:"Ask about this patient…",send:"Ask",stop:"Stop",
 why:"Why",whyTitle:"Why CareBoard shows this",src:"Source data",rule:"Rule or guideline",type:"How it was produced",det:"Deterministic rule on chart data",aiGen:"AI-generated, clinician must verify",close:"Close",
 calc_title:"Auto clinical calculators",calc_sub:"Scores fill from chart data. Every input, formula source and version is visible. Missing data is flagged, never guessed.",
 all:"All",core:"Core inpatient",er:"Emergency",cardio:"Cardiology",icu:"ICU",peds:"Pediatric ICU",applicable:"Applies to this patient",notApplicable:"Not applicable to this patient",
 chartData:"Chart data",autoCalc:"Auto-calculated from chart",keyInputs:"Key inputs from chart",sourceData:"View source data",explain:"Explain for this patient",approved:"Hospital approved",lastVerified:"Last verified",version:"Version",source:"Source",
 updates:"Guideline and protocol updates",updates_sub:"CareBoard monitors major guideline publishers. Changes are shown for review and are never applied automatically.",pendingReview:"Pending hospital review",
 legendHigh:"High risk / act now",legendMed:"Moderate / review",legendLow:"Low",legendInfo:"Information",legendNA:"Not applicable",
 high:"High risk",med:"Moderate",low:"Low risk",lowmed:"Low–medium",na:"Not applicable",partial:"Partial",
 ho_title:"Smart handover",ho_sub:"Auto-prepared from live chart data. Structured with I-PASS. Verified by a clinician before it is handed over.",myPts:"My patients",allWards:"All wards",
 changed:"What changed",done:"What was done",todo:"To-do and plan changes",contingency:"If this happens",illness:"Illness severity",snapshot:"Snapshot",
 draft:"Auto-draft handover",verify:"Mark as verified",verifiedBy:"Verified by",edit:"Edit handover",readback:"Receiver read-back completed",lastUpdated:"Last updated",
 det_s:"Deteriorating",watch_s:"Watch",stable_s:"Stable",unstable:"Unstable",watcher:"Watcher",stableI:"Stable",
 locked:"Not on your care team",lockedSub:"CareBoard shows a patient only to their assigned care team. In an emergency you can request time-limited access. Every access is logged.",reason:"Clinical reason for emergency access",request:"Request emergency access",accessLeft:"Emergency access active",remaining:"remaining",endAccess:"End access",
 radar_title:"Hospital intelligence",radar_sub:"Finds patterns no single clinician can see across wards. Built for Hajj and Umrah surge seasons.",
 gov_title:"Access and trust",gov_sub:"Who can see what, why each item is shown, and how data stays protected.",
 biz_title:"Go-to-market",
 aiUnavailable:"",aiDenied:"Live AI was not allowed in this view. The scripted content above is still accurate.",aiRate:"Too many AI requests. Wait a minute, then try again.",aiErr:"Live AI could not answer right now. Try again.",thinking:"Thinking…",aiNote:"Built from chart data and published guidelines. Verify before acting.",
 savedVerified:"Handover verified",copied:"Copied",accessGranted:"Emergency access granted for 30 minutes and logged",
},
ar:{host:"مستشفى تجريبي عام · السجل الصحي الإلكتروني",patient:"المريض",user:"د. كامل أزهر، استشاري، طب الأسرة فريق ب",
 g_patient:"المريض",g_hospital:"المستشفى",nav_ehr:"ملخص المريض",nav_cb:"كيربورد AI",nav_calc:"الحاسبات السريرية",nav_ho:"التسليم الذكي",nav_radar:"ذكاء المستشفى",nav_gov:"الوصول والثقة",nav_biz:"استراتيجية السوق",
 summary:"الملخص",results:"النتائج",orders:"الطلبات",medications:"الأدوية",notes:"الملاحظات",careplan:"خطة الرعاية",
 allergies:"الحساسية",code:"حالة الإنعاش",los:"يوم التنويم",exposure:"تاريخ التعرض",
 vitals:"العلامات الحيوية",vitals_sub:"آخر قراءة مع التغير منذ 06:00",problems:"المشكلات والشكاوى الرئيسية",complaints:"الشكاوى الرئيسية",history:"التاريخ المرضي",res_box:"أحدث النتائج",meds_box:"الأدوية الحالية",imaging:"الأشعة",cds:"مهام دعم القرار السريري",soap:"ملاحظة SOAP",
 layer:"طبقة كيربورد",layerOn:"تشغيل",layerOff:"إيقاف",cbPanelSub:"طبقة ذكاء فوق هذا السجل",openCB:"فتح عرض كيربورد الكامل",
 nursing:"ملاحظات التمريض",nursing_sub:"أهم ما سجله التمريض في هذه المناوبة",changes:"التغيرات الأخيرة",changes_sub:"جديد أو متفاقم منذ آخر مراجعة طبية الساعة 08:00",matters:"التحديثات الجديدة",matters_sub:"أحدث العناصر التي تحتاج انتباهًا خلال هذه الساعة",open:"ما زال معلقًا",open_sub:"عناصر بانتظار متابعة أو نتائج",
 causes:"تحليل الأسباب القابلة للعكس",causes_sub:"مرتبة حسب قوة الأدلة في الملف. تدعم الحكم السريري ولا تُشخّص.",support:"يدعم",against:"يعارض",missingInfo:"معلومات ناقصة",investigate:"الخطوة المقترحة",evidence:"قوة الدليل",
 ask:"اسأل كيربورد",askSub:"الذكاء الاصطناعي يجيب من هذا الملف فقط. لا يُرسل الاسم أو رقم الملف أبدًا.",askPh:"اسأل عن هذا المريض…",send:"اسأل",stop:"إيقاف",
 why:"لماذا",whyTitle:"لماذا يعرض كيربورد هذا",src:"بيانات المصدر",rule:"القاعدة أو الإرشاد",type:"طريقة الإنتاج",det:"قاعدة ثابتة على بيانات الملف",aiGen:"مولّد بالذكاء الاصطناعي، يجب أن يتحقق الطبيب",close:"إغلاق",
 calc_title:"الحاسبات السريرية التلقائية",calc_sub:"تُحسب الدرجات من بيانات الملف. كل مدخل ومصدر وإصدار ظاهر. البيانات الناقصة تُعلَّم ولا تُخمَّن.",
 all:"الكل",core:"أساسي للتنويم",er:"الطوارئ",cardio:"القلب",icu:"العناية المركزة",peds:"عناية الأطفال",applicable:"تنطبق على هذا المريض",notApplicable:"لا تنطبق على هذا المريض",
 chartData:"بيانات الملف",autoCalc:"محسوبة تلقائيًا من الملف",keyInputs:"المدخلات الرئيسية من الملف",sourceData:"عرض بيانات المصدر",explain:"اشرح لهذا المريض",approved:"معتمدة من المستشفى",lastVerified:"آخر تحقق",version:"الإصدار",source:"المصدر",
 updates:"تحديثات الإرشادات والبروتوكولات",updates_sub:"يتابع كيربورد ناشري الإرشادات الرئيسيين. تُعرض التغييرات للمراجعة ولا تُطبّق تلقائيًا أبدًا.",pendingReview:"بانتظار مراجعة المستشفى",
 legendHigh:"خطورة عالية / تدخل الآن",legendMed:"متوسطة / مراجعة",legendLow:"منخفضة",legendInfo:"معلومة",legendNA:"لا تنطبق",
 high:"خطورة عالية",med:"متوسطة",low:"منخفضة",lowmed:"منخفضة–متوسطة",na:"لا تنطبق",partial:"جزئية",
 ho_title:"التسليم الذكي",ho_sub:"يُعد تلقائيًا من بيانات الملف المباشرة وفق نموذج I-PASS، ويتحقق منه الطبيب قبل التسليم.",myPts:"مرضاي",allWards:"كل الأجنحة",
 changed:"ما الذي تغيّر",done:"ما تم إنجازه",todo:"المهام وتغييرات الخطة",contingency:"خطة الطوارئ",illness:"شدة الحالة",snapshot:"لمحة سريعة",
 draft:"صياغة التسليم تلقائيًا",verify:"تأكيد التحقق",verifiedBy:"تم التحقق بواسطة",edit:"تعديل التسليم",readback:"أكمل المستلم إعادة القراءة",lastUpdated:"آخر تحديث",
 det_s:"متدهور",watch_s:"تحت المراقبة",stable_s:"مستقر",unstable:"غير مستقر",watcher:"تحت المراقبة",stableI:"مستقر",
 locked:"ليس ضمن فريق الرعاية الخاص بك",lockedSub:"يعرض كيربورد المريض لفريق رعايته فقط. في الطوارئ يمكنك طلب وصول مؤقت، ويُسجَّل كل وصول.",reason:"السبب السريري للوصول الطارئ",request:"طلب وصول طارئ",accessLeft:"وصول طارئ نشط",remaining:"متبقٍ",endAccess:"إنهاء الوصول",
 radar_title:"ذكاء المستشفى",radar_sub:"يكتشف أنماطًا عبر الأجنحة لا يراها طبيب واحد. مصمم لمواسم الحج والعمرة.",
 gov_title:"الوصول والثقة",gov_sub:"من يرى ماذا، ولماذا يظهر كل عنصر، وكيف تبقى البيانات محمية.",
 biz_title:"استراتيجية دخول السوق",
 aiUnavailable:"",aiDenied:"لم يُسمح بالذكاء الاصطناعي في هذا العرض. المحتوى أعلاه ما زال دقيقًا.",aiRate:"طلبات كثيرة. انتظر دقيقة ثم حاول مجددًا.",aiErr:"تعذر الرد الآن. حاول مرة أخرى.",thinking:"جارٍ التفكير…",aiNote:"مبني على بيانات الملف والإرشادات المنشورة. تحقق قبل التصرف.",
 savedVerified:"تم التحقق من التسليم",copied:"تم النسخ",accessGranted:"مُنح وصول طارئ لمدة 30 دقيقة وتم تسجيله",
}};
let lang=store.get("lang","en");
const t=k=>(T[lang]&&T[lang][k])||T.en[k]||k;
const L=o=>typeof o==="string"?o:(o[lang]||o.en);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

Object.assign(T.en,{surg:"Surgery",nurs:"Nursing and safety",nav_board:"Ward board",g_ward:"Ward",board_sub:"Every patient on one screen, sickest first. Tap a row to open the patient.",kp_pts:"Patients",kp_hi:"NEWS2 ≥7",kp_med:"NEWS2 5–6",kp_over:"Overdue",kp_pend:"Pending results",c_bed:"Bed",c_pt:"Patient",c_news:"NEWS2",c_issue:"Top issue now",c_counts:"Activity",c_st:"Status",overdue:"Overdue and due soon",pendRes:"Pending results",noIssue:"No new issues",roleNote:"One shared board for consultants, registrars, residents and interns. Alerts are never dismissed by one user; they clear only when the chart changes, and completed tasks show who did them.",changesK:"Changes",openK:"Open",pendK:"Pending",overBy:"overdue by",dueIn:"due in",lockedRow:"Patient on another team",pulm:"Pulmonology",renal:"Nephrology",gi:"Hepatology and GI",endo:"Endocrinology",heme:"Haematology and VTE",id:"Infectious disease",neuro:"Neurology",obs:"Obstetrics"});
Object.assign(T.ar,{surg:"الجراحة",nurs:"التمريض والسلامة",nav_board:"لوحة الجناح",g_ward:"الجناح",board_sub:"كل المرضى في شاشة واحدة، الأشد خطورة أولًا. اضغط على الصف لفتح ملف المريض.",kp_pts:"المرضى",kp_hi:"NEWS2 ≥7",kp_med:"NEWS2 5–6",kp_over:"متأخر",kp_pend:"نتائج معلقة",c_bed:"السرير",c_pt:"المريض",c_news:"NEWS2",c_issue:"أهم مشكلة الآن",c_counts:"النشاط",c_st:"الحالة",overdue:"المتأخر وما يستحق قريبًا",pendRes:"النتائج المعلقة",noIssue:"لا مشكلات جديدة",roleNote:"لوحة واحدة مشتركة للاستشاريين والأخصائيين والمقيمين والمتدربين. لا يستطيع مستخدم واحد إخفاء تنبيه؛ يختفي فقط عند تغيّر بيانات الملف، وتُظهر المهام المنجزة من أنجزها.",changesK:"تغيرات",openK:"معلق",pendK:"نتائج",overBy:"متأخر",dueIn:"يستحق خلال",lockedRow:"مريض في فريق آخر",pulm:"الصدرية",renal:"الكلى",gi:"الكبد والجهاز الهضمي",endo:"الغدد الصماء",heme:"الدم والجلطات",id:"الأمراض المعدية",neuro:"الأعصاب",obs:"التوليد"});
/* ---------------- patients (fictional demo data) ---------------- */
const NOW="06 Nov 2026";
const P=[
{id:"p1",name:"Faisal Al-Harbi",nameAr:"فيصل الحربي",mrn:"784512",age:56,sex:"M",bed:"12",ward:"Medical Ward 3",team:"B",los:2,status:"det",dx:"Pneumonia, worsening oxygenation",
 allergies:[{a:"Penicillin",r:"Childhood rash (patient report)"}],code:"Full code",wt:78,ht:172,
 exposure:"Returned from Umrah (Makkah) 6 days ago. Camel contact not documented.",
 complaints:["Productive cough for 4 days","Fever","Shortness of breath, worse since 14:00","Right-sided pleuritic chest pain"],
 history:["Type 2 diabetes","Hypertension"],
 f:{pneumonia:1,htn:1,dm:1,immob:1,resp:1,infect:1,aki:1,adm:"medical"},
 times:["06:00","10:00","14:00","18:00"],
 tr:{t:[37.8,38.1,38.6,38.4],hr:[92,98,104,108],sbp:[124,118,104,96],dbp:[76,72,64,58],rr:[18,20,22,24],spo2:[96,94,91,90],o2:[0,2,4,4]},
 v:{avpu:"A",gcs:15,fio2:.36,o2dev:"4 L/min nasal cannula"},
 lab:{wbc:16.2,crp:185,lac:2.4,cr:1.6,na:134,k:4.6,cl:100,hco3:19,alb:2.9,urea:9.1,glu:14.2,hb:128,hct:38,plt:210,ph:7.33,pao2:58},
 prev:{wbc:11.0,crp:96,lac:1.8,cr:1.1},labT:"17:30",prevT:"yesterday 07:00",
 meds:[["Piperacillin/tazobactam","4.5 g IV every 6 h","active"],["Azithromycin","500 mg IV daily","active"],["Paracetamol","1 g PO every 6 h PRN, max 4 g/day","active"],["Insulin glargine","20 units SC at night + correction scale","active"],["Amlodipine","5 mg PO daily","active"],["Metformin","1 g PO twice daily","held"]],
 imaging:[["Chest X-ray","Day 1, 21:40","Right lower lobe consolidation. No pleural effusion.",0],["Chest X-ray (repeat)","Requested 16:00","Pending",1]],
 soap:{s:"Breathlessness worse since this afternoon. Cough with yellow sputum. Right-sided pain on deep breathing.",o:"T 38.4 °C, HR 108, BP 96/58, RR 24, SpO₂ 90% on 4 L/min. Crackles and reduced air entry at right base. Urine output 20 mL/h for 3 h.",a:"Right lower lobe pneumonia with worsening oxygenation and falling blood pressure on day 2 of antibiotics. Creatinine rising.",p:"Continue antibiotics. Repeat chest X-ray and ABG. 500 mL crystalloid bolus. Respiratory team review. Escalate to ICU outreach if SpO₂ under 90% on 6 L/min.",by:"Dr. Kamel Azhar",tm:"Today 16:20"},
 nursing:[
  ["18:10","RN Huda Al-Shehri","SpO₂ fell to 88% on 2 L/min. Oxygen increased to 4 L/min, now 90%. Using accessory muscles.","red"],
  ["16:40","RN Huda Al-Shehri","Urine output 20 mL/h for the last 3 h (60 mL total). Bladder scan 90 mL.","red"],
  ["15:00","RN Huda Al-Shehri","Right-sided chest pain on breathing in, 6/10. Paracetamol given.","amber"],
  ["13:20","RN Huda Al-Shehri","Ate about 25% of lunch. Capillary glucose 14.2 mmol/L, correction insulin given.","amber"],
  ["11:00","RN Huda Al-Shehri","Son Abdulrahman is main family contact and asked for an update on the plan.",""]],
 changes:[
  ["SpO₂ 96% on room air → 90% on 4 L/min","red",["Vitals 06:00–18:00","Nursing note 18:10"],"Desaturation with rising oxygen need"],
  ["NEWS2 rose from 1 to 11","red",["Vitals 06:00–18:00"],"NEWS2 ≥7 calls for an emergency response (RCP, 2017)"],
  ["Systolic BP 124 → 96 mmHg, HR 92 → 108","red",["Vitals 06:00–18:00"],"Falling BP with rising HR"],
  ["WBC 11.0 → 16.2 ×10⁹/L, CRP 96 → 185 mg/L","amber",["Labs yesterday 07:00","Labs 17:30"],"Rising inflammatory markers"],
  ["Creatinine 97 → 141 µmol/L, urine output 20 mL/h","amber",["Labs 17:30","Nursing note 16:40"],"KDIGO AKI stage 1: rise ≥26.5 µmol/L within 48 h"],
  ["Lactate 1.8 → 2.4 mmol/L","amber",["Labs 17:30"],"Lactate >2 mmol/L: remeasure (Surviving Sepsis Campaign, 2021)"]],
 matters:[
  ["Urgent senior and critical care outreach review","red",["NEWS2 11 at 18:00"],"RCP NEWS2: score ≥7 needs emergency assessment by a critical-care-competent team"],
  ["Reassess for sepsis: fluid response, repeat lactate","red",["BP 96/58","HR 108","Lactate 2.4 mmol/L","Urine 20 mL/h"],"Surviving Sepsis Campaign 2021: remeasure lactate when initial >2 mmol/L; assess fluid responsiveness"],
  ["Penicillin allergy recorded while on piperacillin/tazobactam","amber",["Allergy list","Medication record"],"Piperacillin is a penicillin. Confirm reaction history; low-risk histories may be delabelled per allergy pathway"],
  ["No VTE prophylaxis ordered, Padua score 5","amber",["Order list","Padua inputs"],"Padua ≥4 = high VTE risk in medical inpatients (Barbar 2010); consider prophylaxis if no bleeding contraindication (ASH 2018)"]],
 open:[
  ["Blood cultures from day 1 — no result yet","amber",["Lab orders day 1 20:15"],"Open result older than 24 h"],
  ["Repeat chest X-ray requested 16:00 — not done","amber",["Imaging order 16:00"],"Open imaging order"],
  ["Respiratory team review requested 15:30 — not seen","amber",["Consult order 15:30"],"Open consult"],
  ["MERS-CoV risk assessment not documented after Umrah travel","amber",["Exposure history","Admission note"],"Saudi MOH MERS-CoV guidance: assess febrile respiratory illness with relevant travel or exposure"]],
 done:["Antibiotics continued (piperacillin/tazobactam + azithromycin)","Oxygen increased 2 → 4 L/min","500 mL crystalloid bolus given 16:45","ABG taken 17:30"],
 todo:[["Critical care outreach review now","Night registrar","19:00"],["Repeat lactate after fluid bolus","Night resident","19:30"],["Chase repeat CXR and respiratory review","Night resident","20:00"],["Confirm penicillin reaction history with patient and family","Day team","Tomorrow 09:00"],["Decide on VTE prophylaxis","Night registrar","21:00"],["Hold amlodipine while SBP under 100","Night resident","Now"],["Respiratory PCR panel including MERS-CoV, droplet precautions","Night resident","19:30"]],
 contingency:["If SpO₂ under 90% on 6 L/min or RR above 30: call ICU outreach (ext. 4411)","If SBP under 90 mmHg after fluids: senior review for vasopressor pathway","If urine output under 0.5 mL/kg/h for 6 h (under 39 mL/h): renal review"],
 cds:[
  ["Allergy–drug conflict: penicillin allergy vs piperacillin/tazobactam","Confirm reaction type; keep or switch per allergy pathway",["Allergy list","MAR"],"Drug class match: piperacillin is a penicillin"],
  ["VTE prophylaxis not ordered (Padua 5, high risk)","Consider enoxaparin if no bleeding contraindication",["Padua inputs","Order list"],"Padua ≥4 high risk (Barbar 2010); ASH 2018 medical inpatients"],
  ["Amlodipine still active with SBP 96 mmHg","Consider holding while hypotensive",["MAR","Vitals 18:00"],"Antihypertensive with SBP <100 mmHg"],
  ["AKI stage 1: review nephrotoxins and doses","Cockcroft–Gault CrCl ≈57 mL/min: current piperacillin dose suitable; recheck if creatinine rises",["Creatinine 1.6 mg/dL","Weight 78 kg","Age 56"],"KDIGO 2012; CrCl = (140 − age) × weight / (72 × SCr)"],
  ["Repeat lactate in 2–6 h","Initial lactate above 2 mmol/L",["Lactate 2.4 mmol/L 17:30"],"Surviving Sepsis Campaign 2021"]],
 causes:[
  {c:"Progressing pneumonia or inadequate microbial coverage",w:4,s:["Fever persists at 36 h","WBC 11.0 → 16.2","CRP 96 → 185","Oxygen need rising"],a:["Under 48 h of antibiotics is early to call treatment failure"],m:["Blood culture result","Sputum culture","Urinary pneumococcal and Legionella antigens"],n:["Chase cultures; review resistant-organism risk factors"]},
  {c:"Sepsis-related hypoperfusion or hypovolaemia",w:4,s:["SBP 124 → 96","HR 108","Lactate 2.4","Urine 20 mL/h","Poor oral intake"],a:["Mentation normal (GCS 15)"],m:["Fluid balance chart","Capillary refill","Response to 500 mL bolus"],n:["Assess fluid responsiveness; repeat lactate"]},
  {c:"Viral co-infection (influenza, SARS-CoV-2, MERS-CoV)",w:3,s:["Umrah travel 6 days ago","Hospital respiratory cluster signal under review"],a:["Lobar consolidation favours bacterial cause"],m:["Respiratory PCR panel","Camel and sick-contact exposure"],n:["Send respiratory PCR including MERS-CoV; droplet precautions while pending"]},
  {c:"Parapneumonic effusion or empyema",w:2,s:["Pleuritic pain","Reduced air entry at right base"],a:["No effusion on day-1 CXR"],m:["Repeat CXR","Point-of-care lung ultrasound"],n:["Repeat imaging today"]},
  {c:"Pulmonary embolism",w:2,s:["Tachycardia and hypoxia","Immobile, Padua 5","No VTE prophylaxis"],a:["Fever and consolidation explain most findings"],m:["Leg examination","Clinical pretest assessment (D-dimer less useful in infection)"],n:["Clinician pretest assessment; CT pulmonary angiography only if probability is high"]}],
 heart:null,wells:{dvt:0,likely:0,hemo:0},uo:"20 mL/h for 3 h",medFlags:{"Piperacillin/tazobactam":["red","Penicillin allergy recorded: confirm reaction"],"Amlodipine":["amber","SBP 96 mmHg: consider holding"],"Metformin":["amber","Held for AKI and raised lactate"]}},
{id:"p2",name:"Aisha Khan",nameAr:"عائشة خان",mrn:"661239",age:72,sex:"F",bed:"08",ward:"Medical Ward 3",team:"B",los:4,status:"stable",dx:"Heart failure, new atrial fibrillation",
 allergies:[],code:"Full code",wt:70,ht:158,exposure:"No recent travel.",
 complaints:["Breathlessness on exertion","Ankle swelling","Palpitations"],history:["Heart failure with reduced EF (35%)","Hypertension"],
 f:{af:1,chf:1,htn:1,resp:0,adm:"medical",immob:0},
 times:["06:00","10:00","14:00","18:00"],tr:{t:[36.7,36.8,36.9,36.8],hr:[96,92,90,88],sbp:[124,126,130,128],dbp:[74,76,78,76],rr:[18,18,17,18],spo2:[95,95,96,95],o2:[0,0,0,0]},
 v:{avpu:"A",gcs:15,fio2:.21,o2dev:"Room air"},
 lab:{wbc:7.2,crp:8,cr:1.2,na:136,k:4.1,cl:102,hco3:25,alb:3.6,urea:8.4,glu:6.1,hb:118,hct:35,plt:240,ntbnp:1450},prev:{cr:1.3,ntbnp:2800},labT:"07:00",prevT:"2 days ago",
 meds:[["Furosemide","40 mg IV twice daily","active"],["Bisoprolol","2.5 mg PO daily","active"],["Ramipril","2.5 mg PO daily","active"]],
 imaging:[["Echocardiogram","Day 2","LVEF 35%, dilated left atrium.",0]],
 soap:{s:"Breathing easier. Palpitations less frequent.",o:"HR 88 irregular, BP 128/76, SpO₂ 95% room air. Weight down 1.8 kg since admission.",a:"Heart failure improving with diuresis. New AF, rate controlled.",p:"Continue diuresis, daily weights. Decide on anticoagulation.",by:"Dr. Kamel Azhar",tm:"Today 10:10"},
 nursing:[["14:00","RN Mona Al-Ghamdi","Weight 68.2 kg (−1.8 kg). Fluid balance −1.2 L in 24 h.",""],["09:30","RN Mona Al-Ghamdi","Mild dizziness on standing, resolved after sitting.","amber"]],
 changes:[["NT-proBNP 2800 → 1450 pg/mL","green",["Labs 2 days ago","Labs 07:00"],"Falling natriuretic peptide"],["Weight −1.8 kg since admission","green",["Nursing note 14:00"],"Diuresis response"]],
 matters:[["Anticoagulation decision for new AF: CHA₂DS₂-VA 3","amber",["Problem list","Age 72"],"ESC 2024: oral anticoagulation recommended for CHA₂DS₂-VA ≥2"]],
 open:[["Bleeding risk assessment before anticoagulation","amber",["Order list"],"Assess modifiable bleeding risks (ESC 2024)"]],
 done:["IV furosemide continued","Rate control with bisoprolol"],
 todo:[["Discuss anticoagulation with patient","Day team","Tomorrow 10:00"],["Consider switch to oral furosemide if weight stable","Day team","Tomorrow"]],
 contingency:["If HR above 130 at rest: ECG and senior review","If orthostatic symptoms persist: review diuretic dose"],
 cds:[["CHA₂DS₂-VA 3 and no anticoagulant ordered","Discuss oral anticoagulation (ESC 2024)",["Problem list","Age","Order list"],"ESC 2024 AF guideline"]],
 causes:[],heart:null},
{id:"p3",name:"Mohammed Al-Qahtani",nameAr:"محمد القحطاني",mrn:"993447",age:64,sex:"M",bed:"15",ward:"Surgical Ward 2",team:"B",los:1,status:"stable",dx:"Post-op day 1, right hemicolectomy",
 allergies:[],code:"Full code",wt:82,ht:175,exposure:"No recent travel.",
 complaints:["Abdominal wound pain, controlled"],history:["Colon cancer (operated)","Hyperlipidaemia"],
 f:{cancer:1,surg:1,immob:1,adm:"surgical_s"},
 times:["06:00","10:00","14:00","18:00"],tr:{t:[37.3,37.4,37.5,37.4],hr:[86,84,82,84],sbp:[130,134,132,132],dbp:[78,80,78,78],rr:[16,16,16,16],spo2:[96,97,96,96],o2:[0,0,0,0]},
 v:{avpu:"A",gcs:15,fio2:.21,o2dev:"Room air"},
 lab:{wbc:10.4,crp:62,cr:0.9,na:138,k:3.6,cl:104,hco3:24,alb:3.2,urea:5.0,glu:7.4,hb:112,hct:34,plt:255},prev:{hb:128},labT:"06:30",prevT:"pre-op",
 meds:[["Enoxaparin","40 mg SC daily","active"],["Paracetamol","1 g IV every 6 h","active"],["Oxycodone","5 mg PO every 4 h PRN","active"]],
 imaging:[],
 soap:{s:"Pain 3/10. Passing flatus.",o:"Afebrile, haemodynamically stable. Wound clean.",a:"Uncomplicated post-op day 1.",p:"Mobilise, diet as tolerated, Hb tomorrow.",by:"Dr. Yousef Al-Dosari",tm:"Today 08:40"},
 nursing:[["12:00","RN Reem Al-Zahrani","Mobilised to chair for 30 min. Drain output 40 mL serosanguinous.",""]],
 changes:[["Haemoglobin 128 → 112 g/L after surgery","amber",["Pre-op labs","Labs 06:30"],"Expected post-operative drop; trend to be confirmed"]],
 matters:[],open:[["Haemoglobin recheck tomorrow 06:00","blue",["Lab order"],"Scheduled"]],
 done:["Mobilised to chair","Enoxaparin given"],todo:[["Check drain output overnight","Night nurse","06:00"]],contingency:["If Hb under 90 g/L or drain over 200 mL/h: surgical registrar"],
 cds:[],causes:[],heart:null},
{id:"p4",name:"Laila Hassan",nameAr:"ليلى حسن",mrn:"557821",age:38,sex:"F",bed:"21",ward:"Medical Ward 3",team:"B",los:3,status:"watch",dx:"Diabetic foot infection",
 allergies:[{a:"Sulfonamides",r:"Hives"}],code:"Full code",wt:92,ht:160,exposure:"No recent travel.",
 complaints:["Swollen, painful left foot","Discharge from ulcer"],history:["Type 2 diabetes (HbA1c 10.2%)"],
 f:{dm:1,infect:1,adm:"medical",immob:0},
 times:["06:00","10:00","14:00","18:00"],tr:{t:[37.6,37.9,38.0,37.9],hr:[90,94,96,96],sbp:[120,118,118,118],dbp:[74,72,72,72],rr:[18,18,18,18],spo2:[98,98,98,98],o2:[0,0,0,0]},
 v:{avpu:"A",gcs:15,fio2:.21,o2dev:"Room air"},
 lab:{wbc:13.1,crp:120,cr:0.8,na:135,k:4.0,cl:99,hco3:22,alb:3.4,urea:4.2,glu:16.8,hb:124,hct:37,plt:310},prev:{wbc:14.8,crp:150},labT:"07:00",prevT:"yesterday",
 meds:[["Ceftriaxone","2 g IV daily","active"],["Metronidazole","500 mg IV every 8 h","active"],["Insulin basal-bolus","per protocol","active"]],
 imaging:[["Foot X-ray","Day 1","Soft-tissue swelling. No definite bone erosion.",0],["MRI foot","Requested","Pending",1]],
 soap:{s:"Foot pain slightly better.",o:"Low-grade fever. Erythema margin receding.",a:"Diabetic foot infection, improving. Osteomyelitis not excluded.",p:"MRI foot, vascular review, glucose control.",by:"Dr. Kamel Azhar",tm:"Today 11:00"},
 nursing:[["16:00","RN Huda Al-Shehri","Capillary glucose 16.8 mmol/L before dinner.","amber"]],
 changes:[["CRP 150 → 120 mg/L","green",["Labs"],"Improving"],["Glucose persistently above 15 mmol/L","amber",["Glucose chart"],"Hyperglycaemia slows infection control"]],
 matters:[["Glucose control: review insulin doses","amber",["Glucose chart"],"Persistent hyperglycaemia"]],
 open:[["MRI foot for osteomyelitis","amber",["Imaging order"],"Open order"],["Vascular surgery review","amber",["Consult order"],"Open consult"]],
 done:["IV antibiotics day 3"],todo:[["Titrate insulin with diabetes educator","Day team","Tomorrow"]],contingency:["If fever above 38.5 °C or spreading erythema: senior review, consider surgical debridement"],
 cds:[["BMI 35.9: weight-adjusted dosing check","Review weight-based drug doses",["Weight 92 kg","Height 160 cm"],"Obesity class II"]],causes:[],heart:null},
{id:"p5",name:"Omar Salem",nameAr:"عمر سالم",mrn:"118903",age:70,sex:"M",bed:"27",ward:"Medical Ward 5",team:"A",los:2,status:"det",dx:"COPD exacerbation, hypercapnic",
 allergies:[],code:"Full code",wt:64,ht:170,exposure:"Returned from Umrah 8 days ago.",
 complaints:["Increased breathlessness","More sputum","Wheeze"],history:["COPD with prior hypercapnia","Hypertension"],
 f:{copd:1,htn:1,resp:1,infect:1,adm:"medical",immob:1},
 times:["06:00","10:00","14:00","18:00"],tr:{t:[37.4,37.5,37.7,37.6],hr:[98,104,108,112],sbp:[146,144,140,142],dbp:[88,86,84,86],rr:[22,24,26,28],spo2:[90,89,89,89],o2:[1,1,1,1]},
 v:{avpu:"A",gcs:15,fio2:.28,o2dev:"Venturi 28%",scale2:true},
 lab:{wbc:12.6,crp:64,cr:1.0,na:139,k:4.2,cl:101,hco3:30,alb:3.5,urea:6.0,glu:8.0,hb:150,hct:46,plt:280,ph:7.29,pao2:60,paco2:62},prev:{},labT:"17:00",prevT:"",
 meds:[["Salbutamol","nebulised every 4 h","active"],["Ipratropium","nebulised every 6 h","active"],["Prednisolone","40 mg PO daily","active"],["Doxycycline","100 mg PO daily","active"]],
 imaging:[["Chest X-ray","Day 1","Hyperinflation. No consolidation.",0]],
 soap:{s:"More breathless today.",o:"RR 28, SpO₂ 89% on Venturi 28%. ABG pH 7.29, PaCO₂ 62 mmHg.",a:"Acute hypercapnic respiratory failure in COPD exacerbation.",p:"Start NIV, ICU outreach review.",by:"Dr. Khalid Al-Shammari",tm:"Today 17:20"},
 nursing:[["17:10","RN Amal Al-Harthi","Increasing work of breathing. ABG sent.","red"]],
 changes:[["pH 7.29, PaCO₂ 62 mmHg","red",["ABG 17:00"],"Respiratory acidosis: pH <7.35 with PaCO₂ >45 mmHg"]],
 matters:[["Non-invasive ventilation indicated","red",["ABG 17:00"],"BTS/ICS 2016: NIV for acute hypercapnic respiratory failure with pH <7.35 and PaCO₂ >6.5 kPa"]],
 open:[["Repeat ABG 1 h after starting NIV","amber",["Plan"],"BTS/ICS 2016"]],
 done:["NIV started 17:45"],todo:[["Repeat ABG at 18:45","Night resident","18:45"]],contingency:["If pH falls below 7.25 on NIV: ICU review for intubation"],
 cds:[],causes:[],heart:null},
{id:"p6",name:"Fatima Nasser",nameAr:"فاطمة ناصر",mrn:"662110",age:29,sex:"F",bed:"31",ward:"Maternity Ward",team:"B",los:2,status:"stable",dx:"Day 2 after caesarean birth",
 allergies:[],code:"Full code",wt:74,ht:163,exposure:"No recent travel.",
 complaints:["Wound pain, controlled"],history:["First pregnancy, uncomplicated"],
 f:{postpartum:1,surg:1,adm:"surgical_s"},
 times:["06:00","10:00","14:00","18:00"],tr:{t:[36.9,37.0,36.9,36.8],hr:[82,80,78,80],sbp:[118,116,118,116],dbp:[72,70,72,70],rr:[16,16,16,16],spo2:[98,98,99,98],o2:[0,0,0,0]},
 v:{avpu:"A",gcs:15,fio2:.21,o2dev:"Room air"},
 lab:{wbc:11.2,crp:40,cr:0.6,na:137,k:3.9,cl:105,hco3:23,alb:3.1,urea:3.0,glu:5.4,hb:108,hct:32,plt:220},prev:{hb:121},labT:"06:30",prevT:"pre-delivery",
 meds:[["Enoxaparin","40 mg SC daily","active"],["Paracetamol","1 g PO every 6 h","active"]],imaging:[],
 soap:{s:"Comfortable, breastfeeding well.",o:"Observations normal.",a:"Uncomplicated recovery.",p:"Plan discharge tomorrow.",by:"Dr. Noura Al-Anazi",tm:"Today 09:00"},
 nursing:[["10:00","RN Reem Al-Zahrani","Mobilising independently. Lochia normal.",""]],
 changes:[],matters:[],open:[["Discharge medicines and follow-up","blue",["Plan"],"Scheduled"]],done:["Mobilising"],todo:[["Prepare discharge summary","Day team","Tomorrow"]],contingency:["If BP ≥140/90 or headache: obstetric review (postnatal pre-eclampsia)"],
 cds:[],causes:[],heart:null},
{id:"p7",name:"Abdullah Al-Otaibi",nameAr:"عبدالله العتيبي",mrn:"445920",age:61,sex:"M",bed:"05",ward:"Cardiology Ward",team:"B",los:1,status:"watch",dx:"Chest pain, suspected NSTE-ACS",
 allergies:[],code:"Full code",wt:88,ht:174,exposure:"No recent travel.",
 complaints:["Central chest tightness at rest, 2 episodes in 24 h","Sweating with pain"],history:["Hypertension","Type 2 diabetes","Smoker","Hyperlipidaemia"],
 f:{htn:1,dm:1,adm:"medical",immob:0},
 times:["06:00","10:00","14:00","18:00"],tr:{t:[36.9,36.9,37.0,36.9],hr:[90,92,94,92],sbp:[152,150,146,148],dbp:[90,88,86,88],rr:[18,18,18,18],spo2:[97,97,97,97],o2:[0,0,0,0]},
 v:{avpu:"A",gcs:15,fio2:.21,o2dev:"Room air"},
 lab:{wbc:8.4,crp:6,cr:1.0,na:139,k:4.3,cl:103,hco3:25,alb:4.0,urea:5.5,glu:9.2,hb:146,hct:44,plt:230,trop:38},prev:{trop:24},labT:"13:00",prevT:"10:00",
 meds:[["Aspirin","75 mg PO daily (taking before admission)","active"],["Ticagrelor","90 mg PO twice daily","active"],["Fondaparinux","2.5 mg SC daily","active"],["Atorvastatin","80 mg PO nightly","active"]],
 imaging:[],
 soap:{s:"Two episodes of rest chest tightness in 24 h.",o:"ECG: 0.5 mm ST depression V4–V6. hs-TnT 24 → 38 ng/L.",a:"NSTE-ACS likely.",p:"Cardiology for invasive strategy timing.",by:"Dr. Kamel Azhar",tm:"Today 13:30"},
 nursing:[["13:00","RN Mona Al-Ghamdi","Chest pain-free since 09:00.",""]],
 changes:[["hs-Troponin T 24 → 38 ng/L (URL 14)","red",["Labs 10:00","Labs 13:00"],"Rising troponin above upper reference limit"]],
 matters:[["GRACE above 140: early invasive strategy within 24 h","red",["GRACE inputs"],"ESC 2023 ACS; ACC/AHA 2025 ACS"]],
 open:[["Coronary angiography slot","amber",["Cardiology referral"],"Open"]],
 done:["Antiplatelets and anticoagulant started"],todo:[["Confirm angiography time","Cardiology fellow","Tomorrow 08:00"]],contingency:["If recurrent pain or haemodynamic instability: immediate angiography pathway"],
 cds:[],causes:[],
 heart:{h:2,ecg:2,rf:4,athero:0},timi:{known:0,asa:1,angina:1,st:1},grace:{killip:1,arrest:0,st:1,enz:1}}
];
const IMG={
 p1:[["Chest X-ray","Day 1, 21:40","Right lower lobe consolidation. No pleural effusion.",0,"cxr",1],["Lung ultrasound (point of care)","Today 17:50","Right basal consolidation with dynamic air bronchograms. No effusion.",0,"us",1],["Chest X-ray (repeat)","Requested 16:00","Pending",1]],
 p2:[["Chest X-ray","Day 1, 10:15","Cardiomegaly, upper lobe venous diversion, small bilateral effusions.",0,"cxr",1],["Echocardiogram","Day 2, 11:30","LVEF 35%, dilated left atrium, moderate functional mitral regurgitation.",0,"echo",1],["12-lead ECG","Day 1, 09:50","Atrial fibrillation, ventricular rate 112. No acute ST changes.",0,"ecg",1]],
 p3:[["CT abdomen and pelvis (staging)","Pre-op","Caecal mass with no liver or lung metastases.",0,"ctab",1],["Chest X-ray","Post-op day 1, 07:30","No free air under the diaphragm beyond expected post-op. Lungs clear.",0,"cxr",0]],
 p4:[["Foot X-ray (left)","Day 1, 14:20","Soft-tissue swelling at first metatarsal head. No definite bone erosion.",0,"mri",1],["Arterial duplex (left leg)","Day 2, 10:00","Monophasic flow below the knee, suggesting tibial artery disease.",0,"us",1],["MRI foot (left)","Requested day 2","Pending",1]],
 p5:[["Chest X-ray","Day 1","Hyperinflation. No consolidation or pneumothorax.",0,"cxr",0]],
 p6:[["Pelvic ultrasound","Day 1, 15:00","No retained products. Uterus appropriate for postpartum day 1.",0,"us",0]],
 p7:[["12-lead ECG","Today 09:10","0.5 mm ST depression V4–V6. Sinus rhythm 92.",0,"ecg",1],["Echocardiogram","Today 12:40","Mild inferior hypokinesia, LVEF 50%. No significant valve disease.",0,"echo",1],["Chest X-ray","Today 08:30","Normal heart size. Clear lungs.",0,"cxr",0]]};
P.forEach(p=>{if(IMG[p.id])p.imaging=IMG[p.id]});
const VT=["06:00","10:00","14:00","18:00"];
P.push(
{id:"p8",name:"Ibrahim Al-Zahrani",nameAr:"إبراهيم الزهراني",mrn:"552301",age:74,sex:"M",bed:"18",ward:"Medical Ward 3",team:"B",los:3,status:"watch",dx:"Left MCA ischaemic stroke, day 3",
 allergies:[],code:"Full code",wt:80,ht:170,exposure:"No recent travel.",complaints:["Right-sided weakness","Word-finding difficulty","Coughing when drinking"],history:["Atrial fibrillation (not anticoagulated)","Hypertension","Type 2 diabetes"],
 f:{af:1,htn:1,dm:1,stroke:1,ami:1,immob:1,adm:"medical"},times:VT,tr:{t:[37.0,37.2,37.6,37.9],hr:[84,86,88,92],sbp:[168,162,158,154],dbp:[90,88,86,84],rr:[18,18,20,21],spo2:[96,95,95,94],o2:[0,0,0,0]},v:{avpu:"A",gcs:14,fio2:.21,o2dev:"Room air"},
 lab:{wbc:11.8,crp:34,cr:1.1,na:140,k:4.2,cl:104,hco3:24,alb:3.6,urea:7.2,glu:9.8,hb:136,hct:41,plt:240},prev:{wbc:8.9,crp:6},labT:"16:00",prevT:"day 1",
 meds:[["Aspirin","300 mg PO daily (14 days)","active"],["Atorvastatin","80 mg PO nightly","active"],["Intermittent pneumatic compression","Both legs","active"]],
 imaging:[["CT head (non-contrast)","Day 1, 08:20","Acute left MCA territory infarct. No haemorrhage.",0,"cth",1],["CT angiography head and neck","Day 1, 08:35","Left M2 segment occlusion. No significant carotid stenosis.",0,"cta",1],["Chest X-ray","Today 17:40","New subtle right basal opacity, possible aspiration.",0,"cxr",1]],
 soap:{s:"Coughing with oral fluids per nursing.",o:"Temp 37.9 °C, RR 21, SpO₂ 94%. Right hemiparesis unchanged, NIHSS 7.",a:"Day-3 ischaemic stroke with possible aspiration.",p:"Nil by mouth until swallow assessment. Chest review. Plan anticoagulation timing for AF with stroke team.",by:"Dr. Kamel Azhar",tm:"Today 17:50"},
 nursing:[["17:15","RN Amal Al-Harthi","Coughed during bedside water swallow screen. Kept nil by mouth.","red"],["14:00","RN Amal Al-Harthi","Capillary glucose 9.8 mmol/L.",""]],
 changes:[["Failed bedside water swallow screen","red",["Nursing note 17:15"],"Aspiration risk after stroke"],["Temp 37.0 → 37.9 °C, RR 18 → 21","amber",["Vitals 06:00–18:00"],"Possible aspiration pneumonia"],["New right basal opacity on chest X-ray","amber",["CXR 17:40"],"New imaging finding"]],
 matters:[["Keep nil by mouth until speech and language therapy review","red",["Nursing note 17:15"],"Stroke guidelines: swallow screening before oral intake"],["Plan anticoagulation timing for AF (CHA₂DS₂-VA 5)","amber",["Problem list"],"ELAN trial (NEJM 2023): early DOAC start is an option after ischaemic stroke"]],
 open:[["Speech and language therapy swallow assessment","amber",["Referral 13:00"],"Open consult"],["Carotid Doppler","blue",["Imaging order"],"Scheduled"]],
 done:["Aspirin given","Compression devices applied","Nil by mouth from 17:15"],todo:[["IV fluids while nil by mouth","Night resident","19:00"],["Change aspirin to rectal route","Night resident","Now"],["Review chest X-ray; treat if febrile","Night registrar","20:00"],["Speech and language therapy assessment","Day team","Tomorrow 09:00"]],
 contingency:["If GCS falls by 2 or new weakness: urgent CT head and stroke team","If SpO₂ under 92% or temp above 38 °C: treat as aspiration pneumonia"],
 cds:[["Route conflict: nil by mouth with oral aspirin ordered","Change to rectal or nasogastric route per stroke protocol",["MAR","Nursing note 17:15"],"Route and feeding-status mismatch"],["Padua 5: compression devices in place","Pharmacological prophylaxis timing per stroke team",["Padua inputs"],"CLOTS 3 trial: intermittent pneumatic compression reduces DVT after stroke"]],
 medFlags:{"Aspirin":["red","Nil by mouth: oral route ordered"]},causes:[],heart:null},
{id:"p9",name:"Hessa Al-Dawsari",nameAr:"حصة الدوسري",mrn:"774410",age:24,sex:"F",bed:"24",ward:"Medical Ward 3",team:"B",los:1,status:"watch",dx:"Diabetic ketoacidosis, resolving",
 allergies:[],code:"Full code",wt:58,ht:162,exposure:"No recent travel.",complaints:["Vomiting","Abdominal pain","Polyuria and thirst"],history:["Type 1 diabetes"],
 f:{dm:1,adm:"medical"},times:VT,tr:{t:[37.1,37.0,36.9,36.9],hr:[118,110,102,98],sbp:[104,108,112,114],dbp:[62,66,70,70],rr:[26,22,20,18],spo2:[99,99,99,99],o2:[0,0,0,0]},v:{avpu:"A",gcs:15,fio2:.21,o2dev:"Room air"},
 lab:{wbc:13.4,crp:12,cr:1.0,na:131,k:4.0,cl:98,hco3:16,alb:4.1,urea:7.9,glu:18.5,hb:140,hct:42,plt:300,ph:7.28,ket:2.1},prev:{glu:32.4,hco3:9,ket:5.8,k:5.6},labT:"17:00",prevT:"02:00",
 meds:[["Insulin fixed-rate infusion","0.1 units/kg/h","active"],["Sodium chloride 0.9% + KCl 40 mmol/L","150 mL/h","active"],["Glucose 10%","125 mL/h (glucose under 14 mmol/L)","active"]],
 imaging:[["Chest X-ray","Today 02:10","No consolidation. Normal heart size.",0,"cxr",0]],
 soap:{s:"Vomiting settled. Abdominal pain improving.",o:"HR 98, BP 114/70. Ketones 5.8 → 2.1 mmol/L, HCO₃ 9 → 16 mmol/L.",a:"DKA improving on fixed-rate insulin.",p:"Continue insulin and fluids. Ketones and VBG 2-hourly. Restart basal insulin. Diabetes team review.",by:"Dr. Kamel Azhar",tm:"Today 16:30"},
 nursing:[["16:00","RN Mona Al-Ghamdi","Capillary glucose 13.2 mmol/L, glucose 10% started per protocol.","amber"],["12:00","RN Mona Al-Ghamdi","Tolerating sips. Fluid balance +2.1 L.",""]],
 changes:[["Ketones 5.8 → 2.1 mmol/L","green",["Labs 02:00","Labs 17:00"],"JBDS-IP: target ketone fall ≥0.5 mmol/L/h"],["Bicarbonate 9 → 16 mmol/L","green",["VBG"],"Improving acidosis"],["Potassium 5.6 → 4.0 mmol/L","amber",["Labs"],"Potassium falls with insulin"]],
 matters:[["Keep potassium 4.0–5.5 mmol/L on insulin infusion","amber",["K 4.0 mmol/L"],"JBDS-IP DKA guideline"]],
 open:[["Repeat VBG and ketones","amber",["Protocol"],"2-hourly"],["Diabetes team review","blue",["Referral"],"Open"]],
 done:["Fixed-rate insulin running","Glucose 10% started"],todo:[["Repeat VBG and ketones","Night resident","19:00"],["Restart usual basal insulin","Night resident","22:00"]],
 contingency:["If ketones fall under 0.5 mmol/L/h: check infusion, increase rate per protocol","If potassium under 3.5 mmol/L: senior review"],
 cds:[["Potassium at lower target on insulin infusion","Confirm potassium in replacement fluid",["K 4.0","MAR"],"JBDS-IP DKA: potassium target 4.0–5.5 mmol/L"]],causes:[],heart:null},
{id:"p10",name:"Saleh Al-Subaie",nameAr:"صالح السبيعي",mrn:"330918",age:58,sex:"M",bed:"03",ward:"Medical Ward 3",team:"B",los:2,status:"watch",dx:"Decompensated cirrhosis with ascites",
 allergies:[],code:"Full code",wt:84,ht:172,exposure:"No recent travel.",complaints:["Abdominal swelling","Increasing drowsiness","Leg swelling"],history:["Cirrhosis (MASLD), Child-Pugh B","Type 2 diabetes"],
 f:{cirrhosis:1,liver:1,dm:1,aki:1,infect:1,adm:"medical"},times:VT,tr:{t:[37.2,37.4,37.8,37.9],hr:[92,94,98,100],sbp:[106,104,100,102],dbp:[64,62,60,60],rr:[18,18,20,20],spo2:[96,96,95,95],o2:[0,0,0,0]},v:{avpu:"A",gcs:14,fio2:.21,o2dev:"Room air"},
 lab:{wbc:9.8,crp:48,cr:1.3,na:130,k:3.8,cl:100,hco3:22,alb:2.6,urea:8.5,glu:8.2,hb:104,hct:31,plt:78,bili:3.2,inr:1.8},prev:{cr:1.0,bili:2.6},labT:"15:00",prevT:"yesterday",
 meds:[["Lactulose","20 mL PO three times daily","active"],["Rifaximin","550 mg PO twice daily","active"],["Ceftriaxone","1 g IV daily","active"],["Spironolactone","100 mg PO daily","held"],["Furosemide","40 mg PO daily","held"]],
 imaging:[["Abdominal ultrasound with Doppler","Day 1, 11:00","Coarse nodular liver, splenomegaly 15 cm, moderate ascites. Patent portal vein.",0,"us",1],["Chest X-ray","Day 1, 09:30","Small right pleural effusion, possible hepatic hydrothorax.",0,"cxr",1]],
 soap:{s:"More drowsy since afternoon per family.",o:"GCS 14, asterixis present. Tense ascites. Temp 37.9 °C.",a:"Decompensated cirrhosis with possible grade 2 hepatic encephalopathy. Spontaneous bacterial peritonitis not excluded.",p:"Diagnostic paracentesis. Titrate lactulose to 2–3 soft stools. Diuretics held for rising creatinine.",by:"Dr. Kamel Azhar",tm:"Today 16:45"},
 nursing:[["16:30","RN Reem Al-Zahrani","More drowsy, flapping tremor noted. Bowels not opened today.","red"],["12:00","RN Reem Al-Zahrani","Abdominal girth 104 cm (+3 cm).","amber"]],
 changes:[["New drowsiness and asterixis (GCS 14)","red",["Nursing note 16:30"],"Possible hepatic encephalopathy"],["Creatinine 88 → 115 µmol/L","amber",["Labs"],"KDIGO AKI stage 1"],["Temp 37.2 → 37.9 °C","amber",["Vitals 06:00–18:00"],"Possible infection"]],
 matters:[["Diagnostic paracentesis to exclude spontaneous bacterial peritonitis","red",["Ascites","Temp 37.9 °C","New confusion"],"AASLD 2021 / EASL 2018: diagnostic paracentesis in ascites with clinical deterioration"],["No bowel movement on lactulose","amber",["Nursing note 16:30"],"Titrate to 2–3 soft stools per day"]],
 open:[["Ascitic fluid cell count and culture","amber",["Lab order"],"Open"],["Hepatology review","blue",["Referral"],"Open"]],
 done:["Lactulose increased","Diuretics held 16:00"],todo:[["Diagnostic paracentesis","Night registrar","20:00"],["Phosphate enema if no stool by 22:00","Night nurse","22:00"],["Repeat urea and electrolytes","Night resident","06:00"]],
 contingency:["If ascitic neutrophils ≥250 cells/mm³: treat as SBP and give albumin per guideline","If GCS falls below 12: senior review and airway assessment"],
 cds:[["Diuretics held with rising creatinine: keep held","Restart only when renal function stabilises",["Creatinine 115 µmol/L","MAR"],"EASL 2018: stop diuretics in AKI"],["MELD-Na 25","Discuss hepatology and transplant assessment pathway",["MELD-Na inputs"],"AASLD: refer for transplant evaluation at MELD ≥15"]],
 medFlags:{"Spironolactone":["amber","Held: acute kidney injury"],"Furosemide":["amber","Held: acute kidney injury"]},causes:[],heart:null});
const YEST={
 p1:"Cough with yellow sputum. Right-sided pain on deep breathing. Fever 38.6 °C overnight. Crackles and reduced air entry at right base. Right lower lobe pneumonia. Continue antibiotics. Respiratory team review.",
 p2:"Breathless on minimal exertion. HR 104 irregular. New AF, rate control started. Continue diuresis, daily weights. Decide on anticoagulation.",
 p3:"Returned from theatre after right hemicolectomy. Afebrile, haemodynamically stable. Wound clean. Nil by mouth overnight.",
 p4:"Foot pain 7/10. Low-grade fever. Diabetic foot infection. Osteomyelitis not excluded. MRI foot, vascular review, glucose control.",
 p5:"Breathless with wheeze. Hyperinflation on chest X-ray. Nebulisers and steroids.",
 p6:"Day 1 after caesarean birth. Observations normal. Uncomplicated recovery. Encourage mobilisation.",
 p7:"Two episodes of rest chest tightness in 24 h. ECG: 0.5 mm ST depression V4–V6. Admit to cardiology ward.",
 p8:"No new complaints. Right hemiparesis unchanged, NIHSS 7. Day-2 ischaemic stroke. Plan anticoagulation timing for AF with stroke team.",
 p9:"Vomiting and abdominal pain for 1 day. Ketones 5.8 mmol/L, pH 7.10. Diabetic ketoacidosis. Start fixed-rate insulin and fluids.",
 p10:"Abdominal swelling increasing. Tense ascites. Decompensated cirrhosis. Titrate lactulose to 2–3 soft stools. Continue diuretics."};
const NS={p1:{braden:[3,3,2,2,2,2],morse:[0,15,0,20,10,0],at4:[0,0,0,0],must:[0,1,0]},p2:{braden:[4,3,3,3,3,3],morse:[0,15,15,20,10,0],at4:[0,0,0,0],must:[0,0,0],cfs:5},
 p3:{braden:[4,3,3,3,3,3],morse:[0,15,0,20,10,0],at4:[0,0,0,0],must:[0,0,0]},p4:{braden:[3,3,3,3,3,3],morse:[0,15,15,20,10,0],at4:[0,0,0,0],must:[0,0,0]},
 p5:{braden:[4,3,2,3,2,2],morse:[25,15,15,20,10,0],at4:[0,0,0,0],must:[0,1,0],cfs:6},p6:{braden:[4,3,3,3,4,3],morse:[0,0,0,20,0,0],at4:[0,0,0,0],must:[0,0,0]},
 p7:{braden:[4,4,3,4,3,3],morse:[0,15,0,20,0,0],at4:[0,0,0,0],must:[0,0,0]},p8:{braden:[3,3,2,2,2,2],morse:[0,15,0,20,20,15],at4:[0,1,1,0],must:[0,0,2],cfs:4},
 p9:{braden:[4,3,3,3,3,3],morse:[0,15,0,20,0,0],at4:[0,0,0,0],must:[0,0,0]},p10:{braden:[3,2,3,3,2,3],morse:[0,15,0,20,10,15],at4:[0,1,1,4],must:[0,1,0]}};
P.forEach(p=>{p.yest=YEST[p.id]||"";p.ns=NS[p.id]});
{const F=id=>P.find(p=>p.id===id);Object.assign(F("p3").f,{majorSurg:1,surgHigh:1,immob:0});F("p1").wd={paralysis:0,tender:0,swollen:0,calf:0,edema:0,veins:0,alt:1};F("p8").wd={paralysis:1,tender:0,swollen:0,calf:0,edema:0,veins:0,alt:0}}
const ME={name:"Dr. Kamel Azhar",team:"B",role:"Consultant"};
/* timed items: [label, minutes elapsed at page load, target minutes, type] */
const TASKS={p1:[["Senior review after NEWS2 11",25,30,"esc"],["Repeat chest X-ray (urgent)",150,60,"result"],["Respiratory team review",180,120,"review"],["Repeat lactate after fluid bolus",105,360,"result"],["Blood cultures, preliminary report",1320,1440,"result"]],
 p2:[],p3:[],p4:[["MRI foot",1560,1440,"result"],["Vascular surgery review",1200,1440,"review"]],
 p5:[["Repeat ABG 1 h after NIV",45,60,"result"],["ICU outreach review on NIV",40,30,"esc"]],p6:[],
 p7:[["Repeat hs-troponin (3 h)",330,180,"result"],["Coronary angiography (GRACE >140, within 24 h)",300,1440,"review"]],
 p8:[["Speech and language therapy swallow assessment",300,240,"review"],["Carotid Doppler",1100,1440,"result"]],
 p9:[["Repeat VBG and ketones (2-hourly)",95,120,"result"],["Diabetes team review",200,240,"review"]],
 p10:[["Ascitic fluid cell count",70,120,"result"],["Hepatology review",400,480,"review"]]};
const T0=Date.now();
const elapsed=m=>m+(Date.now()-T0)/60000;
function fmtM(m){m=Math.max(0,Math.round(m));const h=Math.floor(m/60),r=m%60;const H=lang==="ar"?" س":" h",M=lang==="ar"?" د":" min";return h?(h+H+(r?" "+r+M:"")):(r+M)}
const tmr=(m,g)=>`<span class="tmr" data-m="${m}" data-g="${g}"></span>`;
function updTmr(e){const m=elapsed(+e.dataset.m),g=+e.dataset.g;const over=m>g;e.className="tmr "+(over?"red":m>=g*0.75?"amber":"");e.textContent=over?`${fmtM(m)} — ${t("overBy")} ${fmtM(m-g)}`:`${fmtM(m)} — ${t("dueIn")} ${fmtM(g-m)}`}
const doneBy=d=>d&&d.by?`<div class="donel">✓ ${esc(d.by)} (${esc(d.role)}), ${esc(d.at)}</div>`:"";

/* ---------------- state ---------------- */
const S={pid:store.get("pid","p1"),layer:store.get("layer",true),calcTab:"all",calcQ:"",shiftWard:"Medical Ward 3",hoTab:store.get("hoTab","mine"),editing:null,hideOld:true,notes:store.get("notes",{}),verified:store.get("verified",{}),todos:store.get("todos",{}),access:store.get("access",{}),audit:store.get("audit",null)};
if(!S.audit){S.audit=[["06 Nov 2026 18:05","Dr. Kamel Azhar","Viewed Faisal Al-Harbi","Care team"],["06 Nov 2026 17:50","Dr. Khalid Al-Shammari","Viewed Omar Salem","Care team"],["06 Nov 2026 16:12","RN Huda Al-Shehri","Added nursing note, Bed 12","Care team"],["06 Nov 2026 03:40","Dr. Faris Al-Juhani","Emergency access, Bed 27 (30 min)","Emergency: rapid response call"]]}
const pat=id=>P.find(p=>p.id===id)||P[0];
const last=a=>a[a.length-1];
const crU=mg=>Math.round(mg*88.4);
function canSee(p){if(p.team===ME.team)return true;const a=S.access[p.id];return !!(a&&a>Date.now())}

/* ---------------- calculators ---------------- */
const VER="06 Nov 2026";
function bandOf(b){return {high:"red",med:"amber",lowmed:"amber",low:"green",info:"blue",na:"grey",partial:"amber"}[b]||"grey"}
function cur(p,i){const T=p.tr;i=i??T.t.length-1;return {t:T.t[i],hr:T.hr[i],sbp:T.sbp[i],dbp:T.dbp[i],rr:T.rr[i],spo2:T.spo2[i],o2:T.o2[i]>0}}
function news2(p,i){
  if(p.f.postpartum)return {na:true,why:{en:"NEWS2 is not validated in pregnancy or the postnatal period. Use the obstetric early warning score (e.g. MEOWS) per local policy.",ar:"مقياس NEWS2 غير معتمد في الحمل أو فترة ما بعد الولادة. استخدم مقياس الإنذار المبكر التوليدي (مثل MEOWS)."}};
  const c=cur(p,i),s2=!!p.v.scale2;let parts={};
  parts.rr=c.rr<=8?3:c.rr<=11?1:c.rr<=20?0:c.rr<=24?2:3;
  parts.spo2=s2?(c.spo2<=83?3:c.spo2<=85?2:c.spo2<=87?1:(c.spo2<=92||!c.o2)?0:c.spo2<=94?1:c.spo2<=96?2:3):(c.spo2<=91?3:c.spo2<=93?2:c.spo2<=95?1:0);
  parts.air=c.o2?2:0;
  parts.sbp=c.sbp<=90?3:c.sbp<=100?2:c.sbp<=110?1:c.sbp<=219?0:3;
  parts.hr=c.hr<=40?3:c.hr<=50?1:c.hr<=90?0:c.hr<=110?1:c.hr<=130?2:3;
  parts.cons=p.v.avpu==="A"?0:3;
  parts.temp=c.t<=35?3:c.t<=36?1:c.t<=38?0:c.t<=39?1:2;
  const total=Object.values(parts).reduce((a,b)=>a+b,0),any3=Object.values(parts).some(x=>x===3);
  return {total,parts,band:total>=7?"high":total>=5?"med":any3?"lowmed":"low",c,s2};
}
const ICUNOTE=()=>lang==="ar"?"معتمد لمرضى العناية المركزة فقط؛ يظهر عند تنويم المريض في العناية.":"Validated for ICU admissions only; shown when the patient is in ICU.";
const NANS=()=>({na:1,note:lang==="ar"?"لا يوجد تقييم تمريضي مسجل.":"No nursing assessment recorded."});
const sumA=a=>a.reduce((x,y)=>x+y,0);
const CALCS=[
{id:"news2",pack:["core","er","pulm"],name:"NEWS2",sub:{en:"National Early Warning Score 2",ar:"مقياس الإنذار المبكر الوطني 2"},
 src:{name:"Royal College of Physicians, London",ver:"NEWS2 (Dec 2017)",note:{en:"Bands: 0–4 low, any single parameter 3 low–medium, 5–6 medium (urgent response), ≥7 high (emergency response). SpO₂ Scale 2 only for documented hypercapnic respiratory failure.",ar:"الفئات: 0–4 منخفض، 3 في أي معيار منخفض–متوسط، 5–6 متوسط، 7 فأكثر مرتفع."}},
 fn(p){const r=news2(p);if(r.na)return {na:1,note:L(r.why)};
  const c=r.c;return {num:r.total,max:20,band:r.band,trend:p.times.map((_,i)=>news2(p,i).total),
  inputs:[["RR",c.rr],["SpO₂",c.spo2+"%"+(r.s2?" (Scale 2)":"")],["O₂",c.o2?p.v.o2dev:"Air"],["SBP",c.sbp],["HR",c.hr],["ACVPU",p.v.avpu],["Temp",c.t]],
  warns:r.s2?[{en:"Scale 2 used: target SpO₂ 88–92% documented for hypercapnic COPD.",ar:"استُخدم المقياس 2: هدف تشبع الأكسجين 88–92% موثق."}]:[],
  action:r.band==="high"?{en:"Emergency assessment by a critical-care-competent team; continuous monitoring.",ar:"تقييم طارئ من فريق مؤهل للعناية الحرجة ومراقبة مستمرة."}:r.band==="med"?{en:"Urgent review by a clinician with competence in acute illness.",ar:"مراجعة عاجلة من طبيب مؤهل في الحالات الحادة."}:null}}},
{id:"qsofa",pack:["core","er","id"],name:"qSOFA",sub:{en:"Quick SOFA, sepsis risk",ar:"مقياس SOFA السريع لخطر الإنتان"},
 src:{name:"Sepsis-3 (Seymour, JAMA 2016); Surviving Sepsis Campaign 2021",ver:"Sepsis-3 / SSC 2021",note:{en:"≥2 of RR ≥22, SBP ≤100, altered mentation flags higher risk of poor outcome. SSC 2021 recommends against qSOFA as a single screening tool compared with SIRS, NEWS or MEWS.",ar:"وجود 2 أو أكثر يدل على خطر أعلى. توصي إرشادات 2021 بعدم استخدامه كأداة فحص منفردة."}},
 fn(p){const f=i=>{const c=cur(p,i);return (c.rr>=22?1:0)+(c.sbp<=100?1:0)+(p.v.gcs<15?1:0)};const c=cur(p),n=f();
  return {num:n,max:3,band:n>=2?"high":n===1?"med":"low",trend:p.times.map((_,i)=>f(i)),inputs:[["RR",c.rr],["SBP",c.sbp],["GCS",p.v.gcs]],
  warns:[{en:"Not a standalone screening tool (SSC 2021). Read with NEWS2 and lactate.",ar:"ليس أداة فحص منفردة. يُقرأ مع NEWS2 واللاكتات."}].concat(p.lab.lac==null?[{en:"Lactate not available.",ar:"اللاكتات غير متوفرة."}]:[])}}},
{id:"bmi",pack:["core","endo"],name:"BMI",sub:{en:"Body mass index",ar:"مؤشر كتلة الجسم"},
 src:{name:"World Health Organization adult BMI classification",ver:"WHO",note:{en:"<18.5 underweight, 18.5–24.9 normal, 25–29.9 overweight, 30–34.9 obesity I, ≥35 obesity II–III.",ar:"أقل من 18.5 نقص وزن، 18.5–24.9 طبيعي، 25–29.9 زيادة وزن، 30 فأكثر سمنة."}},
 fn(p){const b=p.wt/((p.ht/100)**2),v=Math.round(b*10)/10;const lab=b<18.5?{en:"Underweight",ar:"نقص وزن"}:b<25?{en:"Normal",ar:"طبيعي"}:b<30?{en:"Overweight",ar:"زيادة وزن"}:b<35?{en:"Obesity class I",ar:"سمنة درجة 1"}:{en:"Obesity class II+",ar:"سمنة درجة 2+"};
  return {num:v,band:b<18.5||(b>=25&&b<35)?"med":b>=35?"high":"low",label:L(lab),inputs:[["Weight",p.wt+" kg"],["Height",p.ht+" cm"]]}}},
{id:"padua",pack:["core","heme"],name:"Padua",sub:{en:"VTE risk in medical inpatients",ar:"خطر الجلطات الوريدية لمرضى الباطنة"},
 src:{name:"Barbar et al., J Thromb Haemost 2010; ASH 2018 VTE prophylaxis guideline",ver:"Padua Prediction Score",note:{en:"≥4 high VTE risk. Validated in medical, not surgical, inpatients.",ar:"4 فأكثر خطر مرتفع. معتمد لمرضى الباطنة وليس الجراحة."}},
 fn(p){if(p.f.adm!=="medical")return {na:1,note:lang==="ar"?"مريض جراحي أو توليد: استخدم مقياس Caprini أو مسار الجراحة.":"Surgical or obstetric patient: use Caprini or the surgical VTE pathway."};
  const f=p.f;const it=[["Active cancer",f.cancer,3],["Previous VTE",f.priorVTE,3],["Reduced mobility",f.immob,3],["Thrombophilia",f.thromb,3],["Trauma/surgery ≤1 mo",f.surg,2],["Age ≥70",p.age>=70,1],["Heart/respiratory failure",f.chf||f.resp,1],["Acute MI/stroke",f.ami,1],["Acute infection",f.infect,1],["BMI ≥30",p.wt/((p.ht/100)**2)>=30,1],["Hormonal therapy",f.horm,1]];
  const n=it.reduce((a,x)=>a+(x[1]?x[2]:0),0);const onAC=p.meds.some(m=>/enoxaparin|heparin|fondaparinux|apixaban|rivaroxaban/i.test(m[0]));
  return {num:n,max:20,band:n>=4?"high":"low",inputs:it.filter(x=>x[1]).map(x=>[x[0],"+"+x[2]]),warns:n>=4&&!onAC?[{en:"High risk and no pharmacological prophylaxis ordered.",ar:"خطر مرتفع ولا توجد وقاية دوائية مطلوبة."}]:[]}}},
{id:"ag",pack:["core","er","icu","renal","endo"],name:{en:"Anion gap",ar:"فجوة الأنيون"},sub:{en:"With albumin correction and delta ratio",ar:"مع تصحيح الألبومين ونسبة دلتا"},
 src:{name:"AG = Na − (Cl + HCO₃); corrected AG = AG + 2.5 × (4.0 − albumin g/dL) (Figge 1998); delta ratio = (AG − 12)/(24 − HCO₃)",ver:"Reference interval 8–12 mmol/L (lab-dependent)",note:{en:"Elevated corrected AG suggests a high anion gap metabolic acidosis. Delta ratio 0.8–2 suggests pure HAGMA.",ar:"ارتفاع الفجوة المصححة يشير إلى حماض استقلابي عالي الفجوة."}},
 fn(p){const l=p.lab;if(l.na==null||l.cl==null||l.hco3==null)return {na:1,note:"Na, Cl or HCO₃ missing"};
  const ag=l.na-(l.cl+l.hco3),c=l.alb!=null?ag+2.5*(4-l.alb):null,cv=c!=null?Math.round(c*10)/10:ag;const dr=l.hco3<24?((cv-12)/(24-l.hco3)):null;
  return {num:cv,band:cv>=20?"high":cv>12?"med":"low",label:lang==="ar"?"مصححة بالألبومين":"Albumin-corrected",inputs:[["Na",l.na],["Cl",l.cl],["HCO₃",l.hco3],["Albumin",l.alb!=null?Math.round(l.alb*10)+" g/L":"—"],["Raw AG",ag],["Delta ratio",dr!=null?dr.toFixed(2):"n/a"]],
  warns:cv>12&&l.lac>2?[{en:"Lactate "+l.lac+" mmol/L may account for part of the gap.",ar:"قد تفسر اللاكتات جزءًا من الفجوة."}]:[]}}},
{id:"fluids",pack:["core","renal","peds"],name:{en:"Maintenance IV fluids",ar:"السوائل الوريدية للصيانة"},sub:{en:"Adult NICE CG174 / pediatric Holliday–Segar",ar:"إرشادات NICE للبالغين / هوليداي-سيغار للأطفال"},
 src:{name:"NICE CG174 Intravenous fluid therapy in adults (updated 2017); Holliday & Segar 1957 for children with NICE NG29 isotonic fluids",ver:"CG174 / NG29",note:{en:"Adults: 25–30 mL/kg/day water, ~1 mmol/kg/day Na, K and Cl, 50–100 g/day glucose. Consider 20–25 mL/kg/day if older, frail, renal impairment or heart failure. Obese: use ideal body weight.",ar:"البالغون: 25–30 مل/كغ/يوم ماء، مع تقليل إلى 20–25 لكبار السن أو القصور الكلوي أو القلبي."}},
 fn(p){const bmi=p.wt/((p.ht/100)**2);const ibw=(p.sex==="M"?50:45.5)+0.91*(p.ht-152.4);const w=bmi>=30?Math.round(ibw):p.wt;
  const cautious=p.f.chf||p.f.aki||p.age>=75;const lo=cautious?20:25,hi=cautious?25:30;
  const a=Math.round(w*lo/50)*50,b=Math.round(w*hi/50)*50;
  return {num:a+"–"+b,unit:"mL/day",band:"info",label:Math.round(a/24)+"–"+Math.round(b/24)+" mL/h",inputs:[["Dosing weight",w+" kg"+(bmi>=30?" (IBW)":"")],["Rate",lo+"–"+hi+" mL/kg/day"],["Na/K/Cl","≈"+w+" mmol/day"]],
  warns:cautious?[{en:"Reduced rate used: "+(p.f.chf?"heart failure":p.f.aki?"acute kidney injury":"age ≥75")+".",ar:"استُخدم معدل مخفض بسبب الحالة."}]:[]}}},
{id:"curb",pack:["core","er","pulm","id"],name:"CURB-65",sub:{en:"Pneumonia severity",ar:"شدة الالتهاب الرئوي"},
 src:{name:"Lim et al., Thorax 2003; BTS CAP guideline; ATS/IDSA CAP 2019",ver:"CURB-65",note:{en:"0–1 low, 2 moderate, 3–5 high severity. ATS/IDSA 2019 prefers PSI for outpatient decisions and its own severe-CAP criteria for ICU decisions.",ar:"0–1 منخفض، 2 متوسط، 3–5 شديد."}},
 fn(p){if(!p.f.pneumonia)return {na:1,note:lang==="ar"?"لا يوجد التهاب رئوي موثق.":"No pneumonia documented."};const c=cur(p);
  const it=[["Confusion",p.v.gcs<15?1:0],["Urea >7",p.lab.urea>7?1:0],["RR ≥30",c.rr>=30?1:0],["SBP <90 or DBP ≤60",(c.sbp<90||c.dbp<=60)?1:0],["Age ≥65",p.age>=65?1:0]];const n=it.reduce((a,x)=>a+x[1],0);
  return {num:n,max:5,band:n>=3?"high":n===2?"med":"low",inputs:it.map(x=>[x[0],x[1]?"Yes":"No"])}}},
{id:"heart",pack:["er","cardio"],name:"HEART",sub:{en:"Chest pain, 6-week MACE risk",ar:"ألم الصدر، خطر الأحداث القلبية خلال 6 أسابيع"},
 src:{name:"Six et al., Neth Heart J 2008; Backus et al., Int J Cardiol 2013",ver:"HEART score",note:{en:"0–3 low, 4–6 moderate, 7–10 high. History and ECG items are clinician-entered.",ar:"0–3 منخفض، 4–6 متوسط، 7–10 مرتفع."}},
 fn(p){const h=p.heart;if(!h)return {na:1,note:lang==="ar"?"لا يوجد ألم صدري موثق.":"No chest pain presentation documented."};
  const age=p.age>=65?2:p.age>=45?1:0,rf=(h.rf>=3||h.athero)?2:h.rf>=1?1:0,tr=p.lab.trop<=14?0:p.lab.trop<=42?1:2;const n=h.h+h.ecg+age+rf+tr;
  return {num:n,max:10,band:n>=7?"high":n>=4?"med":"low",inputs:[["History",h.h+" (clinician)"],["ECG",h.ecg+" (clinician)"],["Age",age],["Risk factors",rf],["Troponin",tr+" ("+p.lab.trop+" ng/L)"]]}}},
{id:"timi",pack:["cardio"],name:"TIMI",sub:{en:"UA/NSTEMI, 14-day risk",ar:"الذبحة غير المستقرة/احتشاء دون ارتفاع ST"},
 src:{name:"Antman et al., JAMA 2000",ver:"TIMI UA/NSTEMI",note:{en:"0–2 low, 3–4 intermediate, 5–7 high.",ar:"0–2 منخفض، 3–4 متوسط، 5–7 مرتفع."}},
 fn(p){const x=p.timi;if(!x)return {na:1,note:lang==="ar"?"لا يوجد اشتباه بمتلازمة شريانية حادة.":"No suspected ACS documented."};
  const rf=(p.f.htn?1:0)+(p.f.dm?1:0)+(p.history.some(h=>/smok/i.test(h))?1:0)+(p.history.some(h=>/lipid/i.test(h))?1:0);
  const it=[["Age ≥65",p.age>=65],["≥3 CAD risk factors",rf>=3],["Known CAD ≥50%",x.known],["Aspirin in 7 days",x.asa],["≥2 angina episodes 24 h",x.angina],["ST deviation ≥0.5 mm",x.st],["Positive marker",p.lab.trop>14]];const n=it.filter(i=>i[1]).length;
  return {num:n,max:7,band:n>=5?"high":n>=3?"med":"low",inputs:it.map(i=>[i[0],i[1]?"Yes":"No"])}}},
{id:"grace",pack:["cardio"],name:"GRACE",sub:{en:"ACS in-hospital mortality points",ar:"خطر الوفاة داخل المستشفى للمتلازمة الشريانية الحادة"},
 src:{name:"Granger et al., Arch Intern Med 2003; ESC 2023 ACS guideline; ACC/AHA 2025 ACS guideline",ver:"GRACE (in-hospital points)",note:{en:"Score >140 identifies high risk; ESC 2023 and ACC/AHA 2025 support early invasive strategy (within 24 h) for high-risk NSTE-ACS.",ar:"أكثر من 140 خطر مرتفع، وتدعم الإرشادات التدخل المبكر خلال 24 ساعة."}},
 fn(p){const g=p.grace;if(!g)return {na:1,note:lang==="ar"?"لا يوجد اشتباه بمتلازمة شريانية حادة.":"No suspected ACS documented."};const c=cur(p),a=p.age,cr=p.lab.cr;
  const age=a<30?0:a<40?8:a<50?25:a<60?41:a<70?58:a<80?75:a<90?91:100,hr=c.hr<50?0:c.hr<70?3:c.hr<90?9:c.hr<110?15:c.hr<150?24:c.hr<200?38:46,
  sbp=c.sbp<80?58:c.sbp<100?53:c.sbp<120?43:c.sbp<140?34:c.sbp<160?24:c.sbp<200?10:0,crp=cr<0.4?1:cr<0.8?4:cr<1.2?7:cr<1.6?10:cr<2?13:cr<4?21:28,kil=[0,0,20,39,59][g.killip];
  const n=age+hr+sbp+crp+kil+(g.arrest?39:0)+(g.st?28:0)+(g.enz?14:0);
  return {num:n,band:n>140?"high":n>108?"med":"low",inputs:[["Age",age],["HR",hr],["SBP",sbp],["Creatinine",crp],["Killip "+g.killip,kil],["ST deviation",g.st?28:0],["Raised troponin",g.enz?14:0]]}}},
{id:"cha",pack:["cardio","heme"],name:"CHA₂DS₂-VA",sub:{en:"AF stroke risk (ESC 2024)",ar:"خطر السكتة في الرجفان الأذيني (ESC 2024)"},
 src:{name:"ESC 2024 AF guideline (Van Gelder et al., Eur Heart J 2024)",ver:"CHA₂DS₂-VA (replaces CHA₂DS₂-VASc in ESC 2024)",note:{en:"Female sex removed. Oral anticoagulation recommended at ≥2, should be considered at 1. Not for hypertrophic cardiomyopathy or cardiac amyloidosis.",ar:"أزيل معيار الجنس. يوصى بمضاد التخثر عند 2 فأكثر، ويُنظر فيه عند 1."}},
 fn(p){if(!p.f.af)return {na:1,note:lang==="ar"?"لا يوجد رجفان أذيني موثق.":"No atrial fibrillation documented."};const f=p.f;
  const it=[["CHF",f.chf?1:0],["Hypertension",f.htn?1:0],["Age ≥75",p.age>=75?2:0],["Diabetes",f.dm?1:0],["Stroke/TIA",f.stroke?2:0],["Vascular disease",f.vasc?1:0],["Age 65–74",p.age>=65&&p.age<75?1:0]];const n=it.reduce((a,x)=>a+x[1],0);
  return {num:n,max:8,band:n>=2?"high":n===1?"med":"low",inputs:it.filter(x=>x[1]).map(x=>[x[0],"+"+x[1]]),info:p.sex==="F"?{en:"Legacy CHA₂DS₂-VASc would be "+(n+1)+" (adds 1 for female sex).",ar:"المقياس القديم CHA₂DS₂-VASc سيكون "+(n+1)+"."}:null}}},
{id:"apache",pack:["icu"],name:"APACHE II",sub:{en:"ICU severity of illness",ar:"شدة المرض في العناية المركزة"},
 src:{name:"Knaus et al., Crit Care Med 1985",ver:"APACHE II",note:{en:"Validated on worst values in the first 24 h of ICU admission. Ward values are shown for escalation discussion only.",ar:"معتمد على أسوأ القيم في أول 24 ساعة بالعناية المركزة."}},
 fn(p){if(!p.f.icu)return {na:1,note:ICUNOTE()};const l=p.lab,c=cur(p);const miss=[];if(l.pao2==null)miss.push("PaO₂");if(l.ph==null)miss.push("pH");
  const tp=x=>x>=41?4:x>=39?3:x>=38.5?1:x>=36?0:x>=34?1:x>=32?2:x>=30?3:4;const map=(c.sbp+2*c.dbp)/3;
  const mp=x=>x>=160?4:x>=130?3:x>=110?2:x>=70?0:x>=50?2:4,hp=x=>x>=180?4:x>=140?3:x>=110?2:x>=70?0:x>=55?2:x>=40?3:4,rp=x=>x>=50?4:x>=35?3:x>=25?1:x>=12?0:x>=10?1:x>=6?2:4;
  const op=l.pao2==null?0:(p.v.fio2>=.5?0:(l.pao2>70?0:l.pao2>=61?1:l.pao2>=55?3:4));
  const php=l.ph==null?0:(l.ph>=7.7?4:l.ph>=7.6?3:l.ph>=7.5?1:l.ph>=7.33?0:l.ph>=7.25?2:l.ph>=7.15?3:4);
  const na=x=>x>=180?4:x>=160?3:x>=155?2:x>=150?1:x>=130?0:x>=120?2:x>=111?3:4,kp=x=>x>=7?4:x>=6?3:x>=5.5?1:x>=3.5?0:x>=3?1:x>=2.5?2:4;
  let crp=l.cr>=3.5?4:l.cr>=2?3:l.cr>=1.5?2:l.cr>=0.6?0:2;if(p.f.aki)crp*=2;
  const hc=x=>x>=60?4:x>=50?2:x>=46?1:x>=30?0:x>=20?2:4,wb=x=>x>=40?4:x>=20?2:x>=15?1:x>=3?0:x>=1?2:4;
  const ag=p.age<=44?0:p.age<=54?2:p.age<=64?3:p.age<=74?5:6;
  const parts=[["Temp",tp(c.t)],["MAP "+Math.round(map),mp(map)],["HR",hp(c.hr)],["RR",rp(c.rr)],["Oxygenation",op],["pH",php],["Na",na(l.na)],["K",kp(l.k)],["Creatinine"+(p.f.aki?" ×2 (AKI)":""),crp],["Hct",hc(l.hct)],["WBC",wb(l.wbc)],["GCS",15-p.v.gcs],["Age",ag],["Chronic health",0]];
  const n=parts.reduce((a,x)=>a+x[1],0);
  return {num:n,max:71,band:miss.length?"partial":"info",label:lang==="ar"?"تقدير جناح، بلا حدود معتمدة":"Ward estimate, no validated cut-offs",inputs:parts.filter(x=>x[1]).map(x=>[x[0],"+"+x[1]]),miss,
   warns:[{en:"Validated for ICU first-24 h worst values. Shown for escalation context.",ar:"معتمد على قيم العناية المركزة في أول 24 ساعة."}]}}},
{id:"saps",pack:["icu"],name:"SAPS II",sub:{en:"Simplified Acute Physiology Score",ar:"مقياس الفيزيولوجيا الحادة المبسط"},
 src:{name:"Le Gall et al., JAMA 1993",ver:"SAPS II",note:{en:"Predicted mortality is shown only when all 17 variables are present. logit = −7.7631 + 0.0737·SAPS + 0.9971·ln(SAPS + 1).",ar:"تُعرض نسبة الوفاة المتوقعة فقط عند اكتمال المتغيرات السبعة عشر."}},
 fn(p){if(!p.f.icu)return {na:1,note:ICUNOTE()};const l=p.lab,c=cur(p),miss=[];const bun=l.urea*2.8;
  const age=p.age<40?0:p.age<60?7:p.age<70?12:p.age<75?15:p.age<80?16:18,hr=c.hr<40?11:c.hr<70?2:c.hr<120?0:c.hr<160?4:7,sbp=c.sbp<70?13:c.sbp<100?5:c.sbp<200?0:2,tmp=c.t>=39?3:0,
  b=bun<28?0:bun<84?6:10,w=l.wbc<1?12:l.wbc<20?0:3,k=l.k<3?3:l.k<5?0:3,na=l.na<125?5:l.na<145?0:1,hc=l.hco3<15?6:l.hco3<20?3:0,g=p.v.gcs<6?26:p.v.gcs<9?13:p.v.gcs<11?7:p.v.gcs<14?5:0,adm=p.f.adm==="medical"?6:p.f.adm==="surgical_u"?8:0;
  if(l.uo==null)miss.push(lang==="ar"?"إخراج البول 24 ساعة":"24 h urine output");if(l.bili==null)miss.push(lang==="ar"?"البيليروبين":"Bilirubin");
  const n=age+hr+sbp+tmp+b+w+k+na+hc+g+adm;
  const mort=miss.length?null:(()=>{const lg=-7.7631+0.0737*n+0.9971*Math.log(n+1);return Math.round(100*Math.exp(lg)/(1+Math.exp(lg)))})();
  return {num:(miss.length?"≥":"")+n,band:miss.length?"partial":n>=40?"high":n>=30?"med":"low",label:mort!=null?mort+"% predicted mortality":(lang==="ar"?"جزئية":"Partial score"),inputs:[["Age",age],["HR",hr],["SBP",sbp],["BUN",b],["HCO₃",hc],["Admission",adm]].filter(x=>x[1]),miss}}},
{id:"egfr",pack:["renal","core"],name:"eGFR (CKD-EPI 2021)",sub:{en:"Race-free creatinine equation",ar:"معادلة الكرياتينين دون عامل العرق"},
 src:{name:"Inker et al., NEJM 2021 (CKD-EPI 2021); KDIGO 2024 CKD guideline",ver:"CKD-EPI 2021",note:{en:"G1 ≥90, G2 60–89, G3a 45–59, G3b 30–44, G4 15–29, G5 <15 mL/min/1.73 m². Not valid while creatinine is changing (AKI).",ar:"G1 ≥90، G2 60–89، G3a 45–59، G3b 30–44، G4 15–29، G5 أقل من 15. غير دقيق أثناء الإصابة الكلوية الحادة."}},
 fn(p){const f=p.sex==="F",k=f?0.7:0.9,a=f?-0.241:-0.302,r=p.lab.cr/k;const v=Math.round(142*Math.pow(Math.min(r,1),a)*Math.pow(Math.max(r,1),-1.2)*Math.pow(0.9938,p.age)*(f?1.012:1));const g=v>=90?"G1":v>=60?"G2":v>=45?"G3a":v>=30?"G3b":v>=15?"G4":"G5";
  return {num:v,band:v>=60?"low":v>=30?"med":"high",label:g+", mL/min/1.73 m²",inputs:[["Creatinine",crU(p.lab.cr)+" µmol/L"],["Age",p.age],["Sex",p.sex]],warns:p.f.aki?[{en:"Creatinine is rising (AKI): eGFR overestimates kidney function until steady state.",ar:"الكرياتينين في ارتفاع: المعدل المقدر يبالغ في وظيفة الكلى."}]:[]}}},
{id:"aki",pack:["renal"],name:{en:"KDIGO AKI stage",ar:"مرحلة الإصابة الكلوية الحادة"},sub:{en:"Creatinine and urine output criteria",ar:"معايير الكرياتينين وإخراج البول"},
 src:{name:"KDIGO Clinical Practice Guideline for Acute Kidney Injury, 2012",ver:"KDIGO 2012",note:{en:"Stage 1: rise ≥26.5 µmol/L in 48 h or 1.5–1.9× baseline, or urine <0.5 mL/kg/h for 6–12 h. Stage 2: 2.0–2.9×. Stage 3: ≥3×, creatinine ≥354 µmol/L or renal replacement therapy.",ar:"المرحلة 1: ارتفاع ≥26.5 ميكرومول/ل خلال 48 ساعة أو 1.5–1.9 ضعف. المرحلة 2: 2–2.9 ضعف. المرحلة 3: 3 أضعاف أو أكثر."}},
 fn(p){const b=p.prev.cr;if(b==null)return {na:1,note:lang==="ar"?"لا توجد قيمة كرياتينين سابقة للمقارنة.":"No previous creatinine for comparison."};const c=p.lab.cr,rt=c/b,d=c-b;let st=0;if(rt>=3||c>=4)st=3;else if(rt>=2)st=2;else if(rt>=1.5||d>=0.3)st=1;
  return {num:st?(lang==="ar"?"المرحلة "+st:"Stage "+st):(lang==="ar"?"لا إصابة":"No AKI"),band:st>=2?"high":st===1?"med":"low",label:"×"+rt.toFixed(2)+(lang==="ar"?" من الأساس":" baseline"),inputs:[["Baseline",crU(b)+" µmol/L"],["Current",crU(c)+" µmol/L"],["Change",(d>=0?"+":"")+Math.round(d*88.4)+" µmol/L"]].concat(p.uo?[["Urine output",p.uo]]:[])}}},
{id:"crcl",pack:["renal","heme"],name:{en:"Creatinine clearance",ar:"تصفية الكرياتينين"},sub:{en:"Cockcroft–Gault, for drug dosing",ar:"كوكروفت-غولت لتعديل جرعات الأدوية"},
 src:{name:"Cockcroft & Gault, Nephron 1976",ver:"Cockcroft–Gault",note:{en:"CrCl = (140 − age) × weight × 0.85 if female ÷ (72 × creatinine mg/dL). Many drug labels use CrCl for renal dose adjustment.",ar:"تُستخدم في كثير من نشرات الأدوية لتعديل الجرعة الكلوية."}},
 fn(p){const v=Math.round((140-p.age)*p.wt*(p.sex==="F"?0.85:1)/(72*p.lab.cr));return {num:v,band:v<30?"high":v<60?"med":"low",label:"mL/min",inputs:[["Age",p.age],["Weight",p.wt+" kg"],["Creatinine",crU(p.lab.cr)+" µmol/L"]],warns:p.wt/((p.ht/100)**2)>=30?[{en:"BMI ≥30: actual weight may overestimate clearance. Check pharmacy policy on adjusted weight.",ar:"مؤشر الكتلة 30 فأكثر: قد يبالغ الوزن الفعلي في التقدير."}]:[]}}},
{id:"wells",pack:["pulm","er","heme"],name:{en:"Wells score for PE",ar:"مقياس ويلز للانصمام الرئوي"},sub:{en:"Pretest probability, two-tier",ar:"الاحتمال قبل الفحص، مستويان"},
 src:{name:"Wells et al., Thromb Haemost 2000; ESC 2019 acute PE guideline",ver:"Wells (two-tier)",note:{en:"≤4 PE unlikely: D-dimer (age-adjusted over 50 years: age × 10 µg/L). >4 PE likely: CT pulmonary angiography. DVT signs and 'PE most likely' are clinician-entered.",ar:"4 أو أقل: الانصمام غير مرجح، يُطلب دي-دايمر. أكثر من 4: مرجح، يُطلب تصوير مقطعي للشرايين الرئوية."}},
 fn(p){const w=p.wells;if(!w)return {na:1,note:lang==="ar"?"لا يوجد سؤال انصمام رئوي موثق.":"No PE question documented."};const c=cur(p);
  const it=[["Clinical DVT signs",w.dvt?3:0],["PE most likely diagnosis",w.likely?3:0],["HR >100",c.hr>100?1.5:0],["Immobilised ≥3 d or surgery ≤4 wk",(p.f.immob||p.f.surg)?1.5:0],["Previous DVT/PE",p.f.priorVTE?1.5:0],["Haemoptysis",w.hemo?1:0],["Active cancer",p.f.cancer?1:0]];const n=it.reduce((a,x)=>a+x[1],0);
  return {num:n,max:12.5,band:n>4?"high":"low",label:n>4?(lang==="ar"?"الانصمام مرجح":"PE likely"):(lang==="ar"?"الانصمام غير مرجح":"PE unlikely"),inputs:it.filter(x=>x[1]).map(x=>[x[0],"+"+x[1]]).concat([["DVT signs","clinician: no"],["PE most likely","clinician: no"]]),warns:p.f.infect?[{en:"D-dimer is often raised in infection, which lowers its usefulness here.",ar:"يرتفع دي-دايمر غالبًا مع العدوى مما يقلل فائدته هنا."}]:[]}}},
{id:"sirs",pack:["id","er"],name:"SIRS",sub:{en:"Systemic inflammatory response criteria",ar:"معايير الاستجابة الالتهابية الجهازية"},
 src:{name:"ACCP/SCCM consensus (Bone et al., Chest 1992); Surviving Sepsis Campaign 2021",ver:"SIRS",note:{en:"Temp >38 or <36 °C, HR >90, RR >20 or PaCO₂ <32 mmHg, WBC >12 or <4 ×10⁹/L. Met when ≥2. SSC 2021 prefers SIRS, NEWS or MEWS over qSOFA alone for screening.",ar:"تتحقق بوجود معيارين أو أكثر. تفضّلها إرشادات 2021 على qSOFA منفردًا للفحص."}},
 fn(p){const c=cur(p),l=p.lab;const it=[["Temp >38 or <36",c.t>38||c.t<36],["HR >90",c.hr>90],["RR >20",c.rr>20||(l.paco2!=null&&l.paco2<32)],["WBC >12 or <4",l.wbc>12||l.wbc<4]];const n=it.filter(x=>x[1]).length;
  return {num:n,max:4,band:n>=2?"high":n===1?"med":"low",label:n>=2?(lang==="ar"?"المعايير متحققة":"Criteria met"):(lang==="ar"?"غير متحققة":"Not met"),inputs:it.map(x=>[x[0],x[1]?"Yes":"No"])}}},
{id:"hasbled",pack:["cardio","heme"],name:"HAS-BLED",sub:{en:"Bleeding risk on anticoagulation",ar:"خطر النزيف مع مضادات التخثر"},
 src:{name:"Pisters et al., Chest 2010; ESC 2024 AF guideline",ver:"HAS-BLED",note:{en:"≥3 high bleeding risk. ESC 2024: use it to find and fix modifiable bleeding risks, not as a reason to withhold anticoagulation.",ar:"3 فأكثر خطر مرتفع. يُستخدم لمعالجة العوامل القابلة للتعديل وليس لحجب مضاد التخثر."}},
 fn(p){if(!p.f.af)return {na:1,note:lang==="ar"?"لا يوجد رجفان أذيني موثق.":"No atrial fibrillation documented."};const c=cur(p);const anti=p.meds.some(m=>/aspirin|clopidogrel|ticagrelor|ibuprofen|naproxen|diclofenac/i.test(m[0]));
  const it=[["SBP >160",c.sbp>160],["Abnormal renal function",p.lab.cr>=2.26||p.f.dialysis],["Abnormal liver function",p.f.liver],["Stroke",p.f.stroke],["Bleeding history",p.f.bleed],["Labile INR",p.f.labileINR],["Age >65",p.age>65],["Antiplatelet or NSAID",anti],["Alcohol excess",p.f.alcohol]];const n=it.filter(x=>x[1]).length;
  return {num:n,max:9,band:n>=3?"high":n===2?"med":"low",inputs:it.filter(x=>x[1]).map(x=>[x[0],"+1"]),info:{en:"Modifiable now: blood pressure, antiplatelets/NSAIDs, alcohol.",ar:"قابل للتعديل الآن: ضغط الدم، مضادات الصفائح والمسكنات، الكحول."}}}},
{id:"cna",pack:["endo"],name:{en:"Corrected sodium",ar:"الصوديوم المصحح"},sub:{en:"For hyperglycaemia",ar:"لارتفاع سكر الدم"},
 src:{name:"Hillier et al., Am J Med 1999",ver:"Correction factor 2.4",note:{en:"Corrected Na = Na + 0.024 × (glucose mg/dL − 100). The Katz (1973) factor of 1.6 gives a lower estimate.",ar:"الصوديوم المصحح = الصوديوم + 0.024 × (السكر ملغ/دل − 100)."}},
 fn(p){const g=p.lab.glu;if(g==null||g<11.1)return {na:1,note:lang==="ar"?"السكر غير مرتفع (أقل من 11.1 ملمول/ل).":"Glucose not raised (under 11.1 mmol/L)."};const v=Math.round((p.lab.na+0.024*(g*18-100))*10)/10;
  return {num:v,band:v<130||v>150?"high":v<135||v>145?"med":"low",label:"mmol/L",inputs:[["Measured Na",p.lab.na],["Glucose",g+" mmol/L"]]}}},
{id:"osm",pack:["endo","renal"],name:{en:"Calculated osmolality",ar:"الأسمولية المحسوبة"},sub:{en:"2 × Na + glucose + urea",ar:"2 × الصوديوم + السكر + اليوريا"},
 src:{name:"Standard SI formula, all values in mmol/L",ver:"Reference 275–295 mOsm/kg",note:{en:"Osmolar gap needs a measured osmolality; a gap above 10 suggests unmeasured osmoles.",ar:"تتطلب الفجوة الأسمولية قياسًا مخبريًا، وأكثر من 10 يشير لمواد غير مقاسة."}},
 fn(p){const l=p.lab;if(l.glu==null||l.urea==null)return {na:1,note:"Glucose or urea missing"};const v=Math.round(2*l.na+l.glu+l.urea);
  return {num:v,band:v>320||v<260?"high":v>295||v<275?"med":"low",label:"mOsm/kg",inputs:[["Na",l.na],["Glucose",l.glu],["Urea",l.urea]]}}},
{id:"gcs",pack:["neuro","er","icu"],name:"GCS",sub:{en:"Glasgow Coma Scale",ar:"مقياس غلاسكو للغيبوبة"},
 src:{name:"Teasdale & Jennett, Lancet 1974",ver:"GCS",note:{en:"15 normal, 13–14 mild, 9–12 moderate, ≤8 severe (consider airway protection). Record eye, verbal and motor components.",ar:"15 طبيعي، 13–14 خفيف، 9–12 متوسط، 8 أو أقل شديد."}},
 fn(p){const g=p.v.gcs;return {num:g,max:15,band:g<=12?"high":g<15?"med":"low",label:g===15?(lang==="ar"?"طبيعي":"Normal"):g>=13?(lang==="ar"?"خفيف":"Mild"):g>=9?(lang==="ar"?"متوسط":"Moderate"):(lang==="ar"?"شديد":"Severe"),inputs:[["ACVPU",p.v.avpu]]}}},
{id:"abcd2",pack:["neuro"],name:"ABCD²",sub:{en:"Stroke risk after TIA",ar:"خطر السكتة بعد النوبة الإقفارية العابرة"},
 src:{name:"Johnston et al., Lancet 2007; NICE NG128 (2019)",ver:"ABCD²",note:{en:"NICE NG128 advises specialist assessment within 24 h for suspected TIA and not using ABCD² to set urgency.",ar:"توصي NICE بتقييم تخصصي خلال 24 ساعة لكل اشتباه دون الاعتماد على المقياس."}},
 fn(p){return {na:1,note:lang==="ar"?"لا توجد نوبة إقفارية عابرة موثقة.":"No TIA documented."}}},
{id:"meows",pack:["obs"],name:"MEOWS",sub:{en:"Modified Early Obstetric Warning Score",ar:"مقياس الإنذار المبكر التوليدي المعدل"},
 src:{name:"Singh et al., Anaesthesia 2012",ver:"MEOWS trigger criteria",note:{en:"Trigger: one red or two yellow parameters. Thresholds vary between hospitals; follow the local obstetric chart.",ar:"الإنذار: معيار أحمر واحد أو معياران أصفران. تختلف الحدود بين المستشفيات."}},
 fn(p){if(!p.f.postpartum&&!p.f.preg)return {na:1,note:lang==="ar"?"ليست حاملًا أو في فترة ما بعد الولادة.":"Not pregnant or postnatal."};const c=cur(p);let r=0,y=0;
  if(c.t<35||c.t>38)r++;else if(c.t<36)y++;
  if(c.sbp<90||c.sbp>160)r++;else if(c.sbp<100||c.sbp>=150)y++;
  if(c.dbp>100)r++;else if(c.dbp>=90)y++;
  if(c.hr<40||c.hr>120)r++;else if(c.hr<50||c.hr>=100)y++;
  if(c.rr<10||c.rr>30)r++;else if(c.rr>=21)y++;
  if(c.spo2<95)r++;if(p.v.avpu!=="A")r++;
  const trig=r>=1||y>=2;return {num:trig?(lang==="ar"?"إنذار":"Trigger"):(lang==="ar"?"لا إنذار":"No trigger"),band:trig?"high":y?"med":"low",label:r+(lang==="ar"?" أحمر، ":" red, ")+y+(lang==="ar"?" أصفر":" yellow"),inputs:[["BP",c.sbp+"/"+c.dbp],["HR",c.hr],["RR",c.rr],["SpO₂",c.spo2+"%"],["Temp",c.t]]}}},
{id:"meld",pack:["gi"],name:"MELD-Na",sub:{en:"Chronic liver disease severity",ar:"شدة مرض الكبد المزمن"},
 src:{name:"Kim et al., NEJM 2008 (MELD-Na), OPTN formula",ver:"MELD-Na",note:{en:"For cirrhosis. Uses creatinine, bilirubin, INR and sodium (bounded 125–137). MELD 3.0 (Kim 2021) adds sex and albumin.",ar:"لتليف الكبد فقط. يعتمد على الكرياتينين والبيليروبين وINR والصوديوم."}},
 fn(p){if(!p.f.cirrhosis)return {na:1,note:lang==="ar"?"لا يوجد تليف كبدي موثق.":"No cirrhosis documented."};const l=p.lab,miss=[];if(l.bili==null)miss.push("Bilirubin");if(l.inr==null)miss.push("INR");if(miss.length)return {num:"—",band:"partial",label:t("partial"),inputs:[],miss};
  const cr=Math.min(Math.max(l.cr,1),4),bi=Math.max(l.bili,1),inr=Math.max(l.inr,1);const m=Math.round(10*(0.957*Math.log(cr)+0.378*Math.log(bi)+1.12*Math.log(inr)+0.643));const na=Math.min(Math.max(l.na,125),137);const v=Math.round(m>11?m+1.32*(137-na)-0.033*m*(137-na):m);
  return {num:v,max:40,band:v>=30?"high":v>=20?"med":"low",inputs:[["Creatinine",l.cr],["Bilirubin",l.bili],["INR",l.inr],["Na",l.na]]}}},
{id:"gbs",pack:["gi"],name:"Glasgow-Blatchford",sub:{en:"Upper GI bleeding risk",ar:"خطر نزيف الجهاز الهضمي العلوي"},
 src:{name:"Blatchford et al., Lancet 2000; NICE CG141",ver:"Glasgow-Blatchford score",note:{en:"A score of 0–1 identifies low-risk patients who may be suitable for outpatient care.",ar:"الدرجة 0–1 تحدد المرضى منخفضي الخطورة."}},
 fn(p){return {na:1,note:lang==="ar"?"لا يوجد نزيف هضمي موثق.":"No GI bleeding documented."}}},
{id:"wellsdvt",pack:["heme","er","surg"],name:{en:"Wells score for DVT",ar:"مقياس ويلز للخثار الوريدي العميق"},sub:{en:"Pretest probability, two-level (NICE NG158)",ar:"الاحتمال قبل الفحص، مستويان"},
 src:{name:"Wells et al., NEJM 2003; NICE NG158 (2020)",ver:"Wells DVT (two-level)",note:{en:"≥2 DVT likely: proximal leg vein ultrasound within 4 h. ≤1 DVT unlikely: D-dimer. Examination items are clinician-entered.",ar:"2 فأكثر: مرجح، تصوير بالموجات خلال 4 ساعات. 1 أو أقل: غير مرجح، دي-دايمر."}},
 fn(p){const w=p.wd;if(!w)return {na:1,note:lang==="ar"?"لا يوجد سؤال خثار وريدي موثق.":"No DVT question documented."};
  const it=[["Active cancer",p.f.cancer?1:0],["Paralysis, paresis or recent plaster",w.paralysis?1:0],["Bedridden ≥3 d or major surgery ≤12 wk",(p.f.immob||p.f.surg)?1:0],["Tenderness along deep veins",w.tender?1:0],["Entire leg swollen",w.swollen?1:0],["Calf swelling >3 cm",w.calf?1:0],["Pitting oedema",w.edema?1:0],["Collateral superficial veins",w.veins?1:0],["Previous DVT",p.f.priorVTE?1:0],["Alternative diagnosis as likely",w.alt?-2:0]];const n=sumA(it.map(x=>x[1]));
  return {num:n,band:n>=2?"high":"low",label:n>=2?(lang==="ar"?"الخثار مرجح":"DVT likely"):(lang==="ar"?"الخثار غير مرجح":"DVT unlikely"),inputs:it.filter(x=>x[1]).map(x=>[x[0],(x[1]>0?"+":"")+x[1]]),warns:n>=2?[{en:"Arrange proximal leg vein ultrasound (NICE NG158).",ar:"رتّب تصويرًا بالموجات لأوردة الساق."}]:[]}}},
{id:"caprini",pack:["surg","heme"],name:"Caprini",sub:{en:"VTE risk in surgical patients",ar:"خطر الجلطات لدى مرضى الجراحة"},
 src:{name:"Caprini, Dis Mon 2005; ACCP 2012 non-orthopaedic surgery guideline (Gould et al., Chest)",ver:"Caprini RAM 2005",note:{en:"0 very low, 1–2 low, 3–4 moderate, ≥5 high. ACCP 2012 suggests extended (4-week) LMWH after abdominal or pelvic cancer surgery.",ar:"5 فأكثر خطر مرتفع."}},
 fn(p){if(!p.f.surg)return {na:1,note:lang==="ar"?"ليس مريضًا جراحيًا. يُستخدم Padua لمرضى الباطنة.":"Not a surgical patient. Padua is used for medical inpatients."};if(p.f.postpartum)return {na:1,note:lang==="ar"?"غير معتمد بعد الولادة: يُستخدم تقييم RCOG.":"Not validated after childbirth: use the RCOG obstetric VTE assessment."};
  const a=p.age;const it=[["Age",a>=75?3:a>=61?2:a>=41?1:0],["Major surgery >45 min",p.f.majorSurg?2:0],["BMI >25",p.wt/((p.ht/100)**2)>25?1:0],["Malignancy",p.f.cancer?2:0],["Confined to bed >72 h",p.f.immob?2:0],["History of VTE",p.f.priorVTE?3:0],["Heart failure",p.f.chf?1:0],["Sepsis or pneumonia <1 month",p.f.infect?1:0]];const n=sumA(it.map(x=>x[1]));
  const onAC=p.meds.some(m=>/enoxaparin|heparin|fondaparinux/i.test(m[0]));
  return {num:n,band:n>=5?"high":n>=3?"med":"low",inputs:it.filter(x=>x[1]).map(x=>[x[0],"+"+x[1]]),info:onAC?{en:"Pharmacological prophylaxis ordered."+(p.f.cancer&&p.f.majorSurg?" Consider extended 28-day LMWH after cancer surgery (ACCP 2012).":""),ar:"الوقاية الدوائية مطلوبة."}:null,warns:!onAC&&n>=3?[{en:"No pharmacological prophylaxis ordered.",ar:"لا توجد وقاية دوائية."}]:[]}}},
{id:"rcri",pack:["surg","cardio"],name:"RCRI",sub:{en:"Revised Cardiac Risk Index, pre-operative",ar:"مؤشر الخطر القلبي المعدل قبل الجراحة"},
 src:{name:"Lee et al., Circulation 1999; ESC 2022 non-cardiac surgery guideline",ver:"RCRI (Lee)",note:{en:"Major cardiac complication risk in the original cohort: 0 = 0.4%, 1 = 0.9%, 2 = 6.6%, ≥3 = 11%. ESC 2022 advises combining with functional capacity and biomarkers.",ar:"خطر المضاعفات القلبية الكبرى حسب عدد العوامل."}},
 fn(p){if(!p.f.surg||p.f.postpartum)return {na:1,note:lang==="ar"?"لا توجد جراحة غير قلبية موثقة.":"No non-cardiac surgery documented."};
  const it=[["High-risk surgery",p.f.surgHigh?1:0],["Ischaemic heart disease",p.f.ihd?1:0],["Heart failure",p.f.chf?1:0],["Cerebrovascular disease",p.f.stroke?1:0],["Insulin-treated diabetes",p.f.insulin?1:0],["Creatinine >177 µmol/L",p.lab.cr>2?1:0]];const n=sumA(it.map(x=>x[1]));const r=["0.4%","0.9%","6.6%","11%"][Math.min(n,3)];
  return {num:n,max:6,band:n>=2?"high":n===1?"med":"low",label:r+(lang==="ar"?" خطر قلبي":" cardiac risk"),inputs:it.filter(x=>x[1]).map(x=>[x[0],"+1"]).concat([["Timing",lang==="ar"?"تقييم ما قبل العملية":"Pre-operative assessment"]])}}},
{id:"braden",pack:["nurs","core","surg"],name:{en:"Braden scale",ar:"مقياس برادن"},sub:{en:"Pressure injury risk, nursing assessment",ar:"خطر قرح الضغط، تقييم تمريضي"},
 src:{name:"Bergstrom et al., Nurs Res 1987",ver:"Braden scale (6–23)",note:{en:"≤9 very high, 10–12 high, 13–14 moderate, 15–18 mild risk, ≥19 no risk. Lower is worse.",ar:"كلما انخفضت الدرجة زاد الخطر."}},
 fn(p){const b=p.ns&&p.ns.braden;if(!b)return NANS();const n=sumA(b);
  return {num:n,max:23,band:n<=12?"high":n<=18?"med":"low",label:n<=9?"Very high risk":n<=12?"High risk":n<=14?"Moderate risk":n<=18?"Mild risk":"No risk",inputs:["Sensory","Moisture","Activity","Mobility","Nutrition","Friction"].map((k,i)=>[k,b[i]])}}},
{id:"morse",pack:["nurs","core"],name:{en:"Morse Fall Scale",ar:"مقياس مورس للسقوط"},sub:{en:"Inpatient fall risk, nursing assessment",ar:"خطر السقوط، تقييم تمريضي"},
 src:{name:"Morse et al., Can J Aging 1989",ver:"Morse Fall Scale (0–125)",note:{en:"Common cut-offs: 0–24 low, 25–44 moderate, ≥45 high. Hospitals set their own thresholds.",ar:"45 فأكثر خطر مرتفع."}},
 fn(p){const m=p.ns&&p.ns.morse;if(!m)return NANS();const n=sumA(m);
  return {num:n,max:125,band:n>=45?"high":n>=25?"med":"low",label:n>=45?"High fall risk":n>=25?"Moderate fall risk":"Low fall risk",inputs:["History of falling","Secondary diagnosis","Ambulatory aid","IV access","Gait","Mental status"].map((k,i)=>[k,m[i]]).filter(x=>x[1])}}},
{id:"fourat",pack:["nurs","neuro","core"],name:"4AT",sub:{en:"Rapid delirium screen",ar:"فحص سريع للهذيان"},
 src:{name:"Bellelli et al., Age Ageing 2014; SIGN 157 delirium guideline (2019)",ver:"4AT (0–12)",note:{en:"≥4 possible delirium ± cognitive impairment; 1–3 possible cognitive impairment; 0 delirium unlikely.",ar:"4 فأكثر: احتمال هذيان."}},
 fn(p){const a=p.ns&&p.ns.at4;if(!a)return NANS();const n=sumA(a);
  return {num:n,max:12,band:n>=4?"high":n>=1?"med":"low",label:n>=4?"Possible delirium":n>=1?"Possible cognitive impairment":"Delirium unlikely",inputs:["Alertness","AMT4","Attention","Acute change"].map((k,i)=>[k,a[i]]),warns:p.f.stroke?[{en:"Aphasia can affect the verbal items.",ar:"قد تؤثر الحبسة على البنود اللفظية."}]:[]}}},
{id:"must",pack:["nurs","gi","surg"],name:"MUST",sub:{en:"Malnutrition Universal Screening Tool",ar:"أداة فحص سوء التغذية"},
 src:{name:"BAPEN (Elia, 2003); NICE CG32 nutrition support",ver:"MUST",note:{en:"0 low, 1 medium, ≥2 high risk: dietitian referral and nutrition plan.",ar:"2 فأكثر خطر مرتفع."}},
 fn(p){const m=p.ns&&p.ns.must;if(!m)return NANS();const n=sumA(m);
  return {num:n,max:6,band:n>=2?"high":n===1?"med":"low",inputs:[["BMI score",m[0]],["Weight loss score",m[1]],["Acute disease effect",m[2]]],warns:n>=2?[{en:"Dietitian referral recommended.",ar:"يوصى بالإحالة لأخصائي التغذية."}]:[]}}},
{id:"cfs",pack:["nurs","core"],name:{en:"Clinical Frailty Scale",ar:"مقياس الهشاشة السريري"},sub:{en:"Patients aged 65 and over",ar:"للمرضى 65 سنة فأكثر"},
 src:{name:"Rockwood et al., CMAJ 2005 (CFS version 2.0, 2020)",ver:"CFS 1–9",note:{en:"1–3 fit, 4 very mild, 5 mild, 6 moderate, 7–8 severe, 9 terminally ill. Supports escalation and ceiling-of-care discussions. Not for under 65.",ar:"يدعم نقاشات سقف الرعاية."}},
 fn(p){if(p.age<65)return {na:1,note:lang==="ar"?"أقل من 65 سنة.":"Under 65 years."};const v=p.ns&&p.ns.cfs;if(!v)return NANS();
  return {num:v,max:9,band:v>=7?"high":v>=5?"med":"low",label:["","Very fit","Fit","Managing well","Very mild frailty","Mild frailty","Moderate frailty","Severe frailty","Very severe frailty","Terminally ill"][v],inputs:[["Assessed","Admission"]]}}},
{id:"prism",pack:["peds"],name:"PRISM III",sub:{en:"Pediatric Risk of Mortality",ar:"خطر الوفاة لدى الأطفال"},
 src:{name:"Pollack et al., Crit Care Med 1996; Phoenix Sepsis Criteria (Schlapbach et al., JAMA 2024) for pediatric sepsis",ver:"PRISM III",note:{en:"For PICU patients under 18 years.",ar:"لمرضى عناية الأطفال دون 18 سنة."}},
 fn(p){return p.age<18?{num:"—",band:"info"}:{na:1,note:lang==="ar"?"مريض بالغ. يظهر للمرضى دون 18 سنة.":"Adult patient. Shown for patients under 18."}}}
];
const PACKS=["all","core","nurs","er","cardio","surg","pulm","renal","gi","endo","heme","id","neuro","obs","icu","peds"];
const UPDATES=[
 {t:{en:"CHA₂DS₂-VA replaces CHA₂DS₂-VASc",ar:"CHA₂DS₂-VA يحل محل CHA₂DS₂-VASc"},d:{en:"ESC 2024 AF guideline removed female sex from stroke risk scoring. CareBoard shows CHA₂DS₂-VA by default with the legacy score for comparison.",ar:"أزالت إرشادات ESC 2024 معيار الجنس من تقدير خطر السكتة."},s:"ESC, Eur Heart J 2024;45:3314–3414",st:"applied"},
 {t:{en:"2025 ACC/AHA acute coronary syndromes guideline",ar:"إرشادات ACC/AHA 2025 للمتلازمات الشريانية الحادة"},d:{en:"Published 27 Feb 2025. Supports GRACE-based risk stratification for invasive strategy timing; adds options such as transition to ticagrelor monotherapy after 1 month of DAPT in selected patients.",ar:"نُشرت في 27 فبراير 2025 وتدعم تقسيم المخاطر بمقياس GRACE."},s:"Circulation 2025;151:e771–e862",st:"review"},
 {t:{en:"qSOFA not recommended as a single screening tool",ar:"لا يوصى بـ qSOFA كأداة فحص منفردة"},d:{en:"Surviving Sepsis Campaign 2021 recommends against qSOFA alone compared with SIRS, NEWS or MEWS. CareBoard always pairs qSOFA with NEWS2 and lactate.",ar:"توصي حملة النجاة من الإنتان 2021 بعدم استخدامه منفردًا."},s:"Evans et al., Crit Care Med 2021",st:"applied"},
 {t:{en:"Phoenix Sepsis Criteria for children",ar:"معايير فينكس للإنتان لدى الأطفال"},d:{en:"New consensus definition of pediatric sepsis and septic shock. Candidate for the pediatric pack after hospital review.",ar:"تعريف جديد لإنتان الأطفال قيد مراجعة المستشفى."},s:"Schlapbach et al., JAMA 2024",st:"review"}
];

/* ---------------- why registry ---------------- */
const WHY=[];
function whyBtn(src,rule,ai,title){const i=WHY.push({src,rule,ai,title})-1;return `<button class="why" type="button" data-why="${i}">${t("why")}</button>`}
function openWhy(i){const w=WHY[i];if(!w)return;$("#dlgTitle").textContent=t("whyTitle");
 $("#dlgBody").innerHTML=`<div><h4>${t("src")}</h4><ul>${(w.src||[]).map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div><div><h4>${t("rule")}</h4><p>${esc(w.rule)}</p></div><div><h4>${t("type")}</h4><p><span class="tag ${w.ai?"amber":"cb"}">${w.ai?t("aiGen"):t("det")}</span></p></div><p class="tiny muted">${lang==="ar"?"لا يعرض كيربورد أي ادعاء غير مرتبط ببيانات الملف أو بإرشاد منشور.":"CareBoard shows no claim that is not tied to chart data or a published guideline."}</p>
 <div class="ai" style="padding:12px"><div class="ai-label">${IC.spark} ${lang==="ar"?"شرح من بيانات الملف والإرشادات":"Explanation from this chart and guidelines"}</div><div class="ai-out" id="whyOut" aria-live="polite"></div>
 <div class="askrow"><input id="whyQ" type="text" placeholder="${lang==="ar"?"اسأل سؤالًا متابعًا عن هذا العنصر…":"Ask a follow-up about this item…"}" aria-label="Follow-up question"><button class="btn primary" type="button" id="whyAsk">${t("send")}</button></div><div class="chips">${QCH().map(q=>`<button type="button" data-whyq="${esc(q)}">${esc(q)}</button>`).join("")}</div></div>`;
 S.whyCur=i;$("#dlg").showModal();
 showBuilt($("#whyOut"),whyAnswer(pat(S.pid),w))}

/* ---------------- helpers ---------------- */
const $=s=>document.querySelector(s);
function toast(m){const e=$("#toast");e.textContent=m;e.style.display="block";clearTimeout(toast._t);toast._t=setTimeout(()=>e.style.display="none",2600)}
function spark(vals,color,w=120,h=34){const mn=Math.min(...vals),mx=Math.max(...vals),r=mx-mn||1;const pts=vals.map((v,i)=>[4+i*(w-8)/(vals.length-1),h-6-(v-mn)/r*(h-14)]);
 return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><polyline fill="none" stroke="${color}" stroke-width="2" points="${pts.map(p=>p.join(",")).join(" ")}"/>${pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="${i===pts.length-1?3.2:2.2}" fill="${color}"/>`).join("")}</svg>`}
function trendChart(vals,labels,color){const w=230,h=78,mn=Math.min(...vals),mx=Math.max(...vals),r=mx-mn||1;const pts=vals.map((v,i)=>[16+i*(w-32)/(vals.length-1),h-22-(v-mn)/r*(h-42)]);
 return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${w}px" aria-hidden="true"><polyline fill="none" stroke="${color}" stroke-width="2" points="${pts.map(p=>p.join(",")).join(" ")}"/>${pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="${color}"/><text x="${p[0]}" y="${p[1]-7}" text-anchor="middle" font-size="10.5" font-weight="600" fill="${color}">${vals[i]}</text><text x="${p[0]}" y="${h-5}" text-anchor="middle" font-size="9.5" fill="var(--muted)">${labels[i]}</text>`).join("")}</svg>`}
const colorVar=b=>`var(--${bandOf(b)})`;
const IC={
 pulse:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12h4l3-7 4 14 3-7h4"/></svg>',
 list:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
 flask:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 3h6M10 3v6L4 20h16L14 9V3"/></svg>',
 pill:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-45 12 12)"/></svg>',
 img:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/></svg>',
 check:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12l5 5 9-10"/></svg>',
 note:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3h10l4 4v14H5z"/><path d="M9 12h6M9 16h6"/></svg>',
 up:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 17l6-6 4 4 6-7"/><path d="M14 8h6v6"/></svg>',
 target:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>',
 clock:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
 nurse:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6M12 3v3M10.5 4.5h3"/></svg>',
 spark:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>',
 lock:'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>',
 calc:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg>',
 swap:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/></svg>',
 radar:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12l6-6"/></svg>',
 shield:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>',
 chart:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
 user:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>'
};
const statusTag=s=>s==="det"?`<span class="tag red">${t("det_s")}</span>`:s==="watch"?`<span class="tag amber">${t("watch_s")}</span>`:`<span class="tag green">${t("stable_s")}</span>`;
const pname=p=>lang==="ar"?p.nameAr:p.name;

/* ---------------- AI (sample capability) ---------------- */
let sampleFn=null,sampleReady=false;
function aiStatusLine(){return "";if(!sampleReady)return "";return sampleFn?"":`<p class="tiny muted" style="margin-top:8px">${t("aiUnavailable")}</p>`}
function chartContext(p){
 const calcs=CALCS.map(c=>{const r=c.fn(p);return r.na?null:{score:L(c.name),value:r.num,band:r.band}}).filter(Boolean);
 return JSON.stringify({patient:{age:p.age,sex:p.sex,ward:p.ward,admissionDay:p.los,keyComplaints:p.complaints,background:p.history,allergies:p.allergies,codeStatus:p.code,exposure:p.exposure,weightKg:p.wt,heightCm:p.ht},
  vitals:p.times.map((tm,i)=>({time:tm,tempC:p.tr.t[i],hr:p.tr.hr[i],bp:p.tr.sbp[i]+"/"+p.tr.dbp[i],rr:p.tr.rr[i],spo2:p.tr.spo2[i],oxygenLmin:p.tr.o2[i]})),oxygenDevice:p.v.o2dev,avpu:p.v.avpu,gcs:p.v.gcs,
  labs:{time:p.labT,values:p.lab,previous:p.prev,previousTime:p.prevT,units:"WBC 10^9/L, CRP mg/L, lactate mmol/L, creatinine mg/dL, electrolytes mmol/L, albumin g/dL, urea mmol/L, glucose mmol/L, Hb g/L, troponin ng/L, NT-proBNP pg/mL"},
  medications:p.meds.map(m=>({drug:m[0],dose:m[1],status:m[2]})),imaging:p.imaging.map(i=>({study:i[0],when:i[1],finding:i[2]})),nursingNotes:p.nursing.map(n=>({time:n[0],note:n[2]})),latestSoapNote:curSoap(p),addenda:NB(p).add,openItems:p.open.map(o=>o[0]),calculatedScores:calcs})}
function aiPrompt(p,task){return `You are CareBoard AI, a clinical decision support assistant for a licensed hospital clinician in Saudi Arabia. Rules: use ONLY the chart data below. After each factual statement, cite the chart field in square brackets, e.g. [Vitals 18:00] or [Lab CRP]. If something is not in the chart, write "Not documented". Never invent values, doses or results. Do not give a definitive diagnosis; frame as considerations for clinician judgment and name the guideline when you rely on one. Write in ${lang==="ar"?"Arabic (medical terms and drug names may stay in English)":"English"}. Use short lines starting with "- ". Keep under 170 words. No headings with question marks.\n\nTASK: ${task}\n\nCHART DATA (de-identified, name and MRN removed):\n${chartContext(p)}`}
function fmtAI(s){const lines=esc(s).split(/\n+/);let h="",inL=false;for(let ln of lines){ln=ln.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\[([^\]]{1,60})\]/g,'<span class="src">$1</span>');
 if(/^\s*[-•*]\s+/.test(ln)){if(!inL){h+="<ul>";inL=true}h+="<li>"+ln.replace(/^\s*[-•*]\s+/,"")+"</li>"}else{if(inL){h+="</ul>";inL=false}if(ln.trim()&&!/^#+\s*$/.test(ln))h+="<p>"+ln.replace(/^#+\s*/,"")+"</p>"}}if(inL)h+="</ul>";return h}

/* ---------------- built-in explanation engine (no external AI) ---------------- */
const BL=(en,ar)=>lang==="ar"?ar:en;
function showBuilt(out,txt){if(!out)return;out.innerHTML=`<p class="thinking">${t("thinking")}</p>`;setTimeout(()=>{out.innerHTML=fmtAI(txt)+`<p class="ai-label" style="margin-top:8px">${IC.check} ${t("aiNote")}</p>`},260)}
function chartFacts(p,text){const x=(text||"").toLowerCase(),c=cur(p),c0=cur(p,0),l=p.lab,pv=p.prev,T=last(p.times),F=[],has=r=>r.test(x);
 if(has(/spo|oxygen|o₂|desat|breath|respir|hypox|niv/))F.push(`SpO₂ ${c0.spo2}% at ${p.times[0]} → ${c.spo2}% at ${T}, ${p.v.o2dev} [Vitals ${T}]`);
 if(has(/news|deterior|escalat|outreach|senior|critical/)){const n=news2(p);if(!n.na)F.push(`NEWS2 ${news2(p,0).total} at ${p.times[0]} → ${n.total} at ${T} [Calculated from vitals]`)}
 if(has(/\bbp\b|blood pressure|systolic|hypotens|amlodipine|sepsis|fluid|perfusion/))F.push(`BP ${c0.sbp}/${c0.dbp} → ${c.sbp}/${c.dbp} mmHg, HR ${c0.hr} → ${c.hr} [Vitals ${T}]`);
 if(has(/wbc|crp|inflam|infect|sepsis|pneumon|antibiot|culture/)&&l.wbc!=null)F.push(`WBC ${pv.wbc!=null?pv.wbc+" → ":""}${l.wbc} ×10⁹/L, CRP ${pv.crp!=null?pv.crp+" → ":""}${l.crp} mg/L [Labs ${p.labT}]`);
 if(has(/creat|aki|renal|kidney|urine|nephro|diuretic|dose/))F.push(`Creatinine ${pv.cr!=null?crU(pv.cr)+" → ":""}${crU(l.cr)} µmol/L${p.uo?", urine output "+p.uo:""} [Labs ${p.labT}]`);
 if(has(/lactate|sepsis|perfusion/)&&l.lac!=null)F.push(`Lactate ${pv.lac!=null?pv.lac+" → ":""}${l.lac} mmol/L [Labs ${p.labT}]`);
 if(has(/glucose|insulin|ketone|dka|hyperglyc/))F.push(`Glucose ${l.glu} mmol/L${l.ket!=null?", ketones "+(pv.ket!=null?pv.ket+" → ":"")+l.ket+" mmol/L":""} [Labs ${p.labT}]`);
 if(has(/potassium|insulin/))F.push(`Potassium ${pv.k!=null?pv.k+" → ":""}${l.k} mmol/L [Labs ${p.labT}]`);
 if(has(/allerg|penicillin|piperacillin/))F.push(`Allergies: ${p.allergies.map(a=>a.a+" ("+a.r+")").join(", ")||"none recorded"} [Allergy list]`);
 if(has(/vte|padua|prophyl|dvt|clot|embol|caprini|wells|compression/)){const pd=CALCS.find(k=>k.id==="padua").fn(p);if(!pd.na)F.push(`Padua ${pd.num}, ${pd.band==="high"?"high":"low"} risk [Calculated]`);const ac=p.meds.filter(m=>/enoxaparin|heparin|fondaparinux|apixaban|compression/i.test(m[0]));F.push(`VTE prevention ordered: ${ac.length?ac.map(m=>m[0]).join(", "):"none"} [Medication record]`)}
 if(has(/x-ray|cxr|imaging|mri|ultrasound|\bct\b|doppler|echo/))p.imaging.forEach(i=>F.push(`${i[0]}: ${i[2]} [Imaging, ${i[1]}]`));
 if(has(/troponin|grace|acs|chest|angiograph|invasive/)&&l.trop!=null)F.push(`hs-Troponin T ${pv.trop!=null?pv.trop+" → ":""}${l.trop} ng/L, upper limit 14 [Labs ${p.labT}]`);
 if(has(/mers|umrah|travel|exposure|cluster/))F.push(`${p.exposure} [Exposure history]`);
 if(has(/anticoag|\baf\b|cha₂|atrial/)){const ch=CALCS.find(k=>k.id==="cha").fn(p);if(!ch.na)F.push(`CHA₂DS₂-VA ${ch.num} [Calculated]`)}
 if(has(/ascit|cirrho|meld|paracent|enceph|lactulose|drows/)&&l.bili!=null)F.push(`Bilirubin ${Math.round(l.bili*17.1)} µmol/L, INR ${l.inr}, Na ${l.na} mmol/L [Labs ${p.labT}]`);
 const ws=x.split(/[^a-z]+/).filter(w=>w.length>=6);p.nursing.forEach(n=>{if(ws.some(w=>n[2].toLowerCase().includes(w)))F.push(`${n[2]} [Nursing note ${n[0]}]`)});
 if(!F.length){const n=news2(p);F.push(`HR ${c.hr}, BP ${c.sbp}/${c.dbp}, RR ${c.rr}, SpO₂ ${c.spo2}%, Temp ${c.t} °C${n.na?"":", NEWS2 "+n.total} [Vitals ${T}]`)}
 return [...new Set(F)].slice(0,6)}
function matchTodo(p,text){const ws=(text||"").toLowerCase().split(/[^a-z]+/).filter(w=>w.length>=5);let best=null,sc=0;p.todo.forEach(td=>{const n=ws.filter(w=>td[0].toLowerCase().includes(w)).length;if(n>sc){sc=n;best=td}});return best||p.todo[0]}
function whyAnswer(p,w){const txt=[w.title,w.rule,(w.src||[]).join(" ")].join(" "),f=chartFacts(p,txt),td=matchTodo(p,txt);
 return [`**${BL("Why it shows","سبب الظهور")}:** ${w.rule||""}`,`**${BL("What the chart says now","ما يقوله الملف الآن")}:**`,...f.map(x=>"- "+x),(w.src||[]).length?`**${BL("Sources","المصادر")}:** ${w.src.join("; ")}`:"",td?`**${BL("Next step on the plan","الخطوة التالية في الخطة")}:** ${td[0]} (${td[1]}, ${td[2]})`:"",p.contingency&&p.contingency[0]?`**${BL("Escalate if","صعّد إذا")}:** ${p.contingency[0]}`:""].filter(Boolean).join("\n")}
const QCH=()=>[BL("What should I check next?","ما الذي أتحقق منه بعد ذلك؟"),BL("Which guideline supports this?","ما الإرشاد الداعم؟"),BL("When should I escalate?","متى أصعّد الحالة؟"),BL("What is still missing?","ما المعلومات الناقصة؟")];
function askAnswer(p,w,q){const x=q.toLowerCase(),txt=[w.title,w.rule,(w.src||[]).join(" ")].join(" ");let body;
 if(/escalat|icu|call|senior|worse|deterior|أصعّد|صعّد|العناية|تدهور/.test(x)){const n=news2(p);body=[`**${BL("Escalation plan","خطة التصعيد")}:**`,...p.contingency.map(c=>"- "+c),n.na?"":`- NEWS2 ${n.total}: ${n.band==="high"?BL("emergency response by a critical-care-competent team (RCP 2017)","استجابة طارئة من فريق العناية الحرجة"):n.band==="med"?BL("urgent clinician review (RCP 2017)","مراجعة عاجلة"):BL("continue ward monitoring","استمرار المراقبة")} [Calculated]`]}
 else if(/guideline|evidence|source|reference|why|إرشاد|دليل|مصدر|لماذا/.test(x)){body=[`**${BL("Guideline basis","الأساس الإرشادي")}:** ${w.rule||""}`,...(w.src||[]).map(s=>"- "+s+" [Source]"),BL("Full calculator references and recent guideline changes are on the Clinical calculators page.","المراجع الكاملة وتحديثات الإرشادات في صفحة الحاسبات السريرية.")]}
 else if(/missing|pending|wait|result|outstanding|ناقص|معلق|نتائج/.test(x)){const tk=(TASKS[p.id]||[]).filter(t=>t[3]==="result");body=[`**${BL("Still open for this patient","ما زال معلقًا لهذا المريض")}:**`,...p.open.map(o=>"- "+o[0]+" ["+(o[2]||[""])[0]+"]"),...tk.map(t=>`- ${t[0]}: ${fmtM(elapsed(t[1]))} ${BL("waiting","انتظار")} [Pending results]`)]}
 else if(/next|check|do |plan|should|تحقق|بعد|خطوة|أفعل/.test(x)){const td=matchTodo(p,txt);body=[`**${BL("Next on the plan","التالي في الخطة")}:**`,...[td,...p.todo.filter(t=>t!==td)].slice(0,3).map(t=>`- ${t[0]} (${t[1]}, ${t[2]})`),`**${BL("Chart facts to confirm","حقائق للتأكد منها")}:**`,...chartFacts(p,txt).slice(0,3).map(f=>"- "+f)]}
 else body=[BL("Prepared answers cover four questions: next steps, guideline basis, escalation and missing information. Tap one below, or use those words in your question.","الإجابات المعدة تغطي أربعة أسئلة: الخطوات التالية، والأساس الإرشادي، والتصعيد، والمعلومات الناقصة. اختر سؤالًا أدناه."),`**${BL("Relevant chart facts","حقائق ذات صلة من الملف")}:**`,...chartFacts(p,txt).map(f=>"- "+f)];
 return [`**${BL("Question","السؤال")}:** ${q}`,...body].join("\n")}
function explainCalc(p,c,r){if(r.na)return `**${L(c.name)}:** ${r.note||t("na")}`;
 return [`**${L(c.name)}: ${r.num}${r.max?" / "+r.max:""}, ${r.label||t(r.band)}**`,`**${BL("Inputs from the chart","المدخلات من الملف")}:**`,...r.inputs.map(x=>`- ${x[0]}: ${x[1]} [Chart]`),...(r.miss||[]).map(m=>`- ${m}: ${BL("missing, so the score is partial","غير متوفر والدرجة جزئية")}`),`**${BL("What it means","ماذا تعني")}:** ${L(c.src.note)}`,...(r.warns||[]).map(w=>`**${BL("Caution","تنبيه")}:** ${L(w)}`),r.info?`**${BL("Note","ملاحظة")}:** ${L(r.info)}`:"",r.action?`**${BL("Recommended response","الاستجابة الموصى بها")}:** ${L(r.action)}`:"",`**${BL("Source","المصدر")}:** ${c.src.name} (${c.src.ver})`].filter(Boolean).join("\n")}
function handoverDraft(p){const n=news2(p),sv={det:BL("Unstable","غير مستقر"),watch:BL("Watcher","تحت المراقبة"),stable:BL("Stable","مستقر")}[p.status];
 return [`**I — ${BL("Illness severity","شدة الحالة")}:** ${sv}${n.na?"":", NEWS2 "+n.total}`,`**P — ${BL("Patient summary","ملخص المريض")}:** ${p.age}${p.sex}, ${p.dx}. ${BL("Background","التاريخ")}: ${p.history.join(", ")}. ${BL("Allergies","الحساسية")}: ${p.allergies.map(a=>a.a).join(", ")||"NKDA"}. ${p.code}.`,
  p.changes.length?`**${BL("What changed","ما الذي تغيّر")}:**`:"",...p.changes.slice(0,3).map(c=>"- "+c[0]),`**A — ${BL("Action list","قائمة المهام")}:**`,...p.todo.map((td,i)=>`- ${td[0]} (${td[1]}, ${td[2]})${S.todos[p.id+"_t"+i]?" ✓":""}`),`**S — ${BL("Situation awareness and contingency","الوعي بالموقف وخطة الطوارئ")}:**`,...p.contingency.map(c=>"- "+c),`**S — ${BL("Synthesis by receiver","تلخيص المستلم")}:** ${BL("Read back the top issue","أعد قراءة المشكلة الأهم")}: "${(p.matters[0]||p.changes[0]||[BL("Stable, routine review","مستقر، مراجعة روتينية")])[0]}" ${BL("and the first action","وأول مهمة")}: "${p.todo[0]?p.todo[0][0]:"—"}".`].filter(Boolean).join("\n")}
let aiCtl=null;
async function runAI(p,task,out,btn){
 if(!sampleFn){out.innerHTML=`<p class="muted">${t("aiUnavailable")}</p>`;return}
 if(aiCtl){aiCtl.abort()}aiCtl=new AbortController();const ctl=aiCtl;
 if(btn)btn.disabled=true;out.innerHTML=`<p class="thinking">${t("thinking")}</p>`;
 try{const r=await sampleFn(aiPrompt(p,task),{signal:ctl.signal,modelTier:"default",onText:({text})=>{out.innerHTML=fmtAI(text)}});
  out.innerHTML=fmtAI(r.text)+`<p class="ai-label" style="margin-top:8px">${IC.spark} ${t("aiNote")}</p>`}
 catch(e){const code=e&&e.code;if(code==="aborted"){}else{const msg=code==="not_granted"?t("aiDenied"):code==="rate_limited"?t("aiRate"):t("aiErr");out.innerHTML=(e&&e.text?fmtAI(e.text):"")+`<p class="muted">${msg}</p>`;if(code==="not_granted"){sampleFn=null}}}
 finally{if(btn)btn.disabled=false;if(aiCtl===ctl)aiCtl=null}}

/* ---------------- views ---------------- */
const VIEWS=[["board","nav_board",IC.list,0],["ehr","nav_ehr",IC.user,1],["careboard","nav_cb",IC.spark,0],["calculators","nav_calc",IC.calc,0],["handover","nav_ho",IC.swap,0],["radar","nav_radar",IC.radar,0],["governance","nav_gov",IC.shield,0]];
function curView(){const h=location.hash.replace("#","");return VIEWS.some(v=>v[0]===h)?h:"board"}
function renderRail(){const v=curView();const a=x=>`<a href="#${x[0]}" class="${x[3]?"hostlink":""}" ${v===x[0]?'aria-current="page"':""}>${x[2]}${t(x[1])}</a>`;
 $("#rail").innerHTML=`<div class="grp">${t("g_ward")}</div>`+VIEWS.slice(0,1).map(a).join("")+`<div class="grp">${t("g_patient")}</div>`+VIEWS.slice(1,5).map(a).join("")+`<div class="grp">${t("g_hospital")}</div>`+VIEWS.slice(5).map(a).join("")}
function renderTop(){$("#hostName").textContent=t("host");$("#lblPatient").textContent=t("patient");$("#userChip").innerHTML=IC.user+" "+esc(t("user"));$("#langBtn").textContent=lang==="ar"?"English":"العربية";
 $("#mineToggle").checked=S.hoTab==="mine";$("#mineLbl").textContent=lang==="ar"?"مرضاي فقط":"My patients only";
 $("#ptSelect").innerHTML=P.filter(p=>S.hoTab==="all"||p.team===ME.team).map(p=>`<option value="${p.id}" ${p.id===S.pid?"selected":""}>${esc(lang==="ar"?"سرير":"Bed")} ${p.bed} — ${esc(pname(p))}${canSee(p)?"":" 🔒"}</option>`).join("");$("#dlgClose").textContent=t("close")}

function banner(p){const n=news2(p);const ini=(p.name.split(" ")[0][0]+(p.name.split(" ").slice(-1)[0].replace(/^Al-/,"")[0]||"")).toUpperCase();return `<section class="banner"><div class="mono" aria-hidden="true">${ini}</div><div class="who"><h1>${esc(pname(p))}</h1><div class="meta"><span>MRN ${p.mrn}</span><span>${p.age} ${lang==="ar"?"سنة":"years"}</span><span>${p.sex==="M"?(lang==="ar"?"ذكر":"Male"):(lang==="ar"?"أنثى":"Female")}</span><span>${esc(p.ward)}, ${lang==="ar"?"سرير":"Bed"} ${p.bed}</span></div></div>
 <div class="facts"><div class="fact"><div class="k">${t("allergies")}</div>${p.allergies.length?p.allergies.map(a=>`<span class="tag red">${esc(a.a)}</span>`).join(" "):`<span class="tag grey">NKDA</span>`}</div><div class="fact"><div class="k">${t("code")}</div><span class="tag green">${esc(p.code)}</span></div><div class="fact"><div class="k">${t("los")}</div><b>${p.los}</b></div><div class="fact"><div class="k">NEWS2</div>${n.na?`<span class="tag grey">${t("na")}</span>`:`<span class="tag ${bandOf(n.band)}">${n.total}</span>`}</div><div class="fact"><div class="k">&nbsp;</div>${statusTag(p.status)}</div></div></section>`}

function sevIcon(sev,z=20){const w=`<svg width="${z}" height="${z}" viewBox="0 0 24 24" aria-hidden="true" style="flex:none">`;
 if(sev==="red")return w+'<path d="M12 2.6 22.6 20.8H1.4z" fill="var(--red)" stroke="var(--red)" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 9v5.4" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="12" cy="17.6" r="1.45" fill="#fff"/></svg>';
 if(sev==="amber")return w+'<circle cx="12" cy="12" r="10.5" fill="#F08C00"/><path d="M12 6.8v6.4" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="12" cy="16.9" r="1.45" fill="#fff"/></svg>';
 if(sev==="blue")return w+'<circle cx="12" cy="12" r="10.5" fill="var(--blue)"/><circle cx="12" cy="7.4" r="1.45" fill="#fff"/><path d="M12 11v6" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>';
 return w+'<circle cx="12" cy="12" r="10.5" fill="var(--green)"/><path d="M7.4 12.3l3 3 6.2-6.6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
const sevName=v=>({red:L({en:"Critical",ar:"حرج"}),amber:L({en:"Needs review",ar:"يحتاج مراجعة"}),blue:L({en:"Information",ar:"معلومة"}),green:L({en:"Improving",ar:"تحسّن"})}[v]||"");
function sevLegend(){return `<div class="legend sevleg">${["red","amber","blue","green"].map(v=>`<span>${sevIcon(v,15)} ${sevName(v)}</span>`).join("")}</div>`}
function itemList(arr,cls=""){if(!arr.length)return `<p class="muted small">${lang==="ar"?"لا شيء":"Nothing outstanding"}</p>`;return `<div class="items">${arr.map(x=>`<div class="item ${x[1]||""} ${cls}"><span class="sev" title="${sevName(x[1])}">${sevIcon(x[1])}</span><div class="body">${esc(x[0])}</div>${whyBtn(x[2],x[3],0,x[0])}</div>`).join("")}</div>`}

function vitalsBox(p){const c=cur(p),f=cur(p,0),n=news2(p);const d=(a,b)=>{const x=Math.round((a-b)*10)/10;return x===0?"":`${x>0?"↑":"↓"} ${Math.abs(x)}`};
 const sc=s=>s>=3?"red":s>=1?"amber":"green",rg=(v,lo,hi)=>v<lo||v>hi?"amber":"green",P2=n.na?null:n.parts;
 const cells=[["Temp",c.t,"°C",d(c.t,f.t),P2?sc(P2.temp):rg(c.t,36,38),p.tr.t],["HR",c.hr,"bpm",d(c.hr,f.hr),P2?sc(P2.hr):rg(c.hr,51,100),p.tr.hr],["BP",c.sbp+"/"+c.dbp,"mmHg",d(c.sbp,f.sbp),P2?sc(P2.sbp):rg(c.sbp,90,139),p.tr.sbp],["RR",c.rr,"/min",d(c.rr,f.rr),P2?sc(P2.rr):rg(c.rr,12,20),p.tr.rr],["SpO₂",c.spo2,"%",d(c.spo2,f.spo2),P2?sc(P2.spo2):rg(c.spo2,95,100),p.tr.spo2],["O₂",c.o2?p.v.o2dev:(lang==="ar"?"هواء الغرفة":"Room air"),"",c.o2&&!f.o2?(lang==="ar"?"جديد منذ 06:00":"new since 06:00"):"",P2?sc(P2.air):"green",null],["ACVPU",p.v.avpu,"GCS "+p.v.gcs,"",P2?sc(P2.cons):(p.v.avpu==="A"?"green":"red"),null]];
 return `<div class="box"><div class="box-h"><h3>${chip(IC.pulse,"red")} ${t("vitals")}</h3><span class="tiny muted">${t("vitals_sub")}</span></div><div class="vgrid">${cells.map(x=>`<div class="vital ${x[4]}"><div class="k">${x[0]}</div><div class="v num" style="${x[5]?"":"font-size:15px"}">${esc(x[1])} <small>${esc(x[2])}</small></div><div class="tiny num" style="color:var(--${x[4]})">${x[3]||"&nbsp;"}</div>${x[5]?spark(x[5],`var(--${x[4]})`,110,26):""}</div>`).join("")}</div><p class="tiny muted" style="margin-top:8px">${n.na?(lang==="ar"?"الألوان حسب المعدلات المرجعية. NEWS2 لا ينطبق بعد الولادة.":"Colours follow reference ranges. NEWS2 does not apply after childbirth."):(lang==="ar"?"الألوان حسب نقاط NEWS2: أخضر طبيعي (0)، برتقالي غير طبيعي (1–2)، أحمر إنذار (3).":"Colours follow NEWS2 parameter scores: green normal (0), orange abnormal (1–2), red alert (3).")}</p></div>`}
function problemsBox(p){return `<div class="box"><div class="box-h"><h3>${chip(IC.list,"cb")} ${t("problems")}</h3></div><h4 class="tiny muted" style="margin-bottom:4px">${t("complaints")}</h4><ul class="small">${p.complaints.map(c=>`<li>${esc(c)}</li>`).join("")}</ul><h4 class="tiny muted" style="margin:10px 0 4px">${t("history")}</h4><div style="display:flex;gap:6px;flex-wrap:wrap">${p.history.map(h=>`<span class="tag grey">${esc(h)}</span>`).join("")}</div><p class="tiny muted" style="margin-top:10px">${t("exposure")}: ${esc(p.exposure)}</p></div>`}
const LABS=[["wbc","WBC","×10⁹/L",4,11,null,2,15],["crp","CRP","mg/L",0,5,null,-1,100],["lac","Lactate","mmol/L",0,2,null,-1,4],["cr","Creatinine","µmol/L",.6,1.2,crU,-1,2],["na","Sodium","mmol/L",135,145,null,125,155],["k","Potassium","mmol/L",3.5,5.1,null,3,6],["hco3","Bicarbonate","mmol/L",22,29,null,15,40],["urea","Urea","mmol/L",2.5,7.8,null,-1,20],["glu","Glucose","mmol/L",3.9,11,null,3,20],["hb","Haemoglobin","g/L",120,170,null,70,200],["plt","Platelets","×10⁹/L",150,400,null,50,1000],["alb","Albumin","g/L",3.5,5,v=>Math.round(v*10),2,9],["trop","hs-Troponin T","ng/L",0,14,null,-1,14],["ket","Blood ketones","mmol/L",0,0.6,null,-1,3],["bili","Bilirubin","µmol/L",0.1,1.2,v=>Math.round(v*17.1),-1,3],["inr","INR","",0.8,1.2,null,-1,2],["ntbnp","NT-proBNP","pg/mL",0,125,null,-1,2000]];
function labStatus(l,v){return v<l[6]||v>l[7]?"red":v<l[3]||v>l[4]?"amber":"green"}
function resultsBox(p){const rows=LABS.filter(l=>p.lab[l[0]]!=null);return `<div class="box"><div class="box-h"><h3>${chip(IC.flask,"blue")} ${t("res_box")}</h3><span class="tiny muted">${p.labT}</span></div><div class="scroll-x"><table class="t num"><tbody>${rows.map(l=>{const v=p.lab[l[0]],pv=p.prev[l[0]],cv=l[5]?l[5](v):v,st=labStatus(l,v),ar=v>l[4]?"↑ ":v<l[3]?"↓ ":"";return `<tr><td><span class="ldot ${st}"></span>${l[1]}</td><td class="${st==="green"?"":"v-"+st}">${ar}${cv}</td><td class="muted tiny">${l[2]}</td><td class="muted tiny">${pv!=null?(lang==="ar"?"سابقًا ":"was ")+(l[5]?l[5](pv):pv):""}</td></tr>`}).join("")}</tbody></table></div></div>`}
function medsBox(p){const F=p.medFlags||{};return `<div class="box"><div class="box-h"><h3>${chip(IC.pill,"green")} ${t("meds_box")}</h3></div><table class="t"><tbody>${p.meds.map(m=>{const fl=F[m[0]];return `<tr><td><span class="ldot ${fl?fl[0]:m[2]==="held"?"amber":"green"}"></span><b style="font-weight:600">${esc(m[0])}</b>${fl?`<div class="mflag ${fl[0]}">${esc(fl[1])}</div>`:""}</td><td class="small">${esc(m[1])}</td><td>${m[2]==="held"?`<span class="tag amber">${lang==="ar"?"موقوف":"Held"}</span>`:""}</td></tr>`}).join("")}</tbody></table></div>`}
function imgType(i){if(i[4])return i[4];const n=i[0].toLowerCase();return /x-ray/.test(n)?"cxr":/angiograph/.test(n)&&/head/.test(n)?"cta":/ct/.test(n)&&/head/.test(n)?"cth":/ct/.test(n)?"ctab":/mri/.test(n)?"mri":/echo/.test(n)?"echo":/ecg/.test(n)?"ecg":/ultrasound|duplex|doppler/.test(n)?"us":"cxr"}
function thumb(i){const pend=i[3],ty=imgType(i),ab=i[5]!=null?i[5]:!/^(no |normal|clear)/i.test(i[2]);
 const w='<svg class="thumb" viewBox="0 0 92 72" role="img" aria-label="'+esc(i[0])+'">';
 if(pend)return w+'<rect width="92" height="72" fill="var(--grey-soft)"/><circle cx="46" cy="36" r="12" fill="none" stroke="var(--muted)" stroke-width="2"/><path d="M46 29v7l5 3" stroke="var(--muted)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
 let g='<rect width="92" height="72" fill="#07090c"/>';
 if(ty==="cxr"){g+='<ellipse cx="31" cy="38" rx="15" ry="25" fill="#5c6670" opacity=".55"/><ellipse cx="61" cy="38" rx="15" ry="25" fill="#5c6670" opacity=".55"/><rect x="43" y="6" width="6" height="62" fill="#c9d1d8" opacity=".55"/><ellipse cx="52" cy="50" rx="13" ry="10" fill="#aab3bc" opacity=".55"/>';for(let k=0;k<5;k++)g+=`<path d="M18 ${16+k*9}q13 -6 26 0M48 ${16+k*9}q13 -6 26 0" stroke="#cfd6dc" stroke-opacity=".28" fill="none"/>`;if(ab)g+=/effusion/i.test(i[2])?'<path d="M16 54q14 -8 29 -2v14H16z" fill="#e9eef2" opacity=".6"/>':'<circle cx="29" cy="49" r="9" fill="#eef2f5" opacity=".6"/>'}
 else if(ty==="cth"||ty==="cta"){g+='<ellipse cx="46" cy="36" rx="25" ry="30" fill="#e9eef2" opacity=".85"/><ellipse cx="46" cy="36" rx="22" ry="27" fill="#5e6873"/><path d="M46 10v52" stroke="#3b434c" stroke-width="1.5"/><ellipse cx="40" cy="33" rx="4" ry="8" fill="#20262c"/><ellipse cx="52" cy="33" rx="4" ry="8" fill="#20262c"/>';if(ty==="cta")g+='<path d="M46 52c-10-6-14-14-20-22M46 52c10-6 14-14 20-22" stroke="#f6f8fa" stroke-width="1.8" fill="none"/><path d="M66 30l4-5" stroke="#f6f8fa" stroke-width="1.8" stroke-dasharray="2 2"/>';if(ab&&ty==="cth")g+='<path d="M50 14q16 6 16 22q0 10-6 14q-6-14-10-36z" fill="#2b3239"/>'}
 else if(ty==="ctab"){g+='<ellipse cx="46" cy="38" rx="38" ry="27" fill="#4f5862"/><ellipse cx="46" cy="38" rx="35" ry="24" fill="#6b7580"/><path d="M14 30q10-14 26-12q4 12-4 22q-14 2-22-10z" fill="#8a949e"/><circle cx="46" cy="56" r="6" fill="#e4e9ee"/><circle cx="60" cy="40" r="5" fill="#9aa3ad"/>';if(ab)g+='<circle cx="30" cy="46" r="6" fill="#c5ccd3"/>'}
 else if(ty==="mri"){g+='<path d="M10 52q4-12 20-14q14-2 30-12q12-6 22 2l-4 10q-18 2-30 12q-14 10-38 8z" fill="#8f99a3"/><path d="M18 50q20-4 40-16" stroke="#cfd6dc" stroke-opacity=".5" fill="none"/>';if(ab)g+='<circle cx="22" cy="49" r="5" fill="#f2f5f7" opacity=".85"/>'}
 else if(ty==="ecg"){g='<rect width="92" height="72" fill="#fff5f5"/>';for(let k=0;k<=92;k+=8)g+=`<path d="M${k} 0v72" stroke="#f3b7b7" stroke-width=".5"/>`;for(let k=0;k<=72;k+=8)g+=`<path d="M0 ${k}h92" stroke="#f3b7b7" stroke-width=".5"/>`;g+='<path d="M0 40h8l3-3 3 3h4l2 6 4-26 4 24 3-4h6l4-5 4 5h6l3-3 3 3h4l2 6 4-26 4 24 3-4h6l4-5 4 5h5" fill="none" stroke="#2b2b2b" stroke-width="1.3"/>'}
 else {g+='<path d="M46 6L8 66h76z" fill="#5a636c"/><path d="M46 6L8 66h76z" fill="url(#spk)" opacity=".9"/><defs><pattern id="spk" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#9aa4ad"/><circle cx="4" cy="4" r=".6" fill="#6d7780"/></pattern></defs>';if(ty==="echo")g+='<ellipse cx="38" cy="40" rx="7" ry="11" fill="#07090c"/><ellipse cx="55" cy="40" rx="7" ry="11" fill="#07090c"/><ellipse cx="40" cy="56" rx="6" ry="6" fill="#07090c"/><ellipse cx="54" cy="56" rx="7" ry="6" fill="#07090c"/>';else if(ab)g+='<path d="M22 50q24-10 48 0l6 14H16z" fill="#07090c"/>'}
 return w+g+'</svg>'}
function imagingBox(p){return `<div class="box"><div class="box-h"><h3>${chip(IC.img,"teal")} ${t("imaging")}</h3><span class="tiny muted">${p.imaging.length} ${lang==="ar"?"دراسة":"studies"}</span></div>${p.imaging.length?p.imaging.map(i=>{const ab=i[5]!=null?i[5]:!/^(no |normal|clear)/i.test(i[2]);return `<div class="img-row">${thumb(i)}<div style="min-width:0"><b style="font-weight:600">${esc(i[0])}</b><div class="tiny muted">${esc(i[1])}</div><div class="small" style="margin-top:3px">${i[3]?`<span class="tag amber">${esc(i[2])}</span>`:`<span class="ldot ${ab?"amber":"green"}"></span>${esc(i[2])}`}</div></div></div>`}).join(""):`<p class="muted small">${lang==="ar"?"لا توجد دراسات":"No imaging this admission"}</p>`}</div>`}
const chip=(ic,c)=>`<span class="ichip ${c}">${ic}</span>`;
const IPEN='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/></svg>',IPLUS='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
const nowT=()=>(lang==="ar"?"اليوم ":"Today ")+new Date().toTimeString().slice(0,5);
function NB(p){return S.notes[p.id]||(S.notes[p.id]={cdsAdd:[],cdsEd:{},soap:null,add:[]})}
function curSoap(p){return NB(p).soap||p.soap}
function edForm(kind,val,ph,multi){return `<div class="edform">${multi?`<textarea id="edText" rows="3" placeholder="${esc(ph)}">${esc(val)}</textarea>`:`<input id="edText" type="text" value="${esc(val)}" placeholder="${esc(ph)}">`}<div class="edrow"><span class="tiny muted" style="margin-inline-end:auto">${lang==="ar"?"سيُسجَّل باسم":"Will be signed as"} ${esc(ME.name)}</span><button class="btn sm" type="button" data-cancel>${lang==="ar"?"إلغاء":"Cancel"}</button><button class="btn sm primary" type="button" data-save="${kind}">${lang==="ar"?"حفظ":"Save"}</button></div></div>`}
function cdsBox(p){const nb=NB(p),ar=lang==="ar";
 const items=p.cds.map((c,i)=>{const e=nb.cdsEd[i];return {k:p.id+"_cds"+i,key:"o"+i,title:e?e.text:c[0],sub:c[1],sev:/conflict/i.test(c[0])?"red":"amber",why:[c[2],c[3]],meta:e?`${ar?"عدّله":"Edited by"} ${e.by}, ${e.at}`:""}}).concat(nb.cdsAdd.map((a,j)=>({k:p.id+"_cdsA"+j,key:"a"+j,title:a.text,sub:"",sev:"manual",why:[["Entered by "+a.by+", "+a.at],"Clinician-entered to-do"],meta:`${ar?"أضافه":"Added by"} ${a.by}, ${a.at}${a.edBy?` · ${ar?"عدّله":"edited by"} ${a.edBy}, ${a.edAt}`:""}`})));
 const openN=items.filter(i=>!S.todos[i.k]).length;
 return `<div class="box"><div class="box-h"><h3>${chip(IC.check,"amber")} ${t("cds")}</h3><div style="display:flex;gap:8px;align-items:center"><span class="tiny muted">${openN} ${ar?"مفتوحة":"open"}</span><button class="ibtn" type="button" data-cdsadd title="${ar?"إضافة مهمة":"Add to-do"}" aria-label="${ar?"إضافة مهمة":"Add to-do"}">${IPLUS}</button></div></div>
 ${S.editing==="cdsnew:"+p.id?edForm("cdsnew","",ar?"مهمة جديدة…":"New to-do…"):""}
 ${items.length?`<div class="items">${items.map(it=>{if(S.editing==="cds:"+p.id+":"+it.key)return edForm("cds:"+it.key,it.title,"");const dn=S.todos[it.k],sev=it.sev;
  const tag=dn?`<span class="tag green">${ar?"تم":"Done"}</span>`:sev==="manual"?`<span class="tag blue">${ar?"يدوي":"Manual"}</span>`:sev==="red"?`<span class="tag red">${ar?"عاجل":"Urgent"}</span>`:`<span class="tag amber">${ar?"مراجعة":"Review"}</span>`;
  return `<div class="item ${dn?"green":sev==="manual"?"blue":sev}"><input type="checkbox" data-todo="${it.k}" ${dn?"checked":""} aria-label="Done" style="margin-top:4px;accent-color:var(--green)"><div class="body" style="${dn?"text-decoration:line-through;color:var(--muted)":""}"><b style="font-weight:600">${esc(it.title)}</b>${it.sub?`<div class="sub">${esc(it.sub)}</div>`:""}${it.meta?`<div class="edmeta">${esc(it.meta)}</div>`:""}${doneBy(dn)}</div>${tag}<button class="ibtn sm" type="button" data-cdsedit="${it.key}" title="${ar?"تعديل":"Edit"}" aria-label="${ar?"تعديل":"Edit"}">${IPEN}</button>${whyBtn(it.why[0],it.why[1],0,it.title)}</div>`}).join("")}</div>`:`<p class="muted small">${ar?"لا توجد مهام":"No to-dos"}</p>`}</div>`}
function soapBox(p){const s=curSoap(p),nb=NB(p),ar=lang==="ar";
 const body=S.editing==="soap:"+p.id?`<div class="edform">${["s","o","a","p"].map(k=>`<label class="soapl"><b>${k.toUpperCase()}</b><textarea id="ed${k.toUpperCase()}" rows="2">${esc(s[k])}</textarea></label>`).join("")}<div class="edrow"><span class="tiny muted" style="margin-inline-end:auto">${ar?"سيُسجَّل التعديل باسم":"Edit will be signed as"} ${esc(ME.name)}</span><button class="btn sm" type="button" data-cancel>${ar?"إلغاء":"Cancel"}</button><button class="btn sm primary" type="button" data-save="soap">${ar?"حفظ":"Save"}</button></div></div>`
  :`<div class="soap"><b>S</b><p>${esc(s.s)}</p><b>O</b><p>${esc(s.o)}</p><b>A</b><p>${esc(s.a)}</p><b>P</b><p>${esc(s.p)}</p></div>${nb.soap?`<div class="edmeta" style="margin-top:8px">${ar?"عدّله":"Edited by"} ${esc(nb.soap.edBy)}, ${esc(nb.soap.edAt)}</div>`:""}`;
 return `<div class="box"><div class="box-h"><h3>${chip(IC.note,"blue")} ${t("soap")}</h3><div style="display:flex;gap:8px;align-items:center"><span class="tiny muted">${esc(p.soap.by)}, ${esc(p.soap.tm)}</span><button class="ibtn" type="button" data-soapedit title="${ar?"تعديل الملاحظة":"Edit note"}" aria-label="${ar?"تعديل الملاحظة":"Edit note"}">${IPEN}</button><button class="ibtn" type="button" data-soapadd title="${ar?"إضافة ملحق":"Add addendum"}" aria-label="${ar?"إضافة ملحق":"Add addendum"}">${IPLUS}</button></div></div>${body}
 ${nb.add.map(a=>`<div class="addm"><div class="tiny" style="font-weight:600;color:var(--cb)">${ar?"ملحق":"Addendum"} · ${esc(a.by)}, ${esc(a.at)}</div><div>${esc(a.text)}</div></div>`).join("")}
 ${S.editing==="soapadd:"+p.id?edForm("soapadd","",ar?"نص الملحق…":"Addendum text…",1):""}</div>`}
function cbPanel(p){return `<aside class="cbpanel" aria-label="CareBoard AI"><div class="cbpanel-h">${IC.spark}<div><b>CareBoard AI</b><div class="tiny" style="opacity:.85">${t("cbPanelSub")}</div></div></div><div class="cbpanel-b">
 <div class="cbsec"><h4 style="color:var(--red)">${IC.up} ${t("changes")}</h4>${itemList(p.changes.slice(0,3))}</div>
 <div class="cbsec"><h4 style="color:var(--green)">${IC.target} ${t("matters")}</h4>${itemList(p.matters.slice(0,2))}</div>
 <div class="cbsec"><h4 style="color:var(--cb)">${IC.clock} ${t("open")}</h4>${itemList(p.open.slice(0,2))}</div>
 <a class="btn primary" href="#careboard" style="justify-content:center;text-decoration:none">${t("openCB")}</a></div></aside>`}

const LEGEND=()=>`<div class="legend"><span><i style="background:var(--red)"></i>${L({en:"Critical / act now",ar:"حرج / تدخل الآن"})}</span><span><i style="background:var(--amber)"></i>${L({en:"Abnormal / review",ar:"غير طبيعي / مراجعة"})}</span><span><i style="background:var(--green)"></i>${L({en:"Within range",ar:"ضمن المعدل"})}</span></div>`;
function viewEHR(p){return `${banner(p)}<div style="margin:-4px 0 12px">${LEGEND()}</div><div class="g2"><div class="span2">${vitalsBox(p)}</div>${resultsBox(p)}${problemsBox(p)}${medsBox(p)}${imagingBox(p)}<div class="span2">${cdsBox(p)}</div><div class="span2">${soapBox(p)}</div></div>`}
const sentences=x=>String(x||"").split(/(?<=[.!?])\s+/).map(z=>z.trim()).filter(Boolean),normS=x=>x.toLowerCase().replace(/\s+/g," ").trim();
function notesBox(p){const ar=lang==="ar",s=curSoap(p),y=new Set(sentences(p.yest).map(normS)),nb=NB(p);let nNew=0,nOld=0;
 const rows=[["S",s.s],["O",s.o],["A",s.a],["P",s.p]].map(([k,v])=>{const it=sentences(v).map(x=>({x,old:y.has(normS(x))}));it.forEach(i=>i.old?nOld++:nNew++);const oc=it.filter(i=>i.old).length;
  const body=it.filter(i=>!i.old||!S.hideOld).map(i=>i.old?`<span class="old">${esc(i.x)}</span>`:`<mark class="new">${esc(i.x)}</mark>`).join(" ")+(S.hideOld&&oc?` <span class="carry">${oc} ${ar?"منقولة من الأمس":"carried over"}</span>`:"");
  return `<div class="notes-row"><b class="soapk">${k}</b><div>${body||'<span class="muted">—</span>'}</div></div>`}).join("")+nb.add.map(a=>{nNew++;return `<div class="notes-row"><b class="soapk">+</b><div><mark class="new">${esc(a.text)}</mark> <span class="tiny muted">${esc(a.by)}, ${esc(a.at)}</span></div></div>`}).join("");
 return `<section class="box tint-gold" style="margin-top:16px"><div class="sec-h" style="flex-wrap:wrap"><div class="sec-ic gold">${IC.note}</div><div style="flex:1;min-width:220px"><h2>${ar?"الجديد في الملاحظات منذ الأمس":"What’s new in notes since yesterday"}</h2><p class="tiny muted">${ar?"تُقارن ملاحظة اليوم جملةً بجملة مع ملاحظة الأمس. المظلل جديد، والمكرر مطوي. مقارنة نصية دقيقة دون ذكاء اصطناعي.":"Today’s progress note compared sentence by sentence with yesterday’s. Highlighted text is new; repeated text is folded. Exact text comparison, no AI."}</p></div><span class="tag gold">${nNew} ${ar?"جديدة":"new"}</span><span class="tag grey">${nOld} ${ar?"منقولة":"carried over"}</span><button class="btn sm" type="button" data-toggleold>${S.hideOld?(ar?"إظهار النص المنقول":"Show carried-over text"):(ar?"إخفاء النص المنقول":"Hide carried-over text")}</button></div>
 ${rows}<details style="margin-top:10px"><summary class="small muted" style="cursor:pointer">${ar?"ملاحظة الأمس":"Yesterday’s progress note"}</summary><p class="small muted" style="margin-top:6px">${esc(p.yest||"—")}</p></details></section>`}
function viewCB(p){const ar=lang==="ar";
 return `${banner(p)}<div class="page-head"><div><h1>CareBoard AI</h1><p>${ar?"ما الذي تغيّر، والتحديثات الجديدة، وما زال معلقًا. كل عنصر مرتبط بمصدره ومرتب حسب الخطورة.":"What changed, new updates and what is still open. Every item links to its source and carries a severity symbol."}</p></div>${sevLegend()}</div>
 <div class="cbgrid">
  <section class="box tint-blue"><div class="sec-h"><div class="sec-ic blue">${IC.nurse}</div><div><h2>${t("nursing")}</h2><p class="tiny muted">${t("nursing_sub")}</p></div></div>${p.nursing.map(n=>`<div class="note ${n[3]}" style="display:flex;gap:8px"><span>${sevIcon(n[3]||"green",16)}</span><div><div class="meta">${n[0]}, ${esc(n[1])}</div><div class="small">${esc(n[2])}</div></div></div>`).join("")}</section>
  <section class="box tint-red"><div class="sec-h"><div class="sec-ic red">${IC.up}</div><div><h2>${t("changes")}</h2><p class="tiny muted">${t("changes_sub")}</p></div></div>${itemList(p.changes)}</section>
  <section class="box tint-cb"><div class="sec-h"><div class="sec-ic cb">${IC.target}</div><div><h2>${t("matters")}</h2><p class="tiny muted">${t("matters_sub")}</p></div></div>${itemList(p.matters)}</section>
  <section class="box tint-amber"><div class="sec-h"><div class="sec-ic amber">${IC.clock}</div><div><h2>${t("open")}</h2><p class="tiny muted">${t("open_sub")}</p></div></div>${itemList(p.open)}</section>
 </div>${notesBox(p)}`}
function calcCard(c,p){const r=c.fn(p);const nm=L(c.name),sub=L(c.sub);
 const tip=`<span class="tip"><b>${t("source")}:</b> ${esc(c.src.name)}<br><b>${t("version")}:</b> ${esc(c.src.ver)}<br><b>${t("lastVerified")}:</b> ${VER}<br><br>${esc(L(c.src.note))}</span>`;
 const badge=`<span class="verified tag green" tabindex="0">${IC.check} ${t("approved")}${tip}</span>`;
 if(r.na)return `<article class="calc" style="opacity:.8"><div class="calc-h"><div><h3>${esc(nm)}</h3><div class="sub">${esc(sub)}</div></div>${badge}</div><div class="score"><div class="sbox grey"><div class="n" style="font-size:18px">—</div><div class="b">${t("na")}</div></div><p class="small muted">${esc(r.note||"")}</p></div></article>`;
 const b=bandOf(r.band);const bl=r.label||(r.band==="info"?(r.unit||""):t(r.band));
 return `<article class="calc ${b}"><div class="calc-h"><div><h3>${esc(nm)}</h3><div class="sub">${esc(sub)}</div></div>${badge}</div>
 <div class="score"><div class="sbox ${b}"><div class="n num">${esc(r.num)}${r.max?`<small> / ${r.max}</small>`:""}</div><div class="b">${esc(bl)}</div></div>${r.trend?trendChart(r.trend,p.times,colorVar(r.band)):""}</div>
 ${r.action?`<div class="${b==="red"?"warn":"info"}" style="${b==="red"?"background:var(--red-soft);color:var(--red)":""}">${esc(L(r.action))}</div>`:""}
 <div><div class="tiny muted" style="margin-bottom:4px">${t("keyInputs")}</div><div class="inputs num">${r.inputs.map(x=>`<div><span>${esc(x[0])}</span><b>${esc(x[1])}</b></div>`).join("")}${(r.miss||[]).map(m=>`<div class="miss"><span>${esc(m)}</span><b>${t("missing")}</b></div>`).join("")}</div></div>
 ${(r.warns||[]).map(w=>`<div class="warn">⚠ ${esc(L(w))}</div>`).join("")}${r.info?`<div class="info">${esc(L(r.info))}</div>`:""}
 <div class="calc-actions">${whyBtn(r.inputs.map(x=>x[0]+": "+x[1]).concat(["Chart data at "+p.labT+" and vitals "+last(p.times)]),c.src.name+" — "+L(c.src.note))}<button class="btn sm" type="button" data-explain="${c.id}" >${IC.spark} ${t("explain")}</button></div><div class="ai-out" id="ex_${c.id}" aria-live="polite"></div></article>`}
function viewCalc(p){const tab=S.calcTab,q=S.calcQ.trim().toLowerCase();const hay=c=>[c.name,c.sub].map(x=>typeof x==="string"?x:(x.en+" "+x.ar)).join(" ").toLowerCase()+" "+c.pack.map(k=>(T.en[k]||"")+" "+(T.ar[k]||"")).join(" ").toLowerCase()+" "+c.src.name.toLowerCase();const list=CALCS.filter(c=>(tab==="all"||c.pack.includes(tab))&&(!q||hay(c).includes(q)));const app=list.filter(c=>!c.fn(p).na),na=list.filter(c=>c.fn(p).na);
 return `${banner(p)}<div class="page-head"><div><h1>${t("calc_title")}</h1><p>${t("calc_sub")}</p></div><div class="legend"><span><i style="background:var(--red)"></i>${t("legendHigh")}</span><span><i style="background:var(--amber)"></i>${t("legendMed")}</span><span><i style="background:var(--green)"></i>${t("legendLow")}</span><span><i style="background:var(--blue)"></i>${t("legendInfo")}</span><span><i style="background:var(--grey)"></i>${t("legendNA")}</span></div></div>
 <div class="csearch"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg><input id="calcQ" type="search" autocomplete="off" value="${esc(S.calcQ)}" placeholder="${lang==="ar"?"ابحث عن حاسبة أو تخصص… مثل Wells أو الكلى أو سقوط":"Search a calculator or specialty… e.g. Wells, kidney, falls, sepsis"}" aria-label="Search calculators"><select id="calcSpec" aria-label="Specialty">${PACKS.map(k=>`<option value="${k}" ${tab===k?"selected":""}>${t(k)}</option>`).join("")}</select>${q||tab!=="all"?`<button class="btn sm" type="button" data-calcclear>${lang==="ar"?"مسح":"Clear"}</button>`:""}</div>
 <h3 style="margin-bottom:10px">${t("applicable")} (${app.length})</h3>${!list.length?`<div class="box muted small">${lang==="ar"?"لا توجد نتائج. جرّب كلمة أخرى.":"No calculators match. Try another word."}</div>`:app.length?`<div class="cgrid">${app.map(x=>calcCard(x,p)).join("")}</div>`:`<p class="muted small">${lang==="ar"?"لا توجد حاسبة منطبقة في هذا التخصص لهذا المريض.":"No calculator in this specialty applies to this patient."}</p>`}${aiStatusLine()}
 ${na.length?`<h3 style="margin:22px 0 10px" class="muted">${t("notApplicable")} (${na.length})</h3><div class="cgrid">${na.map(x=>calcCard(x,p)).join("")}</div>`:""}
 <section class="box" style="margin-top:24px"><div class="sec-h"><div class="sec-ic cb">${IC.note}</div><div><h2>${t("updates")}</h2><p class="tiny muted">${t("updates_sub")}</p></div></div><div class="g2">${UPDATES.map(u=>`<div class="upd"><b style="font-weight:600">${esc(L(u.t))}</b> <span class="tag ${u.st==="applied"?"green":"amber"}" style="margin-inline-start:4px">${u.st==="applied"?(lang==="ar"?"مطبق بعد المراجعة":"Applied after review"):t("pendingReview")}</span><div class="small" style="margin-top:4px">${esc(L(u.d))}</div><div class="tiny muted" style="margin-top:3px">${esc(u.s)}</div></div>`).join("")}</div></section>`}
function viewBoard(){const list=S.hoTab==="all"?P:P.filter(p=>p.team===ME.team);
 const vis=list.filter(canSee),hid=list.filter(p=>!canSee(p));
 const sc=p=>{const n=news2(p);return n.na?-1:n.total};const order={det:0,watch:1,stable:2};
 const urg=p=>((p.matters[0]||[])[1]==="red"?0:1);vis.sort((a,b)=>sc(b)-sc(a)||order[a.status]-order[b.status]||urg(a)-urg(b));
 const tasks=vis.flatMap(p=>(TASKS[p.id]||[]).map(x=>({p,x})));
 const over=tasks.filter(o=>elapsed(o.x[1])>o.x[2]).length,pend=tasks.filter(o=>o.x[3]==="result").length;
 const hi=vis.filter(p=>!news2(p).na&&news2(p).total>=7).length,md=vis.filter(p=>{const n=news2(p);return !n.na&&n.total>=5&&n.total<7}).length;
 const row=p=>{const n=news2(p),f=news2(p,0);const b=n.na?"grey":bandOf(n.band);const tr=n.na?"":n.total>f.total?`<span class="btrend" style="color:var(--red)">↑</span>`:n.total<f.total?`<span class="btrend" style="color:var(--green)">↓</span>`:`<span class="btrend muted">→</span>`;
  const top=(p.matters[0]||p.changes[0]||[t("noIssue"),"green"]);const tk=TASKS[p.id]||[];const pr=tk.filter(x=>x[3]==="result").length;
  const more=p.changes.length+p.matters.length+p.open.length;return `<div class="brow bgrid ${b}" role="link" tabindex="0" data-open="${p.id}"><div class="bbed num">${p.bed}</div><div><div class="bname">${esc(pname(p))}</div><div class="tiny muted">${p.age}${p.sex} · ${esc(p.dx)}</div></div><div class="bnews"><span class="n ${b} num">${n.na?"MEOWS":n.total}</span>${tr}</div><div class="bissue"><div style="display:flex;gap:7px;align-items:flex-start">${sevIcon(top[1]||"green",17)}<span>${esc(top[0])}</span></div><a class="cblink" href="#careboard" data-cbopen="${p.id}">${more>1?(lang==="ar"?`كل العناصر (${more}) في كيربورد`:`All ${more} items in CareBoard`):(lang==="ar"?"فتح كيربورد":"Open CareBoard")} →</a></div><div class="bcnt num"><span><b class="${p.changes.length>=3?"hot":""}">${p.changes.length}</b>${t("changesK")}</span><span><b>${p.open.length}</b>${t("openK")}</span><span><b>${pr}</b>${t("pendK")}</span></div><div class="bst">${statusTag(p.status)}</div></div>`};
 const lockRow=p=>`<div class="brow bgrid grey locked"><div class="bbed num">${p.bed}</div><div><div class="bname">🔒 ${t("lockedRow")}</div><div class="tiny muted">${esc(p.ward)}, ${lang==="ar"?"فريق":"Team"} ${p.team}</div></div><div></div><div class="bissue muted small">${t("lockedSub").split(".")[0]}.</div><div></div><div class="bst"><button class="link" type="button" data-goto="${p.id}">${t("request")}</button></div></div>`;
 const tl=tasks.slice().sort((a,b)=>elapsed(b.x[1])/b.x[2]-elapsed(a.x[1])/a.x[2]);
 return `<div class="page-head"><div><h1>${t("nav_board")} — ${S.hoTab==="all"?t("allWards"):(lang==="ar"?"طب الأسرة فريق ب":"Family Medicine Team B")}</h1><p>${t("board_sub")}</p></div></div>
 <div class="bkpis"><div class="bkpi"><div class="n num">${vis.length}</div><div class="k">${t("kp_pts")}</div></div><div class="bkpi ${hi?"red":""}"><div class="n num">${hi}</div><div class="k">${t("kp_hi")}</div></div><div class="bkpi ${md?"amber":""}"><div class="n num">${md}</div><div class="k">${t("kp_med")}</div></div><div class="bkpi ${over?"red":""}"><div class="n num">${over}</div><div class="k">${t("kp_over")}</div></div><div class="bkpi"><div class="n num">${pend}</div><div class="k">${t("kp_pend")}</div></div></div>
 <div class="board"><div><div class="bhead bgrid"><span>${t("c_bed")}</span><span>${t("c_pt")}</span><span>${t("c_news")}</span><span>${t("c_issue")}</span><span>${t("c_counts")}</span><span>${t("c_st")}</span></div>${vis.map(row).join("")}${hid.map(lockRow).join("")}<p class="tiny muted" style="margin-top:10px">${t("roleNote")}</p></div>
 <aside><section class="box"><h3 style="margin-bottom:4px">${IC.clock} ${t("overdue")}</h3>${tl.filter(o=>o.x[3]!=="result"||elapsed(o.x[1])>o.x[2]*0.75).map(o=>`<div class="tl"><div>${esc(o.x[0])}</div><div class="who">${lang==="ar"?"سرير":"Bed"} ${o.p.bed}, ${esc(pname(o.p))}</div>${tmr(o.x[1],o.x[2])}</div>`).join("")||`<p class="muted small">—</p>`}</section>
 <section class="box" style="margin-top:12px"><h3 style="margin-bottom:4px">${IC.flask} ${t("pendRes")}</h3>${tl.filter(o=>o.x[3]==="result").map(o=>`<div class="tl"><div>${esc(o.x[0])}</div><div class="who">${lang==="ar"?"سرير":"Bed"} ${o.p.bed}, ${esc(pname(o.p))}</div>${tmr(o.x[1],o.x[2])}</div>`).join("")||`<p class="muted small">—</p>`}</section></aside></div>`}
function hoPatients(){return S.hoTab==="mine"?P.filter(p=>p.team===ME.team):P}
function viewHandover(){let list=hoPatients();if(!list.some(p=>p.id===S.pid))S.pid=list[0].id;const p=pat(S.pid);const ok=canSee(p);
 const sevMap={det:["red",t("unstable")],watch:["amber",t("watcher")],stable:["green",t("stableI")]};const vf=S.verified[p.id];
 const left=`<div class="plist"><div class="ph"><h2>${t("ho_title")}</h2></div>${list.map(x=>`<button class="prow" type="button" data-pid="${x.id}" aria-current="${x.id===p.id}"><div><div class="bed">${lang==="ar"?"سرير":"Bed"} ${x.bed}, ${esc(x.ward)}</div><div class="nm">${esc(pname(x))}${canSee(x)?"":" 🔒"}</div><div class="dx">MRN ${x.mrn}, ${x.age}${x.sex} · ${esc(x.dx)}</div></div><div class="st">${statusTag(x.status)}${S.verified[x.id]?`<div class="tiny" style="color:var(--green);margin-top:3px">✓</div>`:""}</div></button>`).join("")}</div>`;
 if(!ok)return `<div class="page-head"><div><h1>${t("ho_title")}</h1><p>${t("ho_sub")}</p></div></div><div class="ho">${left}<div>${lockView(p)}</div></div>`;
 const n=news2(p);
 const right=`<div class="box"><div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap;margin-bottom:12px"><div><div class="tiny muted">${lang==="ar"?"سرير":"Bed"} ${p.bed}, ${esc(p.ward)}</div><h2 style="font-size:22px">${esc(pname(p))}</h2><div class="small muted">MRN ${p.mrn}, ${p.age} ${p.sex==="M"?(lang==="ar"?"ذكر":"Male"):(lang==="ar"?"أنثى":"Female")} · ${esc(p.dx)}</div></div><div style="margin-inline-start:auto;text-align:end"><div class="tiny muted">${t("illness")} (I-PASS)</div><span class="tag ${sevMap[p.status][0]}">${sevMap[p.status][1]}</span><div class="tiny muted" style="margin-top:6px">${t("lastUpdated")} ${NOW}, 18:30</div></div></div>
 <div class="g3" style="margin-bottom:12px"><div class="kpi"><div class="k">NEWS2</div><div class="n num" style="color:${n.na?"var(--grey)":colorVar(n.band)}">${n.na?"—":n.total}</div></div><div class="kpi"><div class="k">${t("allergies")}</div><div class="small" style="font-weight:600">${p.allergies.map(a=>esc(a.a)).join(", ")||"NKDA"}</div></div><div class="kpi"><div class="k">${t("code")}</div><div class="small" style="font-weight:600">${esc(p.code)}</div></div></div>
 <div class="hogrid">
  <div class="hob red"><h3>${IC.up} ${t("changed")}<span class="tiny" style="margin-inline-start:auto;font-weight:500;opacity:.8">${lang==="ar"?"المصدر: كيربورد":"Source: CareBoard"}</span></h3><ul>${(p.changes.length?p.changes.map(c=>c[0]):[lang==="ar"?"لا تغيرات مهمة":"No significant change"]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
  <div class="hob green"><h3>${IC.check} ${t("done")}</h3><ul>${p.done.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
  <div class="hob amber"><h3>${IC.clock} ${t("open")}</h3><ul>${p.open.map(x=>`<li>${esc(x[0])}</li>`).join("")||"<li>—</li>"}</ul></div>
  <div class="hob blue"><h3>${IC.list} ${t("todo")}</h3>${p.todo.map((x,i)=>{const k=p.id+"_t"+i,dn=S.todos[k];return `<label class="todo ${dn?"done":""}"><input type="checkbox" data-todo="${k}" ${dn?"checked":""}><span><span class="x">${esc(x[0])}</span><div class="own">${esc(x[1])}, ${esc(x[2])}</div>${doneBy(dn)}</span></label>`}).join("")}</div>
 </div>
 <div class="box" style="margin-top:12px;background:var(--surface2)"><h3 style="margin-bottom:6px">${t("contingency")}</h3><ul class="small">${p.contingency.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="ipass" style="margin-top:10px"><span>I · Illness severity</span><span>P · Patient summary</span><span>A · Action list</span><span>S · Situation awareness</span><span>S · Synthesis by receiver</span></div></div>
 <section class="ai" style="margin-top:12px"><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><div class="ai-label">${IC.spark} ${lang==="ar"?"مسودة تلقائية من الملف":"Auto-draft from the chart"}</div><button class="btn sm primary" id="hoDraft" type="button" >${t("draft")}</button></div>${aiStatusLine()}<div class="ai-out" id="hoOut" aria-live="polite"></div></section>
 <div class="verify-bar"><label class="switch"><input type="checkbox" id="readback" ${vf&&vf.rb?"checked":""}> ${t("readback")}</label>${vf?`<span class="tag green">✓ ${t("verifiedBy")} ${esc(vf.by)}, ${esc(vf.at)}</span>`:""}<button class="btn" type="button" id="hoEdit">${t("edit")}</button><button class="btn primary" type="button" id="hoVerify">${IC.check} ${t("verify")}</button></div></div>`;
 return `<div class="page-head"><div><h1>${t("ho_title")}</h1><p>${t("ho_sub")}</p></div></div><div class="ho">${left}<div>${right}</div></div>`}

function lockView(p){return `<div class="lock"><div style="color:var(--muted)">${IC.lock}</div><h2 style="margin:8px 0 6px">${t("locked")}</h2><p class="small muted">${esc(pname(p))}, ${lang==="ar"?"سرير":"Bed"} ${p.bed} — ${lang==="ar"?"فريق":"Team"} ${p.team}</p><p class="small" style="margin-top:10px">${t("lockedSub")}</p><textarea id="bgReason" placeholder="${t("reason")}" aria-label="${t("reason")}"></textarea><button class="btn danger" type="button" data-bg="${p.id}">${t("request")}</button><p class="tiny muted" style="margin-top:10px">${lang==="ar"?"مدة الوصول 30 دقيقة. يُراجع مسؤول الخصوصية كل وصول طارئ.":"Access lasts 30 minutes. The privacy officer reviews every emergency access."}</p></div>`}

const ROSTER={
 "Medical Ward 3":{team:"Family Medicine Team B",shift:"Day shift 07:00–19:00",next:"Night team from 19:00: Dr. Ziyad Al-Ghamdi (Registrar), Dr. Reem Al-Sulami (Resident)",staff:[["Consultant","Dr. Kamel Azhar","4310","On ward"],["Registrar","Dr. Faris Al-Juhani","4312","On ward"],["Resident","Dr. Nawaf Al-Harbi","4315","On ward"],["Intern","Dr. Lama Al-Qahtani","4316","In ED, admitting"],["Charge nurse","RN Huda Al-Shehri","4301","On ward"],["Clinical pharmacist","Ph. Majed Al-Otaibi","4330","Covering wards 3 and 5"],["Respiratory therapist","RT Salman Al-Dossary","4340","On call"],["ICU outreach nurse","RN Amal Hassan","4411","Responding, Bed 12"]],nurses:6,pts:24},
 "Medical Ward 5":{team:"Internal Medicine Team A",shift:"Day shift 07:00–19:00",next:"Night team from 19:00: Dr. Bader Al-Anazi (Registrar)",staff:[["Consultant","Dr. Khalid Al-Shammari","4510","On ward"],["Registrar","Dr. Sami Al-Rashid","4512","On ward"],["Resident","Dr. Ahmed Fathi","4515","On ward"],["Intern","Dr. Sara Al-Mutairi","4516","On ward"],["Charge nurse","RN Amal Al-Harthi","4501","On ward"]],nurses:5,pts:23},
 "Surgical Ward 2":{team:"General Surgery",shift:"Day shift 07:00–19:00",next:"Night: Dr. Turki Al-Malki (Surgical registrar)",staff:[["Consultant","Dr. Yousef Al-Dosari","4610","In theatre"],["Registrar","Dr. Turki Al-Malki","4612","On ward"],["Resident","Dr. Omar Nasser","4615","In theatre"],["Charge nurse","RN Reem Al-Zahrani","4601","On ward"]],nurses:4,pts:20},
 "Cardiology Ward":{team:"Cardiology",shift:"Day shift 07:00–19:00",next:"Night: Dr. Hani Al-Saeed (Cardiology fellow)",staff:[["Consultant","Dr. Abdulaziz Al-Faisal","4710","In cath lab"],["Fellow","Dr. Hani Al-Saeed","4712","On ward"],["Charge nurse","RN Mona Al-Ghamdi","4701","On ward"]],nurses:4,pts:15},
 "Maternity Ward":{team:"Obstetrics",shift:"Day shift 07:00–19:00",next:"Night: Dr. Hind Al-Otaibi (Obstetric registrar)",staff:[["Consultant","Dr. Noura Al-Anazi","4810","On ward"],["Registrar","Dr. Hind Al-Otaibi","4812","In labour ward"],["Charge midwife","MW Fatimah Al-Zahrani","4801","On ward"]],nurses:4,pts:18},
 "ICU":{team:"Critical Care",shift:"Day shift 07:00–19:00",next:"Night: Dr. Rakan Al-Shehri (ICU registrar)",staff:[["Intensivist","Dr. Majid Al-Harthi","4910","On unit"],["ICU registrar","Dr. Rakan Al-Shehri","4912","On unit"],["Charge nurse","RN Ghada Al-Mutlaq","4901","On unit"],["Respiratory therapist","RT Fahad Al-Qarni","4940","On unit"]],nurses:33,pts:33}};
function rosterBox(ar){const w=S.shiftWard,r=ROSTER[w];const ini=n=>{const w=n.replace(/^(Dr|RN|Ph|RT|MW)\.?\s+/,"").split(" ");return (w[0][0]+(w.length>1?w[w.length-1].replace(/^Al-/,"")[0]:"")).toUpperCase()};
 const ratio=Math.round(r.pts/r.nurses*10)/10;const stTag=x=>/In |Responding|cath|theatre|ED/.test(x)?"amber":/call/.test(x)?"blue":"green";
 return `<section class="box tint-cb" style="margin-bottom:16px"><div class="sec-h" style="flex-wrap:wrap"><div class="sec-ic cb">${IC.user}</div><div style="flex:1;min-width:220px"><h2>${ar?"من في المناوبة الآن":"Who is on shift now"}</h2><p class="tiny muted">${esc(r.team)} · ${esc(r.shift)}</p></div><select id="shiftWard" class="sel" style="padding:7px 10px;font-size:14px" aria-label="Ward">${Object.keys(ROSTER).map(k=>`<option ${k===w?"selected":""}>${esc(k)}</option>`).join("")}</select></div>
 <div class="roster">${r.staff.map(x=>`<div class="person ${x[1]===ME.name?"me":""}"><div class="pav">${esc(ini(x[1]))}</div><div style="min-width:0"><div class="tiny muted">${esc(x[0])}</div><div style="font-weight:600">${esc(x[1])}${x[1]===ME.name?` <span class="tag cb">${ar?"أنت":"You"}</span>`:""}</div><div class="tiny"><span class="tag ${stTag(x[3])}">${esc(x[3])}</span> <span class="muted">ext. ${x[2]}</span></div></div></div>`).join("")}
 <div class="person"><div class="pav" style="background:linear-gradient(150deg,#2F9E8F,#11594F)">RN</div><div><div class="tiny muted">${ar?"التمريض":"Nursing"}</div><div style="font-weight:600">${r.nurses} ${ar?"ممرضين":"nurses"} · ${r.pts} ${ar?"مريضًا":"patients"}</div><div class="tiny"><span class="tag ${ratio>5?"red":ratio>4?"amber":"green"}">1 : ${ratio}</span></div></div></div></div>
 <p class="tiny muted" style="margin-top:10px">${IC.clock} ${esc(r.next)}</p></section>`}
function hospOps(ar){
 const k=[["412/448",ar?"إشغال الأسرّة 92%":"Bed occupancy, 92%","amber"],["14",ar?"مرضى الطوارئ بانتظار سرير":"ED patients waiting for a bed","red"],["3/36",ar?"أسرّة العناية المتاحة":"ICU beds available","amber"],["21/38",ar?"الخروج: منجز / متوقع اليوم":"Discharges done / expected today",""],["24 min",ar?"وسيط الوقت من NEWS2 ≥7 لمراجعة كبير الأطباء (الهدف 30)":"Median NEWS2 ≥7 to senior review (target 30)","green"]];
 const W=[["Medical Ward 3",24,24,2,5,"1:6","red",4],["Medical Ward 5",23,24,1,2,"1:5","amber",3],["Surgical Ward 2",20,24,0,1,"1:5","",6],["Cardiology Ward",15,16,1,1,"1:4","",2],["Maternity Ward",18,22,0,0,"1:5","",5],["ICU",33,36,4,2,"1:1","",1]];
 const st=[[ar?"مضادات وريدية أكثر من 72 ساعة دون مراجعة موثقة":"IV antibiotics >72 h without documented review",9,"amber"],[ar?"بدء كاربابينيم خلال 24 ساعة":"Carbapenem starts in the last 24 h",4,"amber"],[ar?"مزارع دم إيجابية لم يُتخذ إجراء بشأنها":"Positive blood cultures not yet acted on",2,"red"],[ar?"مضادات مقيدة بانتظار موافقة الأمراض المعدية":"Restricted antimicrobials awaiting ID approval",3,"blue"]];
 const lg=[["Urdu",12],["Bahasa Indonesia",9],["Bengali",6],["Turkish",4],["French",3],[ar?"أخرى":"Other",3]],mx=12;
 return `${rosterBox(ar)}<div class="bkpis">${k.map(x=>`<div class="bkpi ${x[2]}"><div class="n num">${x[0]}</div><div class="k">${x[1]}</div></div>`).join("")}</div>
 <div class="g2"><section class="box"><div class="sec-h"><div class="sec-ic cb">${IC.chart}</div><div><h2>${ar?"حالة الأجنحة الآن":"Ward status now"}</h2><p class="tiny muted">${ar?"الإشغال والحدة وطاقم التمريض في مكان واحد":"Occupancy, acuity and staffing in one place"}</p></div></div><div class="scroll-x"><table class="t small num"><thead><tr><th>${ar?"الجناح":"Ward"}</th><th>${ar?"الإشغال":"Beds"}</th><th>NEWS2 ≥5</th><th>${ar?"متأخر":"Overdue"}</th><th>${ar?"ممرض:مريض":"Nurse : patient"}</th><th>${ar?"خروج اليوم":"Discharges"}</th></tr></thead><tbody>${W.map(w=>{const o=w[1]/w[2];return `<tr><td>${esc(w[0])}</td><td><span class="tag ${o>=.97?"red":o>=.9?"amber":"green"}">${w[1]}/${w[2]}</span></td><td>${w[3]?`<span class="tag ${w[3]>=2?"red":"amber"}">${w[3]}</span>`:"0"}</td><td>${w[4]}</td><td>${w[6]?`<span class="tag ${w[6]}">${w[5]}</span>`:w[5]}</td><td>${w[7]}</td></tr>`}).join("")}</tbody></table></div></section>
 <section class="box"><div class="sec-h"><div class="sec-ic amber">${IC.pill}</div><div><h2>${ar?"إشراف المضادات الحيوية":"Antimicrobial stewardship"}</h2><p class="tiny muted">${ar?"أعداد على مستوى المستشفى لفريق الإشراف":"Hospital-wide counts for the stewardship team"}</p></div></div><div class="items">${st.map(x=>`<div class="item ${x[2]}"><span class="sev">${sevIcon(x[2])}</span><div class="body small">${x[0]}</div><b class="num" style="font-size:18px">${x[1]}</b></div>`).join("")}</div></section></div>
 <section class="box" style="margin-top:16px"><div class="sec-h"><div class="sec-ic teal">${IC.user}</div><div><h2>${ar?"دعم مرضى الحج والعمرة":"Pilgrim patient support"}</h2><p class="tiny muted">${ar?"37 مريضًا منوّمًا من مجموعات الحج والعمرة. 3 طلبات ترجمة معلقة.":"37 inpatients from Hajj and Umrah groups. 3 interpreter requests pending."}</p></div></div><div class="langbars">${lg.map(x=>`<div><span>${esc(x[0])}</span><i style="width:${x[1]/mx*100}%"></i><b class="num">${x[1]}</b></div>`).join("")}</div></section>`}
function viewRadar(){const bins=[0,1,1,2,1,2],labels=["−72h","−60h","−48h","−36h","−24h","−12h"],mx=3;const W=320,H=130;
 const bars=bins.map((v,i)=>{const bh=v/mx*(H-40),x=24+i*48,y=H-22-bh;return `<rect x="${x}" y="${y}" width="32" height="${bh}" rx="3" fill="var(--amber)"/><text x="${x+16}" y="${y-4}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--ink)">${v||""}</text><text x="${x+16}" y="${H-6}" text-anchor="middle" font-size="10" fill="var(--muted)">${labels[i]}</text>`}).join("");
 const ward=(nm,f,x,tot)=>`<div class="ward"><div style="display:flex;justify-content:space-between"><b style="font-weight:600">${nm}</b><span class="tag amber">${f}</span></div><div class="beds">${Array.from({length:tot},(_,i)=>`<i class="${i<x?"x":i<f?"f":""}"></i>`).join("")}</div></div>`;
 const ar=lang==="ar";
 return `<div class="page-head"><div><h1>${t("radar_title")}</h1><p>${t("radar_sub")}</p></div><span class="tag cb">${ar?"وضع الحج والعمرة":"Hajj and Umrah mode"}</span></div>
 ${hospOps(ar)}<section class="signal" style="margin-top:16px"><div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap"><div class="sec-ic amber">${IC.radar}</div><div style="flex:1;min-width:240px"><h2>${ar?"إشارة تجمّع تنفسي حموي — بحاجة لمراجعة مكافحة العدوى":"Febrile respiratory cluster signal — needs Infection Prevention review"}</h2><p class="small muted" style="margin-top:4px">${ar?"لا يستدعي أي مريض منفردًا تنبيهًا، لكن النمط عبر الأجنحة غير متوقع.":"No single patient triggers an alert. Together, the pattern across wards is unexpected."}</p></div><span class="tag amber">${ar?"إشارة، ليست تفشيًا مؤكدًا":"Signal, not a confirmed outbreak"}</span></div>
 <div class="kpis"><div class="kpi"><div class="n num">7</div><div class="k">${ar?"مرضى بحمى وأعراض تنفسية جديدة خلال 72 ساعة":"New fever + respiratory symptoms, 72 h"}</div></div><div class="kpi"><div class="n num">2.1</div><div class="k">${ar?"المتوقع حسب خط أساس 4 أسابيع":"Expected from 4-week baseline"}</div></div><div class="kpi"><div class="n num">0.006</div><div class="k">${ar?"قيمة p (بواسون، P(X≥7|λ=2.1))":"Poisson p, P(X≥7 | λ=2.1)"}</div></div><div class="kpi"><div class="n num">3</div><div class="k">${ar?"أجنحة متأثرة":"Wards involved"}</div></div></div></section>
 <div class="g2" style="margin-top:14px"><section class="box"><h3 style="margin-bottom:8px">${ar?"منحنى البداية (فترات 12 ساعة)":"Onset curve (12 h bins)"}</h3><svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:420px">${bars}</svg></section>
 <section class="box"><h3 style="margin-bottom:8px">${ar?"التعرض المشترك":"Shared exposure"}</h3><table class="t small"><tbody><tr><td>${ar?"عودة من العمرة خلال 10 أيام":"Returned from Umrah within 10 days"}</td><td class="num"><b>4 / 7</b></td></tr><tr><td>${ar?"نفس منطقة الإقامة في مكة":"Same accommodation district in Makkah"}</td><td class="num"><b>3 / 7</b></td></tr><tr><td>${ar?"مخالطة إبل موثقة":"Documented camel contact"}</td><td class="num"><b>0 / 7 (${ar?"غير موثق لدى 5":"not recorded in 5"})</b></td></tr><tr><td>${ar?"نتائج PCR تنفسي متاحة":"Respiratory PCR resulted"}</td><td class="num"><b>1 / 7</b></td></tr></tbody></table></section></div>
 <section class="box" style="margin-top:14px"><h3 style="margin-bottom:8px">${ar?"توزيع الأجنحة":"Ward distribution"}</h3><div class="wards">${ward(ar?"الباطنة 3":"Medical Ward 3",3,1,24)}${ward(ar?"الباطنة 5":"Medical Ward 5",2,1,24)}${ward(ar?"ملاحظة الطوارئ":"ED observation",2,0,16)}</div><p class="tiny muted" style="margin-top:8px">${ar?"الأحمر: مريض متدهور ضمن الإشارة. يرى الطبيب أسماء مرضى فريقه فقط.":"Red: deteriorating patient in the signal. Clinicians see names only for patients on their own care team."}</p></section>
 <div class="g2" style="margin-top:14px"><section class="box"><h3 style="margin-bottom:8px">${ar?"الإجراءات المقترحة":"Suggested actions"}</h3><div class="items">${[[ar?"إبلاغ فريق مكافحة العدوى للمراجعة":"Notify Infection Prevention for review","red"],[ar?"احتياطات الرذاذ والتلامس حتى ظهور النتائج":"Droplet and contact precautions while results are pending","amber"],[ar?"لوحة PCR تنفسية تشمل MERS-CoV والإنفلونزا وSARS-CoV-2":"Respiratory PCR panel including MERS-CoV, influenza, SARS-CoV-2","amber"],[ar?"توثيق تاريخ التعرض (إبل، مخالطين مرضى، مجموعة الرحلة)":"Complete exposure history (camels, sick contacts, tour group)","amber"]].map(x=>`<div class="item ${x[1]}"><span class="dot"></span><div class="body small">${x[0]}</div></div>`).join("")}</div></section>
 <section class="box"><h3 style="margin-bottom:6px">${ar?"التقرير الخارجي: أعداد مجمّعة فقط":"External report: aggregated counts only"}</h3><p class="small muted" style="margin-bottom:8px">${ar?"يُشارك مع التجمع الصحي الإقليمي أو هيئة الصحة العامة بعد اعتماد مكافحة العدوى. لا أسماء ولا أرقام ملفات. الأعداد أقل من 5 تُخفى.":"Shared with the regional health cluster or the Public Health Authority after Infection Prevention approval. No names, no MRNs. Counts under 5 are suppressed."}</p><pre class="json">{
  "facility": "DEMO-HOSP-001",
  "syndrome": "acute febrile respiratory illness",
  "window_hours": 72,
  "case_count": 7,
  "expected_count": 2.1,
  "wards_affected": 3,
  "recent_umrah_travel": "&lt;5",
  "patient_identifiers": "none"
}</pre><button class="btn sm" type="button" style="margin-top:8px" id="copyRep">${ar?"نسخ التقرير":"Copy report"}</button></section></div>`}

function viewGov(){const ar=lang==="ar";const a=S.access;const active=Object.entries(a).filter(([k,v])=>v>Date.now());
 return `<div class="page-head"><div><h1>${t("gov_title")}</h1><p>${t("gov_sub")}</p></div></div>
 <div class="g2"><section class="box"><h3 style="margin-bottom:8px">${ar?"الوصول حسب فريق الرعاية":"Care-team-based access"}</h3><p class="small" style="margin-bottom:10px">${ar?"يرى الطبيب المريض فقط إذا كان ضمن فريق رعايته. في الطوارئ يطلب الطبيب غير المعيّن وصولًا مؤقتًا عبر البوابة مع ذكر السبب.":"A clinician sees a patient only when assigned to that patient's care team. In an emergency, an unassigned clinician requests time-limited access in the portal and states a reason."}</p>
 <table class="t small"><thead><tr><th>${t("patient")}</th><th>${ar?"الفريق":"Team"}</th><th>${ar?"وصولك":"Your access"}</th></tr></thead><tbody>${P.map(p=>`<tr><td>${esc(pname(p))}</td><td>${p.team}</td><td>${p.team===ME.team?`<span class="tag green">${ar?"فريق الرعاية":"Care team"}</span>`:canSee(p)?`<span class="tag amber">${ar?"طارئ":"Emergency"} <span class="timer num" data-timer="${p.id}"></span></span>`:`<span class="tag grey">🔒 ${ar?"مقفل":"Locked"}</span> <button class="link" type="button" data-goto="${p.id}">${t("request")}</button>`}</td></tr>`).join("")}</tbody></table></section>
 <section class="box"><h3 style="margin-bottom:8px">${ar?"سجل التدقيق":"Audit log"}</h3><div class="scroll-x"><table class="t small"><thead><tr><th>${ar?"الوقت":"Time"}</th><th>${ar?"المستخدم":"User"}</th><th>${ar?"الإجراء":"Action"}</th><th>${ar?"الأساس":"Basis"}</th></tr></thead><tbody>${S.audit.map(r=>`<tr><td class="num">${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${/Emergency/.test(r[3])?`<span class="tag amber">${esc(r[3])}</span>`:esc(r[3])}</td></tr>`).join("")}</tbody></table></div></section></div>
 <div class="g2" style="margin-top:14px"><section class="box"><h3 style="margin-bottom:6px">${ar?"حماية البيانات":"Data protection"}</h3>${[[ar?"مصمم وفق نظام حماية البيانات الشخصية السعودي (PDPL) الذي تشرف عليه سدايا، والبيانات الصحية فيه بيانات حساسة":"Designed for Saudi Arabia's Personal Data Protection Law (PDPL), supervised by SDAIA, which treats health data as sensitive data"],[ar?"ضوابط وصول بمستوى HIPAA: أقل صلاحية لازمة، وصول طارئ مؤقت، سجل تدقيق كامل":"HIPAA-grade access controls: minimum necessary, time-limited break-glass access, full audit trail"],[ar?"استضافة البيانات داخل المملكة":"Data hosted inside the Kingdom"],[ar?"يقرأ من السجل الحالي عبر HL7 FHIR R4 دون استبداله":"Reads from the existing EHR through HL7 FHIR R4; never replaces it"],[ar?"الشروحات تعتمد على بيانات الملف فقط ولا يُرسل الاسم أو رقم الملف خارج المستشفى":"Explanations use chart data only; name and MRN are never sent outside the hospital"],[ar?"المشاركة الخارجية أعداد مجمّعة فقط مع إخفاء الأعداد الصغيرة":"External sharing is aggregated counts only, with small-number suppression"]].map(x=>`<div class="check"><span class="ok">✓</span><span>${x[0]}</span></div>`).join("")}</section>
 <section class="box"><h3 style="margin-bottom:6px">${ar?"طبقة الثقة":"Trust layer"}</h3>${[[ar?"كل عنصر يحمل زر «لماذا» يعرض بيانات المصدر والقاعدة أو الإرشاد":"Every item has a Why button showing its source data and the rule or guideline behind it"],[ar?"تمييز واضح بين القواعد الثابتة ومخرجات الذكاء الاصطناعي":"Clear label separating deterministic rules from AI-generated text"],[ar?"لا أوامر تلقائية: الطبيب يقرر ويتحقق":"No autonomous orders: the clinician decides and verifies"],[ar?"كل حاسبة تعرض المصدر والإصدار وتاريخ آخر تحقق":"Every calculator shows source, version and last-verified date"],[ar?"تحديثات الإرشادات تُعرض للمراجعة ولا تُطبق تلقائيًا":"Guideline updates are shown for review, never applied automatically"],[ar?"البيانات الناقصة تظهر كناقصة ولا تُخمَّن":"Missing data is shown as missing, never guessed"]].map(x=>`<div class="check"><span class="ok">✓</span><span>${x[0]}</span></div>`).join("")}</section></div>
 ${active.length?"":""}`}


/* ---------------- render ---------------- */
function render(){WHY.length=0;document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";renderTop();renderRail();
 const v=curView(),p=pat(S.pid);let h="";
 if(v==="board")h=viewBoard();else if(["ehr","careboard","calculators"].includes(v)&&!canSee(p))h=lockView(p);
 else if(v==="ehr")h=viewEHR(p);else if(v==="careboard")h=viewCB(p);else if(v==="calculators")h=viewCalc(p);else if(v==="handover")h=viewHandover();else if(v==="radar")h=viewRadar();else h=viewGov();
 $("#main").innerHTML=h;tickTimers();if(S.editing){const f=document.querySelector("#edText,#edS");if(f){f.focus();if(f.setSelectionRange&&f.value)f.setSelectionRange(f.value.length,f.value.length)}}}
function tickTimers(){document.querySelectorAll(".tmr").forEach(updTmr);document.querySelectorAll("[data-timer]").forEach(e=>{const ms=(S.access[e.dataset.timer]||0)-Date.now();if(ms<=0){e.textContent="";return}const m=Math.floor(ms/60000),s=Math.floor(ms%60000/1000);e.textContent=m+":"+String(s).padStart(2,"0")})}
setInterval(()=>{tickTimers();const exp=Object.entries(S.access).some(([k,v])=>v&&v<Date.now());if(exp){for(const k in S.access)if(S.access[k]<Date.now())delete S.access[k];store.set("access",S.access);render()}},1000);

/* ---------------- events ---------------- */
document.addEventListener("click",e=>{
 const cbo=e.target.closest("[data-cbopen]");if(cbo){e.preventDefault();S.pid=cbo.dataset.cbopen;store.set("pid",S.pid);location.hash="careboard";return}
 if(e.target.closest("[data-cdsadd]")){S.editing="cdsnew:"+S.pid;render();return}
 const ce=e.target.closest("[data-cdsedit]");if(ce){S.editing="cds:"+S.pid+":"+ce.dataset.cdsedit;render();return}
 if(e.target.closest("[data-soapedit]")){S.editing="soap:"+S.pid;render();return}
 if(e.target.closest("[data-soapadd]")){S.editing="soapadd:"+S.pid;render();return}
 if(e.target.closest("[data-cancel]")){S.editing=null;render();return}
 if(e.target.closest("[data-calcclear]")){S.calcQ="";S.calcTab="all";render();return}
 if(e.target.closest("[data-toggleold]")){S.hideOld=!S.hideOld;render();return}
 const sv=e.target.closest("[data-save]");if(sv){const p=pat(S.pid),nb=NB(p),k=sv.dataset.save,at=nowT(),tx=(($("#edText")||{}).value||"").trim();let act="";
  if(k==="cdsnew"){if(!tx)return;nb.cdsAdd.push({text:tx,by:ME.name,at});act="Added CDS to-do"}
  else if(k.startsWith("cds:o")){if(!tx)return;nb.cdsEd[+k.slice(5)]={text:tx,by:ME.name,at};act="Edited CDS to-do"}
  else if(k.startsWith("cds:a")){if(!tx)return;const a=nb.cdsAdd[+k.slice(5)];a.text=tx;a.edBy=ME.name;a.edAt=at;act="Edited CDS to-do"}
  else if(k==="soap"){const g=id=>($("#"+id)||{}).value||"";nb.soap={s:g("edS"),o:g("edO"),a:g("edA"),p:g("edP"),by:p.soap.by,tm:p.soap.tm,edBy:ME.name,edAt:at};act="Edited SOAP note"}
  else if(k==="soapadd"){if(!tx)return;nb.add.push({text:tx,by:ME.name,at});act="Added SOAP addendum"}
  S.editing=null;store.set("notes",S.notes);S.audit.unshift([NOW+" "+new Date().toTimeString().slice(0,5),ME.name,act+", Bed "+p.bed,"Care team"]);store.set("audit",S.audit);toast(lang==="ar"?"تم الحفظ باسم "+ME.name:"Saved and signed by "+ME.name);render();return}
 const w=e.target.closest("[data-why]");if(w){openWhy(+w.dataset.why);return}
 const tb=e.target.closest("[data-tab]");if(tb){S.calcTab=tb.dataset.tab;render();return}
 const ht=e.target.closest("[data-hotab]");if(ht){S.hoTab=ht.dataset.hotab;render();return}
 const op=e.target.closest("[data-open]");if(op){S.pid=op.dataset.open;store.set("pid",S.pid);location.hash="ehr";return}
 const pr=e.target.closest("[data-pid]");if(pr){S.pid=pr.dataset.pid;store.set("pid",S.pid);render();return}
 const gt=e.target.closest("[data-goto]");if(gt){S.pid=gt.dataset.goto;store.set("pid",S.pid);location.hash="ehr";return}
 const bg=e.target.closest("[data-bg]");if(bg){const r=($("#bgReason")||{}).value||"";if(r.trim().length<5){$("#bgReason").focus();toast(t("reason"));return}const p=pat(bg.dataset.bg);S.access[p.id]=Date.now()+30*60000;store.set("access",S.access);S.audit.unshift([NOW+" "+new Date().toTimeString().slice(0,5),ME.name,"Emergency access, "+p.name+" (30 min)","Emergency: "+r.trim().slice(0,60)]);store.set("audit",S.audit);toast(t("accessGranted"));render();return}
 const ex=e.target.closest("[data-explain]");if(ex){const c=CALCS.find(x=>x.id===ex.dataset.explain),p=pat(S.pid),r=c.fn(p);showBuilt($("#ex_"+c.id),explainCalc(p,c,r));return}
 const ask=e.target.closest("[data-ask]");if(ask){$("#askIn").value=ask.dataset.ask;$("#askBtn").click();return}
 if(e.target.closest("#askBtn")){const q=$("#askIn").value.trim();if(!q)return;runAI(pat(S.pid),"Answer the clinician's question: "+q,$("#askOut"),$("#askBtn"));return}
 if(e.target.closest("#hoDraft")){showBuilt($("#hoOut"),handoverDraft(pat(S.pid)));return}
 if(e.target.closest("#hoVerify")){const p=pat(S.pid);S.verified[p.id]={by:ME.name,at:new Date().toTimeString().slice(0,5),rb:!!($("#readback")||{}).checked};store.set("verified",S.verified);toast(t("savedVerified"));render();return}
 if(e.target.closest("#hoEdit")){document.querySelectorAll(".hob ul").forEach(u=>{u.contentEditable="true";u.style.outline="1px dashed var(--cb)"});return}
 if(e.target.closest("#copyRep")){const txt=document.querySelector("pre.json").textContent;try{navigator.clipboard.writeText(txt).then(()=>toast(t("copied")))}catch(_){};return}
});
document.addEventListener("change",e=>{
 if(e.target.id==="calcSpec"){S.calcTab=e.target.value;render();return}
 if(e.target.id==="shiftWard"){S.shiftWard=e.target.value;render();return}
 if(e.target.id==="mineToggle"){S.hoTab=e.target.checked?"mine":"all";store.set("hoTab",S.hoTab);if(S.hoTab==="mine"&&pat(S.pid).team!==ME.team){S.pid=P.find(p=>p.team===ME.team).id;store.set("pid",S.pid)}render();return}
 if(e.target.id==="ptSelect"){S.pid=e.target.value;store.set("pid",S.pid);render();return}
 if(e.target.id==="layerToggle"){S.layer=e.target.checked;store.set("layer",S.layer);render();return}
 if(e.target.dataset.todo){S.todos[e.target.dataset.todo]=e.target.checked?{by:ME.name,role:ME.role,at:new Date().toTimeString().slice(0,5)}:false;store.set("todos",S.todos);render();return}
});
document.addEventListener("input",e=>{if(e.target.id==="calcQ"){S.calcQ=e.target.value;render();const f=$("#calcQ");if(f){f.focus();f.setSelectionRange(f.value.length,f.value.length)}}});
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.id==="edText"&&e.target.tagName==="INPUT"){e.preventDefault();const b=document.querySelector("[data-save]");if(b)b.click();return}if(e.key==="Escape"&&S.editing){S.editing=null;render();return}const o=e.target.closest&&e.target.closest("[data-open]");if(o&&(e.key==="Enter"||e.key===" ")&&e.target===o){e.preventDefault();o.click()}});
$("#langBtn").addEventListener("click",()=>{lang=lang==="ar"?"en":"ar";store.set("lang",lang);render()});
$("#dlgClose").addEventListener("click",()=>$("#dlg").close());
$("#dlg").addEventListener("close",()=>{if(aiCtl)aiCtl.abort()});
$("#dlg").addEventListener("click",e=>{const qb=e.target.closest("[data-whyq]");if(qb){$("#whyQ").value=qb.dataset.whyq;$("#whyAsk").click();return}if(e.target.id==="whyAsk"){const q=($("#whyQ").value||"").trim();if(!q)return;const w=WHY[S.whyCur]||{};showBuilt($("#whyOut"),askAnswer(pat(S.pid),w,q))}});
$("#dlg").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.id==="whyQ"){e.preventDefault();$("#whyAsk").click()}});
setInterval(()=>{if(curView()==="board")render()},60000);
window.addEventListener("hashchange",()=>{render();window.scrollTo(0,0)});
render();
