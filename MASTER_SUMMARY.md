# ScholarLink - Master Project Summary

## 1. Project Overview

**Project Name:** ScholarLink - Scholarship & Aid Matching System

**What it does:** A full-stack relational database project that matches students to scholarships based on eligibility criteria and tracks applications through approval/disbursement pipeline.

**Tech Stack:**
- **Backend:** Python 3.x + FastAPI
- **Database:** MySQL 8.0 (via PyMySQL)
- **Frontend:** React 19 + Vite + Tailwind CSS v4 + Zustand
- **Authentication:** Mock JWT (PyJWT)

**Entry Points:**
- Backend: `backend/app/main.py` - FastAPI application with all routes
- Frontend: `frontend/src/main.jsx` - React entry point
- Database: Docker MySQL container defined in `docker-compose.yml`

---

## 2. Database Summary (MySQL)

**Total Tables:** 11

### Table 1: Institutions
| Column | Type | Constraints |
|--------|------|-------------|
| institution_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(120) | NOT NULL |
| type | ENUM('CENTRAL','STATE','DEEMED','PRIVATE') | NOT NULL |
| accreditation | VARCHAR(32) | NULL |
| state | VARCHAR(60) | NOT NULL |

### Table 2: Providers
| Column | Type | Constraints |
|--------|------|-------------|
| provider_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(120) | NOT NULL |
| type | ENUM('GOVERNMENT','NGO','PRIVATE','INSTITUTION') | NOT NULL |
| contact_email | VARCHAR(120) | NOT NULL |

### Table 3: Students
| Column | Type | Constraints |
|--------|------|-------------|
| student_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(120) | NOT NULL |
| dob | DATE | NOT NULL |
| gender | ENUM('MALE','FEMALE','OTHER') | NOT NULL |
| caste_category | ENUM('GEN','OBC','SC','ST','EWS') | NOT NULL |
| annual_family_income | INT | NOT NULL |
| cgpa | DECIMAL(3,1) | NOT NULL |
| disability_status | BOOLEAN | NOT NULL, DEFAULT FALSE |
| state | VARCHAR(60) | NOT NULL |
| institution_id | INT | NOT NULL, FK → Institutions |
| department | VARCHAR(60) | NOT NULL |
| year_of_study | INT | NOT NULL |
| enrollment_no | VARCHAR(32) | NOT NULL, UNIQUE |

### Table 4: Scholarships
| Column | Type | Constraints |
|--------|------|-------------|
| scholarship_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(140) | NOT NULL |
| scholarship_type | ENUM('EXTERNAL','COLLEGE_MERIT','ATHLETICS','MCM') | NOT NULL |
| provider_id | INT | NOT NULL, FK → Providers |
| institution_id | INT | NULL, FK → Institutions |
| amount_inr | INT | NOT NULL |
| seats_available | INT | NOT NULL |
| deadline | DATE | NOT NULL |
| min_cgpa | DECIMAL(3,1) | NULL |
| max_family_income | INT | NULL |
| gender_req | ENUM('MALE','FEMALE','OTHER') | NULL |
| category_req | ENUM('GEN','OBC','SC','ST','EWS') | NULL |
| disability_req | BOOLEAN | NOT NULL, DEFAULT FALSE |
| state_req | VARCHAR(60) | NULL |
| renewable | BOOLEAN | NOT NULL, DEFAULT FALSE |

### Table 5: Applications
| Column | Type | Constraints |
|--------|------|-------------|
| application_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| student_id | INT | NOT NULL, FK → Students |
| scholarship_id | INT | NOT NULL, FK → Scholarships |
| applied_date | DATE | NOT NULL |
| status | ENUM('Pending','Under Review','Approved','Rejected','Deadline Passed') | NOT NULL |
| remarks | VARCHAR(255) | NULL |

### Table 6: AthleticsRecords
| Column | Type | Constraints |
|--------|------|-------------|
| record_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| student_id | INT | NOT NULL, FK → Students |
| sport | VARCHAR(60) | NOT NULL |
| achievement_level | ENUM('NATIONAL','STATE','UNIVERSITY','INTER_COLLEGE','COLLEGE') | NOT NULL |
| achievement_desc | VARCHAR(160) | NOT NULL |
| academic_year | VARCHAR(16) | NOT NULL |
| certificate_no | VARCHAR(40) | NOT NULL |
| verified | BOOLEAN | NOT NULL, DEFAULT FALSE |

### Table 7: CollegeScholarshipCriteria
| Column | Type | Constraints |
|--------|------|-------------|
| criteria_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| scholarship_id | INT | NOT NULL, FK → Scholarships |
| criteria_type | ENUM('CGPA_RANK','CGPA_ABSOLUTE','SPORT','ACHIEVEMENT_LEVEL','DEPT_RESTRICT','YEAR_RESTRICT') | NOT NULL |
| criteria_value | VARCHAR(120) | NOT NULL |
| criteria_operator | ENUM('GTE','LTE','IN','EQ','TOP_N_PCT') | NOT NULL |
| weight | DECIMAL(4,2) | NOT NULL, DEFAULT 1.00 |

### Table 8: MCMCriteria
| Column | Type | Constraints |
|--------|------|-------------|
| mcm_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| scholarship_id | INT | NOT NULL, FK → Scholarships |
| cgpa_weight | DECIMAL(4,2) | NOT NULL |
| income_weight | DECIMAL(4,2) | NOT NULL |
| min_cgpa_floor | DECIMAL(3,1) | NOT NULL |
| max_income_ceiling | INT | NOT NULL |
| composite_cutoff | DECIMAL(5,2) | NOT NULL |

### Table 9: Documents
| Column | Type | Constraints |
|--------|------|-------------|
| doc_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| application_id | INT | NOT NULL, FK → Applications |
| doc_type | ENUM('INCOME_CERT','CASTE_CERT','MARKSHEET','SPORTS_CERT','BANK_STATEMENT','BONAFIDE') | NOT NULL |
| verified | BOOLEAN | NOT NULL, DEFAULT FALSE |

### Table 10: EligibilityLog
| Column | Type | Constraints |
|--------|------|-------------|
| log_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| student_id | INT | NOT NULL, FK → Students |
| scholarship_id | INT | NOT NULL, FK → Scholarships |
| is_eligible | BOOLEAN | NOT NULL |
| checked_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| reason | VARCHAR(255) | NULL |
| predicted_score | TINYINT | NULL |
| model_version | VARCHAR(32) | NULL |

### Table 11: Disbursements
| Column | Type | Constraints |
|--------|------|-------------|
| disbursement_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| application_id | INT | NOT NULL, FK → Applications |
| amount_paid | INT | NOT NULL |
| payment_date | DATE | NOT NULL |
| payment_mode | ENUM('NEFT','Cheque','Direct Credit') | NOT NULL |
| transaction_ref | VARCHAR(60) | NOT NULL |

### Relationships (FK)
- Students → Institutions (many-to-one)
- Scholarships → Providers (many-to-one)
- Scholarships → Institutions (many-to-one, nullable)
- Applications → Students (many-to-one)
- Applications → Scholarships (many-to-one)
- AthleticsRecords → Students (many-to-one)
- CollegeScholarshipCriteria → Scholarships (many-to-one)
- MCMCriteria → Scholarships (many-to-one)
- Documents → Applications (many-to-one)
- EligibilityLog → Students (many-to-one)
- EligibilityLog → Scholarships (many-to-one)
- Disbursements → Applications (many-to-one)

---

## 3. Query Summary

**Total SQL Queries in Backend:** 18 unique queries

| # | Query | File | Function | Operation | Tables |
|---|-------|------|----------|-----------|--------|
| 1 | `SELECT * FROM Students WHERE student_id=%s` | main.py | get_student | SELECT | Students |
| 2 | Complex MATCH query with eligibility filters | main.py | student_matches | SELECT | Scholarships, Students, Applications, EligibilityLog |
| 3 | Applicant ranking with window function | main.py | scholarship_applicants | SELECT | Applications, Students |
| 4 | Pending athletics verification | main.py | athletics_pending | SELECT | AthleticsRecords, Students |
| 5 | `UPDATE AthleticsRecords SET verified = TRUE` | main.py | athletics_verify | UPDATE | AthleticsRecords |
| 6 | MCM leaderboard with composite score calculation | main.py | mcm_leaderboard | SELECT | Students, Scholarships, MCMCriteria |
| 7 | CGPA percentile rankings using window functions | main.py | cgpa_ranks | SELECT | Students |
| 8 | `INSERT INTO Applications...` | main.py | create_application | INSERT | Applications |
| 9 | `SELECT * FROM Applications WHERE application_id = %s` | main.py | get_application | SELECT | Applications |
| 10 | Admin scholarships with counts | main.py | admin_scholarships | SELECT | Scholarships, Applications, Providers |
| 11 | Admin stats (multiple queries) | main.py | admin_stats | SELECT | Applications, Disbursements, Scholarships, Students |
| 12 | All applications with details | main.py | admin_applications | SELECT | Applications, Scholarships, Students |
| 13 | Student applications | main.py | student_applications | SELECT | Applications, Scholarships |
| 14 | Admin students | main.py | admin_students | SELECT | Students, Institutions |
| 15 | `INSERT INTO Scholarships...` | main.py | create_scholarship | INSERT | Scholarships |
| 16 | `UPDATE Applications SET status = %s` | main.py | update_application_status | UPDATE | Applications |
| 17 | `DELETE FROM Applications WHERE application_id = %s` | main.py | delete_application | DELETE | Applications |
| 18 | Auth queries in auth.py | auth.py | create_token, verify_token, require_role | JWT operations | N/A |

---

## 4. API / Route Summary

**Total Endpoints:** 17

| Method | Path | Handler Function | Operation | DB Tables |
|--------|------|------------------|-----------|-----------|
| POST | `/auth/login` | login | Auth | N/A (mock users) |
| GET | `/api/students/{student_id}` | get_student | Read | Students |
| GET | `/api/students/{student_id}/matches` | student_matches | Read | Scholarships, Students, Applications |
| GET | `/api/students/{student_id}/applications` | student_applications | Read | Applications, Scholarships |
| GET | `/api/scholarships/{scholarship_id}/applicants` | scholarship_applicants | Read | Applications, Students |
| POST | `/api/applications` | create_application | Insert | Applications |
| GET | `/api/applications/{application_id}` | get_application | Read | Applications |
| GET | `/api/admin/stats` | admin_stats | Read | Applications, Disbursements, Scholarships, Students |
| GET | `/api/admin/applications` | admin_applications | Read | Applications, Scholarships, Students |
| GET | `/api/admin/scholarships` | admin_scholarships | Read | Scholarships, Applications, Providers |
| GET | `/api/admin/students` | admin_students | Read | Students, Institutions |
| GET | `/api/admin/athletics/pending` | athletics_pending | Read | AthleticsRecords, Students |
| PUT | `/api/admin/athletics/{record_id}/verify` | athletics_verify | Update | AthleticsRecords |
| GET | `/api/admin/mcm/leaderboard` | mcm_leaderboard | Read | Students, Scholarships, MCMCriteria |
| GET | `/api/admin/college/cgpa-ranks` | cgpa_ranks | Read | Students |
| POST | `/api/admin/scholarships` | create_scholarship | Insert | Scholarships |
| PUT | `/api/admin/applications/{application_id}` | update_application_status | Update | Applications |
| DELETE | `/api/admin/applications/{application_id}` | delete_application | Delete | Applications |

---

## 5. Business Logic Summary

### Core Modules
1. **Authentication (auth.py)**
   - JWT token creation using PyJWT
   - Token verification middleware
   - Role-based access control (admin vs student)

2. **Database Connection (database.py)**
   - PyMySQL connection pooling
   - Environment-based configuration

3. **API Routes (main.py)**
   - Student scholarship matching with eligibility filtering
   - Admin application management (CRUD)
   - Athletics verification workflow
   - MCM composite score calculation
   - CGPA percentile rankings using window functions
   - Scholarship creation

4. **Frontend State (Zustand)**
   - authStore: JWT token, role, userId management
   - dataStore: API calls, application state

### Scholarship Types Logic
- **EXTERNAL**: Government/NGO scholarships - filtered by income, category, CGPA, state
- **COLLEGE_MERIT**: Institution-based CGPA rankings
- **ATHLETICS**: Sports achievements with verification requirement
- **MCM**: Composite scoring (CGPA + income weighted)

### Data Flow
1. Student login → JWT token with role
2. Dashboard loads → Fetch matches based on eligibility
3. Apply → Create application record
4. Admin reviews → Update status / verify athletics
5. Approved → Disbursement tracking

---

## 6. Rebuild Prompt

Create a complete full-stack scholarship management system called **ScholarLink** with the following specifications:

### Database (MySQL 8.0)
Create 11 tables with the exact schema defined above:
- Institutions, Providers, Students, Scholarships, Applications
- AthleticsRecords, CollegeScholarshipCriteria, MCMCriteria
- Documents, EligibilityLog, Disbursements

Include proper foreign keys, indexes, and enum constraints. Include seed data with 10 students, 12 scholarships, 2 institutions, 4 providers.

### Backend (Python FastAPI)
1. Create FastAPI app with CORS middleware
2. Implement JWT authentication with mock users (admin:900, student1:1, student2:2)
3. Create all 17 API endpoints listed above with proper SQL queries using PyMySQL
4. Use window functions for MCM leaderboard and CGPA rankings
5. Add triggers for athletics verification (create EligibilityLog entry)

### Frontend (React + Vite + Tailwind)
1. Set up React 19 with Vite and Tailwind CSS v4
2. Create Zustand stores for auth and API data
3. Build Login page with role-based routing
4. Build Student Dashboard with:
   - Sidebar navigation (Dashboard, My Matches, Applications, Documents, Profile)
   - Stats cards (Matches, Applied, Approved, Total Aid)
   - Scholarship cards with type-specific designs (External, MCM, Athletics, Merit)
   - My Applications section showing application status
5. Build Admin Panel with:
   - Sidebar (Dashboard, Applications, Scholarships, Athletics Verify, MCM Leaderboard, Reports)
   - Stats overview
   - Applications table with status dropdown and delete option
   - Scholarships table with add form
   - Athletics verification queue
   - MCM leaderboard

### Configuration
- MySQL on localhost:3306 with user scholarlink/scholarlink
- Backend on 127.0.0.1:8000
- Frontend on 127.0.0.1:5173

### Design System
Use these exact colors:
- Primary: #2C63E5, Accent: #00C6A2
- Background: #F8F9FB, Surface: #FFFFFF
- Scholarship types: EXTERNAL=#5B6AF0, MERIT=#F59E0B, ATHLETICS=#10B981, MCM=#8B5CF6

Login credentials: admin/admin, student1/student