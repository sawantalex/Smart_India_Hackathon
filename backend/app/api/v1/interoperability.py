from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.patient import Patient
from app.models.encounter import Encounter
from app.integrations.fhir.adapter import FHIRAdapter
from app.integrations.abdm.adapter import ABDMAdapter

router = APIRouter(prefix="/interoperability", tags=["Interoperability Adapter"])

@router.get("/fhir/patient/{patient_id}")
def get_fhir_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    patient_dict = {
        "patient_code": patient.patient_code,
        "full_name": patient.full_name,
        "gender": patient.gender or "unknown",
        "district": patient.district or "",
        "village_or_town": patient.village_or_town or "",
        "preferred_language": patient.preferred_language
    }
    return FHIRAdapter.to_fhir_patient(patient_dict)

@router.get("/fhir/encounter/{encounter_id}")
def get_fhir_encounter(encounter_id: int, db: Session = Depends(get_db)):
    encounter = db.query(Encounter).filter(Encounter.id == encounter_id).first()
    if not encounter:
        raise HTTPException(status_code=404, detail="Encounter not found")

    enc_dict = {
        "encounter_code": encounter.encounter_code,
        "patient_id": encounter.patient_id,
        "facility_name": encounter.facility.name if encounter.facility else "Health Facility",
        "summary": encounter.summary,
        "created_at": encounter.created_at.isoformat()
    }
    return FHIRAdapter.to_fhir_encounter(enc_dict)

@router.get("/abdm/verify/{abha_number}")
def verify_abha_sandbox(abha_number: str):
    return ABDMAdapter.verify_abha_number_mock(abha_number)
