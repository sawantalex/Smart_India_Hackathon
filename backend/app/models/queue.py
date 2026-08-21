from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.core.database import Base

class QueueStatus(str, enum.Enum):
    WAITING = "WAITING"
    CALLING = "CALLING"
    IN_CONSULTATION = "IN_CONSULTATION"
    COMPLETED = "COMPLETED"
    SKIPPED = "SKIPPED"

class QueueToken(Base):
    __tablename__ = "queue_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token_number = Column(String(20), nullable=False)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), nullable=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    department = Column(String(100), default="General OPD", nullable=False)
    priority = Column(String(20), default="NORMAL", nullable=False) # NORMAL, HIGH, EMERGENCY
    status = Column(SQLEnum(QueueStatus), default=QueueStatus.WAITING, nullable=False)
    position = Column(Integer, default=1, nullable=False)
    estimated_wait_minutes = Column(Integer, default=15, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    facility = relationship("Facility")
    appointment = relationship("Appointment", back_populates="queue_token")
    patient = relationship("Patient")
