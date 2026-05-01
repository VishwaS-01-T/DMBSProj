# ScholarLink - Scholarship & Aid Matching System

A full-stack relational database project that matches students to scholarships based on eligibility criteria and predicts approval probability using ML models.

## 📋 Project Overview

| Attribute | Details |
|-----------|---------|
| **Type** | DBMS Course Project (Full-Stack) |
| **Stack** | MySQL 8.0 · Python 3.x + FastAPI · React + Vite + Tailwind CSS · Zustand |
| **ML Layer** | Logistic Regression (placeholder for demo) |
| **Database** | 11 tables, 4 scholarship types, triggers, events, window functions, views |

## 🎯 Features

### Student Dashboard
- **All Matches** - Merged list of all eligible scholarships sorted by ML score
- **External** - National/state/NGO scholarships with deadline indicators
- **College Awards** - Sub-tabs for CGPA Merit, Athletics, MCM with special card designs
- **Applied** - Application timeline with status badges

### Admin Panel
- **External Scholarships** - Management table
- **Athletics Queue** - Pending verification with trigger functionality
- **MCM Leaderboard** - Composite score ranking by department
- **CGPA Rank View** - Department-wise percentile rankings

### Authentication
- Mock JWT authentication
- Two roles: Admin and Student

## 🚀 Quick Start

### Prerequisites
- Docker (for MySQL)
- Python 3.x
- Node.js 18+

### Step 1: Start MySQL Container

```bash
cd scholarlink
docker compose up -d
```

Wait for MySQL to initialize (30-60 seconds).

### Step 2: Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start the server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend runs at: **http://127.0.0.1:8000**
API Documentation: **http://127.0.0.1:8000/docs**

### Step 3: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: **http://127.0.0.1:5173**

## 🔐 Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin` |
| Student | `student1` | `student` |
| Student | `student2` | `student` |

## 🗄️ Database Schema (11 Tables)

### Core Tables
- **Students** - Profile with CGPA, income, category, department
- **Scholarships** - Scholarship details with eligibility criteria
- **Providers** - Scholarship providers (Government/NGO/Private/Institution)
- **Institutions** - Educational institutions
- **Applications** - Student applications with status tracking

### Supporting Tables
- **AthleticsRecords** - Student sports achievements
- **CollegeScholarshipCriteria** - College-specific eligibility rules
- **MCMCriteria** - Merit-cum-means composite scoring rules
- **Documents** - Application document verification
- **EligibilityLog** - Eligibility check history with ML scores
- **Disbursements** - Payment tracking

## 📊 Scholarship Types

| Type | Description | Criteria |
|------|-------------|----------|
| `EXTERNAL` | Government/NGO scholarships | Income, category, CGPA, state, gender |
| `COLLEGE_MERIT` | Institution CGPA-based | Rank within department/batch |
| `ATHLETICS` | Sports achievements | Sport, achievement level, verification |
| `MCM` | Merit-cum-means | CGPA + family income weighted |

## 🔌 API Endpoints

### Authentication
- `POST /auth/login` - Mock JWT login

### Student APIs
- `GET /api/students/{student_id}` - Get student profile
- `GET /api/students/{student_id}/matches` - Get matching scholarships

### Admin APIs
- `GET /api/scholarships/{scholarship_id}/applicants` - Ranked applicant list
- `GET /api/admin/athletics/pending` - Pending verification queue
- `PUT /api/admin/athletics/{record_id}/verify` - Verify athletics record (triggers DB)
- `GET /api/admin/mcm/leaderboard` - MCM composite scores
- `GET /api/admin/college/cgpa-ranks` - CGPA percentile rankings

### Applications
- `POST /api/applications` - Submit new application
- `GET /api/applications/{application_id}` - Get application status

## 🎨 Design System

### Colors
```
Primary:      #2C63E5 (Brand Blue)
Accent:       #00C6A2 (Success Green)
Background:   #F8F9FB (Light Grey)
Surface:      #FFFFFF (White)

Scholarship Types:
- EXTERNAL:    #5B6AF0 (Indigo)
- COLLEGE_MERIT: #F59E0B (Amber)
- ATHLETICS:   #10B981 (Emerald)
- MCM:         #8B5CF6 (Violet)
```

### Typography
- Font: Inter (sans-serif)
- Headings: Bold, clean hierarchy

## 📁 Project Structure

```
scholarlink/
├── docker-compose.yml           # MySQL 8.0 container configuration
├── README.md                   # This file
│
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application + routes
│   │   ├── auth.py              # JWT authentication
│   │   ├── database.py          # MySQL connection (PyMySQL)
│   │   └── schemas.py           # Pydantic request/response models
│   │
│   ├── migrations/
│   │   ├── init/
│   │   │   ├── schema.sql       # CREATE TABLE statements
│   │   │   └── seed_data.sql    # Sample data
│   │   ├── queries.sql          # Key SQL queries (Q1-Q10)
│   │   ├── views.sql            # Database views
│   │   └── triggers.sql         # Triggers + events
│   │
│   └── requirements.txt         # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── App.jsx               # Main React component
    │   ├── main.jsx              # Entry point
    │   ├── index.css             # Tailwind styles
    │   ├── store/
    │   │   ├── authStore.js      # Zustand auth state
    │   │   └── dataStore.js      # API data state
    │   ├── components/ui/        # Reusable UI components
    │   │   ├── button.jsx
    │   │   ├── badge.jsx
    │   │   └── card.jsx
    │   └── lib/
    │       └── utils.js          # Tailwind merge utility
    │
    ├── package.json
    ├── tailwind.config.js       # Design system config
    ├── vite.config.js
    └── postcss.config.js
```

## 🧪 Demo Walkthrough

### 1. Verify Database Setup
Open MySQL Workbench or CLI and verify all 11 tables exist:
```sql
USE scholarlink;
SHOW TABLES;
```

### 2. Login as Student
- URL: http://127.0.0.1:5173
- Credentials: student1 / student
- See scholarship matches on dashboard

### 3. Login as Admin
- Credentials: admin / admin
- Navigate to "Athletics Queue" tab
- Click "Verify" on a pending record

### 4. Observe Trigger Effect
- The database trigger `after_athletics_verify` fires
- An entry is inserted into `EligibilityLog`
- The student can now see the athletics scholarship in their dashboard

### 5. View MCM Composite Scores
- Admin → "MCM Leaderboard" tab
- See students ranked by composite score
- CGPA component + Income component = Total

## 🔧 Troubleshooting

### MySQL Connection Issues
If you see authentication errors:
```bash
# Install cryptography for MySQL auth
pip install cryptography
```

### Port Already in Use
```bash
# Kill existing processes
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Docker Issues
```bash
# Reset MySQL container
docker compose down -v
docker compose up -d
```

## 📝 Notes

- ML models are placeholders for demo (predicted_score is hardcoded)
- Authentication is mock JWT (not production-ready)
- Design follows minimalist light theme per design doc
- All scholarship type logic uses `scholarship_type` as routing key

---

**ScholarLink v2** - DBMS Course Project