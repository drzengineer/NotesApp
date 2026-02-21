# 📝 Notes App

A full-stack **MERN** web application for creating and managing notes — built with production-grade architecture, cloud deployment, and automated CI/CD.

🔗 **Live Demo:** [notes.davidr.io](https://notes.davidr.io)  |  👤 **Portfolio:** [davidr.io](https://davidr.io)

-----

## Problem Solved

Managing notes across devices typically requires either bulky desktop software or trusting a third-party service with your data. This app provides a fast, responsive, self-contained notes experience with a RESTful API backend, persistent cloud storage, and a clean UI that works across mobile, tablet, and desktop — deployed and accessible from anywhere.

-----

## Features

- ✅ Full **CRUD** operations — Create, Read, Update, Delete notes in real time
- ✅ **Responsive design** — works seamlessly on mobile, tablet, and desktop
- ✅ **Cloud database** — MongoDB Atlas with automatic backups and high availability
- ✅ **Production deployment** — live at a custom domain with separate frontend/backend services
- ✅ **Automated CI/CD** — auto-deploys on every push to `main`
- ✅ **Security middleware** — CORS configuration, rate limiting, environment variable management
- ✅ **TypeScript** — strict mode end-to-end across frontend and backend
- 🔧 **Authentication** — JWT-based user auth currently in active development

-----

## Architecture

```
┌─────────────────────┐         ┌──────────────────────┐
│   React Frontend    │  HTTP   │  Node.js/Express API │
│   (Vite + Tailwind) │ ──────► │   RESTful Endpoints  │
│   Render Static     │         │   Render Web Service │
└─────────────────────┘         └──────────┬───────────┘
                                           │ Mongoose ODM
                                ┌──────────▼───────────┐
                                │    MongoDB Atlas     │
                                │  (Cloud Database)    │
                                │  Auto-backup enabled │
                                └──────────────────────┘
```

**Deployment:** Frontend and backend are deployed as separate services on Render, connected to a shared MongoDB Atlas cluster. GitHub integration triggers automatic redeployment on every merge to `main`.

-----

## Tech Stack

| Layer      | Technology                                                        |
|------------|-------------------------------------------------------------------|
| Frontend   | React.js, Vite, TypeScript, Tailwind CSS, DaisyUI                 |
| Backend    | Node.js, Express.js, TypeScript                                   |
| Database   | MongoDB, MongoDB Atlas, Mongoose ODM                              |
| Deployment | Render (static site + web service), custom domain                 |
| DevOps     | Git, GitHub, CI/CD via Render integration                         |
| Security   | CORS, rate limiting, environment variables                        |

-----

## API Endpoints

| Method   | Endpoint         | Description             |
|----------|------------------|-------------------------|
| `GET`    | `/api/notes`     | Retrieve all notes      |
| `GET`    | `/api/notes/:id` | Retrieve a single note  |
| `POST`   | `/api/notes`     | Create a new note       |
| `PUT`    | `/api/notes/:id` | Update an existing note |
| `DELETE` | `/api/notes/:id` | Delete a note           |

-----

## Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- npm

### Clone & Install

```bash
git clone https://github.com/drzengineer/NotesApp.git
cd NotesApp
```

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env` file in the `/backend` directory:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5001
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in the `/frontend` directory:

```env
VITE_API_URL=http://localhost:5001/api
```

### Run Locally

**Backend** (from `/backend`):

```bash
npm run dev
```

**Frontend** (from `/frontend`):

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` — backend on `http://localhost:5001`.

### Type Checking

Run the TypeScript compiler in check-only mode (no output emitted):

**Backend:**
```bash
cd backend
npm run typecheck
```

**Frontend:**
```bash
cd frontend
npm run typecheck
```

-----

## Project Structure

```
NotesApp/
├── backend/
│   ├── src/
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Express route handlers
│   │   ├── middleware/    # CORS, rate limiting, error handling
│   │   └── server.ts      # App entry point
│   ├── dist/              # Compiled JavaScript output
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page-level components
│   │   ├── lib/           # Axios instance, utilities
│   │   ├── types.ts       # Shared TypeScript interfaces
│   │   └── App.tsx        # Root component
│   ├── index.html
│   └── tsconfig.json
└── .gitignore
```

-----

## Deployment

Both services are deployed on **Render**:

- **Frontend** → Static site, auto-built from `/frontend` on push to `main`
- **Backend** → Node.js web service, auto-deployed on push to `main`
- **Database** → MongoDB Atlas (cloud-hosted, separate from Render)
- **Domain** → Custom domain configured at [notes.davidr.io](https://notes.davidr.io)

CI/CD is handled entirely through Render's GitHub integration — no manual deploys needed.

-----

## Roadmap

- [x] CRUD operations
- [x] Cloud deployment with custom domain
- [x] Automated CI/CD pipeline
- [x] Rate limiting & CORS security
- [x] TypeScript migration (strict mode, frontend + backend)
- [ ] JWT authentication & protected routes
- [ ] Jest unit tests (target 70%+ coverage)
- [ ] Docker containerization
- [ ] Redis caching
- [ ] WebSocket real-time collaboration

-----

## Author

**David Rodriguez** — Full-Stack Developer

[davidr.io](https://davidr.io)  |  [LinkedIn](https://linkedin.com/in/drzengineer)  |  [GitHub](https://github.com/drzengineer)