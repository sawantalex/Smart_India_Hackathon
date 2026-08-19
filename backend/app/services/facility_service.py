from sqlalchemy.orm import Session
from typing import List, Optional, Tuple
from app.models.facility import Facility
from app.models.triage import UrgencyLevel

class FacilityService:
    @staticmethod
    def get_recommended_facilities(
        db: Session,
        urgency: UrgencyLevel,
        district: Optional[str] = None,
        village_or_town: Optional[str] = None
    ) -> Tuple[List[Facility], str]:
        """
        Recommends appropriate healthcare facilities based on urgency and location privacy principles.
        Returns: (facilities_list, verification_disclaimer)
        """
        query = db.query(Facility).filter(Facility.is_verified == True)

        if urgency == UrgencyLevel.EMERGENCY:
            query = query.filter(Facility.emergency_capable == True)

        if district:
            query = query.filter(Facility.district.ilike(f"%{district}%"))

        facilities = query.all()

        # If no verified district matches found, return general verified facilities
        if not facilities:
            facilities = db.query(Facility).filter(Facility.is_verified == True).limit(5).all()

        disclaimer = "Facility information is loaded from verified regional healthcare records."
        if not facilities:
            disclaimer = "Real-time facility availability information could not be verified. Please contact local emergency services."

        return facilities, disclaimer
