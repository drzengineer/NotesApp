# Notes App

A full-stack notes application built with Next.js 16 App Router, TypeScript, and MongoDB Atlas. Features Google and GitHub OAuth, per-user note ownership, and a three-layer test suite with Playwright E2E tests running across three browsers via GitHub Actions CI.

🔗 **Live:** [notes.davidr.io](https://notes.davidr.io) · **Portfolio:** [davidr.io](https://davidr.io)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, SSR, API Routes) |
| Language | TypeScript (strict mode) |
| Auth | NextAuth v5, Google & GitHub OAuth, JWT sessions, MongoDB Adapter |
| Database | MongoDB Atlas, Mongoose ODM |
| Styling | Tailwind CSS v4, DaisyUI v5 |
| Testing | Jest, React Testing Library, Playwright |
| Deployment | AWS Amplify, custom domain |
| CI/CD | GitHub Actions, runs full Playwright suite on every push |
| Security | Per-IP rate limiting middleware, route protection, environment secrets |

---

## Authentication

- Google and GitHub OAuth via NextAuth v5
- JWT session strategy with stable user IDs via MongoDB adapter
- Every note is tied to an authenticated owner, notes are private per user
- Cross-provider account linking via shared email, authenticate with either provider and access the same account
- All authenticated routes protected via Next.js middleware

---

## Testing

Three-layer test strategy:

- **Unit** —         pure functions and middleware (Jest)
- **Integration** —  API routes against a live isolated MongoDB Atlas test database via `.env.test` (Jest)
- **E2E** —          33+ user flows across Chromium, Firefox, and WebKit (Playwright)

E2E tests cover CRUD operations, validation errors, dialog handling, navigation, and special character edge cases. GitHub Actions runs the full suite against a production build (`npm run build && npm run start`) on every push.

---

## Architecture
```
┌─────────────────────────────────────────────────┐
│               Next.js 16 App Router             │
│                                                 │
│  ┌──────────────────┐   ┌─────────────────────┐ │
│  │ Server Components│   │     API Routes      │ │
│  │   (SSR pages)    │   │  /api/notes         │ │
│  └────────┬─────────┘   │  /api/auth/[...]    │ │
│           │             └──────────┬──────────┘ │
│           │                        │            │
│           └───────────┬────────────┘            │
│                       │                         │
│              ┌────────▼────────┐                │
│              │  Mongoose ODM   │                │
│              └────────┬────────┘                │
│                       │                         │
│  ┌────────────────────▼────────────────────┐    │
│  │            NextAuth v5                  │    │
│  │   Google OAuth · GitHub OAuth · JWT     │    │
│  └────────────────────┬────────────────────┘    │
│                       │                         │
│  ┌────────────────────▼────────────────────┐    │
│  │          Middleware (proxy.ts)          │    │
│  │    Route Protection · Rate Limiting     │    │
│  └────────────────────┬────────────────────┘    │
└───────────────────────┼─────────────────────────┘
                        │
           ┌────────────▼────────────┐
           │      MongoDB Atlas      │
           │   Notes · Auth Data     │
           └─────────────────────────┘
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notes` | Retrieve all notes for authenticated user |
| `GET` | `/api/notes/[id]` | Retrieve a single note |
| `POST` | `/api/notes` | Create a note |
| `PUT` | `/api/notes/[id]` | Update a note |
| `DELETE` | `/api/notes/[id]` | Delete a note |

---

## Project Structure
```
NotesApp/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── e2e/
│   ├── global-setup.ts
│   └── notes.spec.ts
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   └── notes/
│   │   │       ├── route.ts
│   │   │       ├── route.test.ts
│   │   │       ├── route.integration.test.ts
│   │   │       └── [id]/
│   │   │           ├── route.ts
│   │   │           ├── route.test.ts
│   │   │           └── route.integration.test.ts
│   │   ├── create/
│   │   │   └── page.tsx
│   │   ├── notes/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── globals.css
│   │   ├── icon.svg
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Navbar.tsx / Navbar.test.tsx
│   │   ├── NoteCard.tsx / NoteCard.test.tsx
│   │   ├── NotesNotFound.tsx / NotesNotFound.test.tsx
│   │   ├── SessionWrapper.tsx
│   │   └── SignInPrompt.tsx
│   ├── lib/
│   │   ├── db.ts
│   │   └── Note.ts
│   ├── utils/
│   │   ├── validators.ts / validators.test.ts
│   │   └── formatNote.ts / formatNote.test.ts
│   ├── auth.ts
│   └── proxy.ts
├── .dockerignore
├── amplify.yml
├── Dockerfile
├── jest.config.ts
├── jest.integration.setup.ts
├── jest.setup.ts
├── next.config.ts
├── playwright.config.ts
└── tsconfig.json
```

---

## Local Setup
```bash
git clone https://github.com/drzengineer/NotesApp.git
cd NotesApp
npm install
```

Create `.env.local`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```
```bash
npm run dev          # development
npm run build        # production build
npm test             # all Jest tests
npm run test:u       # unit tests only
npm run test:i       # integration tests only
npm run test:e2e     # Playwright E2E
```

---

## Deployment

Deployed on AWS Amplify with a custom domain. Environment variables managed via Amplify console. Auto-deploys on push to `main`.

---

## Author

**David Rodriguez** — [davidr.io](https://davidr.io) · [LinkedIn](https://linkedin.com/in/drzengineer) · [GitHub](https://github.com/drzengineer)
