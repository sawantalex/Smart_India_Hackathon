from app.services.red_flag_engine import RedFlagEngine
from app.services.safe_ai_layer import SafeAILayer
from app.schemas.symptom import SymptomInput

def test_emergency_red_flag_evaluation():
    symptom_in = SymptomInput(
        symptoms=["severe chest pain", "shortness of breath"],
        duration="1 hour",
        severity="UNBEARABLE",
        age_group="18-59",
        confidence=1.0
    )
    is_emergency, flags = RedFlagEngine.evaluate(symptom_in)
    assert is_emergency is True
    assert "severe_chest_pain" in flags or "severe_breathing_difficulty" in flags

def test_triage_api_emergency_escalation(client, patient_token):
    symptom_data = {
        "symptoms": ["chest tightness", "gasping"],
        "duration": "30 mins",
        "severity": "UNBEARABLE",
        "age_group": "18-59",
        "confidence": 1.0
    }
    res = client.post(
        "/api/v1/triage/evaluate",
        json=symptom_data,
        headers={"Authorization": f"Bearer {patient_token}"}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["risk_category"] == "EMERGENCY"
    assert "EMERGENCY MEDICAL CARE" in data["recommended_next_step"]

def test_safe_ai_layer_blocks_prohibited_diagnosis():
    unsafe_text = "You have cancer and you must take 500mg of amoxicillin."
    sanitized, was_sanitized = SafeAILayer.validate_and_sanitize(unsafe_text)
    assert was_sanitized is True
    assert "cannot provide a medical diagnosis" in sanitized
    assert "cancer" not in sanitized
