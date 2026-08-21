from pydantic import BaseModel
from typing import List, Dict, Any

class QualityMetricsDashboardResponse(BaseModel):
    is_demo_data: bool = True
    access_metrics: Dict[str, Any]
    referral_metrics: Dict[str, Any]
    followup_metrics: Dict[str, Any]
    diagnostic_metrics: Dict[str, Any]
    medicine_metrics: Dict[str, Any]
    facility_utilization: Dict[str, Any]
