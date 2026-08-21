from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.core.database import Base

class ConsultationStatus(str, enum.Enum):
    REQUESTED = "REQUESTED"
    SCHEDULED = "SCHEDULED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class ConsultationSession(Base):
    __tablename__ = "consultation_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_code = Column(String(30), unique=True, index=True, nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    worker_id = Column(Integer, ForeignKey("healthcare_workers.id"), nullable=True)
    doctor_name = Column(String(100), nullable=True)
    specialty = Column(String(100), default="General Medicine", nullable=False)
    status = Column(SQLEnum(ConsultationStatus), default=ConsultationStatus.REQUESTED, nullable=False)
    reason = Column(Text, nullable=False)
    clinical_summary = Column(Text, nullable=True) # AI-assisted or worker prepared summary
    is_ai_generated_summary = Column(String(10), default="TRUE", nullable=False)
    clinician_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    patient = relationship("Patient")
    facility = relationship("Facility")
    worker = relationship("HealthcareWorker")
