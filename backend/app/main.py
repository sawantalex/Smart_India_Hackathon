from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
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
    openapi_url=f"{settings.API_V1_STR}/openapi.json" if settings.ENVIRONMENT == "development" else "/openapi.json",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else "/docs",
    redoc_url=None
)

# Redirect alternative docs paths to /docs to prevent 404 Not Found errors
@app.get("/api/docs", include_in_schema=False)
@app.get("/api/v1/docs", include_in_schema=False)
def redirect_to_docs():
    return RedirectResponse(url="/docs")

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
        pw_hash = get_password_hash("password123")
        admin_pw_hash = get_password_hash("admin")
        
        # Ensure 'admin' user exists with password 'admin'
        existing_admin = db.query(User).filter(User.username == "admin").first()
        if not existing_admin:
            admin_user = User(username="admin", email="admin@example.com", phone="9876543212", hashed_password=admin_pw_hash, role=UserRole.ADMIN)
            db.add(admin_user)
            db.commit()
        else:
            existing_admin.hashed_password = admin_pw_hash
            db.commit()

        # Ensure 'admin_demo' user exists with password 'admin'
        existing_admin_demo = db.query(User).filter(User.username == "admin_demo").first()
        if not existing_admin_demo:
            admin_demo_user = User(username="admin_demo", email="admin_demo@example.com", phone="9876543213", hashed_password=admin_pw_hash, role=UserRole.ADMIN)
            db.add(admin_demo_user)
            db.commit()
        else:
            existing_admin_demo.hashed_password = admin_pw_hash
            db.commit()

        if db.query(User).filter(User.username == "patient_demo").count() == 0:
            patient_user = User(username="patient_demo", email="patient@example.com", phone="9876543210", hashed_password=pw_hash, role=UserRole.PATIENT)
            db.add(patient_user)
            db.commit()
            db.refresh(patient_user)
            
            patient_profile = Patient(user_id=patient_user.id, patient_code="PAT-DEMO-001", full_name="Ramesh Kumar (Demo)", age_group="18-59", preferred_language="hi", district="Pune", village_or_town="Shivajinagar")
            db.add(patient_profile)

        if db.query(Facility).count() == 0:
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

        if db.query(User).filter(User.username == "worker_demo").count() == 0:
            worker_user = User(username="worker_demo", email="worker@example.com", phone="9876543211", hashed_password=pw_hash, role=UserRole.HEALTH_WORKER)
            db.add(worker_user)
            db.commit()
            db.refresh(worker_user)

            worker_profile = HealthcareWorker(user_id=worker_user.id, worker_code="HW-DEMO-001", full_name="Sunita Patil (ASHA Worker)", qualification="ASHA Worker", assigned_facility_id=1, phone="9876543211")
            db.add(worker_profile)
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
