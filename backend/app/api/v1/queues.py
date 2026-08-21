from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import uuid4
from datetime import datetime, timezone
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.facility import Facility
from app.models.queue import QueueToken, QueueStatus
from app.schemas.queue import QueueTokenCreate, QueueTokenResponse, QueueStatusUpdate

router = APIRouter(prefix="/queues", tags=["Queue Management"])

@router.post("", response_model=QueueTokenResponse)
def create_queue_token(
    queue_in: QueueTokenCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    target_patient_id = patient.id if patient else 1

    facility = db.query(Facility).filter(Facility.id == queue_in.facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")

    existing_waiting = db.query(QueueToken).filter(
        QueueToken.facility_id == queue_in.facility_id,
        QueueToken.status == QueueStatus.WAITING
    ).count()

    token_number = f"T-{existing_waiting + 1:03d}"
    token = QueueToken(
        token_number=token_number,
        facility_id=facility.id,
        appointment_id=queue_in.appointment_id,
        patient_id=target_patient_id,
        department=queue_in.department,
        priority=queue_in.priority,
        status=QueueStatus.WAITING,
        position=existing_waiting + 1,
        estimated_wait_minutes=(existing_waiting + 1) * 10
    )
    db.add(token)
    db.commit()
    db.refresh(token)

    res = QueueTokenResponse.from_orm(token)
    res.facility_name = facility.name
    return res

@router.get("/patient/my", response_model=List[QueueTokenResponse])
def get_my_queue_tokens(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        return []

    tokens = db.query(QueueToken).filter(QueueToken.patient_id == patient.id).order_by(QueueToken.created_at.desc()).all()
    out = []
    for t in tokens:
        r = QueueTokenResponse.from_orm(t)
        if t.facility:
            r.facility_name = t.facility.name
        out.append(r)
    return out

@router.get("/facility/{facility_id}", response_model=List[QueueTokenResponse])
def get_facility_queue(
    facility_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tokens = db.query(QueueToken).filter(QueueToken.facility_id == facility_id).order_by(QueueToken.position.asc()).all()
    out = []
    for t in tokens:
        r = QueueTokenResponse.from_orm(t)
        if t.facility:
            r.facility_name = t.facility.name
        out.append(r)
    return out

@router.put("/{token_id}/status", response_model=QueueTokenResponse)
def update_queue_status(
    token_id: int,
    status_in: QueueStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    token = db.query(QueueToken).filter(QueueToken.id == token_id).first()
    if not token:
        raise HTTPException(status_code=404, detail="Queue token not found")

    token.status = status_in.status
    if status_in.priority:
        token.priority = status_in.priority
    db.commit()
    db.refresh(token)

    res = QueueTokenResponse.from_orm(token)
    if token.facility:
        res.facility_name = token.facility.name
    return res
