import uuid
from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.referral import Referral, ReferralStatus, FollowUp
from app.models.triage import UrgencyLevel
from app.schemas.referral import ReferralCreate, ReferralUpdate

class ReferralService:
    @staticmethod
    def create_referral(db: Session, referral_in: ReferralCreate) -> Referral:
        referral_code = f"REF-{uuid.uuid4().hex[:8].upper()}"
        db_referral = Referral(
            referral_code=referral_code,
            patient_id=referral_in.patient_id,
            assessment_id=referral_in.assessment_id,
            facility_id=referral_in.facility_id,
            urgency=referral_in.urgency,
            reason=referral_in.reason,
            status=ReferralStatus.PENDING,
            notes=referral_in.notes
        )
        db.add(db_referral)
        db.commit()
        db.refresh(db_referral)
        return db_referral

    @staticmethod
    def update_referral(db: Session, referral_id: int, update_in: ReferralUpdate) -> Optional[Referral]:
        db_referral = db.query(Referral).filter(Referral.id == referral_id).first()
        if not db_referral:
            return None

        if update_in.status:
            db_referral.status = update_in.status
        if update_in.assigned_worker_id:
            db_referral.assigned_worker_id = update_in.assigned_worker_id
        if update_in.notes:
            db_referral.notes = update_in.notes

        db.commit()
        db.refresh(db_referral)
        return db_referral
