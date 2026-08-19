from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from app.models.audit import AuditLog

class AuditService:
    @staticmethod
    def log_event(
        db: Session,
        actor_id: str,
        actor_role: str,
        action: str,
        resource: str,
        result: str,
        details: Optional[Dict[str, Any]] = None,
        request_id: Optional[str] = None,
        ip_address: Optional[str] = None
    ) -> AuditLog:
        audit_entry = AuditLog(
            actor_id=str(actor_id),
            actor_role=actor_role,
            action=action,
            resource=resource,
            result=result,
            details=details,
            request_id=request_id,
            ip_address=ip_address
        )
        db.add(audit_entry)
        db.commit()
        return audit_entry
