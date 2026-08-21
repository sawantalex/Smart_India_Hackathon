from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User, UserRole
from app.schemas.quality import QualityMetricsDashboardResponse

router = APIRouter(prefix="/quality", tags=["Quality & Accountability Dashboard"])

@router.get("/dashboard", response_model=QualityMetricsDashboardResponse)
def get_quality_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return QualityMetricsDashboardResponse(
        is_demo_data=True,
        access_metrics={
            "avg_wait_time_minutes": 18,
            "avg_travel_distance_km_saved": 24.5,
            "today_appointments_booked": 42,
            "queue_active_tokens": 14
        },
        referral_metrics={
            "total_referrals": 28,
            "completed_referrals": 22,
            "completion_rate_pct": 78.5,
            "pending_transfers": 4,
            "delayed_referrals": 2
        },
        followup_metrics={
            "maternal_followups_completed_pct": 92.0,
            "child_immunization_followups_pct": 88.4,
            "chronic_disease_adherence_pct": 84.1,
            "missed_followups_count": 5
        },
        diagnostic_metrics={
            "tests_available_pct": 87.5,
            "avg_turnaround_hours": 12.4,
            "abnormal_results_flagged": 3
        },
        medicine_metrics={
            "essential_medicine_availability_pct": 91.2,
            "stockout_alerts_active": 2,
            "low_stock_warnings": 5
        },
        facility_utilization={
            "phc_consultations_today": 34,
            "district_hospital_transfers_today": 8,
            "active_teleconsultations": 6
        }
    )
