# ScholarLink Agent Configuration

This file defines the agent's capabilities and project context for ScholarLink.

## Project Overview

**ScholarLink** is a Scholarship & Aid Matching System — a full-stack relational database project that matches students to scholarships based on eligibility criteria.

- **Type**: DBMS Course Project (Full-Stack)
- **Stack**: MySQL 8.0 · Python 3.x + FastAPI · React + Vite + Tailwind CSS · Zustand
- **ML Layer**: Logistic Regression (placeholder for demo)
- **Database**: 11 tables, 4 scholarship types, triggers, events, window functions, views

## Tech Stack

| Layer | Technology |
|-------|------------|
| Database | MySQL 8.0 (via Docker) |
| Backend | Python 3.x + FastAPI |
| ML | scikit-learn (placeholder) |
| DB Connector | PyMySQL |
| Frontend | React 19 + Vite 8 + Tailwind CSS v4 |
| State Management | Zustand |
| Auth | Mock JWT |

## Available Commands

### Database
```bash
# Start MySQL container
cd scholarlink && docker compose up -d

# Stop MySQL container
docker compose down

# Check MySQL status
docker compose ps
```

### Backend
```bash
cd scholarlink/backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start development server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# API documentation
# http://127.0.0.1:8000/docs
```

### Frontend
```bash
cd scholarlink/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
scholarlink/
├── AGENT.md                    # This file
├── README.md                    # Project documentation
├── DESIGN_AESTHETICS.md         # Design system specifications
├── docker-compose.yml           # MySQL container config
│
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application + routes
│   │   ├── auth.py              # JWT authentication
│   │   ├── database.py          # MySQL connection (PyMySQL)
│   │   └── schemas.py           # Pydantic models
│   │
│   ├── migrations/
│   │   ├── init/
│   │   │   ├── schema.sql       # CREATE TABLE statements (11 tables)
│   │   │   └── seed_data.sql    # Sample data
│   │   ├── queries.sql          # Key SQL queries (Q1-Q10)
│   │   ├── views.sql            # Database views
│   │   └── triggers.sql         # Triggers + events
│   │
│   └── requirements.txt         # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── App.jsx              # Main React component
    │   ├── main.jsx             # Entry point
    │   ├── index.css            # Tailwind v4 styles + @theme
    │   ├── store/
    │   │   ├── authStore.js     # Zustand auth state
    │   │   └── dataStore.js     # API data state
    │   ├── components/ui/       # Reusable UI components
    │   │   ├── button.jsx
    │   │   ├── badge.jsx
    │   │   └── card.jsx
    │   └── lib/
    │       └── utils.js         # Tailwind merge utility (cn)
    │
    ├── package.json
    ├── tailwind.config.js      # Tailwind v4 config (legacy compat)
    ├── vite.config.js
    └── postcss.config.js
```

## Database Schema (11 Tables)

### Core Tables
- **Institutions** - Educational institutions
- **Providers** - Scholarship providers (Government/NGO/Private/Institution)
- **Students** - Profile with CGPA, income, category, department
- **Scholarships** - Scholarship details with eligibility criteria
- **Applications** - Student applications with status tracking

### Supporting Tables
- **AthleticsRecords** - Student sports achievements
- **CollegeScholarshipCriteria** - College-specific eligibility rules
- **MCMCriteria** - Merit-cum-means composite scoring rules
- **Documents** - Application document verification
- **EligibilityLog** - Eligibility check history with ML scores
- **Disbursements** - Payment tracking

## Scholarship Types

| Type | Description |
|------|-------------|
| `EXTERNAL` | Government/NGO scholarships |
| `COLLEGE_MERIT` | Institution CGPA-based |
| `ATHLETICS` | Sports achievements |
| `MCM` | Merit-cum-means (CGPA + income weighted) |

## API Endpoints

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

## Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin` |
| Student | `student1` | `student` |
| Student | `student2` | `student` |

## Design System

### Colors
```
--color-bg:           #F8F9FB
--color-surface:      #FFFFFF
--color-surface-2:    #F1F4F8
--color-border:       #E4E8EF
--color-primary:      #2C63E5
--color-primary-soft: #EEF3FD
--color-accent:       #00C6A2
--color-external:     #5B6AF0
--color-merit:        #F59E0B
--color-athletics:    #10B981
--color-mcm:          #8B5CF6
```

### Typography
- Font: Inter (sans-serif)
- Font weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## Key Implementation Rules

1. **NULL = no restriction** - Every nullable eligibility column in Scholarships means "open to all" on that dimension
2. **scholarship_type drives logic** - All routing (ML model selection, eligibility query, card design) is keyed on `scholarship_type`
3. **Verified flag is a gate** - Athletics cards must never show until `AthleticsRecords.verified = TRUE`
4. **MCM formula is visible** - Always render both `cgpa_component` and `income_component` separately in the UI
5. **Window functions for ranking** - Use `RANK()` / `PERCENT_RANK()` over `ORDER BY` subqueries
6. **ML scores are suggestions** - `predicted_score` is advisory, not final approval
7. **Model versioning** - Always write `model_version` alongside `predicted_score`
8. **FastAPI endpoints** - All API routes return JSON with OpenAPI docs at `/docs`

## Tailwind CSS v4 Note

The frontend uses Tailwind CSS v4. Key differences from v3:
- Use `@import "tailwindcss"` instead of `@tailwind base/components/utilities`
- Use `@theme` directive for custom values
- Custom classes are defined in `frontend/src/index.css`

## Quick Start Scripts

### Setup Script (First time or after reset)
```bash
cd scholarlink
./scripts/setup.sh
```
This script:
1. Starts MySQL Docker container
2. Initializes database schema (11 tables)
3. Seeds sample data (10 students, 12 scholarships)
4. Starts backend on port 8000
5. Starts frontend on port 5173

### Reset Script (Complete fresh start)
```bash
cd scholarlink
./scripts/reset.sh
```
WARNING: This deletes all data and recreates everything from scratch.

## Common Issues

### MySQL Tables Don't Exist
If you see "Table 'scholarlink.Scholarships' doesn't exist":
```bash
# Run database setup manually
docker exec -i scholarlink-mysql mysql -uroot -proot scholarlink < backend/migrations/init/schema.sql
docker exec -i scholarlink-mysql mysql -uroot -proot scholarlink < backend/migrations/init/seed_data.sql
```

### MySQL Authentication
If you see authentication errors, install cryptography:
```bash
pip install cryptography
```

### Tailwind Not Loading
Ensure `index.css` uses `@import "tailwindcss"` and `@theme` directive for v4.

### Port Already in Use
```bash
lsof -ti:8000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```

---

*Last updated: May 2026*