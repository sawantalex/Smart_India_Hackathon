from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.triage import UrgencyLevel
from app.models.referral import ReferralStatus

class ReferralCreate(BaseModel):
    patient_id: int
    assessment_id: Optional[int] = None
    facility_id: int
    urgency: UrgencyLevel
    reason: str
    notes: Optional[str] = None

class ReferralUpdate(BaseModel):
    status: Optional[ReferralStatus] = None
    assigned_worker_id: Optional[int] = None
    notes: Optional[str] = None

class FollowUpCreate(BaseModel):
    referral_id: int
    scheduled_date: datetime

class ReferralResponse(BaseModel):
    id: int
    referral_code: str
    patient_id: int
    assessment_id: Optional[int] = None
    facility_id: int
    assigned_worker_id: Optional[int] = None
    urgency: UrgencyLevel
    reason: str
    status: ReferralStatus
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
