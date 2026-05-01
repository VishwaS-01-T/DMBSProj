from datetime import date

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.auth import create_token, require_role, verify_token
from app.database import get_connection
from app.schemas import ApplicationCreate, LoginRequest, ScholarshipCreate, ApplicationStatusUpdate

app = FastAPI(title="ScholarLink API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MOCK_USERS = {
    "admin": {"user_id": 900, "role": "admin", "password": "admin"},
    "student1": {"user_id": 1, "role": "student", "password": "student"},
    "student2": {"user_id": 2, "role": "student", "password": "student"},
}


@app.post("/auth/login")
def login(payload: LoginRequest):
    user = MOCK_USERS.get(payload.username)
    if not user or user["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(user_id=user["user_id"], role=user["role"])
    return {"token": token, "role": user["role"], "user_id": user["user_id"]}


@app.get("/api/students/{student_id}")
def get_student(student_id: int, _payload=Depends(verify_token)):
    with get_connection().cursor() as cursor:
        cursor.execute("SELECT * FROM Students WHERE student_id=%s", (student_id,))
        student = cursor.fetchone()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@app.get("/api/students/{student_id}/matches")
def student_matches(student_id: int, _payload=Depends(verify_token)):
    with get_connection().cursor() as cursor:
        cursor.execute(
            """
            SELECT s.*, el.predicted_score
            FROM Scholarships s
            JOIN Students st ON st.student_id = %s
            LEFT JOIN Applications a
              ON a.student_id = st.student_id AND a.scholarship_id = s.scholarship_id
            LEFT JOIN EligibilityLog el
              ON el.student_id = st.student_id AND el.scholarship_id = s.scholarship_id
            WHERE s.deadline >= CURDATE()
              AND a.application_id IS NULL
              AND (s.institution_id IS NULL OR s.institution_id = st.institution_id)
              AND (s.min_cgpa IS NULL OR st.cgpa >= s.min_cgpa)
              AND (s.max_family_income IS NULL OR st.annual_family_income <= s.max_family_income)
              AND (s.gender_req IS NULL OR st.gender = s.gender_req)
              AND (s.category_req IS NULL OR st.caste_category = s.category_req)
              AND (s.disability_req = FALSE OR st.disability_status = TRUE)
              AND (s.state_req IS NULL OR st.state = s.state_req)
            ORDER BY COALESCE(el.predicted_score, 0) DESC, s.amount_inr DESC
            """,
            (student_id,),
        )
        rows = cursor.fetchall()
    return rows


@app.get("/api/scholarships/{scholarship_id}/applicants")
def scholarship_applicants(scholarship_id: int, _payload=Depends(require_role("admin"))):
    with get_connection().cursor() as cursor:
        cursor.execute(
            """
            SELECT
              a.application_id,
              a.student_id,
              st.name,
              st.cgpa,
              st.annual_family_income,
              RANK() OVER (PARTITION BY a.scholarship_id ORDER BY st.cgpa DESC, st.annual_family_income ASC) AS applicant_rank
            FROM Applications a
            JOIN Students st ON a.student_id = st.student_id
            WHERE a.scholarship_id = %s
            """,
            (scholarship_id,),
        )
        rows = cursor.fetchall()
    return rows


@app.get("/api/admin/athletics/pending")
def athletics_pending(_payload=Depends(require_role("admin"))):
    with get_connection().cursor() as cursor:
        cursor.execute(
            """
            SELECT ar.*, st.name, st.department, st.year_of_study
            FROM AthleticsRecords ar
            JOIN Students st ON st.student_id = ar.student_id
            WHERE ar.verified = FALSE
            ORDER BY ar.record_id DESC
            """
        )
        rows = cursor.fetchall()
    return rows


@app.put("/api/admin/athletics/{record_id}/verify")
def athletics_verify(record_id: int, _payload=Depends(require_role("admin"))):
    with get_connection().cursor() as cursor:
        cursor.execute("UPDATE AthleticsRecords SET verified = TRUE WHERE record_id = %s", (record_id,))
        cursor.execute("SELECT * FROM AthleticsRecords WHERE record_id = %s", (record_id,))
        record = cursor.fetchone()
    return {"record": record}


@app.get("/api/admin/mcm/leaderboard")
def mcm_leaderboard(department: str | None = None, _payload=Depends(require_role("admin"))):
    with get_connection().cursor() as cursor:
        cursor.execute(
            """
            WITH eligible AS (
              SELECT
                st.student_id,
                st.name,
                st.department,
                st.cgpa,
                st.annual_family_income,
                s.scholarship_id,
                mc.cgpa_weight,
                mc.income_weight,
                mc.min_cgpa_floor,
                mc.max_income_ceiling,
                mc.composite_cutoff
              FROM Students st
              JOIN Scholarships s ON s.scholarship_type = 'MCM' AND s.institution_id = st.institution_id
              JOIN MCMCriteria mc ON mc.scholarship_id = s.scholarship_id
              WHERE st.cgpa >= mc.min_cgpa_floor
                AND st.annual_family_income <= mc.max_income_ceiling
            )
            SELECT
              e.student_id,
              e.name,
              e.department,
              e.scholarship_id,
              ROUND((e.cgpa / 10) * e.cgpa_weight * 100, 2) AS cgpa_component,
              ROUND((1 - (e.annual_family_income / e.max_income_ceiling)) * e.income_weight * 100, 2) AS income_component,
              ROUND(
                ((e.cgpa / 10) * e.cgpa_weight * 100) +
                ((1 - (e.annual_family_income / e.max_income_ceiling)) * e.income_weight * 100),
                2
              ) AS composite_score
            FROM eligible e
            WHERE
              (((e.cgpa / 10) * e.cgpa_weight * 100) +
               ((1 - (e.annual_family_income / e.max_income_ceiling)) * e.income_weight * 100)) >= e.composite_cutoff
            ORDER BY composite_score DESC
            """
        )
        rows = cursor.fetchall()
    if department:
        rows = [row for row in rows if row["department"] == department]
    return rows


@app.get("/api/admin/college/cgpa-ranks")
def cgpa_ranks(_payload=Depends(require_role("admin"))):
    with get_connection().cursor() as cursor:
        cursor.execute(
            """
            WITH ranked AS (
              SELECT
                st.student_id,
                st.name,
                st.institution_id,
                st.department,
                st.year_of_study,
                st.cgpa,
                PERCENT_RANK() OVER (
                  PARTITION BY st.institution_id, st.department, st.year_of_study
                  ORDER BY st.cgpa DESC
                ) AS pct_rank
              FROM Students st
            )
            SELECT
              r.student_id,
              r.name,
              r.department,
              r.year_of_study,
              r.cgpa,
              r.pct_rank
            FROM ranked r
            WHERE r.pct_rank <= 0.15
            ORDER BY r.department, r.year_of_study, r.cgpa DESC
            """
        )
        rows = cursor.fetchall()
    return rows


@app.post("/api/applications")
def create_application(payload: ApplicationCreate, _payload=Depends(verify_token)):
    with get_connection().cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO Applications (student_id, scholarship_id, applied_date, status, remarks)
            VALUES (%s, %s, %s, 'Pending', %s)
            """,
            (payload.student_id, payload.scholarship_id, date.today(), payload.remarks),
        )
        application_id = cursor.lastrowid
        cursor.execute("SELECT * FROM Applications WHERE application_id = %s", (application_id,))
        record = cursor.fetchone()
    return record


@app.get("/api/applications/{application_id}")
def get_application(application_id: int, _payload=Depends(verify_token)):
    with get_connection().cursor() as cursor:
        cursor.execute("SELECT * FROM Applications WHERE application_id = %s", (application_id,))
        record = cursor.fetchone()
    if not record:
        raise HTTPException(status_code=404, detail="Application not found")
    return record


@app.get("/api/admin/scholarships")
def admin_scholarships(_payload=Depends(require_role("admin"))):
    with get_connection().cursor() as cursor:
        cursor.execute(
            """
            SELECT s.*, 
                   COUNT(a.application_id) as application_count,
                   p.name as provider_name
            FROM Scholarships s
            LEFT JOIN Applications a ON s.scholarship_id = a.scholarship_id
            LEFT JOIN Providers p ON s.provider_id = p.provider_id
            GROUP BY s.scholarship_id
            ORDER BY s.scholarship_id
            """
        )
        rows = cursor.fetchall()
    return rows


@app.get("/api/admin/stats")
def admin_stats(_payload=Depends(require_role("admin"))):
    with get_connection().cursor() as cursor:
        cursor.execute("SELECT COUNT(*) as total FROM Applications")
        total = cursor.fetchone()["total"]
        
        cursor.execute("SELECT COUNT(*) as total FROM Applications WHERE status = 'Approved'")
        approved = cursor.fetchone()["total"]
        
        cursor.execute("SELECT COUNT(*) as total FROM Applications WHERE status = 'Pending'")
        pending = cursor.fetchone()["total"]
        
        cursor.execute("SELECT COUNT(*) as total FROM Applications WHERE status = 'Under Review'")
        under_review = cursor.fetchone()["total"]
        
        cursor.execute("SELECT SUM(amount_paid) as total FROM Disbursements")
        disbursed = cursor.fetchone()["total"] or 0
        
        cursor.execute("SELECT COUNT(*) as total FROM Scholarships")
        scholarship_count = cursor.fetchone()["total"]
        
        cursor.execute("SELECT COUNT(*) as total FROM Students")
        student_count = cursor.fetchone()["total"]
        
    return {
        "total_applications": total,
        "approved": approved,
        "pending": pending,
        "under_review": under_review,
        "total_disbursed": disbursed,
        "total_scholarships": scholarship_count,
        "total_students": student_count
    }


@app.get("/api/admin/applications")
def admin_applications(_payload=Depends(require_role("admin"))):
    with get_connection().cursor() as cursor:
        cursor.execute(
            """
            SELECT a.*, s.name as scholarship_name, st.name as student_name, st.enrollment_no
            FROM Applications a
            JOIN Scholarships s ON a.scholarship_id = s.scholarship_id
            JOIN Students st ON a.student_id = st.student_id
            ORDER BY a.applied_date DESC
            """
        )
        rows = cursor.fetchall()
    return rows


@app.get("/api/students/{student_id}/applications")
def student_applications(student_id: int, _payload=Depends(verify_token)):
    with get_connection().cursor() as cursor:
        cursor.execute(
            """
            SELECT a.*, s.name as scholarship_name
            FROM Applications a
            JOIN Scholarships s ON a.scholarship_id = s.scholarship_id
            WHERE a.student_id = %s
            ORDER BY a.applied_date DESC
            """,
            (student_id,)
        )
        rows = cursor.fetchall()
    return rows


@app.get("/api/admin/students")
def admin_students(_payload=Depends(require_role("admin"))):
    with get_connection().cursor() as cursor:
        cursor.execute(
            """
            SELECT st.*, i.name as institution_name
            FROM Students st
            JOIN Institutions i ON st.institution_id = i.institution_id
            ORDER BY st.student_id
            """
        )
        rows = cursor.fetchall()
    return rows


@app.post("/api/admin/scholarships")
def create_scholarship(payload: ScholarshipCreate, _payload=Depends(require_role("admin"))):
    provider_id = payload.provider_id if payload.provider_id else 1
    institution_id = payload.institution_id if payload.institution_id else None
    seats_available = payload.seats_available if payload.seats_available else 10
    min_cgpa = payload.min_cgpa if payload.min_cgpa else None
    max_family_income = payload.max_family_income if payload.max_family_income else None
    gender_req = payload.gender_req if payload.gender_req else None
    category_req = payload.category_req if payload.category_req else None
    state_req = payload.state_req if payload.state_req else None
    
    with get_connection().cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO Scholarships 
            (name, scholarship_type, provider_id, institution_id, amount_inr, seats_available, 
             deadline, min_cgpa, max_family_income, gender_req, category_req, disability_req, state_req, renewable)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (payload.name, payload.scholarship_type, provider_id, institution_id,
             payload.amount_inr, seats_available, payload.deadline, min_cgpa,
             max_family_income, gender_req, category_req, 
             payload.disability_req, state_req, payload.renewable)
        )
        get_connection().commit()
        scholarship_id = cursor.lastrowid
        cursor.execute("SELECT * FROM Scholarships WHERE scholarship_id = %s", (scholarship_id,))
        record = cursor.fetchone()
    return record


@app.put("/api/admin/applications/{application_id}")
def update_application_status(application_id: int, payload: ApplicationStatusUpdate, _payload=Depends(require_role("admin"))):
    with get_connection().cursor() as cursor:
        cursor.execute(
            "UPDATE Applications SET status = %s, remarks = %s WHERE application_id = %s",
            (payload.status, payload.remarks, application_id)
        )
        get_connection().commit()
        cursor.execute("SELECT * FROM Applications WHERE application_id = %s", (application_id,))
        record = cursor.fetchone()
    return record


@app.delete("/api/admin/applications/{application_id}")
def delete_application(application_id: int, _payload=Depends(require_role("admin"))):
    with get_connection().cursor() as cursor:
        cursor.execute("DELETE FROM Applications WHERE application_id = %s", (application_id,))
        get_connection().commit()
    return {"message": "Application deleted successfully", "application_id": application_id}
