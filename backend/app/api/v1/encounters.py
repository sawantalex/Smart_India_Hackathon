from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import uuid4
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.encounter import Encounter, EncounterType
from app.schemas.encounter import EncounterCreate, EncounterResponse, PatientTimelineResponse

router = APIRouter(prefix="/encounters", tags=["Encounters & Timeline"])

@router.post("", response_model=EncounterResponse)
def create_encounter(
    encounter_in: EncounterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.id == encounter_in.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    if current_user.role == UserRole.PATIENT and patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized patient record creation attempt")

    worker_id = None
    if current_user.role == UserRole.HEALTH_WORKER and hasattr(current_user, "worker_profile") and current_user.worker_profile:
        worker_id = current_user.worker_profile.id

    encounter_code = f"ENC-{uuid4().hex[:8].upper()}"
    encounter = Encounter(
        encounter_code=encounter_code,
        patient_id=patient.id,
        facility_id=encounter_in.facility_id,
        worker_id=worker_id,
        encounter_type=encounter_in.encounter_type,
        title=encounter_in.title,
        summary=encounter_in.summary,
        clinical_notes=encounter_in.clinical_notes,
        urgency=encounter_in.urgency
    )
    db.add(encounter)
    db.commit()
    db.refresh(encounter)

    res = EncounterResponse.from_orm(encounter)
    if encounter.facility:
        res.facility_name = encounter.facility.name
    return res

@router.get("/patient/{patient_id}", response_model=PatientTimelineResponse)
def get_patient_timeline(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if current_user.role == UserRole.PATIENT and patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied to patient timeline")

    encounters = db.query(Encounter).filter(Encounter.patient_id == patient_id).order_by(Encounter.created_at.desc()).all()
    encounter_responses = []
    for enc in encounters:
        res = EncounterResponse.from_orm(enc)
        if enc.facility:
            res.facility_name = enc.facility.name
        encounter_responses.append(res)

    return PatientTimelineResponse(
        patient_id=patient.id,
        patient_code=patient.patient_code,
        full_name=patient.full_name,
        encounters=encounter_responses
    )
