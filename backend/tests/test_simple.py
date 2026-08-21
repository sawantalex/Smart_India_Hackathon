def test_simple_security_import():
    from app.core.security import get_password_hash, create_access_token
    assert get_password_hash("password123") is not None
    token = create_access_token("1", "PATIENT")
    assert token is not None
