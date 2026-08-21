from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.queue import QueueStatus

class QueueTokenCreate(BaseModel):
    facility_id: int
    appointment_id: Optional[int] = None
    department: str = "General OPD"
    priority: str = "NORMAL"

class QueueTokenResponse(BaseModel):
    id: int
    token_number: str
    facility_id: int
    facility_name: Optional[str] = None
    department: str
    priority: str
    status: QueueStatus
    position: int
    estimated_wait_minutes: int
    created_at: datetime

    class Config:
        from_attributes = True

class QueueStatusUpdate(BaseModel):
    status: QueueStatus
    priority: Optional[str] = None
