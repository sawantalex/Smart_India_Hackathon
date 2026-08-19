from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime

class SyncItem(BaseModel):
    client_tx_id: str
    entity_type: str # Patient, Assessment, Referral
    action_type: str # CREATE, UPDATE
    payload: Dict[str, Any]

class SyncRequest(BaseModel):
    device_id: str
    events: List[SyncItem]

class SyncResultItem(BaseModel):
    client_tx_id: str
    status: str # APPLIED, CONFLICT_RESOLVED, REJECTED
    message: Optional[str] = None
    server_id: Optional[int] = None

class SyncResponse(BaseModel):
    device_id: str
    results: List[SyncResultItem]
    synced_at: datetime
