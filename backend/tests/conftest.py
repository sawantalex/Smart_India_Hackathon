import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

# Ensure backend app is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.security import get_password_hash, create_access_token
from app.main import app
from app.core.database import Base, get_db
from app.models import *

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_his.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    from app.core.database import engine as app_engine
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    Base.metadata.drop_all(bind=app_engine)
    Base.metadata.create_all(bind=app_engine)
    session = TestingSessionLocal()
    
    # Seed default test users
    pw = get_password_hash("password123")
    p_user = User(username="test_patient", email="p1@example.com", hashed_password=pw, role=UserRole.PATIENT)
    p_user2 = User(username="test_patient2", email="p2@example.com", hashed_password=pw, role=UserRole.PATIENT)
    w_user = User(username="test_worker", email="w1@example.com", hashed_password=pw, role=UserRole.HEALTH_WORKER)
    a_user = User(username="test_admin", email="a1@example.com", hashed_password=pw, role=UserRole.ADMIN)
    
    session.add_all([p_user, p_user2, w_user, a_user])
    session.commit()
    
    p1 = Patient(user_id=p_user.id, patient_code="PAT-001", full_name="Test Patient 1", age_group="18-59", preferred_language="hi")
    p2 = Patient(user_id=p_user2.id, patient_code="PAT-002", full_name="Test Patient 2", age_group="18-59", preferred_language="hi")
    fac = Facility(name="Test PHC", facility_type="PHC", services="OPD", district="Pune", village_or_town="Village", emergency_capable=True, is_verified=True, contact_phone="1234567890")
    session.add_all([p1, p2, fac])
    session.commit()

    hw = HealthcareWorker(user_id=w_user.id, worker_code="HW-001", full_name="Test Worker", qualification="ASHA", assigned_facility_id=fac.id)
    session.add(hw)
    session.commit()

    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    def _override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def patient_token(db):
    user = db.query(User).filter(User.username == "test_patient").first()
    return create_access_token(subject=user.id, role=user.role.value)

@pytest.fixture
def patient2_token(db):
    user = db.query(User).filter(User.username == "test_patient2").first()
    return create_access_token(subject=user.id, role=user.role.value)

@pytest.fixture
def worker_token(db):
    user = db.query(User).filter(User.username == "test_worker").first()
    return create_access_token(subject=user.id, role=user.role.value)

@pytest.fixture
def admin_token(db):
    user = db.query(User).filter(User.username == "test_admin").first()
    return create_access_token(subject=user.id, role=user.role.value)
