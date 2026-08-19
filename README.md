# AI-Powered Multilingual Rural Healthcare Access, Triage and Referral System

Production-grade, multilingual, voice-first, and offline-capable rural healthcare triage and referral platform built for low-bandwidth environments.

---

## 🌟 Key Features

1. **Multilingual Voice Triage**: Voice-first symptom recording in **Hindi**, **Marathi**, and **English** using Web Speech API with confidence scoring and fallback audio synth.
2. **Deterministic Red-Flag Safety Engine**: Instant emergency escalation for acute symptoms (chest pain, severe dyspnea, trauma) triggering direct 108 ambulance calls and 24/7 trauma clinic navigation.
3. **Clinician Human-in-the-Loop**: Healthcare worker (ASHA / PHC) portal allowing risk classification overrides, clinical notes, referral creation, and home follow-up scheduling.
4. **Offline Sync & Idempotency**: Offline queueing using IndexedDB (`idb`) with idempotent sync transaction processing for low-connectivity rural health posts.
5. **Security & Privacy**: Strict Role-Based Access Control (RBAC), Insecure Direct Object Reference (IDOR) prevention, audit trail logging, and de-identification cohort thresholds ($N \ge 5$).

---

## 📁 Repository Structure

```
HIS/
├── backend/                  # FastAPI Python Application
│   ├── app/
│   │   ├── api/v1/          # REST Endpoints (Auth, Patients, Triage, Facilities, Referrals, Sync, Analytics, Audit)
│   │   ├── core/            # Config, Security, DB session
│   │   ├── models/          # SQLAlchemy ORM Data Models
│   │   ├── schemas/         # Pydantic Request/Response Schemas
│   │   └── services/        # Business Logic (RedFlagEngine, SafeAILayer, TriageService, etc.)
│   ├── tests/               # Pytest Automated Test Suite (100% Pass Rate)
│   └── requirements.txt     # Python Dependencies
├── frontend/                 # React + Vite + TypeScript Application
│   ├── src/
│   │   ├── components/      # Header, OfflineBanner, VoiceAssistant
│   │   ├── context/         # AuthContext, LanguageContext
│   │   ├── i18n/            # Hindi, Marathi, English Translations
│   │   ├── offline/         # IndexedDB Storage Module
│   │   ├── pages/           # 24 Core UI Screens
│   │   └── services/        # ApiService, VoiceService
│   ├── package.json
│   └── vite.config.ts
├── AI_SAFETY.md              # Medical Safety & Guardrails Specification
├── SECURITY.md               # Security, RBAC & Privacy Specification
└── DEPLOYMENT.md             # Local Deployment Guide
```

---

## 🚀 Quick Start

Refer to [DEPLOYMENT.md](file:///d:/HIS/DEPLOYMENT.md) for full instructions.

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`
