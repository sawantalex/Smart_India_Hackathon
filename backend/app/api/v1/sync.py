from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.sync import SyncRequest, SyncResponse
from app.services.sync_service import SyncService

router = APIRouter(prefix="/sync", tags=["Offline Sync"])

@router.post("/", response_model=SyncResponse)
def synchronize_offline_queue(
    sync_req: SyncRequest,
    db: Session = Depends(get_db)
):
    return SyncService.process_sync_queue(db, sync_req)
