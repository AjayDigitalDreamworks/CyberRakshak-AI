# CyberRakshak AI

AI powered Scam and Deepfake Detection SaaS platform with full-stack architecture.

## Project Structure

```
cyberrakshak-ai/
+-- frontend/      # React + Vite + Tailwind + Framer Motion
+-- backend/       # Express + MongoDB + JWT + Multer
+-- ai-engine/     # FastAPI + AI analysis modules
+-- docs/          # documentation/screenshots
+-- docker-compose.yml
+-- README.md
```

## Features

- JWT authentication and protected routes
- URL phishing scanner with risk scoring
- SMS scam analyzer with NLP heuristic detection
- Fake screenshot verification (OCR pipeline placeholder)
- Deepfake image/video detector module
- Voice clone detector module
- Reports and scan history dashboard
- Threat logs and security score-oriented UI
- Dark/light theme toggle, toasts, skeleton loaders

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Router, Axios, Chart.js, Lucide Icons
- Backend: Node.js, Express, JWT, bcrypt, helmet, rate limiting, multer, mongoose
- AI Engine: FastAPI, TensorFlow, OpenCV, EasyOCR, Scikit-learn, librosa (with lightweight placeholder inference)
- Database: MongoDB Atlas

## Local Setup

### 1) Clone and open

```bash
cd cyberrakshak-ai
```

### 2) Backend env

Create `backend/.env` from template:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/cyberrakshak
JWT_SECRET=replace_with_secure_secret
AI_ENGINE_URL=http://localhost:8000
CLIENT_URL=http://localhost:5173
```

### 3) Install dependencies

```bash
cd frontend && npm install
cd ../backend && npm install
cd ../ai-engine && pip install -r requirements.txt
```

### 4) Run services

Terminal 1:
```bash
cd ai-engine
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Terminal 2:
```bash
cd backend
npm run dev
```

Terminal 3:
```bash
cd frontend
npm run dev
```

## Docker Compose

```bash
docker compose up --build
```

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/url-scan`
- `POST /api/sms-scan`
- `POST /api/screenshot`
- `POST /api/deepfake`
- `POST /api/audio-scan`
- `GET /api/reports`

## Deployment

- Frontend deploy: Vercel (`frontend`)
- Backend deploy: Render Web Service (`backend`)
- AI engine deploy: Render Web Service (`ai-engine`)
- Configure envs on Render and Vercel:
  - `VITE_API_BASE_URL`
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `AI_ENGINE_URL`

## Architecture

1. User logs in via frontend auth pages.
2. Token stored in localStorage and sent as Bearer token.
3. Scan modules send data/files to backend APIs.
4. Backend validates, rate-limits, stores data in MongoDB, calls FastAPI AI service.
5. AI result returned, persisted as scans/reports/threat logs.
6. Dashboard and reports read persisted history.

## Screenshots Placeholders

Add screenshots in `docs/screenshots`:

- `landing.png`
- `dashboard.png`
- `url-scan.png`
- `sms-scan.png`
- `screenshot-detect.png`
- `deepfake-detect.png`
- `voice-detect.png`
- `reports.png`

## Notes

- Current AI endpoints use production-ready service interfaces with lightweight placeholder scoring logic.
- Replace heuristics with trained TensorFlow/scikit models without changing API contracts.
