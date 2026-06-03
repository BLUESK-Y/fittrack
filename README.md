# FitTrack — Global Fitness Tracking & Challenge Platform

FitTrack is a full-stack fitness web application where users can log workouts, join competitive challenges, climb leaderboards, earn badges, and get personalized AI-powered coaching — all in one place.

---

## Features

- **Workout Logging** — Log exercises with duration, calories, steps, and mood
- **Challenges** — Browse, filter, and join fitness challenges with weekly roadmaps
- **Leaderboard** — Compete globally by total points, steps, and calories
- **Badges & Achievements** — Earn badges as you hit milestones
- **AI Coach** — Chat with a Gemini-powered assistant for personalized workout recommendations
- **Dashboard** — Visual activity charts, calendar heatmap, streaks, and stats at a glance
- **Admin Panel** — Manage challenges and users (admin role only)
- **Protected Routes** — JWT-based authentication with role-based access control

---

## Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 19 + Vite | UI framework and build tool |
| React Router DOM 7 | Client-side routing |
| Bootstrap 5 + React Bootstrap | Styling and layout |
| Axios | HTTP client with interceptors |
| ApexCharts | Activity data visualization |
| React Hook Form + Yup | Form handling and validation |
| Google Generative AI (Gemini) | AI Coach integration |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JWT + bcryptjs | Authentication and password hashing |
| Cookie Parser + CORS | Middleware |
| Google Generative AI (Gemini) | AI recommendations endpoint |
| Nodemon | Development auto-reload |

---

## Project Structure

```
fct/
├── frontend/                  # React Vite app
│   └── src/
│       ├── assets/            # Icons, badge images
│       ├── components/        # Shared UI (Navbar, Footer, Modal, Charts, etc.)
│       ├── features/
│       │   ├── auth/          # Login & Signup
│       │   ├── challenges/    # Challenge list and detail pages
│       │   ├── dashboard/     # User dashboard
│       │   ├── leaderboard/   # Global rankings
│       │   ├── aiCoach/       # AI Chat interface
│       │   └── admin/         # Admin panel
│       ├── pages/             # Landing page
│       ├── services/          # Axios instance (api.js)
│       └── App.jsx            # Root with router configuration
│
└── backend/                   # Express app
    ├── config/                # DB connection, challenge seeding
    ├── models/                # Mongoose schemas (User, Challenge, Log, Badge, etc.)
    ├── controllers/           # Route logic
    ├── routes/                # API route definitions
    ├── middleware/            # Auth guard, error handler
    ├── seed.js                # Seed challenges
    ├── seedBadges.js          # Seed badges
    ├── seedUsers.js           # Seed sample users
    └── server.js              # App entry point
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB running locally

### 1. Clone the repository

```bash
git clone <repo-url>
cd fct
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fitnessDB
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

Optionally seed the database:

```bash
node seed.js
node seedBadges.js
node seedUsers.js
```

### 3. Setup the Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Get current authenticated user |
| GET | `/challenges` | List all challenges |
| GET | `/logs` | Get user workout logs |
| POST | `/logs` | Create a workout log |
| GET | `/leaderboard` | Get global rankings |
| GET | `/badges` | Get badge list |
| GET | `/analytics` | Get user activity analytics |
| POST | `/ai/recommendations` | AI workout recommendations |
| POST | `/ai/recommend-challenges` | AI challenge suggestions |

---

## Database Models

- **User** — name, email, password (hashed), role, totalPoints, currentStreak, score
- **Challenge** — title, description, category, difficulty, duration, points, weekly roadmap, rules, benefits
- **Log** — user, challenge, date, workoutType, duration, calories, steps, mood
- **UserChallenge** — user-challenge participation records
- **Badge / UserBadge** — achievement definitions and user records

---

## Environment Variables Summary

| Variable | Location | Description |
|----------|----------|-------------|
| `MONGO_URI` | backend | MongoDB connection string |
| `JWT_SECRET` | backend | Secret key for JWT signing |
| `PORT` | backend | Server port (default 5000) |
| `CLIENT_URL` | backend | Allowed CORS origin |
| `GEMINI_API_KEY` | backend | Google Gemini API key |
| `VITE_GEMINI_API_KEY` | frontend | Gemini key for client-side AI Coach |

---

## Scripts

### Frontend
```bash
npm run dev       # Start development server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Backend
```bash
npm run dev       # Start with nodemon (auto-reload)
npm start         # Start production server
```

---

## Seeded Test Accounts

After running `node seedUsers.js`, the following accounts are available in MongoDB. All share the same password.

| Name | Email | Password | Role | Points | Streak |
|------|-------|----------|------|--------|--------|
| Sarah Johnson | sarah.j@demo.com | Password123 | user | 850 | 12 days |
| Mike Chen | mike.c@demo.com | Password123 | user | 720 | 8 days |
| Emma Wilson | emma.w@demo.com | Password123 | user | 630 | 5 days |
| James Rodriguez | james.r@demo.com | Password123 | user | 580 | 7 days |
| Priya Patel | priya.p@demo.com | Password123 | user | 490 | 3 days |
| Alex Thompson | alex.t@demo.com | Password123 | user | 320 | 2 days |
| David Kim | david.k@demo.com | Password123 | user | 410 | 4 days |

> All passwords are hashed with bcryptjs before being stored in MongoDB.

---

## Admin Access

To access the admin panel, log in with the following account:

- **Email:** nandanamanoj2020@gmail.com
- **Password:** Password123
- **Role:** admin

After logging in, navigate to `http://localhost:5173/admin` to reach the Admin Panel.
