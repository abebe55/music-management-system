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
- **Rate limiting** — Global + auth-specific limits
- **Docker** — Single `docker compose up` runs the full stack

---

## Quick Start

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
cp .env.example .env   # edit with your values

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2 — Seed demo data

```bash
cd backend
npm run seed
# Creates a development account and 20 sample songs
# See seed.ts for the default email — use a strong password of your choice
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

### 4 — Run with Docker

```bash
docker compose up --build
# Backend: http://localhost:5000
# MongoDB: localhost:27017
```

---

## API Reference

Base URL: `http://localhost:5000/api/v1`

### Auth endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | ✗ | Login, returns JWT tokens |
| POST | `/auth/forgot-password` | ✗ | Send OTP to email |
| POST | `/auth/verify-otp` | ✗ | Validate OTP code |
| POST | `/auth/reset-password` | ✗ | Reset with OTP + new password |
| GET | `/auth/me` | ✓ | Get current user |
| POST | `/auth/change-password` | ✓ | Change password |
| POST | `/auth/logout` | ✓ | Logout (stateless) |
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
- `page`, `limit` — pagination
- `sort`, `order` — sorting (`title|artist|album|genre|createdAt`, `asc|desc`)
- `search` — search in title, artist, album
- `genre`, `artist`, `album` — filter fields

### Statistics

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/statistics` | ✓ | All stats (totals, by genre/artist/album) |

---

## Project Structure

```
music_information_management/
├── backend/                     # Express REST API
│   ├── src/
│   │   ├── app.ts               # Express app setup
│   │   ├── server.ts            # HTTP server entry
│   │   ├── config/              # env, db, auth, cors, email, security
│   │   ├── common/              # middleware, utils, errors, constants, types
│   │   ├── database/            # indexes, seed script
│   │   ├── routes/              # root router aggregator
│   │   └── modules/
│   │       ├── auth/            # Login, OTP, reset, change password
│   │       ├── songs/           # CRUD
│   │       └── statistics/      # Aggregation queries
│   └── tests/
│       ├── fixtures/            # Test data factories
│       ├── unit/                # Service-level unit tests
│       └── integration/         # Full HTTP integration tests
│
├── frontend/                    # React SPA
│   └── src/
│       ├── app/                 # Redux store, sagas, hooks
│       ├── api/                 # Axios client + API modules
│       ├── features/            # auth / songs / statistics slices + sagas
│       ├── components/          # UI components (common, auth, songs, statistics)
│       ├── layouts/             # AuthLayout, MainLayout (sidebar)
│       ├── pages/               # Dashboard, Songs, Statistics, Settings, Login…
│       ├── routes/              # ProtectedRoute, PublicRoute, AppRoutes
│       ├── styles/              # theme, global styles, styled-system helpers
│       ├── types/               # TypeScript interfaces
│       └── utils/               # formatters, storage, validators, constants
│
├── docker-compose.yml           # MongoDB + backend
└── .github/workflows/ci.yml     # GitHub Actions CI
```

---

## Running Tests

```bash
cd backend

# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration
```

---

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for all required variables.

Key backend variables:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Access token secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | Refresh token secret |
| `SMTP_*` | Email settings for OTP delivery |
| `CORS_ORIGIN` | Frontend URL(s) allowed by CORS |

---



