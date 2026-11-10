<p align="center">
  <img src="assets/img/logo.svg" width="96" alt="CareBoard AI logo">
</p>

<h1 align="center">CareBoard AI</h1>

<p align="center"><strong>One intelligence layer. Three views. Safer, clearer inpatient care.</strong><br>
An add-on board that sits on top of the hospital EHR and shows clinicians what changed, what needs attention now and what is still open, without replacing the EHR or adding a new bedside system.</p>

<p align="center">
  <a href="https://careboardai-ksa.netlify.app/"><strong>▶ Live demo</strong></a> ·
  <a href="#3-minute-demo-walkthrough">3-minute walkthrough</a> ·
  <a href="docs/CLINICAL_LOGIC.md">Clinical logic</a> ·
  <a href="docs/ARCHITECTURE.md">Architecture</a>
</p>

<p align="center">
  <img src="docs/screenshots/01-ward-board.png" alt="Ward board: every patient on one screen, sickest first" width="900">
</p>

> **All patients, staff and hospital data in this demo are fictional.** No real patient information is used or stored.

---

## The problem

Saudi hospitals are highly digital, but the information a clinician needs during a busy shift is scattered across EHR tabs, lab and imaging systems, nursing notes and verbal handovers. The research is consistent:

| Problem | Evidence |
|---|---|
| Doctors spend more time on the computer than with patients | About 2 hours of EHR and desk work for every hour of direct patient care (Sinsky et al., 2016). Family physicians spent 5.9 of an 11.4-hour day in the EHR (Arndt et al., 2017). |
| Notes are bloated, so the signal is buried | Only 18% of progress-note text was typed fresh; the rest was copied or imported (Wang et al., 2017). Half of all words in notes duplicated earlier text (Steinkamp et al., 2022). |
| Too many alerts teach clinicians to ignore alerts | Drug safety alerts are overridden in 49%–96% of cases (van der Sijs et al., 2006). |
| Handovers are where errors happen | Structured I-PASS handover cut medical errors by 23% and preventable adverse events by 30% (Starmer et al., 2014). |
| Test results get lost | 20%–61% of inpatient test results were not followed up (Callen et al., 2011); responsible physicians were unaware of most abnormal results returned after discharge (Roy et al., 2005). |
| Delayed escalation costs lives | Each hour from sustained high NEWS to critical care admission was associated with higher mortality (Whebell et al., 2021). |
| Poor usability causes harm | EHR usability issues contributed to 36% of pediatric medication safety reports reviewed (Ratwani et al., 2018). |

## The solution

CareBoard AI reads from the systems a hospital already has and turns them into a single, prioritised board that any member of the team (consultant, registrar, resident, intern or nurse) can follow at a glance during peak hours.

**Design principles**

1. **A layer, not a replacement.** Designed to read from the existing EHR through HL7 FHIR R4, so hospitals avoid a rip-and-replace project.
2. **One source, shown once.** Changes, updates and open items live in one place; other views link to it rather than repeating it.
3. **Clinician in control.** Nothing is ordered automatically. Clinicians can edit and add, and every edit is signed with name and time.
4. **Every item explains itself.** A “Why” button on each item shows its source data, the rule or guideline behind it, and a plain-language explanation built from the chart.
5. **No alert can be silently dismissed.** The board is shared by the whole team, so an alert clears only when the chart changes, and completed tasks show who completed them.

## Features

| View | What it does |
|---|---|
| **Ward board** (home) | Every patient on one screen, sickest first. NEWS2 badge with trend, the single top issue, counts of changes, open items and pending results. Live overdue timers and a pending-results tracker. |
| **Patient summary** | Colour-coded vitals (NEWS2-based), results, medications with safety flags, imaging with previews, a clinical decision support to-do list and the SOAP note. Clinicians can **edit and add**; every entry is signed with name and time. |
| **CareBoard AI** | Nursing notes, recent changes, new updates and still-open items, each with a severity symbol (critical, needs review, information, improving). **“What’s new in notes since yesterday”** highlights only new sentences and folds copy-pasted text, using exact text comparison. |
| **Clinical calculators** | 35 scores across 15 specialties, auto-filled from the chart and searchable. Each shows inputs, colour band, source, version and a patient-specific explanation. Scores that are not validated for the patient are shown as not applicable, with the reason. See [docs/CLINICAL_LOGIC.md](docs/CLINICAL_LOGIC.md). |
| **Smart handover** | I-PASS structured handover auto-prepared from the chart: what changed, what was done, what is still open, to-do and plan changes with owners, contingency plans, receiver read-back and “Mark as verified”. |
| **Hospital intelligence** | Who is on shift now on each ward, bed occupancy, ED patients waiting for a bed, ICU capacity, ward acuity and staffing, antimicrobial stewardship signals, pilgrim patient language support, and a Hajj/Umrah febrile respiratory **cluster radar** with aggregated-only external reporting. |
| **Access and trust** | Care-team-only access, time-limited emergency (“break-the-glass”) access with a stated reason, and a full audit log. |

Also included: full **English / Arabic** interface with right-to-left layout, light and dark mode, and a phone-friendly layout.

<table>
<tr>
<td><img src="docs/screenshots/02-patient-summary.png" alt="Patient summary"></td>
<td><img src="docs/screenshots/03-careboard-ai.png" alt="CareBoard AI view"></td>
</tr>
<tr>
<td><img src="docs/screenshots/04-clinical-calculators.png" alt="Clinical calculators"></td>
<td><img src="docs/screenshots/05-smart-handover.png" alt="Smart handover"></td>
</tr>
<tr>
<td><img src="docs/screenshots/06-hospital-intelligence.png" alt="Hospital intelligence"></td>
<td><img src="docs/screenshots/08-why-explanation.png" alt="Why explanation"></td>
</tr>
<tr>
<td><img src="docs/screenshots/09-arabic-rtl.png" alt="Arabic right-to-left interface"></td>
<td align="center"><img src="docs/screenshots/10-mobile.png" alt="Phone layout" width="260"></td>
</tr>
</table>

## 3-minute demo walkthrough

1. **Ward board.** Point out that Bed 12 is at the top with NEWS2 11 and a rising arrow. Watch the “Senior review after NEWS2 11” timer turn from orange to red.
2. **Tap Bed 12 (Faisal).** Vitals tiles are red, orange or green by NEWS2. Show the penicillin allergy conflict with piperacillin/tazobactam in the decision-support list and press **Why**.
3. **Add a to-do with ＋** and edit the SOAP note with ✎. Both are signed “Dr. Kamel Azhar” with the time.
4. **CareBoard AI.** Show the severity symbols, then **What’s new in notes since yesterday**: only new sentences are highlighted.
5. **Clinical calculators.** Search “wells”, then press **Explain for this patient** on NEWS2.
6. **Smart handover.** Press **Auto-draft handover**, then **Mark as verified**.
7. **Hospital intelligence.** Show who is on shift and the Hajj/Umrah cluster signal with aggregated-only reporting.
8. **Switch to Arabic** with the language button.

## Saudi context

- **Market:** about 500 hospitals in the Kingdom (499 in 2023, General Authority for Statistics).
- **Data protection:** designed to align with Saudi Arabia’s Personal Data Protection Law (PDPL), supervised by SDAIA, which treats health data as sensitive. Data would be hosted inside the Kingdom.
- **Hajj and Umrah:** the cluster radar and pilgrim language support are built for surge seasons.
- **Regulation:** decision-support features would follow the SFDA software-as-a-medical-device pathway before clinical use.

## Run it locally

No installation, build step or server is required.

```bash
git clone https://github.com/salehashafi5-collab/careboard-ai.git
cd careboard-ai
# Option 1: open index.html in any modern browser
# Option 2: serve it locally
python3 -m http.server 8000   # then visit http://localhost:8000
```

### Deploy for free

- **GitHub Pages:** Settings → Pages → Deploy from branch → `main` / root. The site appears at `https://salehashafi5-collab.github.io/careboard-ai/`.
- **Netlify:** drag the project folder onto https://app.netlify.com/drop.

## Project structure

```
careboard-ai/
├── index.html                 # App shell
├── assets/
│   ├── css/styles.css         # Design tokens, light/dark themes, RTL, layout
│   ├── js/app.js              # Data, calculators, views, events (vanilla JS)
│   └── img/                   # Logo and favicon (SVG)
└── docs/
    ├── CLINICAL_LOGIC.md      # Every calculator: thresholds, source, version
    ├── ARCHITECTURE.md        # How it works today and in a hospital pilot
    └── screenshots/
```

## Technology

- Plain HTML, CSS and JavaScript with no framework, no build step and no external dependencies apart from Google Fonts (IBM Plex Sans, IBM Plex Serif, IBM Plex Sans Arabic).
- All calculations run in the browser. Edits and preferences are saved in the viewer’s own browser storage only.
- Explanations behind **Why**, **Ask**, **Explain** and **Auto-draft handover** are built from the chart data and cited guidelines, so the demo works offline and never sends data anywhere. A hospital pilot could connect a large language model through a secure hospital-hosted service; see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Roadmap

1. Read-only HL7 FHIR R4 / SMART on FHIR integration with one pilot ward.
2. Outlier patients (team patients physically on other wards) shown on the board.
3. Escalation ladder: unacted critical items rise from intern to registrar to consultant after a set time.
4. Pending results at discharge, each with a named follow-up owner.
5. Pilot metrics measured from EHR event logs: EHR time per patient, NEWS2 ≥7 to senior review time, open items lost between shifts.

## Clinical safety disclaimer

CareBoard AI is a hackathon prototype. It is not a medical device and has not been clinically validated or approved by the SFDA. Scores, thresholds and explanations are for demonstration and must be reviewed by licensed clinicians before any clinical use.

## References

1. Sinsky C, et al. Allocation of physician time in ambulatory practice. *Ann Intern Med.* 2016;165:753–760.
2. Arndt BG, et al. Tethered to the EHR: primary care physician workload assessment using EHR event log data and time-motion observations. *Ann Fam Med.* 2017;15:419–426.
3. Wang MD, Khanna R, Najafi N. Characterizing the source of text in electronic health record progress notes. *JAMA Intern Med.* 2017;177:1212–1213.
4. Steinkamp J, Kantrowitz JJ, Airan-Javia S. Prevalence and sources of duplicate information in the electronic medical record. *JAMA Netw Open.* 2022;5:e2233348.
5. van der Sijs H, et al. Overriding of drug safety alerts in computerized physician order entry. *J Am Med Inform Assoc.* 2006;13:138–147.
6. Starmer AJ, et al. Changes in medical errors after implementation of a handoff program. *N Engl J Med.* 2014;371:1803–1812.
7. Callen J, Georgiou A, Li J, Westbrook JI. The safety implications of missed test results for hospitalised patients: a systematic review. *BMJ Qual Saf.* 2011;20:194–199.
8. Roy CL, et al. Patient safety concerns arising from test results that return after hospital discharge. *Ann Intern Med.* 2005;143:121–128.
9. Whebell SF, et al. Increased time from physiological derangement to critical care admission associates with mortality. *Crit Care.* 2021. doi:10.1186/s13054-021-03650-1
10. Ratwani RM, et al. Identifying electronic health record usability and safety challenges in pediatric settings. *Health Aff.* 2018;37:1752–1759.
11. Royal College of Physicians. National Early Warning Score (NEWS) 2. London: RCP; 2017.
12. Evans L, et al. Surviving Sepsis Campaign: international guidelines 2021. *Crit Care Med.* 2021;49:e1063–e1143.
13. Van Gelder IC, et al. 2024 ESC Guidelines for the management of atrial fibrillation. *Eur Heart J.* 2024;45:3314–3414.

Full calculator references are listed in [docs/CLINICAL_LOGIC.md](docs/CLINICAL_LOGIC.md).

## License

Released under the [MIT License](LICENSE).
