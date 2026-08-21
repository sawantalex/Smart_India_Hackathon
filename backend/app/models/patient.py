from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    patient_code = Column(String(30), unique=True, index=True, nullable=False) # Demo synthetic ID (e.g. PAT-2026-001)
    full_name = Column(String(100), nullable=False)
    age_group = Column(String(20), nullable=False) # e.g., "0-5", "6-17", "18-59", "60+"
    gender = Column(String(20), nullable=True)
    preferred_language = Column(String(10), default="hi", nullable=False) # hi, mr, en
    district = Column(String(50), nullable=True)
    village_or_town = Column(String(50), nullable=True)
    emergency_contact_phone = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="patient_profile")
    assessments = relationship("TriageAssessment", back_populates="patient", cascade="all, delete-orphan")
    consents = relationship("PatientConsent", back_populates="patient", cascade="all, delete-orphan")
    referrals = relationship("Referral", back_populates="patient", cascade="all, delete-orphan")
    encounters = relationship("Encounter", back_populates="patient", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="patient", cascade="all, delete-orphan")
    diagnostic_orders = relationship("DiagnosticOrder", back_populates="patient", cascade="all, delete-orphan")
    followups = relationship("HighRiskFollowUp", back_populates="patient", cascade="all, delete-orphan")
