from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.core.database import Base

class EncounterType(str, enum.Enum):
    TRIAGE = "TRIAGE"
    APPOINTMENT = "APPOINTMENT"
    CONSULTATION = "CONSULTATION"
    DIAGNOSTIC = "DIAGNOSTIC"
    REFERRAL = "REFERRAL"
    FOLLOW_UP = "FOLLOW_UP"
    MEDICINE_DISPENSED = "MEDICINE_DISPENSED"

class Encounter(Base):
    __tablename__ = "encounters"

    id = Column(Integer, primary_key=True, index=True)
    encounter_code = Column(String(30), unique=True, index=True, nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)
    worker_id = Column(Integer, ForeignKey("healthcare_workers.id"), nullable=True)
    encounter_type = Column(SQLEnum(EncounterType), nullable=False)
    title = Column(String(150), nullable=False)
    summary = Column(Text, nullable=False)
    clinical_notes = Column(Text, nullable=True)
    urgency = Column(String(20), default="LOW", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    patient = relationship("Patient", back_populates="encounters")
    facility = relationship("Facility")
    worker = relationship("HealthcareWorker")
