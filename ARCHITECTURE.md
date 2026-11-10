# Architecture

## Today: hackathon demo

```
Browser
 └── index.html
      ├── assets/css/styles.css   design tokens, themes, RTL
      └── assets/js/app.js
           ├── Demo data (10 fictional inpatients)
           ├── Clinical calculators (35, deterministic formulas)
           ├── Trust layer: "Why" registry (source + rule for every item)
           ├── Built-in explanation engine (chart facts + guideline text)
           ├── Views: ward board, patient summary, CareBoard AI,
           │          calculators, smart handover, hospital intelligence,
           │          access and trust
           └── localStorage: edits, completed tasks, preferences
```

- Static site: no server, no database, no API keys, no tracking.
- Nothing leaves the browser. Edits are stored only on the viewer’s device.
- English and Arabic share one code path; layout flips to right-to-left.

## How each feature works

| Feature | Logic |
|---|---|
| Vital tile colours | NEWS2 parameter score per measurement (0 green, 1–2 orange, 3 red). |
| Ward board order | NEWS2 total, then status, then whether the top issue is critical. |
| Overdue timers | Each open task has an elapsed time and a target; orange at 75% of target, red when overdue. |
| “What’s new in notes” | Today’s note is split into sentences and compared exactly with yesterday’s. Matching sentences fold into a “carried over” chip. |
| Why / Ask / Explain / Auto-draft | Assembled from the item’s source fields, matching chart values, the cited rule or guideline, the patient’s plan and contingency lines. |
| Access control | A patient is visible only to their care team. Emergency access needs a reason, lasts 30 minutes and is written to the audit log. |
| Signed edits | Added or edited to-dos, SOAP edits and addenda store author, role and time. |

## In a hospital pilot

```
Hospital EHR / LIS / PACS / nursing system
        │  HL7 FHIR R4 (read-only), SMART on FHIR launch
        ▼
CareBoard service (hosted inside the Kingdom)
  ├── Normaliser: vitals, labs, meds, notes, orders, imaging reports
  ├── Rules engine: calculators, CDS rules, timers, applicability checks
  ├── Change detector: "since last review" and "since yesterday"
  ├── Optional language model, behind a hospital gateway:
  │     de-identified input only, cites chart fields, clinician verifies
  └── Audit log (every view, edit and emergency access)
        ▼
CareBoard web app (ward board, patient views, hospital intelligence)
```

Safety and governance in a pilot:

- Read-only integration first; no orders are written back to the EHR.
- Calculator thresholds approved by the hospital’s clinical content committee; guideline updates reviewed before use.
- Alert budget per patient, with tracking of which alerts lead to action.
- Designed to align with the Saudi PDPL (SDAIA) and NCA cybersecurity controls; SFDA software-as-a-medical-device pathway for decision-support features.
