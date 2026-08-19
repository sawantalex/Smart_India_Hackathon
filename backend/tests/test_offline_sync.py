def test_offline_queue_sync_and_idempotency(client):
    payload = {
        "device_id": "MOBILE-APP-DEMO-001",
        "events": [
            {
                "client_tx_id": "TX-99001122",
                "entity_type": "Patient",
                "action_type": "CREATE",
                "payload": {"full_name": "Offline Patient", "age_group": "18-59"}
            }
        ]
    }

    # 1. First sync submission
    res1 = client.post("/api/v1/sync/", json=payload)
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["results"][0]["status"] == "APPLIED"

    # 2. Re-send identical transaction (Idempotency test)
    res2 = client.post("/api/v1/sync/", json=payload)
    assert res2.status_code == 200
    data2 = res2.json()
    assert "already processed" in data2["results"][0]["message"]
