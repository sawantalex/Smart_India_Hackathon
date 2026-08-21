from typing import Dict, Any, List
from datetime import datetime

class FHIRAdapter:
    @staticmethod
    def to_fhir_patient(patient_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "resourceType": "Patient",
            "id": str(patient_data.get("patient_code", "PAT-001")),
            "identifier": [
                {
                    "system": "https://health.gov.in/abdm/abaha-id",
                    "value": patient_data.get("patient_code", "PAT-001")
                }
            ],
            "name": [
                {
                    "use": "official",
                    "text": patient_data.get("full_name", "Unknown")
                }
            ],
            "gender": patient_data.get("gender", "unknown").lower(),
            "address": [
                {
                    "district": patient_data.get("district", ""),
                    "city": patient_data.get("village_or_town", ""),
                    "state": "Maharashtra",
                    "country": "IND"
                }
            ],
            "communication": [
                {
                    "language": {
                        "coding": [
                            {
                                "system": "urn:ietf:bcp:47",
                                "code": patient_data.get("preferred_language", "hi")
                            }
                        ]
                    }
                }
            ]
        }

    @staticmethod
    def to_fhir_encounter(encounter_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "resourceType": "Encounter",
            "id": str(encounter_data.get("encounter_code", "ENC-001")),
            "status": "finished",
            "class": {
                "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                "code": "AMB",
                "display": "ambulatory"
            },
            "subject": {
                "reference": f"Patient/{encounter_data.get('patient_id')}"
            },
            "serviceProvider": {
                "display": encounter_data.get("facility_name", "Primary Health Centre")
            },
            "reasonCode": [
                {
                    "text": encounter_data.get("summary", "OPD Consultation")
                }
            ],
            "period": {
                "start": str(encounter_data.get("created_at", datetime.now().isoformat()))
            }
        }
