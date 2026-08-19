from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User, UserRole
from app.models.referral import Referral, FollowUp
from app.schemas.referral import ReferralCreate, ReferralUpdate, ReferralResponse, FollowUpCreate
from app.services.referral_service import ReferralService
from app.services.audit_service import AuditService

router = APIRouter(prefix="/referrals", tags=["Referrals"])

@router.post("/", response_model=ReferralResponse, status_code=status.HTTP_201_CREATED)
def create_referral(
    referral_in: ReferralCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    referral = ReferralService.create_referral(db, referral_in)
    AuditService.log_event(
        db,
        actor_id=str(current_user.id),
        actor_role=current_user.role.value,
        action="REFERRAL_CREATED",
        resource=f"Referral:{referral.id}",
        result="SUCCESS"
    )
    return referral

@router.get("/", response_model=List[ReferralResponse])
def list_referrals(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == UserRole.PATIENT:
        # Patient can only see their own referrals
        from app.models.patient import Patient
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient:
            return []
        query = db.query(Referral).filter(Referral.patient_id == patient.id)
    else:
        query = db.query(Referral)

    if status_filter:
        query = query.filter(Referral.status == status_filter)

    return query.order_by(Referral.created_at.desc()).all()

@router.put("/{referral_id}", response_model=ReferralResponse)
def update_referral_status(
    referral_id: int,
    update_in: ReferralUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in [UserRole.HEALTH_WORKER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Forbidden: Only Healthcare Workers can update referral status")

    referral = ReferralService.update_referral(db, referral_id, update_in)
    if not referral:
        raise HTTPException(status_code=404, detail="Referral not found")

    AuditService.log_event(
        db,
        actor_id=str(current_user.id),
        actor_role=current_user.role.value,
        action="REFERRAL_UPDATED",
        resource=f"Referral:{referral_id}",
        result="SUCCESS"
    )
    return referral
