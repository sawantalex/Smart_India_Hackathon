from typing import Dict, Tuple
from app.models.triage import UrgencyLevel
from app.schemas.symptom import SymptomInput
from app.services.red_flag_engine import RedFlagEngine, HIGH_RISK_KEYWORDS, MILD_KEYWORDS

class TriageEngine:
    MODEL_VERSION = "rules_engine_v1.2_multilingual_dynamic"

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
                "These symptoms indicate a critical condition requiring immediate emergency medical evaluation."
            )
            next_step = (
                "SEEK IMMEDIATE EMERGENCY MEDICAL CARE. Contact your local emergency ambulance service (108) "
                "or proceed immediately to the nearest Emergency capable Healthcare Facility. Do not wait."
            )
            return UrgencyLevel.EMERGENCY, explanation, next_step, detected_symptoms, red_flags

        # Dynamic Text Severity Analysis
        combined_text = (" ".join(detected_symptoms) + " " + (symptom_input.raw_transcript or "")).lower()
        severity = symptom_input.severity.upper()
        num_symptoms = len(detected_symptoms)

        # Detect high-risk or severe keywords in raw transcript
        has_high_risk_keyword = any(kw in combined_text for kw in HIGH_RISK_KEYWORDS)
        has_mild_keyword = any(kw in combined_text for kw in MILD_KEYWORDS) and not has_high_risk_keyword

        # Risk Decision Matrix
        if severity in ["SEVERE", "UNBEARABLE"] or has_high_risk_keyword or num_symptoms >= 4 or (symptom_input.age_group in ["0-5", "60+"] and severity == "MODERATE"):
            risk_category = UrgencyLevel.HIGH
            explanation = (
                f"High-urgency symptom pattern evaluated ({', '.join(detected_symptoms)}) over {symptom_input.duration}. "
                "Prompt medical evaluation by a healthcare professional is strongly advised within 24 hours."
            )
            next_step = (
                "Please visit a nearby Primary Health Centre (PHC) or Community Health Centre (CHC) within 24 hours "
                "or request an urgent ASHA worker home visit."
            )
        elif (has_mild_keyword or severity == "MILD") and num_symptoms <= 1 and not has_high_risk_keyword:
            risk_category = UrgencyLevel.LOW
            explanation = (
                f"Mild, self-limiting symptom pattern reported ({', '.join(detected_symptoms)}) over {symptom_input.duration}. "
                "Based on rule evaluation, symptoms appear non-urgent at this time."
            )
            next_step = (
                "Monitor your condition. Rest, maintain hydration, and consult an ASHA worker if symptoms worsen."
            )
        else:
            risk_category = UrgencyLevel.MODERATE
            explanation = (
                f"Moderate symptom indicators evaluated ({', '.join(detected_symptoms)}) over {symptom_input.duration}. "
                "These symptoms warrant medical observation and professional advice."
            )
            next_step = (
                "Consult with an ASHA worker, ANM, or local clinic for an evaluation if symptoms persist or worsen."
            )

        return risk_category, explanation, next_step, detected_symptoms, red_flags
