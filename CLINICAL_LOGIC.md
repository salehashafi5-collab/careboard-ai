# Clinical logic

Every score in CareBoard AI is calculated in the browser from chart data with a fixed, published formula. Nothing is estimated by AI. When an input is missing, the score is shown as partial and the missing item is named. When a score is not validated for a patient group, it is shown as not applicable with the reason.

> **Demo status:** the “Hospital approved” badges and “last verified” dates represent the governance workflow a hospital would run (pharmacy and therapeutics or clinical content committee). In this demo they have not been through a real hospital approval. A licensed clinician should review all thresholds before any clinical use.

## Colour rules

| Colour | Meaning |
|---|---|
| Red | High risk or alert: act now |
| Orange | Abnormal or moderate: review |
| Green | Within range or low risk |
| Blue | Information (for example fluid volumes) |
| Grey | Not applicable to this patient |

Vital-sign tiles on the patient summary follow the NEWS2 parameter score for each measurement: 0 green, 1–2 orange, 3 red. After childbirth NEWS2 is not used and reference ranges apply instead.

## Calculators (35)

### NEWS2
*National Early Warning Score 2* · Specialties: Core inpatient, Emergency, Pulmonology

- **Thresholds and use:** Bands: 0–4 low, any single parameter 3 low–medium, 5–6 medium (urgent response), ≥7 high (emergency response). SpO₂ Scale 2 only for documented hypercapnic respiratory failure.
- **Source:** Royal College of Physicians, London
- **Version:** NEWS2 (Dec 2017)

### qSOFA
*Quick SOFA, sepsis risk* · Specialties: Core inpatient, Emergency, Infectious disease

- **Thresholds and use:** ≥2 of RR ≥22, SBP ≤100, altered mentation flags higher risk of poor outcome. SSC 2021 recommends against qSOFA as a single screening tool compared with SIRS, NEWS or MEWS.
- **Source:** Sepsis-3 (Seymour, JAMA 2016); Surviving Sepsis Campaign 2021
- **Version:** Sepsis-3 / SSC 2021

### BMI
*Body mass index* · Specialties: Core inpatient, Endocrinology

- **Thresholds and use:** <18.5 underweight, 18.5–24.9 normal, 25–29.9 overweight, 30–34.9 obesity I, ≥35 obesity II–III.
- **Source:** World Health Organization adult BMI classification
- **Version:** WHO

### Padua
*VTE risk in medical inpatients* · Specialties: Core inpatient, Haematology and VTE

- **Thresholds and use:** ≥4 high VTE risk. Validated in medical, not surgical, inpatients.
- **Source:** Barbar et al., J Thromb Haemost 2010; ASH 2018 VTE prophylaxis guideline
- **Version:** Padua Prediction Score

### Anion gap
*With albumin correction and delta ratio* · Specialties: Core inpatient, Emergency, ICU, Nephrology, Endocrinology

- **Thresholds and use:** Elevated corrected AG suggests a high anion gap metabolic acidosis. Delta ratio 0.8–2 suggests pure HAGMA.
- **Source:** AG = Na − (Cl + HCO₃); corrected AG = AG + 2.5 × (4.0 − albumin g/dL) (Figge 1998); delta ratio = (AG − 12)/(24 − HCO₃)
- **Version:** Reference interval 8–12 mmol/L (lab-dependent)

### Maintenance IV fluids
*Adult NICE CG174 / pediatric Holliday–Segar* · Specialties: Core inpatient, Nephrology, Pediatric ICU

- **Thresholds and use:** Adults: 25–30 mL/kg/day water, ~1 mmol/kg/day Na, K and Cl, 50–100 g/day glucose. Consider 20–25 mL/kg/day if older, frail, renal impairment or heart failure. Obese: use ideal body weight.
- **Source:** NICE CG174 Intravenous fluid therapy in adults (updated 2017); Holliday & Segar 1957 for children with NICE NG29 isotonic fluids
- **Version:** CG174 / NG29

### CURB-65
*Pneumonia severity* · Specialties: Core inpatient, Emergency, Pulmonology, Infectious disease

- **Thresholds and use:** 0–1 low, 2 moderate, 3–5 high severity. ATS/IDSA 2019 prefers PSI for outpatient decisions and its own severe-CAP criteria for ICU decisions.
- **Source:** Lim et al., Thorax 2003; BTS CAP guideline; ATS/IDSA CAP 2019
- **Version:** CURB-65

### HEART
*Chest pain, 6-week MACE risk* · Specialties: Emergency, Cardiology

- **Thresholds and use:** 0–3 low, 4–6 moderate, 7–10 high. History and ECG items are clinician-entered.
- **Source:** Six et al., Neth Heart J 2008; Backus et al., Int J Cardiol 2013
- **Version:** HEART score

### TIMI
*UA/NSTEMI, 14-day risk* · Specialties: Cardiology

- **Thresholds and use:** 0–2 low, 3–4 intermediate, 5–7 high.
- **Source:** Antman et al., JAMA 2000
- **Version:** TIMI UA/NSTEMI

### GRACE
*ACS in-hospital mortality points* · Specialties: Cardiology

- **Thresholds and use:** Score >140 identifies high risk; ESC 2023 and ACC/AHA 2025 support early invasive strategy (within 24 h) for high-risk NSTE-ACS.
- **Source:** Granger et al., Arch Intern Med 2003; ESC 2023 ACS guideline; ACC/AHA 2025 ACS guideline
- **Version:** GRACE (in-hospital points)

### CHA₂DS₂-VA
*AF stroke risk (ESC 2024)* · Specialties: Cardiology, Haematology and VTE

- **Thresholds and use:** Female sex removed. Oral anticoagulation recommended at ≥2, should be considered at 1. Not for hypertrophic cardiomyopathy or cardiac amyloidosis.
- **Source:** ESC 2024 AF guideline (Van Gelder et al., Eur Heart J 2024)
- **Version:** CHA₂DS₂-VA (replaces CHA₂DS₂-VASc in ESC 2024)

### APACHE II
*ICU severity of illness* · Specialties: ICU

- **Thresholds and use:** Validated on worst values in the first 24 h of ICU admission. Ward values are shown for escalation discussion only.
- **Source:** Knaus et al., Crit Care Med 1985
- **Version:** APACHE II

### SAPS II
*Simplified Acute Physiology Score* · Specialties: ICU

- **Thresholds and use:** Predicted mortality is shown only when all 17 variables are present. logit = −7.7631 + 0.0737·SAPS + 0.9971·ln(SAPS + 1).
- **Source:** Le Gall et al., JAMA 1993
- **Version:** SAPS II

### eGFR (CKD-EPI 2021)
*Race-free creatinine equation* · Specialties: Nephrology, Core inpatient

- **Thresholds and use:** G1 ≥90, G2 60–89, G3a 45–59, G3b 30–44, G4 15–29, G5 <15 mL/min/1.73 m². Not valid while creatinine is changing (AKI).
- **Source:** Inker et al., NEJM 2021 (CKD-EPI 2021); KDIGO 2024 CKD guideline
- **Version:** CKD-EPI 2021

### KDIGO AKI stage
*Creatinine and urine output criteria* · Specialties: Nephrology

- **Thresholds and use:** Stage 1: rise ≥26.5 µmol/L in 48 h or 1.5–1.9× baseline, or urine <0.5 mL/kg/h for 6–12 h. Stage 2: 2.0–2.9×. Stage 3: ≥3×, creatinine ≥354 µmol/L or renal replacement therapy.
- **Source:** KDIGO Clinical Practice Guideline for Acute Kidney Injury, 2012
- **Version:** KDIGO 2012

### Creatinine clearance
*Cockcroft–Gault, for drug dosing* · Specialties: Nephrology, Haematology and VTE

- **Thresholds and use:** CrCl = (140 − age) × weight × 0.85 if female ÷ (72 × creatinine mg/dL). Many drug labels use CrCl for renal dose adjustment.
- **Source:** Cockcroft & Gault, Nephron 1976
- **Version:** Cockcroft–Gault

### Wells score for PE
*Pretest probability, two-tier* · Specialties: Pulmonology, Emergency, Haematology and VTE

- **Thresholds and use:** ≤4 PE unlikely: D-dimer (age-adjusted over 50 years: age × 10 µg/L). >4 PE likely: CT pulmonary angiography. DVT signs and 'PE most likely' are clinician-entered.
- **Source:** Wells et al., Thromb Haemost 2000; ESC 2019 acute PE guideline
- **Version:** Wells (two-tier)

### SIRS
*Systemic inflammatory response criteria* · Specialties: Infectious disease, Emergency

- **Thresholds and use:** Temp >38 or <36 °C, HR >90, RR >20 or PaCO₂ <32 mmHg, WBC >12 or <4 ×10⁹/L. Met when ≥2. SSC 2021 prefers SIRS, NEWS or MEWS over qSOFA alone for screening.
- **Source:** ACCP/SCCM consensus (Bone et al., Chest 1992); Surviving Sepsis Campaign 2021
- **Version:** SIRS

### HAS-BLED
*Bleeding risk on anticoagulation* · Specialties: Cardiology, Haematology and VTE

- **Thresholds and use:** ≥3 high bleeding risk. ESC 2024: use it to find and fix modifiable bleeding risks, not as a reason to withhold anticoagulation.
- **Source:** Pisters et al., Chest 2010; ESC 2024 AF guideline
- **Version:** HAS-BLED

### Corrected sodium
*For hyperglycaemia* · Specialties: Endocrinology

- **Thresholds and use:** Corrected Na = Na + 0.024 × (glucose mg/dL − 100). The Katz (1973) factor of 1.6 gives a lower estimate.
- **Source:** Hillier et al., Am J Med 1999
- **Version:** Correction factor 2.4

### Calculated osmolality
*2 × Na + glucose + urea* · Specialties: Endocrinology, Nephrology

- **Thresholds and use:** Osmolar gap needs a measured osmolality; a gap above 10 suggests unmeasured osmoles.
- **Source:** Standard SI formula, all values in mmol/L
- **Version:** Reference 275–295 mOsm/kg

### GCS
*Glasgow Coma Scale* · Specialties: Neurology, Emergency, ICU

- **Thresholds and use:** 15 normal, 13–14 mild, 9–12 moderate, ≤8 severe (consider airway protection). Record eye, verbal and motor components.
- **Source:** Teasdale & Jennett, Lancet 1974
- **Version:** GCS

### ABCD²
*Stroke risk after TIA* · Specialties: Neurology

- **Thresholds and use:** NICE NG128 advises specialist assessment within 24 h for suspected TIA and not using ABCD² to set urgency.
- **Source:** Johnston et al., Lancet 2007; NICE NG128 (2019)
- **Version:** ABCD²

### MEOWS
*Modified Early Obstetric Warning Score* · Specialties: Obstetrics

- **Thresholds and use:** Trigger: one red or two yellow parameters. Thresholds vary between hospitals; follow the local obstetric chart.
- **Source:** Singh et al., Anaesthesia 2012
- **Version:** MEOWS trigger criteria

### MELD-Na
*Chronic liver disease severity* · Specialties: Hepatology and GI

- **Thresholds and use:** For cirrhosis. Uses creatinine, bilirubin, INR and sodium (bounded 125–137). MELD 3.0 (Kim 2021) adds sex and albumin.
- **Source:** Kim et al., NEJM 2008 (MELD-Na), OPTN formula
- **Version:** MELD-Na

### Glasgow-Blatchford
*Upper GI bleeding risk* · Specialties: Hepatology and GI

- **Thresholds and use:** A score of 0–1 identifies low-risk patients who may be suitable for outpatient care.
- **Source:** Blatchford et al., Lancet 2000; NICE CG141
- **Version:** Glasgow-Blatchford score

### Wells score for DVT
*Pretest probability, two-level (NICE NG158)* · Specialties: Haematology and VTE, Emergency, Surgery

- **Thresholds and use:** ≥2 DVT likely: proximal leg vein ultrasound within 4 h. ≤1 DVT unlikely: D-dimer. Examination items are clinician-entered.
- **Source:** Wells et al., NEJM 2003; NICE NG158 (2020)
- **Version:** Wells DVT (two-level)

### Caprini
*VTE risk in surgical patients* · Specialties: Surgery, Haematology and VTE

- **Thresholds and use:** 0 very low, 1–2 low, 3–4 moderate, ≥5 high. ACCP 2012 suggests extended (4-week) LMWH after abdominal or pelvic cancer surgery.
- **Source:** Caprini, Dis Mon 2005; ACCP 2012 non-orthopaedic surgery guideline (Gould et al., Chest)
- **Version:** Caprini RAM 2005

### RCRI
*Revised Cardiac Risk Index, pre-operative* · Specialties: Surgery, Cardiology

- **Thresholds and use:** Major cardiac complication risk in the original cohort: 0 = 0.4%, 1 = 0.9%, 2 = 6.6%, ≥3 = 11%. ESC 2022 advises combining with functional capacity and biomarkers.
- **Source:** Lee et al., Circulation 1999; ESC 2022 non-cardiac surgery guideline
- **Version:** RCRI (Lee)

### Braden scale
*Pressure injury risk, nursing assessment* · Specialties: Nursing and safety, Core inpatient, Surgery

- **Thresholds and use:** ≤9 very high, 10–12 high, 13–14 moderate, 15–18 mild risk, ≥19 no risk. Lower is worse.
- **Source:** Bergstrom et al., Nurs Res 1987
- **Version:** Braden scale (6–23)

### Morse Fall Scale
*Inpatient fall risk, nursing assessment* · Specialties: Nursing and safety, Core inpatient

- **Thresholds and use:** Common cut-offs: 0–24 low, 25–44 moderate, ≥45 high. Hospitals set their own thresholds.
- **Source:** Morse et al., Can J Aging 1989
- **Version:** Morse Fall Scale (0–125)

### 4AT
*Rapid delirium screen* · Specialties: Nursing and safety, Neurology, Core inpatient

- **Thresholds and use:** ≥4 possible delirium ± cognitive impairment; 1–3 possible cognitive impairment; 0 delirium unlikely.
- **Source:** Bellelli et al., Age Ageing 2014; SIGN 157 delirium guideline (2019)
- **Version:** 4AT (0–12)

### MUST
*Malnutrition Universal Screening Tool* · Specialties: Nursing and safety, Hepatology and GI, Surgery

- **Thresholds and use:** 0 low, 1 medium, ≥2 high risk: dietitian referral and nutrition plan.
- **Source:** BAPEN (Elia, 2003); NICE CG32 nutrition support
- **Version:** MUST

### Clinical Frailty Scale
*Patients aged 65 and over* · Specialties: Nursing and safety, Core inpatient

- **Thresholds and use:** 1–3 fit, 4 very mild, 5 mild, 6 moderate, 7–8 severe, 9 terminally ill. Supports escalation and ceiling-of-care discussions. Not for under 65.
- **Source:** Rockwood et al., CMAJ 2005 (CFS version 2.0, 2020)
- **Version:** CFS 1–9

### PRISM III
*Pediatric Risk of Mortality* · Specialties: Pediatric ICU

- **Thresholds and use:** For PICU patients under 18 years.
- **Source:** Pollack et al., Crit Care Med 1996; Phoenix Sepsis Criteria (Schlapbach et al., JAMA 2024) for pediatric sepsis
- **Version:** PRISM III

## Applicability rules

- APACHE II and SAPS II are shown only for patients in ICU, because both are validated on ICU admission data.
- Padua is used for medical inpatients; Caprini for surgical patients; neither is used after childbirth (RCOG obstetric assessment applies).
- Wells (PE and DVT) appears only when the clinical question is documented; examination items are clinician-entered.
- The Clinical Frailty Scale is shown only for patients aged 65 and over.
- PRISM III is reserved for patients under 18.

## Guideline-change monitoring

CareBoard lists recent guideline changes (for example ESC 2024 replacing CHA₂DS₂-VASc with CHA₂DS₂-VA, and the 2025 ACC/AHA acute coronary syndromes guideline). Changes are shown for hospital review and are never applied automatically.
