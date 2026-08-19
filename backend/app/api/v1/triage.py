from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.triage import TriageAssessment, UrgencyLevel
from app.schemas.symptom import SymptomInput
from app.schemas.triage import TriageAssessmentResponse, AssessmentOverrideRequest
from app.services.triage_engine import TriageEngine
from app.services.safe_ai_layer import SafeAILayer
from app.services.audit_service import AuditService

router = APIRouter(prefix="/triage", tags=["Triage Engine"])

@router.post("/evaluate", response_model=TriageAssessmentResponse)
def evaluate_symptoms(
    symptom_in: SymptomInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Retrieve patient profile
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        # Fallback patient check or auto-create demo profile
        patient = db.query(Patient).first()
        if not patient:
            raise HTTPException(status_code=400, detail="No active patient profile found for triage")

    # Evaluate triage & red flags
    risk_cat, explanation, next_step, symptoms, red_flags = TriageEngine.evaluate(symptom_in)

    # Sanitize outputs through Safe AI Layer
    sanitized_exp, _ = SafeAILayer.validate_and_sanitize(explanation)
    sanitized_next, _ = SafeAILayer.validate_and_sanitize(next_step)

    assessment = TriageAssessment(
        patient_id=patient.id,
        input_symptoms=symptom_in.dict(),
        detected_symptoms=symptoms,
        detected_red_flags=red_flags,
        risk_category=risk_cat,
        explanation=sanitized_exp,
        recommended_next_step=sanitized_next,
        confidence_score=symptom_in.confidence,
        model_version=TriageEngine.MODEL_VERSION,
        is_worker_overridden=False
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    AuditService.log_event(
        db,
        actor_id=str(current_user.id),
        actor_role=current_user.role.value,
        action="TRIAGE_EVALUATION",
        resource=f"Assessment:{assessment.id}",
        result="SUCCESS",
        details={"risk_category": risk_cat.value, "red_flags_count": len(red_flags)}
    )

    return assessment

@router.post("/{assessment_id}/override", response_model=TriageAssessmentResponse)
def override_assessment(
    assessment_id: int,
    override_in: AssessmentOverrideRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # RBAC: Only HEALTH_WORKER or ADMIN can override triage assessments
    if current_user.role not in [UserRole.HEALTH_WORKER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Forbidden: Only Healthcare Workers can override triage assessments")

    assessment = db.query(TriageAssessment).filter(TriageAssessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment record not found")

    assessment.is_worker_overridden = True
    assessment.worker_override_category = override_in.worker_override_category
    assessment.worker_notes = override_in.worker_notes
    db.commit()
    db.refresh(assessment)

    AuditService.log_event(
        db,
        actor_id=str(current_user.id),
        actor_role=current_user.role.value,
        action="TRIAGE_OVERRIDE",
        resource=f"Assessment:{assessment.id}",
        result="SUCCESS",
        details={"new_category": override_in.worker_override_category.value, "notes": override_in.worker_notes}
    )

    return assessment

@router.get("/history/{patient_id}", response_model=List[TriageAssessmentResponse])
def get_patient_triage_history(
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Strict IDOR check
    if current_user.role == UserRole.PATIENT and patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden: Cannot access another patient's triage history")

    assessments = db.query(TriageAssessment).filter(TriageAssessment.patient_id == patient_id).order_by(TriageAssessment.created_at.desc()).all()
    return assessments
