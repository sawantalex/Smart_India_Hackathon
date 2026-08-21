from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.consultation import ConsultationStatus

class ConsultationCreate(BaseModel):
    facility_id: int
    specialty: str = "General Medicine"
    reason: str

class ConsultationResponse(BaseModel):
    id: int
    session_code: str
    patient_id: int
    facility_id: int
    facility_name: Optional[str] = None
    doctor_name: Optional[str] = None
    specialty: str
    status: ConsultationStatus
    reason: str
    clinical_summary: Optional[str] = None
    is_ai_generated_summary: str = "TRUE"
    clinician_notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ConsultationSummaryUpdate(BaseModel):
    clinical_summary: str
    is_ai_generated_summary: str = "FALSE"
    clinician_notes: Optional[str] = None
    status: Optional[ConsultationStatus] = None
