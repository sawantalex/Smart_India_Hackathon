from typing import List, Dict, Tuple
from app.schemas.symptom import SymptomInput

# Deterministic Red Flag keywords and emergency indicators
RED_FLAG_KEYWORDS = {
    "severe_breathing_difficulty": [
        "shortness of breath", "gasping", "cannot breathe", "breathing difficulty",
        "breathlessness", "saans lene me taklif", "saans phoolna", "saas ghenyas tras"
    ],
    "severe_chest_pain": [
        "chest pain", "chest tightness", "chest pressure", "heart attack",
        "seene me dard", "chaatit dukhane", "seene me dabav"
    ],
    "unconsciousness": [
        "unconscious", "fainted", "blackout", "passed out", "behosh", "befud"
    ],
    "seizure": [
        "seizure", "convulsions", "fits", "daura", "jhatke"
    ],
    "severe_bleeding": [
        "uncontrolled bleeding", "heavy bleeding", "bleeding heavily", "khoon behna", "raktasrav"
    ],
    "stroke_signs": [
        "face drooping", "arm weakness", "slurred speech", "sudden weakness", "sudden paralysis",
        "ek taraf kamzori", "bolne me taklif"
    ],
    "severe_allergic_reaction": [
        "anaphylaxis", "swollen tongue", "swollen throat", "throat closing", "gala soojna"
    ],
    "poisoning_or_snakebite": [
        "poison", "snake bite", "snakebite", "saamp kaatna", "cheel", "zehar"
    ],
    "self_harm": [
        "suicidal", "self harm", "want to die", "aatmhatya", "khudkushi"
    ]
}

class RedFlagEngine:
    @staticmethod
    def evaluate(symptom_input: SymptomInput) -> Tuple[bool, List[str]]:
        """
        Deterministic safety check.
        Returns: (is_emergency, list_of_detected_red_flags)
        """
        detected_flags = []
        
        # 1. Explicit red_flags provided in input
        if symptom_input.red_flags:
            detected_flags.extend(symptom_input.red_flags)

        # 2. Check symptom strings against keyword triggers
        all_symptom_texts = " ".join(symptom_input.symptoms + symptom_input.associated_symptoms).lower()
        if symptom_input.raw_transcript:
            all_symptom_texts += " " + symptom_input.raw_transcript.lower()

        for category, keywords in RED_FLAG_KEYWORDS.items():
            for kw in keywords:
                if kw in all_symptom_texts and category not in detected_flags:
                    detected_flags.append(category)
                    break

        # 3. Vulnerable age group + severe indicators
        if symptom_input.age_group in ["0-5", "60+"] and symptom_input.severity == "UNBEARABLE":
            if "vulnerable_severe_distress" not in detected_flags:
                detected_flags.append("vulnerable_severe_distress")

        is_emergency = len(detected_flags) > 0
        return is_emergency, detected_flags
