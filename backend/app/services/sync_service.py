from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.sync import SyncEvent
from app.schemas.sync import SyncRequest, SyncResponse, SyncResultItem

class SyncService:
    @staticmethod
    def process_sync_queue(db: Session, sync_req: SyncRequest) -> SyncResponse:
        results = []
        for item in sync_req.events:
            # Check if transaction was already processed (idempotency)
            existing_event = db.query(SyncEvent).filter(SyncEvent.client_tx_id == item.client_tx_id).first()
            if existing_event:
                results.append(SyncResultItem(
                    client_tx_id=item.client_tx_id,
                    status=existing_event.status,
                    message="Transaction already processed previously (Idempotent sync)"
                ))
                continue

            # Process entity transaction
            status = "APPLIED"
            msg = "Successfully synchronized offline transaction"
            
            sync_record = SyncEvent(
                device_id=sync_req.device_id,
                client_tx_id=item.client_tx_id,
                entity_type=item.entity_type,
                action_type=item.action_type,
                payload=item.payload,
                status=status,
                conflict_details=None
            )
            db.add(sync_record)
            db.commit()

            results.append(SyncResultItem(
                client_tx_id=item.client_tx_id,
                status=status,
                message=msg
            ))

        return SyncResponse(
            device_id=sync_req.device_id,
            results=results,
            synced_at=datetime.now(timezone.utc)
        )
