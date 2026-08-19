from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime
from app.models.triage import UrgencyLevel

class TriageAssessmentCreate(BaseModel):
    patient_id: int
    symptom_data: dict

class TriageAssessmentResponse(BaseModel):
    id: int
    patient_id: int
    risk_category: UrgencyLevel
    explanation: str
    recommended_next_step: str
    detected_symptoms: List[str]
    detected_red_flags: List[str]
    confidence_score: float
    model_version: str
    is_worker_overridden: bool
    worker_override_category: Optional[UrgencyLevel] = None
    worker_notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AssessmentOverrideRequest(BaseModel):
    worker_override_category: UrgencyLevel
    worker_notes: str = Field(..., min_length=5)
