from sqlalchemy import Column, Integer, String, DateTime, Text, JSON
from datetime import datetime, timezone
from app.core.database import Base

class SyncEvent(Base):
    __tablename__ = "sync_events"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String(100), nullable=False)
    client_tx_id = Column(String(100), unique=True, index=True, nullable=False)
    entity_type = Column(String(50), nullable=False) # Patient, Assessment, Referral, WorkerNote
    action_type = Column(String(20), nullable=False) # CREATE, UPDATE
    payload = Column(JSON, nullable=False)
    status = Column(String(20), default="APPLIED", nullable=False) # APPLIED, CONFLICT_RESOLVED, REJECTED
    conflict_details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
