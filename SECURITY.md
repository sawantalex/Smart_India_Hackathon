# Security & Privacy Architecture

## 1. Data Protection & Encryption

- **Data at Rest**: SQLite/PostgreSQL databases with AES-256 field-level encryption for sensitive Patient Identifiable Information (PII).
- **Data in Transit**: Mandatory HTTPS / TLS 1.3 encryption across all client-server and API endpoints.
- **Headers & Middleware**: Enforced HTTP security headers including `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and Strict Content-Security-Policy (CSP).

---

## 2. Role-Based Access Control (RBAC)

The system enforces strict RBAC across 3 distinct user roles:

| User Role | Permissions & Scope |
| :--- | :--- |
| **PATIENT** | Create voice/text triage assessments, view personal history, request facility referrals, manage consent preferences. |
| **HEALTH_WORKER** (ASHA / PHC Clinician) | View village patient case queue, override AI risk scores, add clinical notes, issue facility referrals, schedule follow-up visits. |
| **ADMIN** | System audit log access, system settings, aggregated de-identified epidemiology trend analytics. |

---

## 3. Insecure Direct Object Reference (IDOR) Prevention

- **Resource Ownership Checks**: API endpoints verify that requested patient records, assessments, or referrals belong to the authenticated user's ID or assigned health worker scope.
- **Tenant & Role Scoping**: Cross-patient access attempts return HTTP 403 Forbidden.

---

## 4. De-Identification & Privacy Thresholds

- **Epidemiology Analytics**: Aggregated regional health trend queries enforce a minimum cohort threshold ($N \ge 5$).
- **Privacy Preservation**: Groups with fewer than 5 matching patient cases are automatically suppressed to prevent re-identification through demographic filtering.

---

## 5. Audit Logging & Compliance

- **Tamper-Resistant Audit Trail**: Every sensitive transaction (login, triage calculation, risk score override, referral creation, data sync) is logged in the `audit_logs` table.
- **Immutable Log Entry**: Records include timestamp, user ID, IP address, action event type, target resource ID, and delta parameters.
