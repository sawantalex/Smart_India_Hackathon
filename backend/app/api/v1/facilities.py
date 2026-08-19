from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.facility import Facility
from app.models.triage import UrgencyLevel
from app.schemas.facility import FacilityResponse, FacilityCreate
from app.services.facility_service import FacilityService
from app.api.v1.auth import get_current_user
from app.models.user import User, UserRole

router = APIRouter(prefix="/facilities", tags=["Healthcare Facilities"])

@router.get("/", response_model=List[FacilityResponse])
def get_facilities(
    district: Optional[str] = Query(None),
    urgency: Optional[UrgencyLevel] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Facility).filter(Facility.is_verified == True)
    if district:
        query = query.filter(Facility.district.ilike(f"%{district}%"))
    if urgency == UrgencyLevel.EMERGENCY:
        query = query.filter(Facility.emergency_capable == True)
    return query.all()

@router.post("/", response_model=FacilityResponse, status_code=201)
def create_facility(
    facility_in: FacilityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Forbidden: Only Admins can register new healthcare facilities")

    facility = Facility(**facility_in.dict())
    db.add(facility)
    db.commit()
    db.refresh(facility)
    return facility
