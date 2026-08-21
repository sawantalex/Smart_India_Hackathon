def test_facility_and_timeline_workflow(client, patient_token):
    # 1. Check patient timeline endpoint
    res = client.get(
        "/api/v1/encounters/patient/1",
        headers={"Authorization": f"Bearer {patient_token}"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "encounters" in data

def test_appointments_and_queue_workflow(client, patient_token):
    # 1. Create appointment
    app_data = {
        "facility_id": 1,
        "department": "General OPD",
        "appointment_date": "2026-08-25T10:00:00Z",
        "reason": "Routine Checkup"
    }
    res = client.post(
        "/api/v1/appointments",
        json=app_data,
        headers={"Authorization": f"Bearer {patient_token}"}
    )
    assert res.status_code == 200
    app_res = res.json()
    assert app_res["status"] == "REQUESTED"

    # 2. Create queue token
    q_data = {
        "facility_id": 1,
        "appointment_id": app_res["id"],
        "department": "General OPD",
        "priority": "NORMAL"
    }
    res_q = client.post(
        "/api/v1/queues",
        json=q_data,
        headers={"Authorization": f"Bearer {patient_token}"}
    )
    assert res_q.status_code == 200
    token_res = res_q.json()
    assert "token_number" in token_res
    assert token_res["status"] == "WAITING"

def test_teleconsultation_and_summary(client, patient_token, worker_token):
    # 1. Request consultation
    cons_data = {
        "facility_id": 1,
        "specialty": "Pediatrics",
        "reason": "Child fever and cough"
    }
    res = client.post(
        "/api/v1/consultations",
        json=cons_data,
        headers={"Authorization": f"Bearer {patient_token}"}
    )
    assert res.status_code == 200
    session = res.json()
    assert "[AI-generated summary]" in session["clinical_summary"]
    assert session["is_ai_generated_summary"] == "TRUE"

    # 2. Worker updates summary after clinician review
    update_data = {
        "clinical_summary": "Clinician reviewed: Pediatric fever evaluated. Prescribed ORS & hydration guidance.",
        "is_ai_generated_summary": "FALSE",
        "clinician_notes": "Follow up in 48 hours.",
        "status": "COMPLETED"
    }
    res_up = client.put(
        f"/api/v1/consultations/{session['id']}/summary",
        json=update_data,
        headers={"Authorization": f"Bearer {worker_token}"}
    )
    assert res_up.status_code == 200
    assert res_up.json()["is_ai_generated_summary"] == "FALSE"

def test_diagnostics_and_medicine_search(client, patient_token, worker_token):
    # 1. Medicine search
    res_med = client.get("/api/v1/medicines/search?query=Paracetamol")
    assert res_med.status_code == 200

    # 2. Diagnostic order creation
    diag_data = {
        "facility_id": 1,
        "test_name": "Blood Glucose Test",
        "reason": "Diabetes screening"
    }
    res_d = client.post(
        "/api/v1/diagnostics/orders",
        json=diag_data,
        headers={"Authorization": f"Bearer {patient_token}"}
    )
    assert res_d.status_code == 200
    order = res_d.json()
    assert order["test_name"] == "Blood Glucose Test"

def test_quality_dashboard_and_fhir_adapter(client, patient_token):
    # 1. Quality metrics dashboard
    res_q = client.get(
        "/api/v1/quality/dashboard",
        headers={"Authorization": f"Bearer {patient_token}"}
    )
    assert res_q.status_code == 200
    data = res_q.json()
    assert data["is_demo_data"] is True
    assert "access_metrics" in data

    # 2. FHIR Patient export
    res_fhir = client.get("/api/v1/interoperability/fhir/patient/1")
    assert res_fhir.status_code == 200
    fhir_data = res_fhir.json()
    assert fhir_data["resourceType"] == "Patient"
