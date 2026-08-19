from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.core.database import Base
from app.models.triage import UrgencyLevel

class ReferralStatus(str, enum.Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class Referral(Base):
    __tablename__ = "referrals"

    id = Column(Integer, primary_key=True, index=True)
    referral_code = Column(String(30), unique=True, index=True, nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    assessment_id = Column(Integer, ForeignKey("triage_assessments.id"), nullable=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    assigned_worker_id = Column(Integer, ForeignKey("healthcare_workers.id"), nullable=True)
    urgency = Column(SQLEnum(UrgencyLevel), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(SQLEnum(ReferralStatus), default=ReferralStatus.PENDING, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    patient = relationship("Patient", back_populates="referrals")
    assessment = relationship("TriageAssessment", back_populates="referrals")
    facility = relationship("Facility", back_populates="referrals")
    healthcare_worker = relationship("HealthcareWorker", back_populates="assigned_referrals")
    follow_ups = relationship("FollowUp", back_populates="referral", cascade="all, delete-orphan")

class FollowUp(Base):
    __tablename__ = "follow_ups"

    id = Column(Integer, primary_key=True, index=True)
    referral_id = Column(Integer, ForeignKey("referrals.id"), nullable=False)
    scheduled_date = Column(DateTime, nullable=False)
    status = Column(String(20), default="SCHEDULED", nullable=False) # SCHEDULED, COMPLETED, MISSED
    outcome_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    referral = relationship("Referral", back_populates="follow_ups")
