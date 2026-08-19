from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import uuid

from app.core.database import get_db
from app.core.security import (
    get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token
)
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.facility import HealthcareWorker
from app.schemas.user import UserCreate, UserResponse, Token
from app.services.audit_service import AuditService

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id: str = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account is inactive or not found")
    return user

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == user_in.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_pw = get_password_hash(user_in.password)
    user = User(
        username=user_in.username,
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=hashed_pw,
        role=user_in.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Auto create Patient or HealthcareWorker profile
    if user.role == UserRole.PATIENT:
        patient_code = f"PAT-{uuid.uuid4().hex[:6].upper()}"
        patient = Patient(
            user_id=user.id,
            patient_code=patient_code,
            full_name=user.username.capitalize(),
            age_group="18-59",
            preferred_language="hi"
        )
        db.add(patient)
        db.commit()
    elif user.role == UserRole.HEALTH_WORKER:
        worker_code = f"HW-{uuid.uuid4().hex[:6].upper()}"
        worker = HealthcareWorker(
            user_id=user.id,
            worker_code=worker_code,
            full_name=f"Worker {user.username.capitalize()}",
            qualification="ASHA / Health Worker"
        )
        db.add(worker)
        db.commit()

    AuditService.log_event(db, actor_id=str(user.id), actor_role=user.role.value, action="REGISTER", resource=f"User:{user.id}", result="SUCCESS")
    return user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        AuditService.log_event(db, actor_id=form_data.username, actor_role="UNKNOWN", action="LOGIN_FAILED", resource="Auth", result="FAILURE")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

    access_token = create_access_token(subject=user.id, role=user.role.value)
    refresh_token = create_refresh_token(subject=user.id, role=user.role.value)

    AuditService.log_event(db, actor_id=str(user.id), actor_role=user.role.value, action="LOGIN", resource=f"User:{user.id}", result="SUCCESS")
    return Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer")
