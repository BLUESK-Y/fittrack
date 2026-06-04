# FitTrack — Global Fitness Tracking & Challenge Platform

FitTrack is a full-stack fitness web application where users can log workouts, join competitive challenges, climb leaderboards, earn badges, and get personalized AI-powered coaching.

---

## Live Demo

- **Frontend:** https://fittrack-frontend-t61f.onrender.com
- **Backend API:** https://fittrack-backend-fwlt.onrender.com

---

## Working Features

- **User Authentication** — Register, login, and logout with JWT-based sessions
- **Dashboard** — Activity trend chart, calendar heatmap, streak tracker, total points, calories, and steps at a glance
- **Workout Logging** — Log sessions with workout type, duration, calories, and steps; edit or view recent sessions
- **Challenges** — Browse and filter 20 fitness challenges by category and difficulty; view weekly roadmaps, rules, benefits, and coach info; join or leave challenges
- **Leaderboard** — Global rankings sorted by total points, steps, or calories
- **Badges & Achievements** — Earn badges automatically based on milestones (Early Riser, Night Owl, Peak Performer, etc.)
- **AI Coach** — Chat with a Gemini-powered assistant for personalized workout recommendations and challenge suggestions
- **Admin Panel** — Create, edit, and delete challenges; view and manage users (admin role only)
- **Protected Routes** — Role-based access control; unauthenticated users are redirected to the landing page

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

---

## Project Structure

```
fct/
├── frontend/                  # React Vite app
│   └── src/
│       ├── assets/            # Icons, badge images
│       ├── components/        # Shared UI (Navbar, Footer, Modal, Charts, etc.)
│       ├── features/
│       │   ├── auth/          # Login & Signup modals
│       │   ├── challenges/    # Challenge list and detail pages
│       │   ├── dashboard/     # User dashboard
│       │   ├── leaderboard/   # Global rankings
│       │   ├── aiCoach/       # AI chat interface
│       │   └── admin/         # Admin panel
│       ├── pages/             # Landing page
│       ├── services/          # Axios instance (api.js)
│       └── App.jsx            # Root with router configuration
│
└── backend/                   # Express app
    ├── config/                # DB connection, challenge data updater
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

## Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas connection string)

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

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fittrack
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

Seed the database (run in order):
```bash
node seed.js
node seedUsers.js
node seedBadges.js
```

### 3. Setup the Frontend
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Start the frontend:
```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

## API Endpoints

Base URL: `/api`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and receive JWT | No |
| POST | `/auth/logout` | Logout | Yes |
| GET | `/auth/me` | Get current user | Yes |
| GET | `/challenges` | List all challenges | No |
| GET | `/challenges/:id` | Challenge details | No |
| POST | `/challenges` | Create challenge | Admin |
| PUT | `/challenges/:id` | Update challenge | Admin |
| DELETE | `/challenges/:id` | Delete challenge | Admin |
| GET | `/logs` | Get user workout logs | Yes |
| POST | `/logs` | Create a workout log | Yes |
| PUT | `/logs/:id` | Update a log | Yes |
| DELETE | `/logs/:id` | Delete a log | Yes |
| GET | `/leaderboard` | Global rankings | No |
| GET | `/logs/report/:challengeId` | Challenge progress report | Yes |
| POST | `/ai/recommendations` | AI workout recommendations | Yes |
| POST | `/ai/recommend-challenges` | AI challenge suggestions | Yes |
| POST | `/ai/predict` | AI progress prediction | Yes |
| POST | `/ai/sentiment` | Sentiment analysis of workout notes | Yes |

---

## Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `MONGO_URI` | backend | MongoDB connection string |
| `JWT_SECRET` | backend | Secret key for JWT signing |
| `PORT` | backend | Server port (default 5000) |
| `CLIENT_URL` | backend | Allowed CORS origin |
| `GEMINI_API_KEY` | backend | Google Gemini API key |
| `VITE_API_URL` | frontend | Backend API base URL |
| `VITE_GEMINI_API_KEY` | frontend | Gemini key for AI Coach |

---

## Test Accounts

All demo accounts use the password `Password123`.

| Name | Email | Role | Points |
|------|-------|------|--------|
| Sarah Johnson | sarah.j@demo.com | user | 850 |
| Mike Chen | mike.c@demo.com | user | 720 |
| Emma Wilson | emma.w@demo.com | user | 630 |
| James Rodriguez | james.r@demo.com | user | 580 |
| Priya Patel | priya.p@demo.com | user | 490 |
| Alex Thompson | alex.t@demo.com | user | 320 |
| David Kim | david.k@demo.com | user | 410 |

## Admin Access

| Email | Password | Role |
|-------|----------|------|
| nandanamanoj2020@gmail.com | Admin@123 | admin |
