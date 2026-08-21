from fastapi import APIRouter
from app.api.v1 import (
    auth,
    patients,
    triage,
    facilities,
    referrals,
    sync,
    analytics,
    audit,
    encounters,
    appointments,
    queues,
    consultations,
    diagnostics,
    medicines,
    followups,
    quality,
    interoperability
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(patients.router)
api_router.include_router(triage.router)
api_router.include_router(facilities.router)
api_router.include_router(referrals.router)
api_router.include_router(sync.router)
api_router.include_router(analytics.router)
api_router.include_router(audit.router)

# Extended modules
api_router.include_router(encounters.router)
api_router.include_router(appointments.router)
api_router.include_router(queues.router)
api_router.include_router(consultations.router)
api_router.include_router(diagnostics.router)
api_router.include_router(medicines.router)
api_router.include_router(followups.router)
api_router.include_router(quality.router)
api_router.include_router(interoperability.router)
