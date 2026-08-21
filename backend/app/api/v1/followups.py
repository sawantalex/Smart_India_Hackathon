from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import uuid4
from datetime import datetime, timezone
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.followup import HighRiskFollowUp, FollowUpCategory, FollowUpStatus
from app.schemas.followup import HighRiskFollowUpCreate, HighRiskFollowUpResponse, HighRiskFollowUpStatusUpdate

router = APIRouter(prefix="/followups", tags=["High-Risk Follow-up"])

@router.post("", response_model=HighRiskFollowUpResponse)
def create_high_risk_followup(
    followup_in: HighRiskFollowUpCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.id == followup_in.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    worker_id = None
    if current_user.role == UserRole.HEALTH_WORKER and hasattr(current_user, "worker_profile") and current_user.worker_profile:
        worker_id = current_user.worker_profile.id

    followup_code = f"FLP-{uuid4().hex[:8].upper()}"
    followup = HighRiskFollowUp(
        followup_code=followup_code,
        patient_id=patient.id,
        assigned_worker_id=worker_id,
        facility_id=followup_in.facility_id,
        category=followup_in.category,
        priority=followup_in.priority,
        scheduled_date=followup_in.scheduled_date,
        reason=followup_in.reason,
        contact_method=followup_in.contact_method,
        status=FollowUpStatus.PENDING
    )
    db.add(followup)
    db.commit()
    db.refresh(followup)

    return HighRiskFollowUpResponse.from_orm(followup)

@router.get("/worker/pending", response_model=List[HighRiskFollowUpResponse])
def get_worker_pending_followups(
    category: Optional[FollowUpCategory] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(HighRiskFollowUp)
    if category:
        query = query.filter(HighRiskFollowUp.category == category)

    followups = query.order_by(HighRiskFollowUp.scheduled_date.asc()).all()
    return [HighRiskFollowUpResponse.from_orm(f) for f in followups]

@router.put("/{followup_id}/status", response_model=HighRiskFollowUpResponse)
def update_followup_status(
    followup_id: int,
    status_in: HighRiskFollowUpStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    followup = db.query(HighRiskFollowUp).filter(HighRiskFollowUp.id == followup_id).first()
    if not followup:
        raise HTTPException(status_code=404, detail="Followup task not found")

    followup.status = status_in.status
    if status_in.notes:
        followup.notes = status_in.notes

    db.commit()
    db.refresh(followup)

    return HighRiskFollowUpResponse.from_orm(followup)
