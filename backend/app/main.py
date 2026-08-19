from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.core.middleware import SecurityHeadersMiddleware
from app.api.v1.api_router import api_router
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.facility import Facility, HealthcareWorker
from app.core.security import get_password_hash

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json" if settings.ENVIRONMENT == "development" else None,
    docs_url=f"{settings.API_V1_STR}/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url=None
)

# CORS middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["*"],
    )

# Security headers middleware
app.add_middleware(SecurityHeadersMiddleware)

# Include v1 API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    # Create tables for development/testing
    Base.metadata.create_all(bind=engine)
    
    # Seed DEMO DATA safely using synthetic records
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            pw_hash = get_password_hash("password123")
            
            # Demo Patient
            patient_user = User(username="patient_demo", email="patient@example.com", phone="9876543210", hashed_password=pw_hash, role=UserRole.PATIENT)
            db.add(patient_user)
            db.commit()
            db.refresh(patient_user)
            
            patient_profile = Patient(user_id=patient_user.id, patient_code="PAT-DEMO-001", full_name="Ramesh Kumar (Demo)", age_group="18-59", preferred_language="hi", district="Pune", village_or_town="Shivajinagar")
            db.add(patient_profile)
            
            # Demo Facilities
            phc = Facility(
                name="Shivajinagar Primary Health Centre (PHC)",
                facility_type="PHC",
                services="General OPD, Maternal & Child Health, Basic First Aid",
                district="Pune",
                village_or_town="Shivajinagar",
                latitude=18.5308,
                longitude=73.8474,
                emergency_capable=False,
                is_verified=True,
                contact_phone="020-25500000",
                operating_hours="8:00 AM - 4:00 PM"
            )
            dh = Facility(
                name="Pune District Hospital & Emergency Trauma Centre",
                facility_type="District Hospital",
                services="24/7 ICU, Emergency Trauma, Surgery, Pediatrics, Oxygen",
                district="Pune",
                village_or_town="Aundh",
                latitude=18.5602,
                longitude=73.8031,
                emergency_capable=True,
                is_verified=True,
                contact_phone="020-27290000",
                operating_hours="24/7"
            )
            db.add_all([phc, dh])
            db.commit()
            db.refresh(phc)

            # Demo Health Worker
            worker_user = User(username="worker_demo", email="worker@example.com", phone="9876543211", hashed_password=pw_hash, role=UserRole.HEALTH_WORKER)
            db.add(worker_user)
            db.commit()
            db.refresh(worker_user)

            worker_profile = HealthcareWorker(user_id=worker_user.id, worker_code="HW-DEMO-001", full_name="Sunita Patil (ASHA Worker)", qualification="ASHA Worker", assigned_facility_id=phc.id, phone="9876543211")
            db.add(worker_profile)

            # Demo Admin
            admin_user = User(username="admin_demo", email="admin@example.com", phone="9876543212", hashed_password=pw_hash, role=UserRole.ADMIN)
            db.add(admin_user)
            db.commit()

    finally:
        db.close()

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "mode": "Preliminary Healthcare Access & Decision Support Prototype",
        "disclaimer": "This system is NOT a doctor and does NOT provide medical diagnosis."
    }
