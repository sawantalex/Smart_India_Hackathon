from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class FacilityBase(BaseModel):
    name: str
    facility_type: str
    services: str
    district: str
    village_or_town: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    emergency_capable: bool = False
    is_verified: bool = True
    contact_phone: str
    operating_hours: str = "24/7"

class FacilityCreate(FacilityBase):
    pass

class FacilityResponse(FacilityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class HealthcareWorkerResponse(BaseModel):
    id: int
    worker_code: str
    full_name: str
    qualification: Optional[str] = None
    assigned_facility_id: Optional[int] = None
    phone: Optional[str] = None

    class Config:
        from_attributes = True
