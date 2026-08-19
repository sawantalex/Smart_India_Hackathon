def test_user_registration(client):
    res = client.post(
        "/api/v1/auth/register",
        json={"username": "newuser", "password": "securepassword", "role": "PATIENT"}
    )
    assert res.status_code == 201
    data = res.json()
    assert data["username"] == "newuser"
    assert data["role"] == "PATIENT"

def test_user_login(client):
    # Registered in conftest fixture: test_patient / password123
    res = client.post(
        "/api/v1/auth/login",
        data={"username": "test_patient", "password": "password123"}
    )
    assert res.status_code == 200
    token_data = res.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

def test_invalid_login(client):
    res = client.post(
        "/api/v1/auth/login",
        data={"username": "test_patient", "password": "wrongpassword"}
    )
    assert res.status_code == 401
