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
from app.models.diagnostic import (
    DiagnosticOrder,
    DiagnosticResult,
    FacilityDiagnosticAvailability,
    DiagnosticStatus
)
from app.schemas.diagnostic import (
    DiagnosticOrderCreate,
    DiagnosticOrderResponse,
    DiagnosticResultCreate,
    DiagnosticResultResponse,
    FacilityDiagnosticAvailabilityResponse
)

router = APIRouter(prefix="/diagnostics", tags=["Diagnostic Coordination"])

@router.get("/availability/{facility_id}", response_model=List[FacilityDiagnosticAvailabilityResponse])
def get_facility_diagnostic_availability(facility_id: int, db: Session = Depends(get_db)):
    availability = db.query(FacilityDiagnosticAvailability).filter(
        FacilityDiagnosticAvailability.facility_id == facility_id
    ).all()
    return availability

@router.post("/orders", response_model=DiagnosticOrderResponse)
def create_diagnostic_order(
    order_in: DiagnosticOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    target_patient_id = patient.id if patient else 1

    facility = db.query(Facility).filter(Facility.id == order_in.facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")

    worker_id = None
    if current_user.role == UserRole.HEALTH_WORKER and hasattr(current_user, "worker_profile") and current_user.worker_profile:
        worker_id = current_user.worker_profile.id

    order_code = f"DIAG-{uuid4().hex[:8].upper()}"
    order = DiagnosticOrder(
        order_code=order_code,
        patient_id=target_patient_id,
        facility_id=facility.id,
        ordered_by_worker_id=worker_id,
        test_name=order_in.test_name,
        reason=order_in.reason,
        status=DiagnosticStatus.REQUESTED
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    res = DiagnosticOrderResponse.from_orm(order)
    res.facility_name = facility.name
    return res

@router.get("/orders/patient/my", response_model=List[DiagnosticOrderResponse])
def get_my_diagnostic_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        return []

    orders = db.query(DiagnosticOrder).filter(DiagnosticOrder.patient_id == patient.id).order_by(DiagnosticOrder.created_at.desc()).all()
    out = []
    for o in orders:
        r = DiagnosticOrderResponse.from_orm(o)
        if o.facility:
            r.facility_name = o.facility.name
        out.append(r)
    return out

@router.post("/orders/{order_id}/results", response_model=DiagnosticResultResponse)
def add_diagnostic_result(
    order_id: int,
    result_in: DiagnosticResultCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = db.query(DiagnosticOrder).filter(DiagnosticOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Diagnostic order not found")

    result = DiagnosticResult(
        order_id=order.id,
        result_summary=result_in.result_summary,
        reference_range=result_in.reference_range,
        is_abnormal=result_in.is_abnormal,
        authorized_for_patient_view=result_in.authorized_for_patient_view
    )
    db.add(result)
    order.status = DiagnosticStatus.COMPLETED
    db.commit()
    db.refresh(result)

    return DiagnosticResultResponse.from_orm(result)
