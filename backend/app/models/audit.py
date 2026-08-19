from sqlalchemy import Column, Integer, String, DateTime, Text, JSON
from datetime import datetime, timezone
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(String(50), nullable=False) # User ID or SYSTEM
    actor_role = Column(String(30), nullable=False)
    action = Column(String(100), nullable=False) # e.g. LOGIN, ASSESSMENT_CREATED, OVERRIDE_APPLIED
    resource = Column(String(100), nullable=False) # e.g. Patient:123
    result = Column(String(20), nullable=False) # SUCCESS, FAILURE, FORBIDDEN
    details = Column(JSON, nullable=True)
    request_id = Column(String(50), nullable=True)
    ip_address = Column(String(45), nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
