from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.core.database import Base

class FollowUpCategory(str, enum.Enum):
    MATERNAL = "MATERNAL"
    CHILD = "CHILD"
    CHRONIC = "CHRONIC"
    POST_REFERRAL = "POST_REFERRAL"
    OTHER = "OTHER"

class FollowUpStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONTACTED = "CONTACTED"
    COMPLETED = "COMPLETED"
    MISSED = "MISSED"
    ESCALATED = "ESCALATED"
    CLOSED = "CLOSED"

class HighRiskFollowUp(Base):
    __tablename__ = "high_risk_followups"

    id = Column(Integer, primary_key=True, index=True)
    followup_code = Column(String(30), unique=True, index=True, nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    assigned_worker_id = Column(Integer, ForeignKey("healthcare_workers.id"), nullable=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)
    category = Column(SQLEnum(FollowUpCategory), default=FollowUpCategory.MATERNAL, nullable=False)
    priority = Column(String(20), default="HIGH", nullable=False) # NORMAL, HIGH, CRITICAL
    scheduled_date = Column(DateTime, nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(SQLEnum(FollowUpStatus), default=FollowUpStatus.PENDING, nullable=False)
    contact_method = Column(String(50), default="HOME_VISIT", nullable=False) # HOME_VISIT, PHONE, PHC_VISIT
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    patient = relationship("Patient", back_populates="followups")
    worker = relationship("HealthcareWorker")
    facility = relationship("Facility")
