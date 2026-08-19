def test_patient_can_get_own_profile(client, patient_token):
    res = client.get(
        "/api/v1/patients/1",
        headers={"Authorization": f"Bearer {patient_token}"}
    )
    assert res.status_code == 200
    assert res.json()["id"] == 1

def test_patient_idor_prevented(client, patient_token):
    # Patient 1 attempting to access Patient 2 (id=2)
    res = client.get(
        "/api/v1/patients/2",
        headers={"Authorization": f"Bearer {patient_token}"}
    )
    assert res.status_code == 403
    assert "Forbidden" in res.json()["detail"]

def test_health_worker_can_access_patient_profile(client, worker_token):
    res = client.get(
        "/api/v1/patients/2",
        headers={"Authorization": f"Bearer {worker_token}"}
    )
    assert res.status_code == 200
    assert res.json()["id"] == 2
