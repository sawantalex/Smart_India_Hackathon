from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class PatientConsent(Base):
    __tablename__ = "patient_consents"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    consent_version = Column(String(20), default="v1.0", nullable=False)
    purpose = Column(String(100), nullable=False) # e.g. "Triage assessment and referral management"
    granted = Column(Boolean, default=True, nullable=False)
    granted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    withdrawn_at = Column(DateTime, nullable=True)
    ip_address = Column(String(45), nullable=True)

    patient = relationship("Patient", back_populates="consents")
