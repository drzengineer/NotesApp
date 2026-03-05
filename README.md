# Notes App

A full-stack notes application built with Next.js 16 App Router, TypeScript, and MongoDB Atlas. Features a three-layer test suite with Playwright E2E tests running across three browsers via GitHub Actions CI.

🔗 **Live:** [notes.davidr.io](https://notes.davidr.io) · **Portfolio:** [davidr.io](https://davidr.io)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, SSR, API Routes) |
| Language | TypeScript (strict mode) |
| Database | MongoDB Atlas, Mongoose ODM |
| Styling | Tailwind CSS v4, DaisyUI v5 |
| Testing | Jest, React Testing Library, Playwright |
| Deployment | AWS Amplify (SSR), custom domain |
| CI/CD | GitHub Actions — runs full Playwright suite on every push |
| Security | Rate limiting via proxy middleware, environment secrets |

---

## Testing

Three-layer test strategy:

- **Unit** — pure functions and middleware (Jest)
- **Integration** — API routes against a live isolated MongoDB Atlas test database via `.env.test` (Jest)
- **E2E** — 33+ user flows across Chromium, Firefox, and WebKit (Playwright, `fullyParallel: true`)

E2E tests cover CRUD operations, validation errors, dialog handling, navigation, and special character edge cases. Tests use UUID-generated data and `beforeEach`/`afterEach` hooks for isolation. Traces enabled for CI failure debugging.

GitHub Actions runs the full suite against a production build (`npm run build && npm run start`) on every push.

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
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notes` | Retrieve all notes |
| `GET` | `/api/notes/[id]` | Retrieve a single note |
| `POST` | `/api/notes` | Create a note |
| `PUT` | `/api/notes/[id]` | Update a note |
| `DELETE` | `/api/notes/[id]` | Delete a note |

---

## Project Structure
```
NotesApp/
├── .github/                          # GitHub Actions workflows
├── e2e/
│   └── notes.spec.ts                 # Playwright E2E tests
├── src/
│   ├── app/
│   │   ├── api/notes/
│   │   │   ├── route.ts              # GET all, POST
│   │   │   ├── route.test.ts         # unit tests
│   │   │   ├── route.integration.test.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts          # GET one, PUT, DELETE
│   │   │       ├── route.test.ts     # unit tests
│   │   │       └── route.integration.test.ts
│   │   ├── create/page.tsx
│   │   ├── notes/[id]/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx                  # Homepage (Server Component)
│   ├── components/
│   │   ├── Navbar.tsx / Navbar.test.tsx
│   │   ├── NoteCard.tsx / NoteCard.test.tsx
│   │   └── NotesNotFound.tsx / NotesNotFound.test.tsx
│   ├── utils/
│   │   ├── validators.ts / validators.test.ts
│   │   └── formatNote.ts / formatNote.test.ts
│   ├── proxy.ts                      # Rate limiting middleware
│   └── proxy.test.ts
├── jest.config.ts
├── jest.setup.ts
├── jest.integration.setup.ts
├── playwright.config.ts
└── amplify.yml
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

Deployed on AWS Amplify with SSR. `MONGO_URI` managed via Amplify environment variables. Auto-deploys on push to `main`.

---

## Author

**David Rodriguez** — [davidr.io](https://davidr.io) · [LinkedIn](https://linkedin.com/in/drzengineer) · [GitHub](https://github.com/drzengineer)