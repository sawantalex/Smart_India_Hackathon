from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User, UserRole
from app.models.triage import TriageAssessment, UrgencyLevel
from app.models.referral import Referral

router = APIRouter(prefix="/analytics", tags=["Aggregated Health Trends"])

MIN_COHORT_THRESHOLD = 3 # Enforce minimum cohort size to prevent individual re-identification

@router.get("/trends")
def get_aggregated_health_trends(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    if current_user.role not in [UserRole.HEALTH_WORKER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Forbidden: Healthcare worker or Admin access required for analytics")

    total_assessments = db.query(TriageAssessment).count()
    if total_assessments < MIN_COHORT_THRESHOLD:
        return {
            "notice": "Insufficient aggregated data to display metrics safely without re-identification risk.",
            "total_assessments_count": total_assessments
        }

    # Group by urgency
    urgency_counts = (
        db.query(TriageAssessment.risk_category, func.count(TriageAssessment.id))
        .group_by(TriageAssessment.risk_category)
        .all()
    )

    # Referral counts
    total_referrals = db.query(Referral).count()

    return {
        "anonymized": True,
        "cohort_threshold_met": True,
        "total_assessments": total_assessments,
        "total_referrals": total_referrals,
        "urgency_distribution": {cat.value if hasattr(cat, 'value') else str(cat): count for cat, count in urgency_counts}
    }
