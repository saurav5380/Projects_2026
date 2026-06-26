# SkillKraft — Project Folder Structure

**Version:** 1.0  
**Status:** Draft for Review  
**Depends on:** PRD v1.0, Database Schema v1.1, API Specification v1.0

---

## 1. Repository Layout

SkillKraft uses a **monorepo** structure with two packages under one root. Think of it like a two-storey building — the ground floor is the backend (Express API), the upper floor is the frontend (Next.js), and they share a common foundation (root config files, environment setup).

```
skillkraft/
├── frontend/                  # Next.js 14 application
├── backend/                   # Express.js API
├── .gitignore
├── .env.example               # Documents all required environment variables
├── README.md
└── package.json               # Root package.json for running both apps concurrently
```

The root `package.json` uses `concurrently` to run both apps with a single `npm run dev` command during development.

---

## 2. Backend Structure

The backend follows a **Router → Controller → Service → Repository** layered architecture. Each layer has a single responsibility and communicates only with the layer directly below it — no skipping layers.

- **Router** — declares the HTTP method, path, and middleware chain
- **Controller** — parses and validates the request, calls the service, formats the response
- **Service** — contains all business logic; orchestrates calls to repositories and AI services
- **Repository** — the only layer that talks to Prisma/PostgreSQL directly

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts                   # Validates and exports all env vars via Zod
│   │   └── corsOptions.ts           # CORS config (allowed origins)
│   │
│   ├── db/
│   │   └── prisma.ts                # Singleton Prisma client instance
│   │
│   ├── middleware/
│   │   ├── authenticate.ts          # JWT verification middleware; attaches user to req
│   │   ├── errorHandler.ts          # Global Express error handler; formats error envelope
│   │   └── validateBody.ts          # Generic Zod validation middleware factory
│   │
│   ├── routes/
│   │   ├── index.ts                 # Mounts all route groups under /api/v1
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── onboarding.routes.ts
│   │   ├── roadmap.routes.ts
│   │   ├── topic.routes.ts
│   │   ├── resource.routes.ts
│   │   ├── bookmark.routes.ts
│   │   ├── quiz.routes.ts
│   │   ├── explain.routes.ts
│   │   ├── dashboard.routes.ts
│   │   ├── nextTopic.routes.ts
│   │   └── review.routes.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── onboarding.controller.ts
│   │   ├── roadmap.controller.ts
│   │   ├── topic.controller.ts
│   │   ├── resource.controller.ts
│   │   ├── bookmark.controller.ts
│   │   ├── quiz.controller.ts
│   │   ├── explain.controller.ts    # Handles SSE streaming setup
│   │   ├── dashboard.controller.ts
│   │   ├── nextTopic.controller.ts
│   │   └── review.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts          # bcrypt hashing, JWT generation, token rotation
│   │   ├── user.service.ts
│   │   ├── onboarding.service.ts    # Orchestrates profile save + roadmap generation
│   │   ├── roadmap.service.ts       # Archive logic, rename, progress aggregation
│   │   ├── topic.service.ts         # Status updates, reorder, checkpoint enforcement
│   │   ├── resource.service.ts
│   │   ├── bookmark.service.ts
│   │   ├── quiz.service.ts          # Quiz session store, scoring, attempt persistence
│   │   ├── dashboard.service.ts     # Aggregates all dashboard data in one call
│   │   ├── review.service.ts        # Weekly review generation + deduplication
│   │   ├── streak.service.ts        # Streak calculation logic (pure function, no DB)
│   │   │
│   │   └── ai/                      # One file per AI feature — isolated from business logic
│   │       ├── ai.client.ts         # OpenAI SDK setup; single instance shared across features
│   │       ├── generateRoadmap.ts   # AI feature: Generate Learning Roadmap
│   │       ├── recommendResources.ts# AI feature: Recommend Resources
│   │       ├── explainConcept.ts    # AI feature: Explain Concepts (streaming)
│   │       ├── generateQuiz.ts      # AI feature: Generate Quiz questions
│   │       ├── scoreQuiz.ts         # AI feature: Generate per-question explanations
│   │       ├── weeklyReview.ts      # AI feature: Weekly Progress Review narrative
│   │       └── nextTopic.ts         # AI feature: Suggest Next Topic
│   │
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── refreshToken.repository.ts
│   │   ├── roadmap.repository.ts
│   │   ├── phase.repository.ts
│   │   ├── topic.repository.ts
│   │   ├── resource.repository.ts
│   │   ├── bookmark.repository.ts
│   │   ├── progress.repository.ts
│   │   ├── quiz.repository.ts
│   │   └── review.repository.ts
│   │
│   ├── validators/                  # Zod schemas — one file per request body shape
│   │   ├── auth.validators.ts       # RegisterBody, LoginBody, RefreshBody
│   │   ├── user.validators.ts       # UpdateProfileBody, ChangePasswordBody
│   │   ├── onboarding.validators.ts # OnboardingBody
│   │   ├── roadmap.validators.ts    # RenameRoadmapBody
│   │   ├── topic.validators.ts      # UpdateProgressBody, ReorderTopicsBody
│   │   ├── resource.validators.ts   # AddResourceBody
│   │   ├── quiz.validators.ts       # SubmitQuizBody
│   │   └── explain.validators.ts    # ExplainBody
│   │
│   ├── types/
│   │   ├── express.d.ts             # Augments Express Request to include req.user
│   │   └── api.types.ts             # Shared TypeScript types for response shapes
│   │
│   ├── utils/
│   │   ├── jwt.ts                   # signAccessToken, signRefreshToken, verifyToken
│   │   ├── password.ts              # hashPassword, comparePassword (bcrypt wrappers)
│   │   ├── quizSessionStore.ts      # In-memory Map for temporary quiz session storage
│   │   └── asyncHandler.ts          # Wraps async route handlers to forward errors to errorHandler
│   │
│   ├── jobs/
│   │   └── weeklyReview.job.ts      # node-cron job: runs every Sunday 08:00 UTC
│   │
│   └── app.ts                       # Express app setup: middleware, routes, error handler
│
├── prisma/
│   ├── schema.prisma                # Prisma schema (from Database Schema artefact)
│   └── migrations/                  # Auto-generated by Prisma migrate
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   │   ├── auth.service.test.ts
│   │   │   ├── streak.service.test.ts
│   │   │   ├── quiz.service.test.ts
│   │   │   └── roadmap.service.test.ts
│   │   └── utils/
│   │       ├── jwt.test.ts
│   │       └── password.test.ts
│   └── integration/
│       ├── auth.test.ts
│       ├── roadmap.test.ts
│       ├── topic.test.ts
│       ├── quiz.test.ts
│       └── review.test.ts
│
├── .env                             # Local env vars (never committed)
├── .env.example                     # Template with all required keys (committed)
├── .eslintrc.json
├── jest.config.ts
├── nodemon.json                     # Watches src/ and restarts on change
├── tsconfig.json
└── package.json
```

---

## 3. Frontend Structure

The frontend follows **Next.js 14 App Router** conventions. The `app/` directory maps directly to URL routes. Shared UI components, hooks, API client functions, and type definitions live outside `app/` so they can be used from any page.

```
frontend/
├── app/                             # Next.js App Router — every folder is a route segment
│   ├── layout.tsx                   # Root layout: fonts, global providers, metadata
│   ├── page.tsx                     # / — Landing page
│   │
│   ├── (auth)/                      # Route group: public auth pages (no shared layout)
│   │   ├── login/
│   │   │   └── page.tsx             # /login
│   │   └── register/
│   │       └── page.tsx             # /register
│   │
│   ├── (app)/                       # Route group: authenticated pages (shared app layout)
│   │   ├── layout.tsx               # App shell: sidebar, topbar, auth guard
│   │   ├── onboarding/
│   │   │   └── page.tsx             # /onboarding — multi-step wizard
│   │   ├── dashboard/
│   │   │   └── page.tsx             # /dashboard
│   │   ├── roadmap/
│   │   │   ├── page.tsx             # /roadmap — full roadmap view
│   │   │   └── [topicId]/
│   │   │       └── page.tsx         # /roadmap/[topicId] — topic detail page
│   │   ├── history/
│   │   │   └── page.tsx             # /history — past weekly reviews
│   │   └── settings/
│   │       └── page.tsx             # /settings
│   │
│   ├── api/                         # Next.js API routes (thin proxies only)
│   │   └── auth/
│   │       └── refresh/
│   │           └── route.ts         # Handles silent token refresh from the browser
│   │
│   └── globals.css                  # TailwindCSS base styles
│
├── components/
│   ├── ui/                          # ShadCN auto-generated components (do not edit manually)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   ├── sheet.tsx                # Used for the explain concept slide-over panel
│   │   └── ...                      # Other ShadCN components added as needed
│   │
│   ├── layout/                      # Structural layout components
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── AuthGuard.tsx            # Redirects unauthenticated users to /login
│   │
│   ├── onboarding/
│   │   ├── OnboardingWizard.tsx     # Parent stepper component
│   │   ├── StepCurrentRole.tsx
│   │   ├── StepTargetRole.tsx
│   │   ├── StepWeeklyHours.tsx
│   │   └── StepTimeline.tsx
│   │
│   ├── dashboard/
│   │   ├── ProgressOverview.tsx     # Progress bar + percentage
│   │   ├── StreakCard.tsx
│   │   ├── NextTopicCard.tsx        # "Recommended Next" card
│   │   └── LatestReviewCard.tsx
│   │
│   ├── roadmap/
│   │   ├── RoadmapView.tsx          # Full roadmap with all phases
│   │   ├── PhaseAccordion.tsx       # Collapsible phase with topic list
│   │   ├── TopicRow.tsx             # Single topic row with status indicator
│   │   └── DragDropTopicList.tsx    # Wraps TopicRow with dnd-kit drag-and-drop
│   │
│   ├── topic/
│   │   ├── TopicDetail.tsx          # Topic page layout
│   │   ├── ResourceList.tsx         # List of resources with Google search links
│   │   ├── ResourceCard.tsx         # Single resource with bookmark toggle
│   │   ├── AddResourceForm.tsx      # Inline form for user-added resources
│   │   ├── ExplainPanel.tsx         # Slide-over SSE streaming panel
│   │   └── QuizModal.tsx            # Quiz dialog: generate → answer → results
│   │
│   ├── quiz/
│   │   ├── QuizQuestion.tsx         # Single question with 4 option radio buttons
│   │   └── QuizResults.tsx          # Score display + per-question feedback
│   │
│   └── shared/
│       ├── LoadingSpinner.tsx
│       ├── ErrorMessage.tsx
│       └── PageHeader.tsx
│
├── hooks/                           # Custom React hooks
│   ├── useAuth.ts                   # Reads auth state; provides login/logout helpers
│   ├── useRoadmap.ts                # Fetches and caches the active roadmap
│   ├── useTopic.ts                  # Fetches a single topic with progress
│   ├── useDashboard.ts              # Fetches dashboard aggregated data
│   ├── useQuiz.ts                   # Manages quiz generate → submit → results flow
│   ├── useExplain.ts                # Manages SSE stream for concept explanation
│   └── useBookmark.ts               # Toggle bookmark with optimistic UI update
│
├── lib/
│   ├── apiClient.ts                 # Axios instance with base URL, auth headers,
│   │                                # and automatic token refresh on 401
│   ├── auth.ts                      # Token storage helpers (memory + cookie strategy)
│   ├── queryClient.ts               # TanStack Query client configuration
│   └── utils.ts                     # cn() helper for merging Tailwind class names
│
├── providers/
│   └── AppProviders.tsx             # Wraps app with QueryClientProvider, AuthProvider
│
├── types/
│   └── api.types.ts                 # TypeScript interfaces mirroring API response shapes
│                                    # Manually kept in sync with backend api.types.ts
│
├── public/
│   ├── favicon.ico
│   └── logo.svg
│
├── .env.local                       # Frontend env vars (NEXT_PUBLIC_API_URL, etc.)
├── .env.local.example
├── .eslintrc.json
├── next.config.ts
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Naming Conventions

### Files and Folders

- All folders use **kebab-case** (`quiz-session`, `weekly-review`)
- All TypeScript files use **camelCase** for utilities and hooks (`apiClient.ts`, `useAuth.ts`)
- React components use **PascalCase** (`TopicDetail.tsx`, `QuizModal.tsx`)
- Test files mirror the file they test with a `.test.ts` suffix (`auth.service.test.ts`)

### Backend Layer Suffixes

Each backend file is named with its layer suffix to make responsibilities immediately clear at a glance:

- `*.routes.ts` — Express Router
- `*.controller.ts` — Request/response handling
- `*.service.ts` — Business logic
- `*.repository.ts` — Prisma database access
- `*.validators.ts` — Zod schemas
- `*.job.ts` — node-cron scheduled jobs

---

## 5. Key Architectural Patterns

### Backend: The asyncHandler Wrapper

Every async route handler is wrapped with `asyncHandler` from `utils/asyncHandler.ts`. This is a tiny utility (about 5 lines) that catches any unhandled promise rejections and forwards them to the global `errorHandler` middleware. Without this, an unhandled async error in Express silently hangs the request. It is the most important utility in the backend.

### Backend: AI Services Are Pure Functions

Every file in `services/ai/` exports a single async function that accepts plain data and returns plain data. They have no knowledge of Express requests, Prisma, or business rules. This means they can be tested in isolation by simply calling them with mock inputs, without needing a running server or database.

### Backend: Quiz Session Store

`utils/quizSessionStore.ts` is an in-memory `Map` keyed by `userId:topicId`. When `/quiz/generate` is called, the generated questions (including `correctIndex`) are stored here with a 30-minute TTL. When `/quiz/submit` is called, the answers are validated against this store rather than trusting the client. This prevents a user from manipulating their answers before submission.

### Frontend: API Client with Silent Token Refresh

`lib/apiClient.ts` is an Axios instance that attaches the access token to every request. It also registers an Axios response interceptor that watches for `401 Unauthorized` responses, silently calls `POST /auth/refresh` to get a new access token, then retries the original request. The user never sees a login page during a normal session. Think of it like a security guard who quietly renews your visitor badge without making you go back to reception.

### Frontend: TanStack Query for Server State

All API data fetching uses **TanStack Query** (`@tanstack/react-query`). This provides automatic caching, background refetching, and loading/error states without manual `useState` + `useEffect` boilerplate. Each custom hook in `hooks/` wraps a TanStack Query `useQuery` or `useMutation` call.

---

## 6. Environment Variables

### Backend `.env`

```
DATABASE_URL=postgresql://user:password@localhost:5432/skillkraft
JWT_ACCESS_SECRET=<random-256-bit-string>
JWT_REFRESH_SECRET=<different-random-256-bit-string>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
OPENAI_API_KEY=sk-...
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

*End of Folder Structure v1.0*
