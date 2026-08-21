import os
from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SwasthyaSetu - Integrated Rural Healthcare System"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str = "sqlite:///./his.db"

    # Security & JWT
    SECRET_KEY: str = "CHANGE_THIS_IN_PRODUCTION_SECRET_KEY_NEVER_COMMIT"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173"
    ]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        return []

    # Voice & AI Providers
    STT_PROVIDER: str = "browser_speech"
    TTS_PROVIDER: str = "browser_speech"
    LLM_PROVIDER: str = "mock_safe"
    GEMINI_API_KEY: str = ""

    # Emergency Settings
    EMERGENCY_CONTACT_VERIFIED_DATE: str = "2026-01-01"
    DEFAULT_EMERGENCY_HELPLINE: str = "108"

    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
