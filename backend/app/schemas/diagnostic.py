from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.diagnostic import DiagnosticStatus

class FacilityDiagnosticAvailabilityResponse(BaseModel):
    id: int
    facility_id: int
    test_name: str
    category: str
    is_available: str
    equipment_status: str
    estimated_turnaround_hours: int
    updated_at: datetime

    class Config:
        from_attributes = True

class DiagnosticOrderCreate(BaseModel):
    facility_id: int
    test_name: str
    reason: Optional[str] = None

class DiagnosticResultResponse(BaseModel):
    id: int
    order_id: int
    result_summary: str
    reference_range: Optional[str] = None
    is_abnormal: str
    authorized_for_patient_view: str
    recorded_at: datetime

    class Config:
        from_attributes = True

class DiagnosticOrderResponse(BaseModel):
    id: int
    order_code: str
    patient_id: int
    facility_id: int
    facility_name: Optional[str] = None
    test_name: str
    reason: Optional[str] = None
    status: DiagnosticStatus
    scheduled_date: Optional[datetime] = None
    created_at: datetime
    results: List[DiagnosticResultResponse] = []

    class Config:
        from_attributes = True

class DiagnosticResultCreate(BaseModel):
    result_summary: str
    reference_range: Optional[str] = None
    is_abnormal: str = "FALSE"
    authorized_for_patient_view: str = "TRUE"
