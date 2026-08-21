from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User, UserRole
from app.models.facility import Facility
from app.models.medicine import Medicine, MedicineStock, MedicineAvailabilityStatus
from app.schemas.medicine import MedicineSearchResponse, MedicineStockUpdate

router = APIRouter(prefix="/medicines", tags=["Medicine Availability"])

@router.get("/search", response_model=List[MedicineSearchResponse])
def search_medicine_availability(
    query: str,
    district: Optional[str] = None,
    db: Session = Depends(get_db)
):
    stocks_query = db.query(MedicineStock).join(Medicine).join(Facility).filter(
        (Medicine.name.ilike(f"%{query}%")) | (Medicine.generic_name.ilike(f"%{query}%"))
    )

    if district:
        stocks_query = stocks_query.filter(Facility.district.ilike(f"%{district}%"))

    stocks = stocks_query.all()
    results = []
    for s in stocks:
        results.append(MedicineSearchResponse(
            id=s.medicine.id,
            name=s.medicine.name,
            generic_name=s.medicine.generic_name,
            category=s.medicine.category,
            dosage_form=s.medicine.dosage_form,
            facility_id=s.facility.id,
            facility_name=s.facility.name,
            facility_district=s.facility.district,
            status=s.status,
            last_updated=s.last_updated
        ))
    return results

@router.put("/stock", response_model=MedicineSearchResponse)
def update_medicine_stock(
    stock_in: MedicineStockUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.HEALTH_WORKER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Unauthorized to update medicine inventory")

    stock = db.query(MedicineStock).filter(
        MedicineStock.facility_id == stock_in.facility_id,
        MedicineStock.medicine_id == stock_in.medicine_id
    ).first()

    if not stock:
        stock = MedicineStock(
            facility_id=stock_in.facility_id,
            medicine_id=stock_in.medicine_id,
            status=stock_in.status,
            quantity_range=stock_in.quantity_range
        )
        db.add(stock)
    else:
        stock.status = stock_in.status
        if stock_in.quantity_range:
            stock.quantity_range = stock_in.quantity_range

    db.commit()
    db.refresh(stock)

    return MedicineSearchResponse(
        id=stock.medicine.id,
        name=stock.medicine.name,
        generic_name=stock.medicine.generic_name,
        category=stock.medicine.category,
        dosage_form=stock.medicine.dosage_form,
        facility_id=stock.facility.id,
        facility_name=stock.facility.name,
        facility_district=stock.facility.district,
        status=stock.status,
        last_updated=stock.last_updated
    )
