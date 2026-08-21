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
from app.models.appointment import Appointment, AppointmentSlot, AppointmentStatus
from app.schemas.appointment import (
    AppointmentSlotResponse,
    AppointmentCreate,
    AppointmentResponse,
    AppointmentStatusUpdate
)

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.get("/slots/{facility_id}", response_model=List[AppointmentSlotResponse])
def list_facility_slots(facility_id: int, db: Session = Depends(get_db)):
    slots = db.query(AppointmentSlot).filter(
        AppointmentSlot.facility_id == facility_id,
        AppointmentSlot.is_active == "ACTIVE"
    ).all()
    return slots

@router.post("", response_model=AppointmentResponse)
def create_appointment(
    app_in: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient and current_user.role == UserRole.PATIENT:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    facility = db.query(Facility).filter(Facility.id == app_in.facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")

    target_patient_id = patient.id if patient else 1

    app_code = f"APT-{uuid4().hex[:8].upper()}"
    appointment = Appointment(
        appointment_code=app_code,
        patient_id=target_patient_id,
        facility_id=facility.id,
        slot_id=app_in.slot_id,
        department=app_in.department,
        appointment_date=app_in.appointment_date,
        reason=app_in.reason,
        status=AppointmentStatus.REQUESTED
    )
    db.add(appointment)

    if app_in.slot_id:
        slot = db.query(AppointmentSlot).filter(AppointmentSlot.id == app_in.slot_id).first()
        if slot:
            slot.booked_count += 1

    db.commit()
    db.refresh(appointment)

    res = AppointmentResponse.from_orm(appointment)
    res.facility_name = facility.name
    return res

@router.get("/patient/my", response_model=List[AppointmentResponse])
def get_my_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        return []

    apps = db.query(Appointment).filter(Appointment.patient_id == patient.id).order_by(Appointment.appointment_date.desc()).all()
    out = []
    for a in apps:
        r = AppointmentResponse.from_orm(a)
        if a.facility:
            r.facility_name = a.facility.name
        out.append(r)
    return out

@router.put("/{appointment_id}/status", response_model=AppointmentResponse)
def update_appointment_status(
    appointment_id: int,
    status_in: AppointmentStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appointment.status = status_in.status
    db.commit()
    db.refresh(appointment)

    res = AppointmentResponse.from_orm(appointment)
    if appointment.facility:
        res.facility_name = appointment.facility.name
    return res
