# 📝 Notes App

A full-stack notes application built with **Next.js 16 App Router**, featuring server-side rendering, serverless API routes, and cloud deployment on AWS.

🔗 **Live Demo:** [notes.davidr.io](https://notes.davidr.io) | 👤 **Portfolio:** [davidr.io](https://davidr.io)

---

## Problem Solved

Managing notes across devices typically requires either bulky desktop software or trusting a third-party service with your data. This app provides a fast, responsive, self-contained notes experience with persistent cloud storage and a clean UI that works across mobile, tablet, and desktop, deployed and accessible from anywhere.

---

## Features

- ✅ Full **CRUD** operations, Create, Read, Update, Delete notes in real time
- ✅ **Server Components**, homepage renders fresh data server-side on every request
- ✅ **Responsive design**, works seamlessly on mobile, tablet, and desktop
- ✅ **Cloud database**, MongoDB Atlas with automatic backups and high availability
- ✅ **Production deployment**, live on AWS Amplify with automated CI/CD
- ✅ **Rate limiting**, request throttling via Next.js proxy middleware
- ✅ **TypeScript**, strict mode end-to-end
- 🔧 **Authentication**, NextAuth integration in active development

---

## Architecture

```
┌─────────────────────────────────────────┐
│           Next.js 16 App Router         │
│                                         │
│  ┌──────────────────┐  ┌──────────────┐ │
│  │ Server Components│  │  API Routes  │ │
│  │  (SSR pages)     │  │  /api/notes  │ │
│  └────────┬─────────┘  └──────┬───────┘ │
│           │                   │         │
│           └───────────────────┘         │
│                    │                    │
│             Mongoose ODM                │
└────────────────────┼────────────────────┘
                     │
          ┌──────────▼───────────┐
          │    MongoDB Atlas     │
          │  (Cloud Database)    │
          └──────────────────────┘

Deployment: AWS Amplify (SSR)
CI/CD: Auto-deploy on push to main
```

---

## Tech Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Framework  | Next.js 16 (App Router, SSR)                            |
| Language   | TypeScript (strict mode)                                |
| Styling    | Tailwind CSS v4, DaisyUI v5                             |
| Database   | MongoDB Atlas, Mongoose ODM                             |
| Deployment | AWS Amplify (SSR), custom domain                        |
| DevOps     | Git, GitHub, CI/CD via Amplify + GitHub integration     |
| Security   | Rate limiting via proxy middleware, environment secrets  |

---

## API Endpoints

| Method   | Endpoint          | Description             |
|----------|-------------------|-------------------------|
| `GET`    | `/api/notes`      | Retrieve all notes      |
| `GET`    | `/api/notes/[id]` | Retrieve a single note  |
| `POST`   | `/api/notes`      | Create a new note       |
| `PUT`    | `/api/notes/[id]` | Update an existing note |
| `DELETE` | `/api/notes/[id]` | Delete a note           |

---

## Setup Instructions

### Prerequisites

- Node.js v20+
- MongoDB Atlas account (or local MongoDB)
- npm

### Clone & Install

```bash
git clone https://github.com/drzengineer/NotesApp.git
cd NotesApp
npm install
```

### Environment Variables

Create a `.env.local` file at the project root:

```env
MONGO_URI=your_mongodb_atlas_connection_string
```

### Run Locally

```bash
npm run dev
```

App runs on `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
NotesApp/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── notes/
│   │   │       ├── route.ts         # GET all, POST
│   │   │       └── [id]/route.ts    # GET one, PUT, DELETE
│   │   ├── create/
│   │   │   └── page.tsx             # Create note page
│   │   ├── notes/
│   │   │   └── [id]/page.tsx        # Note detail page
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Homepage (Server Component)
│   ├── components/                  # Shared UI components
│   └── lib/
│       ├── db.ts                    # Mongoose connection caching
│       └── Note.ts                  # Note model + interface
├── proxy.ts                         # Rate limiting middleware
├── amplify.yml                      # AWS Amplify build config
├── next.config.ts
└── tsconfig.json
```

---

## Deployment

Deployed on **AWS Amplify**:

- **Framework** → Next.js 16 App Router (SSR + API Routes)
- **Database** → MongoDB Atlas (cloud-hosted)
- **CI/CD** → Auto-deploys on push to `main` via GitHub integration
- **Config** → `amplify.yml` in repo root defines build pipeline
- **Secrets** → `MONGO_URI` managed via Amplify environment variables

---

## Roadmap

- [x] CRUD operations
- [x] Next.js 16 App Router migration (from Vite + Express)
- [x] AWS Amplify deployment with SSR
- [x] Automated CI/CD pipeline
- [x] Rate limiting middleware
- [x] TypeScript strict mode
- [ ] NextAuth authentication
- [ ] Jest unit + integration tests
- [ ] Docker containerization
- [ ] GitHub Actions CI pipeline
- [ ] Redis caching

---

## Author

**David Rodriguez** — Software Developer

[davidr.io](https://davidr.io) | [LinkedIn](https://linkedin.com/in/drzengineer) | [GitHub](https://github.com/drzengineer)