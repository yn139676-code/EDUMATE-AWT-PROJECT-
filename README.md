# EduMate 🎓

> A modern student education management platform to track assignments, daily tasks, and presentations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (dark glass-morphism theme) |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| HTTP Client | Axios |
| Notifications | react-hot-toast |

---

## Project Structure

```
EDUMATE/
├── backend/
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express routers
│   ├── server.js      # Entry point
│   ├── .env           # ← create this (see below)
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/       # All axios calls
    │   ├── components/
    │   └── pages/
    └── .env           # ← create this (see below)
```

---

## Setup (Local)

### Prerequisites
- Node.js 18+
- A free MongoDB Atlas account → https://www.mongodb.com/atlas

### 1. Clone & enter the project
```bash
git clone <your-repo-url>
cd EDUMATE
```

### 2. Configure Backend
```bash
cd backend
cp .env.example .env
# Open .env and paste your MongoDB Atlas connection string
```

**`backend/.env`**
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/edumate
PORT=5000
```

### 3. Start the Backend
```bash
cd backend
npm run dev      # runs with nodemon (auto-reload)
```
The API will be at **http://localhost:5000**

### 4. Configure Frontend
```bash
cd frontend
# .env already exists with:
# VITE_API_URL=http://localhost:5000
```

### 5. Start the Frontend
```bash
cd frontend
npm run dev
```
Open **http://localhost:5173** in your browser.

---

## API Endpoints

### Health
```
GET  /api/health
```

### Assignments
```
GET    /api/assignments             List (optional ?status=pending&subject=Math)
POST   /api/assignments             Create
PUT    /api/assignments/:id         Update
DELETE /api/assignments/:id         Delete
```

**Body fields:** `title*`, `subject*`, `description`, `dueDate*`, `priority` (low/medium/high), `status` (pending/completed)

### Daily Tasks
```
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

**Body fields:** `title*`, `completed` (boolean)

### Presentations
```
GET    /api/presentations
POST   /api/presentations
PUT    /api/presentations/:id
DELETE /api/presentations/:id
```

**Body fields:** `title*`, `subject*`, `presentationDate*`, `outline`

---

## Deployment

### Backend → Render
1. Push your code to GitHub (make sure `.env` is in `.gitignore`)
2. Create a new Web Service on [render.com](https://render.com)
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variable: `MONGODB_URI` = your Atlas URI

### Frontend → Vercel
1. Import the repo on [vercel.com](https://vercel.com)
2. Root directory: `frontend`
3. Framework preset: Vite
4. Add environment variable: `VITE_API_URL` = your Render backend URL

---

## Team Members

| Member | Role |
|---|---|
| Member 1 | Frontend & Dashboard |
| Member 2 | Backend & Database |
| Member 3 | Assignments & Task Management |
| Member 4 | Presentations, Testing & Deployment |
