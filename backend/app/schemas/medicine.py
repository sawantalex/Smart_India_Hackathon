from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.medicine import MedicineAvailabilityStatus

class MedicineSearchResponse(BaseModel):
    id: int
    name: str
    generic_name: str
    category: str
    dosage_form: str
    facility_id: int
    facility_name: str
    facility_district: str
    status: MedicineAvailabilityStatus
    last_updated: datetime

    class Config:
        from_attributes = True

class MedicineStockUpdate(BaseModel):
    facility_id: int
    medicine_id: int
    status: MedicineAvailabilityStatus
    quantity_range: Optional[str] = None
