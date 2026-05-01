from pydantic import BaseModel
from datetime import date


class LoginRequest(BaseModel):
    username: str
    password: str


class ApplicationCreate(BaseModel):
    student_id: int
    scholarship_id: int
    remarks: str | None = None


class ScholarshipCreate(BaseModel):
    name: str
    scholarship_type: str
    provider_id: int | None = None
    institution_id: int | None = None
    amount_inr: int
    seats_available: int | None = None
    deadline: date
    min_cgpa: float | None = None
    max_family_income: int | None = None
    gender_req: str | None = None
    category_req: str | None = None
    disability_req: bool = False
    state_req: str | None = None
    renewable: bool = False


class ApplicationStatusUpdate(BaseModel):
    status: str
    remarks: str | None = None
