# ScholarLink — Master Prompt for Claude Code / OpenCode

> Paste this entire file as your system/context prompt when starting a new coding session.

---

## Project Identity

**ScholarLink** is a Scholarship & Aid Matching System — a full-stack relational database project that matches students to scholarships based on eligibility criteria and predicts approval probability using ML.

- **Type:** DBMS Course Project (full-stack)
- **Stack:** MySQL 8.0 · Python 3.x + FastAPI · HTML5/TAILWINDCSS/react JS · scikit-learn
- **ML layer:** Logistic Regression — one model per scholarship type
- **Database:** 11 tables, 4 scholarship types, triggers, events, window functions, views

---

## Scholarship Types

| Type | Issued By | Primary Criteria | ML Features |
|------|-----------|-----------------|-------------|
| `EXTERNAL` | Government / NGO | Income, category, CGPA, state, gender | Income, CGPA gap, category match, deadline proximity |
| `COLLEGE_MERIT` | Institution | CGPA rank within dept/batch | CGPA percentile, dept competition, renewal history |
| `ATHLETICS` | Institution | Sport, achievement level, active status | Sport level, achievement tier, CGPA floor met |
| `MCM` | Institution | CGPA + family income combined | Composite score = weighted CGPA + income need |

---

## Database Schema (11 Tables)

### Core Tables

**Students** — `student_id` (PK) · `name` · `dob` · `gender` (ENUM) · `caste_category` (GEN/OBC/SC/ST/EWS) · `annual_family_income` (INR) · `cgpa` (DECIMAL 3,1) · `disability_status` (BOOL) · `state` · `institution_id` (FK) · `department` · `year_of_study` · `enrollment_no` (UNIQUE)

**Scholarships** — `scholarship_id` (PK) · `name` · `scholarship_type` (ENUM: EXTERNAL/COLLEGE_MERIT/ATHLETICS/MCM) · `provider_id` (FK) · `institution_id` (NULLABLE FK — NULL = open to all) · `amount_inr` · `seats_available` · `deadline` · `min_cgpa` (NULLABLE) · `max_family_income` (NULLABLE) · `gender_req` (NULLABLE) · `category_req` (NULLABLE) · `disability_req` (BOOL) · `state_req` (NULLABLE) · `renewable` (BOOL)

**Providers** — `provider_id` (PK) · `name` · `type` (ENUM: GOVERNMENT/NGO/PRIVATE/INSTITUTION) · `contact_email`

**Institutions** — `institution_id` (PK) · `name` · `type` (ENUM: CENTRAL/STATE/DEEMED/PRIVATE) · `accreditation` · `state`

**Applications** — `application_id` (PK) · `student_id` (FK) · `scholarship_id` (FK) · `applied_date` · `status` (ENUM: Pending/Under Review/Approved/Rejected/Deadline Passed) · `remarks`

### College Scholarship Tables

**AthleticsRecords** — `record_id` (PK) · `student_id` (FK) · `sport` · `achievement_level` (ENUM: NATIONAL/STATE/UNIVERSITY/INTER_COLLEGE/COLLEGE) · `achievement_desc` · `academic_year` · `certificate_no` · `verified` (BOOL DEFAULT FALSE)

**CollegeScholarshipCriteria** — `criteria_id` (PK) · `scholarship_id` (FK) · `criteria_type` (ENUM: CGPA_RANK/CGPA_ABSOLUTE/SPORT/ACHIEVEMENT_LEVEL/DEPT_RESTRICT/YEAR_RESTRICT) · `criteria_value` · `criteria_operator` (ENUM: GTE/LTE/IN/EQ/TOP_N_PCT) · `weight` (DECIMAL 4,2)

**MCMCriteria** — `mcm_id` (PK) · `scholarship_id` (FK) · `cgpa_weight` · `income_weight` · `min_cgpa_floor` · `max_income_ceiling` · `composite_cutoff`

### Supporting Tables

**Documents** — `doc_id` (PK) · `application_id` (FK) · `doc_type` (ENUM: INCOME_CERT/CASTE_CERT/MARKSHEET/SPORTS_CERT/BANK_STATEMENT/BONAFIDE) · `verified` (BOOL)

**EligibilityLog** — `log_id` (PK) · `student_id` (FK) · `scholarship_id` (FK) · `is_eligible` (BOOL) · `checked_at` (TIMESTAMP) · `reason` · `predicted_score` (TINYINT 0–100) · `model_version` (VARCHAR)

**Disbursements** — `disbursement_id` (PK) · `application_id` (FK) · `amount_paid` (INR) · `payment_date` · `payment_mode` (NEFT/Cheque/Direct Credit) · `transaction_ref`

---

## Key SQL Patterns

### Query 1 — External Scholarship Eligibility Match
Finds all external scholarships a student qualifies for. Every `NULL` check means "no restriction on that dimension." Orders by amount descending, filters past deadlines and already-applied scholarships.

### Query 2 — Applicant Ranking (Window Functions)
`RANK() OVER (PARTITION BY scholarship_id ORDER BY cgpa DESC, annual_family_income ASC)` — ranks all applicants per scholarship. Flags students within seat count as `Likely Selected`.

### Query 3 — Scheduled Event (Deadline Auto-Expiry)
MySQL `CREATE EVENT` running nightly — updates expired `Pending` applications to `Deadline Passed` and inserts into `EligibilityLog`.

### Query 6 — CGPA Merit Matching (PERCENT_RANK)
Uses `PERCENT_RANK() OVER (PARTITION BY institution_id, department, year_of_study ORDER BY cgpa DESC)` to compute top-percentile standing. Filters to threshold in `CollegeScholarshipCriteria`.

### Query 7 — Athletics Matching
JOINs `AthleticsRecords` → `CollegeScholarshipCriteria` on `criteria_type = 'SPORT'` and `criteria_type = 'ACHIEVEMENT_LEVEL'`. Uses `JSON_TABLE` to parse comma-separated eligible levels. Only fires for `verified = TRUE` records.

### Query 8 — MCM Composite Score
Formula: `(cgpa / 10 * cgpa_weight * 100) + ((1 - income / ceiling) * income_weight * 100)`. Computes and ranks all eligible students in one CTE. Students above `composite_cutoff` are eligible.

### Query 9 — Trigger: Auto-flag After Athletics Verification
`AFTER UPDATE ON AthleticsRecords` — fires when `verified` flips `FALSE → TRUE`. Inserts eligibility log rows for all matching athletics scholarships immediately. This is the live demo highlight.

### Query 10 — College Scholarship Summary View
`CREATE VIEW college_scholarship_summary` — aggregates all active COLLEGE_MERIT/ATHLETICS/MCM scholarships with application counts and `seat_fill_pct`. Powers the admin panel summary.

---

## ML Integration

Three separate Logistic Regression models, one per scholarship type:

| Model | File | Features |
|-------|------|----------|
| External | `model_external.pkl` | cgpa, income_lakhs, cat_match, gender_match, days_before_ddl, seats_available |
| MCM | `model_mcm.pkl` | cgpa_component, income_component, seats_available, days_before_ddl |
| Athletics | `model_athletics.pkl` | cgpa, achievement_score (1–5 ordinal), seats_available |

- `COLLEGE_MERIT` uses deterministic rank (no separate ML model) — score = `top_pct_rank` converted
- All scores (0–100) written back to `EligibilityLog.predicted_score`
- Training script: `train_models.py` | Scoring script: `score.py`

---

## Frontend Structure

### Student Dashboard (4 Tabs)
1. **All Matches** — merged, sorted by ML score descending
2. **External** — national/state/NGO scholarships, ring + deadline bar design
3. **College Awards** — sub-cards with type badges:
   - CGPA Merit → shows dept rank (e.g., "Rank 3 of 48 in CSE Year 2")
   - Athletics → sport name + achievement badge (National=green, State=blue, University=amber) — only appears after verification
   - MCM → two horizontal bars (CGPA component + income component) summing to composite score
4. **Applied** — application timeline with status badges

### Admin Panel
- External scholarship management table
- **College scholarship tab** (new)
- **Athletics verification queue** — pending records with Verify button (fires trigger)
- **MCM composite score leaderboard** — live Query 8 output, filterable by department
- **Department CGPA rank view** — Query 6 output, top-N% per department

---

## File Structure

```
scholarlink/
├── schema.sql              ← All 11 CREATE TABLE statements
├── seed_data.sql           ← 50+ students, 20+ scholarships across all 4 types
├── queries.sql             ← All 10 key queries
├── views.sql               ← college_scholarship_summary view
├── triggers.sql            ← after_athletics_verify + deadline event
├── main.py                 ← FastAPI app (all API routes)
├── train_models.py         ← Trains all 3 ML models
├── score.py                ← Scores new eligibility records
├── model_external.pkl
├── model_mcm.pkl
├── model_athletics.pkl
└── frontend/
    ├── index.html          ← Student dashboard (all 4 tabs)
    ├── admin.html          ← Admin panel + athletics verify queue
    ├── tracker.html        ← Application status timeline
    └── style.css
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Database | MySQL 8.0 |
| Backend | Python 3.x + Flask |
| ML | scikit-learn (LogisticRegression) |
| DB Connector | pymysql + pandas |
| Frontend | HTML5 + CSS3 + Vanilla JS (fetch API) |

---

## Implementation Rules & Conventions

1. **NULL = no restriction** — every nullable eligibility column in Scholarships means "open to all" on that dimension. Never assume NULL is missing data.
2. **scholarship_type drives logic** — all routing (ML model selection, eligibility query, card design) is keyed on `scholarship_type`. Never hardcode type-specific logic without checking this field.
3. **Verified flag is a gate** — Athletics cards must never show until `AthleticsRecords.verified = TRUE`. The trigger handles the log; the frontend must check this flag independently.
4. **MCM formula is visible** — always render both `cgpa_component` and `income_component` separately in the UI so students understand the formula.
5. **Window functions for ranking** — use `RANK()` / `PERCENT_RANK()` over `ORDER BY` subqueries wherever student ranking is needed. Do not compute rank in Python.
6. **ML scores are suggestions** — `predicted_score` in EligibilityLog is advisory. Final approval is always `Applications.status = 'Approved'` set by admin.
7. **Model versioning** — always write `model_version` (e.g., `'external_v1'`) alongside `predicted_score`. Never leave it NULL when writing a score.
8. **FastAPI endpoints** — all API routes return JSON with automatic OpenAPI docs at `/docs`. Student-facing routes require `student_id` param. Admin routes require admin auth (OAuth2 JWT or API key header).

---

## Demo Flow (Reference)

1. **Opening** — Show 11 tables in MySQL Workbench, explain `scholarship_type` as the routing key
2. **External matching** — Run Query 1, walk through NULL eligibility checks
3. **CGPA merit** — Run Query 6, show `PERCENT_RANK` output, show threshold filtering
4. **Athletics trigger** — Mark a record `verified = TRUE`, immediately show EligibilityLog update, refresh dashboard → card appears. **This is the highlight.**
5. **MCM scoring** — Run Query 8, show two students with equal CGPA but different income getting different composite scores
6. **ML insights** — Show ML score ring on a scholarship card, show MCM composite bars

---

*ScholarLink v2 — DBMS Course Project*
