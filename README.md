# MusicFlow — Music Information Management System

A full-stack MERN application for managing music information. Built for the Addis Software test project.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Redux Toolkit, Redux-Saga, Emotion, Styled System, Vite |
| **Backend** | Node.js, Express, TypeScript, Mongoose |
| **Database** | MongoDB |
| **Auth** | JWT (access + refresh tokens), 6-digit OTP email flow |
| **Infra** | Docker, Docker Compose, GitHub Actions CI |

---

## Features

- **Song CRUD** — Create, read, update, delete songs (Title, Artist, Album, Genre)
- **Statistics dashboard** — Totals, songs per genre/artist/album, top artists/albums
- **Search & filter** — By title, artist, album, genre with pagination
- **Authentication** — Login, forgot password → OTP → reset, change password
- **Protected routes** — JWT middleware on all song/statistics endpoints
- **Rate limiting** — Global + per-endpoint limits (login, OTP request, OTP verify)
- **Docker** — Single `docker compose up` runs the full stack

---

## Quick Start (Local)

### Prerequisites
- Node.js 20+
- MongoDB 7+ (or Docker)

### 1 — Clone and install

```bash
git clone <your-repo-url>
cd music_information_management

# Backend
cd backend
npm install
cp .env.example .env   # fill in your values

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2 — Seed demo data

```bash
cd backend
npm run seed
# Creates a development account (admin@musicflow.com) and 20 sample songs
# Password meets the enterprise policy: 8+ chars, upper, lower, number, special char
```

### 3 — Run locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev          # http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev          # http://localhost:5173
```

### 4 — Run with Docker (local)

```bash
docker compose up --build
# Backend: http://localhost:5000
# MongoDB: localhost:27017
```

---

## Production Deployment

### Architecture

```
  React/TypeScript  ──────► Vercel (Frontend)
                                   │
                              HTTPS API calls
                                   │
                                   ▼
                     Render (Backend — Docker)
                                   │
                           MongoDB Atlas URI
                                   │
                                   ▼
                          MongoDB Atlas (Database)
                                   
  Render Backend ──► Brevo API ──► OTP Emails
```

---

### Step 1 — MongoDB Atlas (database)

1. Go to **[https://cloud.mongodb.com](https://cloud.mongodb.com)** and sign up / log in
2. Click **"Build a Cluster"** → choose **M0 Free Tier** → pick a region close to you
3. **Create a database user:**
   - Go to **Database Access** → **Add New Database User**
   - Username: `musicflow_admin`
   - Password: generate a strong password (save it)
   - Role: **Atlas admin** or **Read and write to any database**
4. **Allow network access:**
   - Go to **Network Access** → **Add IP Address**
   - For initial setup: click **"Allow Access from Anywhere"** (`0.0.0.0/0`)
   - (Tighten to Render's IP ranges after first deploy)
5. **Get connection string:**
   - Go to **Database** → **Connect** → **Compass** or **Drivers**
   - Copy the URI — it looks like:
     ```
     mongodb+srv://musicflow_admin:<password>@cluster0.xxxxx.mongodb.net/music_management
     ```
   - Replace `<password>` with your actual password
   - Keep this URI — you'll paste it into Render as `MONGODB_URI`

---

### Step 2 — Render (backend)

1. Go to **[https://render.com](https://render.com)** → sign up with GitHub
2. **New Web Service** → connect your GitHub repo
3. Configure:
   - **Name:** `musicflow-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Docker`
   - **Dockerfile Path:** `./Dockerfile`
   - **Branch:** `main`
4. **Add environment variables** (in the Render dashboard → Environment):

   | Variable | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | your Atlas URI from Step 1 |
   | `JWT_SECRET` | run `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
   | `JWT_REFRESH_SECRET` | same command, different value |
   | `JWT_EXPIRES_IN` | `7d` |
   | `JWT_REFRESH_EXPIRES_IN` | `30d` |
   | `FRONTEND_URL` | your Vercel URL (add after Step 3) |
   | `BREVO_API_KEY` | your Brevo API key |
   | `EMAIL_FROM_NAME` | `MusicFlow` |
   | `EMAIL_FROM_ADDRESS` | your verified Brevo sender email |
   | `OTP_EXPIRES_MINUTES` | `10` |
   | `OTP_MAX_ATTEMPTS` | `5` |
   | `RATE_LIMIT_WINDOW_MS` | `900000` |
   | `RATE_LIMIT_MAX` | `100` |
   | `AUTH_RATE_LIMIT_MAX` | `10` |

   > **Note:** Do NOT set `PORT` — Render injects it automatically.

5. Click **Deploy** — Render builds your Docker image and starts the service
6. Copy your Render URL: `https://musicflow-backend.onrender.com`

---

### Step 3 — Vercel (frontend)

1. Go to **[https://vercel.com](https://vercel.com)** → sign up with GitHub
2. **New Project** → import your repo
3. Configure:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Add environment variables** (in Vercel dashboard → Settings → Environment Variables):

   | Variable | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://musicflow-backend.onrender.com/api/v1` |
   | `VITE_APP_NAME` | `MusicFlow` |

5. Click **Deploy**
6. Copy your Vercel URL: `https://musicflow.vercel.app`

---

### Step 4 — Connect frontend to backend (CORS)

1. Go back to **Render** → your backend service → **Environment**
2. Set `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://musicflow.vercel.app
   ```
3. Click **Save Changes** — Render redeploys automatically

---

### Step 5 — Seed the production database (optional)

Run locally against your Atlas URI to seed initial data:

```bash
cd backend
MONGODB_URI="mongodb+srv://musicflow_admin:<password>@cluster0.xxxxx.mongodb.net/music_management" npm run seed
```

---

### Step 6 — Brevo IP authorization

If Brevo blocks OTP emails:
1. Go to `https://app.brevo.com/security/authorised_ips`
2. Click **"Unauthorized IP addresses"** tab
3. Click the green checkmark ✓ next to Render's IP to authorize it

---

## API Reference

Base URL: `https://your-render-app.onrender.com/api/v1` (production)
Local:    `http://localhost:5000/api/v1`

### Auth endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | ✗ | Login, returns JWT tokens |
| POST | `/auth/forgot-password` | ✗ | Send OTP to email (60s cooldown per email) |
| POST | `/auth/verify-otp` | ✗ | Validate OTP → returns reset token |
| POST | `/auth/reset-password` | ✗ | Reset password with reset token |
| GET | `/auth/me` | ✓ | Get current user |
| POST | `/auth/change-password` | ✓ | Change password |
| POST | `/auth/update-email` | ✓ | Update email address |
| POST | `/auth/logout` | ✓ | Logout |
| POST | `/auth/refresh-token` | ✗ | Refresh access token |

### Song endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/songs` | ✓ | List songs (pagination, search, filters) |
| POST | `/songs` | ✓ | Create song |
| GET | `/songs/:id` | ✓ | Get song by ID |
| PUT | `/songs/:id` | ✓ | Update song |
| DELETE | `/songs/:id` | ✓ | Delete song |

**Query params for GET /songs:**
- `page`, `limit` — pagination (rows-per-page selector: 8, 10, 20, 30, 50)
- `sort`, `order` — sorting (`title|artist|album|genre|createdAt`, `asc|desc`)
- `search` — full-text search in title, artist, album
- `genre`, `artist`, `album` — exact filter fields

### Statistics

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/statistics` | ✓ | All stats (totals, by genre/artist/album, top 5) |

---

## Project Structure

```
music_information_management/
├── backend/                     # Express REST API
│   ├── Dockerfile               # Multi-stage Docker build
│   ├── .dockerignore
│   ├── src/
│   │   ├── app.ts               # Express app setup
│   │   ├── server.ts            # HTTP server entry
│   │   ├── config/              # env, db, auth, cors, email, security
│   │   ├── common/              # middleware, utils, errors, constants, types
│   │   ├── database/            # indexes, seed script
│   │   ├── routes/              # root router aggregator
│   │   └── modules/
│   │       ├── auth/            # Login, OTP (hashed), reset token, change/update
│   │       ├── songs/           # CRUD + duplicate protection
│   │       └── statistics/      # MongoDB aggregation queries
│   └── tests/
│       ├── fixtures/
│       ├── unit/                # 4 suites, 23 tests
│       └── integration/         # 3 suites, 35 tests
│
├── frontend/                    # React SPA
│   └── src/
│       ├── app/                 # Redux store, sagas, hooks
│       ├── api/                 # Axios client + API modules
│       ├── features/            # auth / songs / statistics slices + sagas
│       ├── components/          # UI components
│       ├── layouts/             # AuthLayout, MainLayout
│       ├── pages/               # Dashboard, Songs, Statistics, Settings, Login…
│       ├── routes/              # ProtectedRoute, PublicRoute, AppRoutes
│       ├── styles/              # theme, global styles
│       ├── types/               # TypeScript interfaces
│       └── utils/               # formatters, storage, validators
│
├── render.yaml                  # Render deployment manifest
├── docker-compose.yml           # Local dev: MongoDB + backend
└── .github/workflows/ci.yml     # GitHub Actions CI
```

---

## Running Tests

```bash
cd backend

# All tests (unit + integration, serial)
npm test

# Unit tests only
npm run test:unit

# Integration tests only (runs --runInBand to avoid DB connection races)
npm run test:integration
```

**Test coverage:** 7 suites, 58 tests total
- Unit: auth.service, otp.service, song.service, statistics.service
- Integration: auth (incl. OTP hash verification, cooldown), songs (incl. validation, duplicate), statistics

---

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for all required variables with documentation.

### Critical backend variables

| Variable | Local | Production |
|---|---|---|
| `MONGODB_URI` | `mongodb://localhost:27017/...` | Atlas URI |
| `JWT_SECRET` | any string 32+ chars | strong random hex |
| `JWT_REFRESH_SECRET` | any string 32+ chars | strong random hex |
| `FRONTEND_URL` | (empty) | `https://your-app.vercel.app` |
| `BREVO_API_KEY` | (empty → console fallback) | your Brevo API key |
| `PORT` | 5000 | **auto-injected by Render** |

### Critical frontend variables

| Variable | Local | Production (Vercel) |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5000/api/v1` | `https://your-render-app.onrender.com/api/v1` |
