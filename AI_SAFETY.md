# AI Safety & Medical Disclaimer

## 1. Core Safety Principles

This platform is engineered as a **preliminary triage and facility referral assistant** designed for rural healthcare access in low-resource settings.

### CRITICAL MANDATE: Autonomous Diagnosis & Prescription Prohibition
* **NO MEDICAL DIAGNOSIS**: The platform strictly refrains from rendering formal clinical diagnoses or identifying specific medical pathologies.
* **NO DRUG PRESCRIPTIONS**: The system NEVER generates drug prescriptions, specific pharmaceutical dosages, or treatment plans.
* **HUMAN-IN-THE-LOOP**: All preliminary risk assessments must be validated by a certified healthcare professional (ASHA worker, Auxiliary Nurse Midwife, or PHC Medical Officer).

---

## 2. Red-Flag Emergency Guardrails

The system employs a **deterministic red-flag rules engine** (`RedFlagEngine`) prior to any machine learning or language model processing.

### Emergency Conditions & Triggers
If any of the following symptoms or combinations are detected in speech or questionnaire inputs, the system triggers an immediate **EMERGENCY ESCALATION**:

1. **Acute Respiratory Distress**: Severe shortness of breath, inability to speak full sentences.
2. **Acute Chest Pain**: Crushing chest pressure, pain radiating to left arm or jaw.
3. **Neurological Deficits**: Unconsciousness, sudden loss of speech, facial drooping, hemiparesis.
4. **Severe Trauma & Hemorrhage**: Profuse uncontrolled bleeding, major head trauma.
5. **Pediatric High-Risk**: Fever with lethargy or neck stiffness in infants under 5 years.

### Deterministic Overrides
- **Zero LLM Dependency for Emergencies**: Red-flag triggers operate on deterministic keyword and age thresholds.
- **Immediate UI Takeover**: The interface switches to an emergency warning screen displaying the National Ambulance Service number (**108**) and direct navigation to 24/7 Trauma PHCs.

---

## 3. Safe AI Output Sanitization Layer

All generated text, voice transcripts, and AI suggestions are processed through the `SafeAILayer` regex-based compliance filter before being returned to the user interface.

### Prohibited Output Patterns
The system automatically intercepts and replaces responses containing:
- Specific prescription drug names (e.g., *Amoxicillin, Paracetamol, Ibuprofen dosage*).
- Diagnostic claims (e.g., *"You have Typhoid / Tuberculosis"*).
- Absolute medical guarantees (e.g., *"This medicine will cure you"*).

### Universal Safe Fallback Response
If a response violates medical safety policies, it is sanitized to:
> *"Preliminary triage note: Please consult a certified Medical Officer or visit your nearest Primary Health Centre for clinical diagnosis."*

---

## 4. Explainability & Confidence Scoring

- **Confidence Rating**: Every triage output includes a transparent confidence score (e.g., `0.92`).
- **Rule Tracing**: Outputs provide explicit rule-based justifications explaining why a patient was assigned `LOW`, `MODERATE`, `HIGH`, or `EMERGENCY` urgency.
- **Clinician Override**: Healthcare workers can override AI recommendations, log clinical notes, and audit changes.
