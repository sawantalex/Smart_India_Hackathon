from typing import Dict, Tuple
from app.models.triage import UrgencyLevel
from app.schemas.symptom import SymptomInput
from app.services.red_flag_engine import RedFlagEngine

class TriageEngine:
    MODEL_VERSION = "rules_engine_v1.0_deterministic"

    @classmethod
    def evaluate(cls, symptom_input: SymptomInput) -> Tuple[UrgencyLevel, str, str, list, list]:
        """
        Evaluates input symptoms and determines risk category, explanation, and next steps.
        Returns: (risk_category, explanation, recommended_next_step, detected_symptoms, detected_red_flags)
        """
        is_emergency, red_flags = RedFlagEngine.evaluate(symptom_input)
        detected_symptoms = symptom_input.symptoms + symptom_input.associated_symptoms

        if is_emergency:
            explanation = (
                f"Potential emergency warning signs detected: {', '.join(red_flags)}. "
                "These symptoms can indicate a serious condition requiring immediate emergency medical evaluation."
            )
            next_step = (
                "SEEK IMMEDIATE EMERGENCY MEDICAL CARE. Contact your local emergency ambulance service (e.g., 108) "
                "or proceed immediately to the nearest Emergency capable Healthcare Facility. Do not wait."
            )
            return UrgencyLevel.EMERGENCY, explanation, next_step, detected_symptoms, red_flags

        # Severity & Duration logic
        severity = symptom_input.severity.upper()
        num_symptoms = len(detected_symptoms)

        if severity == "SEVERE" or num_symptoms >= 4 or (symptom_input.age_group in ["0-5", "60+"] and severity == "MODERATE"):
            risk_category = UrgencyLevel.HIGH
            explanation = (
                f"You reported {severity.lower()} symptoms ({', '.join(detected_symptoms)}) lasting {symptom_input.duration}. "
                "Prompt medical evaluation by a healthcare worker is recommended."
            )
            next_step = (
                "Please visit a nearby Primary Health Centre (PHC) or Community Health Centre (CHC) within 24 hours "
                "or consult a Healthcare Worker."
            )
        elif severity == "MODERATE" or num_symptoms >= 2:
            risk_category = UrgencyLevel.MODERATE
            explanation = (
                f"You reported moderate symptoms ({', '.join(detected_symptoms)}) over {symptom_input.duration}. "
                "These symptoms warrant medical observation and professional advice."
            )
            next_step = (
                "Consult with an ASHA worker, ANM, or local clinic for an evaluation if symptoms persist or worsen."
            )
        else:
            risk_category = UrgencyLevel.LOW
            explanation = (
                f"You reported mild symptoms ({', '.join(detected_symptoms)}) over {symptom_input.duration}. "
                "Based on available information, symptoms appear non-urgent at this time."
            )
            next_step = (
                "Monitor your condition. Rest, stay hydrated, and consult a healthcare worker if symptoms develop or worsen."
            )

        return risk_category, explanation, next_step, detected_symptoms, red_flags
