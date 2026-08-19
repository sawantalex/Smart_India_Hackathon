# Rural Healthcare System Deployment Guide

## Prerequisites

- **Python**: 3.10 or higher
- **Node.js**: 18.x or higher
- **Package Managers**: `pip` (Python), `npm` (Node)

---

## 1. Backend Setup & Startup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate Python virtual environment
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux / macOS:
# source venv/bin/activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Run automated unit test suite
pytest -v

# 5. Launch FastAPI Backend Dev Server (Port 8000)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend Interactive Documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 2. Frontend Setup & Startup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install frontend dependencies
npm install

# 3. Build production bundle (TypeScript verification)
npm run build

# 4. Launch Vite Frontend Dev Server (Port 5173)
npm run dev
```

Frontend Application URL:
- Web Client: `http://localhost:5173`

---

## 3. Quick Demo Login Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Patient** | `patient_demo` | `password123` |
| **ASHA Worker** | `worker_demo` | `password123` |
| **Admin** | `admin_demo` | `password123` |
