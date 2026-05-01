# ScholarLink Database Documentation

## 📊 Database Overview

| Attribute | Value |
|-----------|-------|
| Database Name | scholarlink |
| Engine | MySQL 8.0 |
| Total Tables | 11 |
| Total Records | 53 |

---

## 📋 Tables Summary

| # | Table Name | Records | Purpose |
|---|------------|---------|---------|
| 1 | Institutions | 2 | Educational institutions (IIT Delhi, IIT Bombay) |
| 2 | Providers | 4 | Scholarship providers (Government/NGO/Private) |
| 3 | Students | 10 | Student profiles with academic details |
| 4 | Scholarships | 14 | All scholarship listings |
| 5 | Applications | 5 | Student applications |
| 6 | AthleticsRecords | 3 | Student sports achievements |
| 7 | CollegeScholarshipCriteria | 6 | Merit/Athletics eligibility rules |
| 8 | MCMCriteria | 2 | MCM composite scoring rules |
| 9 | Documents | 6 | Application document verification |
| 10 | EligibilityLog | 4 | Eligibility check history |
| 11 | Disbursements | 1 | Payment tracking |

---

## 🏗️ Table Structures & Relationships

### 1. Institutions (2 records)
```
┌─────────────────────┬────────────────────────────────────────┐
│ Column             │ Type & Constraints                     │
├─────────────────────┼────────────────────────────────────────┤
│ institution_id     │ INT, PRIMARY KEY, AUTO_INCREMENT     │
│ name               │ VARCHAR(120), NOT NULL                 │
│ type               │ ENUM(CENTRAL,STATE,DEEMED,PRIVATE)     │
│ accreditation      │ VARCHAR(32), NULL                     │
│ state              │ VARCHAR(60), NOT NULL                  │
└─────────────────────┴────────────────────────────────────────┘

Sample Data:
- IIT Delhi (CENTRAL, A++, Karnataka)
- IIT Bombay (CENTRAL, A++, Maharashtra)
```

**Relationships:**
- ← Students (many-to-one)
- ← Scholarships (many-to-one, nullable)

---

### 2. Providers (4 records)
```
┌─────────────────────┬────────────────────────────────────────┐
│ Column             │ Type & Constraints                     │
├─────────────────────┼────────────────────────────────────────┤
│ provider_id        │ INT, PRIMARY KEY, AUTO_INCREMENT      │
│ name               │ VARCHAR(120), NOT NULL                 │
│ type               │ ENUM(GOVERMENT,NGO,PRIVATE,INSTITUTION) │
│ contact_email      │ VARCHAR(120), NOT NULL                 │
└─────────────────────┴────────────────────────────────────────┘

Sample Data:
- National Scholarship Board (GOVERNMENT)
- BrightFuture Foundation (NGO)
- Veda Institute (INSTITUTION)
- GIT Deemed University (INSTITUTION)
```

**Relationships:**
- → Scholarships (one-to-many)

---

### 3. Students (10 records)
```
┌─────────────────────┬────────────────────────────────────────┐
│ Column             │ Type & Constraints                     │
├─────────────────────┼────────────────────────────────────────┤
│ student_id         │ INT, PRIMARY KEY, AUTO_INCREMENT      │
│ name               │ VARCHAR(120), NOT NULL                 │
│ dob                │ DATE, NOT NULL                         │
│ gender             │ ENUM(MALE,FEMALE,OTHER), NOT NULL     │
│ caste_category     │ ENUM(GEN,OBC,SC,ST,EWS), NOT NULL     │
│ annual_family_income │ INT, NOT NULL                      │
│ cgpa               │ DECIMAL(3,1), NOT NULL                │
│ disability_status  │ BOOLEAN, DEFAULT FALSE                 │
│ state              │ VARCHAR(60), NOT NULL                 │
│ institution_id     │ INT, NOT NULL, FK → Institutions       │
│ department         │ VARCHAR(60), NOT NULL                 │
│ year_of_study      │ INT, NOT NULL                          │
│ enrollment_no      │ VARCHAR(32), NOT NULL, UNIQUE          │
└─────────────────────┴────────────────────────────────────────┘

Sample Data:
- Aarav Menon (GIT23CSE001, CSE, Year 2, CGPA 8.6, Income 550000, GEN, Karnataka)
- Isha Verma (GIT22CSE014, CSE, Year 3, CGPA 9.1, Income 280000, OBC, Karnataka)
- Rohit Saha (GIT24ECE021, ECE, Year 1, CGPA 7.8, Income 150000, SC, Karnataka)
```

**Relationships:**
- → Institutions (many-to-one)
- → Applications (one-to-many)
- → AthleticsRecords (one-to-many)
- → EligibilityLog (one-to-many)

---

### 4. Scholarships (14 records)
```
┌─────────────────────┬────────────────────────────────────────┐
│ Column             │ Type & Constraints                     │
├─────────────────────┼────────────────────────────────────────┤
│ scholarship_id     │ INT, PRIMARY KEY, AUTO_INCREMENT      │
│ name               │ VARCHAR(140), NOT NULL                 │
│ scholarship_type   │ ENUM NOT NULL:                         │
│                    │   EXTERNAL, COLLEGE_MERIT,              │
│                    │   ATHLETICS, MCM                       │
│ provider_id        │ INT, NOT NULL, FK → Providers          │
│ institution_id     │ INT, NULL, FK → Institutions          │
│ amount_inr         │ INT, NOT NULL                          │
│ seats_available    │ INT, NOT NULL                          │
│ deadline           │ DATE, NOT NULL                          │
│ min_cgpa           │ DECIMAL(3,1), NULL                     │
│ max_family_income  │ INT, NULL                              │
│ gender_req         │ ENUM(MALE,FEMALE,OTHER), NULL         │
│ category_req       │ ENUM(GEN,OBC,SC,ST,EWS), NULL         │
│ disability_req     │ BOOLEAN, DEFAULT FALSE                 │
│ state_req          │ VARCHAR(60), NULL                     │
│ renewable          │ BOOLEAN, DEFAULT FALSE                 │
└─────────────────────┴────────────────────────────────────────┘

Scholarship Types:
┌────────────────────┬─────────────────────────────────────────────┐
│ Type               │ Description                                 │
├────────────────────┼─────────────────────────────────────────────┤
│ EXTERNAL           │ Government/NGO scholarships                │
│ COLLEGE_MERIT      │ Institution CGPA-based awards              │
│ ATHLETICS          │ Sports achievements scholarships           │
│ MCM                │ Merit-cum-means (income + CGPA weighted)   │
└────────────────────┴─────────────────────────────────────────────┘

Sample Data:
- National Merit Support (EXTERNAL, ₹50,000, 120 seats, deadline 2026-08-31)
- GIT CGPA Merit Award (COLLEGE_MERIT, ₹30,000, 20 seats, min_cgpa 8.5)
- GIT Athletics Grant (ATHLETICS, ₹25,000, 10 seats)
- GIT MCM Scholarship (MCM, ₹40,000, 50 seats, max_income 450000)
```

**Relationships:**
- → Providers (many-to-one)
- → Institutions (many-to-one, nullable)
- → Applications (one-to-many)
- → CollegeScholarshipCriteria (one-to-many)
- → MCMCriteria (one-to-many)
- → EligibilityLog (one-to-many)

---

### 5. Applications (5 records)
```
┌─────────────────────┬────────────────────────────────────────┐
│ Column             │ Type & Constraints                     │
├─────────────────────┼────────────────────────────────────────┤
│ application_id     │ INT, PRIMARY KEY, AUTO_INCREMENT      │
│ student_id          │ INT, NOT NULL, FK → Students          │
│ scholarship_id     │ INT, NOT NULL, FK → Scholarships      │
│ applied_date       │ DATE, NOT NULL                         │
│ status             │ ENUM NOT NULL:                         │
│                    │   Pending, Under Review,               │
│                    │   Approved, Rejected, Deadline Passed   │
│ remarks            │ VARCHAR(255), NULL                    │
└─────────────────────┴────────────────────────────────────────┘

Sample Data:
- Application #1: Aarav Menon → National Merit Support (Pending)
- Application #2: Isha Verma → BrightFuture Women in Tech (Under Review)
- Application #3: Tanya Bose → Veda Athletics Excellence (Approved)
- Application #4: Rohit Saha → State STEM Scholars (Rejected)
```

**Relationships:**
- → Students (many-to-one)
- → Scholarships (many-to-one)
- → Documents (one-to-many)
- → Disbursements (one-to-many)

---

### 6. AthleticsRecords (3 records)
```
┌─────────────────────┬────────────────────────────────────────┐
│ Column             │ Type & Constraints                     │
├─────────────────────┼────────────────────────────────────────┤
│ record_id          │ INT, PRIMARY KEY, AUTO_INCREMENT      │
│ student_id          │ INT, NOT NULL, FK → Students          │
│ sport              │ VARCHAR(60), NOT NULL                  │
│ achievement_level  │ ENUM NOT NULL:                         │
│                    │   NATIONAL, STATE, UNIVERSITY,         │
│                    │   INTER_COLLEGE, COLLEGE               │
│ achievement_desc   │ VARCHAR(160), NOT NULL                 │
│ academic_year      │ VARCHAR(16), NOT NULL                  │
│ certificate_no     │ VARCHAR(40), NOT NULL                  │
│ verified           │ BOOLEAN, DEFAULT FALSE                 │
└─────────────────────┴────────────────────────────────────────┘

Sample Data:
- Rohit Saha: Cricket, STATE, Gold medal State U-19 (verified=FALSE)
- Tanya Bose: Swimming, NATIONAL, National champion (verified=FALSE)
- Kabir Singh: Basketball, UNIVERSITY, inter-university (verified=FALSE)
```

**Relationships:**
- → Students (many-to-one)

---

### 7. CollegeScholarshipCriteria (6 records)
```
┌─────────────────────┬────────────────────────────────────────┐
│ Column             │ Type & Constraints                     │
├─────────────────────┼────────────────────────────────────────┤
│ criteria_id        │ INT, PRIMARY KEY, AUTO_INCREMENT      │
│ scholarship_id     │ INT, NOT NULL, FK → Scholarships      │
│ criteria_type      │ ENUM NOT NULL:                         │
│                    │   CGPA_RANK, CGPA_ABSOLUTE,            │
│                    │   SPORT, ACHIEVEMENT_LEVEL,           │
│                    │   DEPT_RESTRICT, YEAR_RESTRICT         │
│ criteria_value    │ VARCHAR(120), NOT NULL                 │
│ criteria_operator │ ENUM NOT NULL:                          │
│                    │   GTE, LTE, IN, EQ, TOP_N_PCT          │
│ weight             │ DECIMAL(4,2), DEFAULT 1.00            │
└─────────────────────┴────────────────────────────────────────┘
```

**Relationships:**
- → Scholarships (many-to-one)

---

### 8. MCMCriteria (2 records)
```
┌─────────────────────┬────────────────────────────────────────┐
│ Column             │ Type & Constraints                     │
├─────────────────────┼────────────────────────────────────────┤
│ mcm_id              │ INT, PRIMARY KEY, AUTO_INCREMENT      │
│ scholarship_id     │ INT, NOT NULL, FK → Scholarships      │
│ cgpa_weight        │ DECIMAL(4,2), NOT NULL               │
│ income_weight      │ DECIMAL(4,2), NOT NULL               │
│ min_cgpa_floor     │ DECIMAL(3,1), NOT NULL               │
│ max_income_ceiling │ INT, NOT NULL                          │
│ composite_cutoff   │ DECIMAL(5,2), NOT NULL                │
└─────────────────────┴────────────────────────────────────────┘

Sample Data:
- IIT Delhi MCM: cgpa_weight=0.6, income_weight=0.4, min_cgpa=7.5, max_income=450000, cutoff=65.00
- IIT Bombay MCM: cgpa_weight=0.5, income_weight=0.5, min_cgpa=7.4, max_income=420000, cutoff=62.00

Composite Score Formula:
  (CGPA/10 × cgpa_weight × 100) + ((1 - Income/max_income_ceiling) × income_weight × 100)
```

**Relationships:**
- → Scholarships (many-to-one)

---

### 9. Documents (6 records)
```
┌─────────────────────┬────────────────────────────────────────┐
│ Column             │ Type & Constraints                     │
├─────────────────────┼────────────────────────────────────────┤
│ doc_id              │ INT, PRIMARY KEY, AUTO_INCREMENT      │
│ application_id     │ INT, NOT NULL, FK → Applications      │
│ doc_type           │ ENUM NOT NULL:                         │
│                    │   INCOME_CERT, CASTE_CERT,            │
│                    │   MARKSHEET, SPORTS_CERT,             │
│                    │   BANK_STATEMENT, BONAFIDE            │
│ verified           │ BOOLEAN, DEFAULT FALSE                 │
└─────────────────────┴────────────────────────────────────────┘
```

**Relationships:**
- → Applications (many-to-one)

---

### 10. EligibilityLog (4 records)
```
┌─────────────────────┬────────────────────────────────────────┐
│ Column             │ Type & Constraints                     │
├─────────────────────┼────────────────────────────────────────┤
│ log_id              │ INT, PRIMARY KEY, AUTO_INCREMENT      │
│ student_id          │ INT, NOT NULL, FK → Students          │
│ scholarship_id     │ INT, NOT NULL, FK → Scholarships      │
│ is_eligible         │ BOOLEAN, NOT NULL                      │
│ checked_at         │ TIMESTAMP, DEFAULT CURRENT_TIMESTAMP   │
│ reason             │ VARCHAR(255), NULL                     │
│ predicted_score    │ TINYINT, NULL (ML prediction 0-100)   │
│ model_version      │ VARCHAR(32), NULL                      │
└─────────────────────┴────────────────────────────────────────┘
```

**Relationships:**
- → Students (many-to-one)
- → Scholarships (many-to-one)

---

### 11. Disbursements (1 record)
```
┌─────────────────────┬────────────────────────────────────────┐
│ Column             │ Type & Constraints                     │
├─────────────────────┼────────────────────────────────────────┤
│ disbursement_id    │ INT, PRIMARY KEY, AUTO_INCREMENT      │
│ application_id     │ INT, NOT NULL, FK → Applications      │
│ amount_paid        │ INT, NOT NULL                          │
│ payment_date       │ DATE, NOT NULL                          │
│ payment_mode       │ ENUM NOT NULL:                         │
│                    │   NEFT, Cheque, Direct Credit          │
│ transaction_ref    │ VARCHAR(60), NOT NULL                  │
└─────────────────────┴────────────────────────────────────────┘
```

**Relationships:**
- → Applications (many-to-one)

---

## 🔗 Entity Relationship Diagram

```
                    ┌──────────────┐
                    │ Institutions │
                    └──────┬───────┘
                           │ 1:N
              ┌────────────┴────────────┐
              │                         │
        ┌─────▼─────┐           ┌──────▼──────┐
        │ Students  │           │ Scholarships │
        └─────┬─────┘           └──────┬───────┘
              │                        │ 1:N
              │ 1:N                    │
        ┌─────▼─────┐           ┌──────▼──────┐
        │Athletics │           │Applications │
        └──────────┘           └──────┬───────┘
                                     │
                            ┌────────┴────────┐
                            │                 │
                      ┌─────▼─────┐     ┌──────▼──────┐
                      │Documents │     │Disbursements│
                      └──────────┘     └─────────────┘
```

---

## 🔑 Foreign Key Relationships Summary

| Child Table | Parent Table | Column |
|-------------|--------------|--------|
| Students | Institutions | institution_id |
| Scholarships | Providers | provider_id |
| Scholarships | Institutions | institution_id |
| Applications | Students | student_id |
| Applications | Scholarships | scholarship_id |
| AthleticsRecords | Students | student_id |
| CollegeScholarshipCriteria | Scholarships | scholarship_id |
| MCMCriteria | Scholarships | scholarship_id |
| Documents | Applications | application_id |
| EligibilityLog | Students | student_id |
| EligibilityLog | Scholarships | scholarship_id |
| Disbursements | Applications | application_id |

---

## 📈 Data Flow

```
Student Login
    ↓
Get Matching Scholarships (eligibility filters)
    ↓
Apply → Create Application Record
    ↓
Admin Reviews → Update Status (Pending → Under Review → Approved/Rejected)
    ↓
If Approved → Create Disbursement Record
```

---

## 🛠️ Database Features Used

1. **Window Functions** - CGPA percentile ranking, applicant ranking
2. **JOINs** - Multi-table queries for dashboards
3. **Aggregations** - Application counts, disbursement totals
4. **Triggers** - Athletics verification logging
5. **Views** - Pre-computed queries (if any)
6. **ENUMs** - Type safety for categories
7. **Indexes** - Foreign keys, unique constraints
8. **Foreign Keys** - Referential integrity

---

## 📝 Query Examples

### 1. Student Scholarship Matching
```sql
SELECT s.*, el.predicted_score
FROM Scholarships s
JOIN Students st ON st.student_id = 1
LEFT JOIN Applications a ON a.student_id = st.student_id AND a.scholarship_id = s.scholarship_id
LEFT JOIN EligibilityLog el ON el.student_id = st.student_id AND el.scholarship_id = s.scholarship_id
WHERE s.deadline >= CURDATE()
  AND a.application_id IS NULL
  AND (s.institution_id IS NULL OR s.institution_id = st.institution_id)
  AND (s.min_cgpa IS NULL OR st.cgpa >= s.min_cgpa)
  AND (s.max_family_income IS NULL OR st.annual_family_income <= s.max_family_income)
```

### 2. MCM Composite Score Leaderboard
```sql
WITH eligible AS (
  SELECT st.*, mc.cgpa_weight, mc.income_weight, mc.composite_cutoff
  FROM Students st
  JOIN Scholarships s ON s.scholarship_type = 'MCM'
  JOIN MCMCriteria mc ON mc.scholarship_id = s.scholarship_id
  WHERE st.cgpa >= mc.min_cgpa_floor AND st.annual_family_income <= mc.max_income_ceiling
)
SELECT 
  student_id, name, department,
  ROUND((cgpa / 10) * cgpa_weight * 100, 2) AS cgpa_component,
  ROUND((1 - (annual_family_income / max_income_ceiling)) * income_weight * 100, 2) AS income_component,
  ROUND(...composite..., 2) AS composite_score
FROM eligible
WHERE composite_score >= composite_cutoff
ORDER BY composite_score DESC
```

### 3. CGPA Percentile Ranking
```sql
WITH ranked AS (
  SELECT student_id, name, department, cgpa,
    PERCENT_RANK() OVER (PARTITION BY institution_id, department, year_of_study ORDER BY cgpa DESC) AS pct_rank
  FROM Students
)
SELECT * FROM ranked WHERE pct_rank <= 0.15
```