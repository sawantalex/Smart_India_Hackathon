from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class HealthcareWorker(Base):
    __tablename__ = "healthcare_workers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    worker_code = Column(String(30), unique=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    qualification = Column(String(100), nullable=True) # e.g., ASHA Worker, ANM, Medical Officer
    assigned_facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)
    phone = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="worker_profile")
    facility = relationship("Facility", back_populates="workers")
    assigned_referrals = relationship("Referral", back_populates="healthcare_worker")

class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    facility_type = Column(String(50), nullable=False) # Primary Health Centre (PHC), Community Health Centre (CHC), District Hospital
    services = Column(Text, nullable=False) # JSON/Comma-separated services
    district = Column(String(50), nullable=False)
    village_or_town = Column(String(50), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    emergency_capable = Column(Boolean, default=False, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    contact_phone = Column(String(20), nullable=False)
    operating_hours = Column(String(50), default="24/7", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    workers = relationship("HealthcareWorker", back_populates="facility")
    referrals = relationship("Referral", back_populates="facility")
