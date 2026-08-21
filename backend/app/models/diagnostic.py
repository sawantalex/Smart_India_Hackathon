from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.core.database import Base

class DiagnosticStatus(str, enum.Enum):
    REQUESTED = "REQUESTED"
    SCHEDULED = "SCHEDULED"
    SAMPLE_COLLECTED = "SAMPLE_COLLECTED"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class FacilityDiagnosticAvailability(Base):
    __tablename__ = "facility_diagnostic_availability"

    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    test_name = Column(String(100), nullable=False) # CBC, X-Ray, Ultrasound, ECG, Blood Sugar
    category = Column(String(50), default="Pathology", nullable=False)
    is_available = Column(String(10), default="AVAILABLE", nullable=False) # AVAILABLE, UNAVAILABLE
    equipment_status = Column(String(100), default="OPERATIONAL", nullable=False)
    estimated_turnaround_hours = Column(Integer, default=24, nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    facility = relationship("Facility")

class DiagnosticOrder(Base):
    __tablename__ = "diagnostic_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_code = Column(String(30), unique=True, index=True, nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    ordered_by_worker_id = Column(Integer, ForeignKey("healthcare_workers.id"), nullable=True)
    test_name = Column(String(100), nullable=False)
    reason = Column(Text, nullable=True)
    status = Column(SQLEnum(DiagnosticStatus), default=DiagnosticStatus.REQUESTED, nullable=False)
    scheduled_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    patient = relationship("Patient", back_populates="diagnostic_orders")
    facility = relationship("Facility")
    worker = relationship("HealthcareWorker")
    results = relationship("DiagnosticResult", back_populates="order", cascade="all, delete-orphan")

class DiagnosticResult(Base):
    __tablename__ = "diagnostic_results"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("diagnostic_orders.id"), nullable=False)
    result_summary = Column(Text, nullable=False)
    reference_range = Column(String(100), nullable=True)
    is_abnormal = Column(String(10), default="FALSE", nullable=False)
    authorized_for_patient_view = Column(String(10), default="TRUE", nullable=False)
    recorded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    order = relationship("DiagnosticOrder", back_populates="results")
