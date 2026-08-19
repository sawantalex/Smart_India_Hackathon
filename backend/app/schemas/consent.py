from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PatientConsentCreate(BaseModel):
    consent_version: str = "v1.0"
    purpose: str = "Triage assessment and referral management"

class PatientConsentResponse(BaseModel):
    id: int
    patient_id: int
    consent_version: str
    purpose: str
    granted: bool
    granted_at: datetime
    withdrawn_at: Optional[datetime] = None

    class Config:
        from_attributes = True
