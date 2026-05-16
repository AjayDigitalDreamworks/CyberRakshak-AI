# CyberRakshak AI

AI powered Scam and Deepfake Detection SaaS platform with full-stack architecture.

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
