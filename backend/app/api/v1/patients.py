from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.consent import PatientConsent
from app.schemas.patient import PatientCreate, PatientResponse, PatientBase
from app.schemas.consent import PatientConsentCreate, PatientConsentResponse
from app.services.audit_service import AuditService

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("/me", response_model=PatientResponse)
def get_my_patient_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
    return patient

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient_by_id(patient_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Strict IDOR Protection: Patient can only access their own profile
    if current_user.role == UserRole.PATIENT and patient.user_id != current_user.id:
        AuditService.log_event(db, actor_id=str(current_user.id), actor_role=current_user.role.value, action="IDOR_ATTEMPT", resource=f"Patient:{patient_id}", result="FORBIDDEN")
        raise HTTPException(status_code=403, detail="Forbidden: You can only access your own medical profile")

    AuditService.log_event(db, actor_id=str(current_user.id), actor_role=current_user.role.value, action="VIEW_PATIENT", resource=f"Patient:{patient_id}", result="SUCCESS")
    return patient

@router.post("/{patient_id}/consent", response_model=PatientConsentResponse)
def grant_or_update_consent(
    patient_id: int,
    consent_in: PatientConsentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if current_user.role == UserRole.PATIENT and patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden: Unauthorized consent update")

    consent = PatientConsent(
        patient_id=patient_id,
        consent_version=consent_in.consent_version,
        purpose=consent_in.purpose,
        granted=True
    )
    db.add(consent)
    db.commit()
    db.refresh(consent)
    return consent
