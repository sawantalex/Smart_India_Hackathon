from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.appointment import AppointmentStatus

class AppointmentSlotBase(BaseModel):
    facility_id: int
    department: str = "General OPD"
    start_time: datetime
    end_time: datetime
    capacity: int = 10

class AppointmentSlotResponse(AppointmentSlotBase):
    id: int
    booked_count: int
    is_active: str

    class Config:
        from_attributes = True

class AppointmentCreate(BaseModel):
    facility_id: int
    slot_id: Optional[int] = None
    department: str = "General OPD"
    appointment_date: datetime
    reason: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: int
    appointment_code: str
    patient_id: int
    facility_id: int
    facility_name: Optional[str] = None
    department: str
    appointment_date: datetime
    status: AppointmentStatus
    reason: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus
