from pydantic import BaseModel, Field
from typing import List, Optional

class SymptomInput(BaseModel):
    symptoms: List[str] = Field(..., description="List of reported primary symptoms")
    duration: str = Field(..., description="Duration e.g., '2 days', 'since morning'")
    severity: str = Field("MODERATE", description="LOW, MODERATE, SEVERE, UNBEARABLE")
    age_group: str = Field(..., description="0-5, 6-17, 18-59, 60+")
    associated_symptoms: List[str] = Field(default_factory=list)
    red_flags: List[str] = Field(default_factory=list)
    language: str = Field("hi", description="hi, mr, en")
    confidence: float = Field(1.0, ge=0.0, le=1.0)
    voice_input_used: bool = False
    raw_transcript: Optional[str] = None
    district: Optional[str] = None

class SymptomExtractionResponse(BaseModel):
    structured_symptoms: SymptomInput
    low_confidence_warning: bool = False
    message: Optional[str] = None
