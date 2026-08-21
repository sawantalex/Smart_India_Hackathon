from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.core.database import Base

class MedicineAvailabilityStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    LIMITED = "LIMITED"
    UNAVAILABLE = "UNAVAILABLE"

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False) # e.g. Paracetamol, ORS, Amoxicillin, Iron Folic Acid
    generic_name = Column(String(100), nullable=False)
    category = Column(String(50), default="Essential Medicine", nullable=False)
    dosage_form = Column(String(50), default="Tablet", nullable=False) # Tablet, Syrup, Injection, Ointment
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    stocks = relationship("MedicineStock", back_populates="medicine", cascade="all, delete-orphan")

class MedicineStock(Base):
    __tablename__ = "medicine_stocks"

    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=False)
    status = Column(SQLEnum(MedicineAvailabilityStatus), default=MedicineAvailabilityStatus.AVAILABLE, nullable=False)
    quantity_range = Column(String(50), default="500+ units", nullable=True) # Detailed range for health workers
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    facility = relationship("Facility")
    medicine = relationship("Medicine", back_populates="stocks")
