from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import uuid4
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.facility import Facility
from app.models.consultation import ConsultationSession, ConsultationStatus
from app.schemas.consultation import ConsultationCreate, ConsultationResponse, ConsultationSummaryUpdate
from app.services.safe_ai_layer import SafeAILayer

router = APIRouter(prefix="/consultations", tags=["Teleconsultation Workflow"])

@router.post("", response_model=ConsultationResponse)
def create_consultation(
    cons_in: ConsultationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    target_patient_id = patient.id if patient else 1

    facility = db.query(Facility).filter(Facility.id == cons_in.facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")

    session_code = f"TELE-{uuid4().hex[:8].upper()}"
    
    ai_summary_raw = f"[AI-generated summary]: Patient requested consultation for '{cons_in.reason}'. Needs review by qualified clinician."
    sanitized_summary, _ = SafeAILayer.validate_and_sanitize(ai_summary_raw)

    session = ConsultationSession(
        session_code=session_code,
        patient_id=target_patient_id,
        facility_id=facility.id,
        specialty=cons_in.specialty,
        status=ConsultationStatus.REQUESTED,
        reason=cons_in.reason,
        clinical_summary=sanitized_summary,
        is_ai_generated_summary="TRUE"
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    res = ConsultationResponse.from_orm(session)
    res.facility_name = facility.name
    return res

@router.get("/patient/my", response_model=List[ConsultationResponse])
def get_my_consultations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        return []

    sessions = db.query(ConsultationSession).filter(ConsultationSession.patient_id == patient.id).order_by(ConsultationSession.created_at.desc()).all()
    out = []
    for s in sessions:
        r = ConsultationResponse.from_orm(s)
        if s.facility:
            r.facility_name = s.facility.name
        out.append(r)
    return out

@router.put("/{session_id}/summary", response_model=ConsultationResponse)
def update_consultation_summary(
    session_id: int,
    summary_in: ConsultationSummaryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(ConsultationSession).filter(ConsultationSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Consultation session not found")

    sanitized, _ = SafeAILayer.validate_and_sanitize(summary_in.clinical_summary)
    session.clinical_summary = sanitized
    session.is_ai_generated_summary = summary_in.is_ai_generated_summary
    if summary_in.clinician_notes:
        session.clinician_notes = summary_in.clinician_notes
    if summary_in.status:
        session.status = summary_in.status

    db.commit()
    db.refresh(session)

    res = ConsultationResponse.from_orm(session)
    if session.facility:
        res.facility_name = session.facility.name
    return res
