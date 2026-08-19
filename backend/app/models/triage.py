from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.core.database import Base

class UrgencyLevel(str, enum.Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    EMERGENCY = "EMERGENCY"

class TriageAssessment(Base):
    __tablename__ = "triage_assessments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    input_symptoms = Column(JSON, nullable=False) # Intermediate JSON schema
    detected_symptoms = Column(JSON, nullable=False) # List of extracted symptoms
    detected_red_flags = Column(JSON, nullable=False) # List of triggered red flags
    risk_category = Column(SQLEnum(UrgencyLevel), nullable=False)
    explanation = Column(Text, nullable=False)
    recommended_next_step = Column(Text, nullable=False)
    confidence_score = Column(Float, default=1.0)
    model_version = Column(String(50), nullable=False) # e.g. "redflag_rules_v1.0 + llm_v1"
    is_worker_overridden = Column(Boolean, default=False)
    worker_override_category = Column(SQLEnum(UrgencyLevel), nullable=True)
    worker_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    patient = relationship("Patient", back_populates="assessments")
    referrals = relationship("Referral", back_populates="assessment")
