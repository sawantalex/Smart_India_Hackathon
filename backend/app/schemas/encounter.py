from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.encounter import EncounterType

class EncounterBase(BaseModel):
    patient_id: int
    facility_id: Optional[int] = None
    encounter_type: EncounterType
    title: str
    summary: str
    clinical_notes: Optional[str] = None
    urgency: str = "LOW"

class EncounterCreate(EncounterBase):
    pass

class EncounterResponse(EncounterBase):
    id: int
    encounter_code: str
    worker_id: Optional[int] = None
    facility_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class PatientTimelineResponse(BaseModel):
    patient_id: int
    patient_code: str
    full_name: str
    encounters: List[EncounterResponse]
