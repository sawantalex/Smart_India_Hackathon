from fastapi import APIRouter
from app.api.v1 import auth, patients, triage, facilities, referrals, sync, analytics, audit

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(patients.router)
api_router.include_router(triage.router)
api_router.include_router(facilities.router)
api_router.include_router(referrals.router)
api_router.include_router(sync.router)
api_router.include_router(analytics.router)
api_router.include_router(audit.router)
