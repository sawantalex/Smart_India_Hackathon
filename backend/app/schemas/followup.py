from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.followup import FollowUpCategory, FollowUpStatus

class HighRiskFollowUpCreate(BaseModel):
    patient_id: int
    facility_id: Optional[int] = None
    category: FollowUpCategory
    priority: str = "HIGH"
    scheduled_date: datetime
    reason: str
    contact_method: str = "HOME_VISIT"

class HighRiskFollowUpResponse(BaseModel):
    id: int
    followup_code: str
    patient_id: int
    assigned_worker_id: Optional[int] = None
    facility_id: Optional[int] = None
    category: FollowUpCategory
    priority: str
    scheduled_date: datetime
    reason: str
    status: FollowUpStatus
    contact_method: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class HighRiskFollowUpStatusUpdate(BaseModel):
    status: FollowUpStatus
    notes: Optional[str] = None
