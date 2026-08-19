from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PatientBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    age_group: str = Field(..., description="0-5, 6-17, 18-59, 60+")
    gender: Optional[str] = None
    preferred_language: str = Field("hi", description="hi, mr, en")
    district: Optional[str] = None
    village_or_town: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int
    user_id: int
    patient_code: str
    created_at: datetime

    class Config:
        from_attributes = True
