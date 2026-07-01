# SkillKraft — Sprint Plan

**Version:** 1.0  
**Status:** Draft for Review  
**Duration:** 6 weeks · 42 days · No gaps  
**Depends on:** PRD v1.1, Database Schema v1.2, API Specification v1.1, Folder Structure v1.0

---

## How to Read This Plan

Each day lists concrete deliverables, not vague intentions. A task is complete only when it compiles, runs without errors, and does what it says. The word "working" means tested manually in the browser or via a REST client (e.g. Postman/Thunder Client) — not just written.

The build sequence follows the **foundation-first** rule: nothing in Week 2 can be built without Week 1 being solid. If a day runs over, the overflow task moves to the next morning — it does not get skipped.

Backend (BE) and Frontend (FE) tasks are labelled. Days that mix both are intentional — they represent integration points where the two sides are connected and verified together.

---

## Week 1 — Foundation: Monorepo, Backend Core, Auth, DB, Frontend Scaffold

### Day 1 — Monorepo Setup and Backend Bootstrap

✅ Initialise monorepo root with `package.json`, `.gitignore`, `.env.example`, `README.md`
✅ Add `concurrently` to root to run both apps with `npm run dev`
✅ Scaffold `backend/` with TypeScript: `tsconfig.json`, `nodemon.json`, `package.json`
✅ Install backend dependencies: `express`, `typescript`, `ts-node`, `nodemon`, `zod`, `dotenv`, `cors`, `helmet`
✅ Create `backend/src/app.ts` — Express app with `cors`, `helmet`, `express.json()` middleware
✅ Create `backend/src/config/env.ts` — Zod-validated environment variable loader
✅ Create `backend/src/utils/asyncHandler.ts` — async error forwarding wrapper
✅ Create `backend/src/middleware/errorHandler.ts` — global error handler returning standard error envelope
✅ Verify: `npm run dev` starts backend on port 3002, `GET /` returns 200

### Day 2 — Database Setup and Prisma Schema

✅ Install PostgreSQL locally; create `skillkraft` database
✅ Install `prisma` and `@prisma/client`; initialise with `npx prisma init`
✅ Write complete `prisma/schema.prisma` from Database Schema artefact: all 10 models, enums, relations, cascade rules
✅ Run `npx prisma migrate dev --name init` — verify migration succeeds with zero errors
✅ Create `backend/src/db/prisma.ts` — singleton Prisma client
✅  Run `npx prisma studio` — visually verify all tables were created correctly
✅ Add index recommendations from schema artefact as a second migration: `npx prisma migrate dev --name add-indexes`

### Day 3 — Auth Utilities and Validators

✅ Install `bcrypt`, `jsonwebtoken`, `@types/bcrypt`, `@types/jsonwebtoken`
✅  Create `backend/src/utils/jwt.ts` — `signAccessToken`, `signRefreshToken`, `verifyToken`
- Create `backend/src/utils/password.ts` — `hashPassword`, `comparePassword`
- Create `backend/src/types/express.d.ts` — augment `Request` to include `req.user`
- Create `backend/src/types/api.types.ts` — TypeScript interfaces for all response shapes
- Create `backend/src/validators/auth.validators.ts` — Zod schemas: `RegisterBody`, `LoginBody`, `RefreshBody`
- Create `backend/src/middleware/validateBody.ts` — generic Zod validation middleware factory
- Create `backend/src/middleware/authenticate.ts` — JWT verification middleware

### Day 4 — Auth Repositories, Services and Routes (BE)

- Create `backend/src/repositories/user.repository.ts` — `createUser`, `findByEmail`, `findById`
- Create `backend/src/repositories/refreshToken.repository.ts` — `create`, `findByToken`, `revoke`, `revokeAllForUser`
- Create `backend/src/services/auth.service.ts` — `register`, `login`, `refresh`, `logout` with full token rotation logic
- Create `backend/src/controllers/auth.controller.ts` — request parsing, service call, response formatting
- Create `backend/src/routes/auth.routes.ts` — `POST /register`, `POST /login`, `POST /refresh`, `POST /logout`
- Mount auth routes in `backend/src/routes/index.ts` under `/api/v1`
- Verify with Postman: register a user, login, refresh token, logout — all return correct status codes and shapes

### Day 5 — User Profile Routes and Frontend Scaffold

- Create `backend/src/validators/user.validators.ts` — `UpdateProfileBody`, `ChangePasswordBody`
- Create `backend/src/repositories/user.repository.ts` — add `updateProfile`, `updatePassword`
- Create `backend/src/services/user.service.ts` — `getProfile`, `updateProfile`, `changePassword`
- Create `backend/src/controllers/user.controller.ts` and `backend/src/routes/user.routes.ts`
- Scaffold `frontend/` with Next.js 14: `npx create-next-app@latest` with TypeScript, TailwindCSS, App Router
- Install frontend dependencies: `axios`, `@tanstack/react-query`, `zod`, `react-hook-form`, `@hookform/resolvers`
- Install ShadCN: `npx shadcn-ui@latest init`; add components: `button`, `input`, `card`, `form`, `label`
- Create `frontend/lib/apiClient.ts` — Axios instance with base URL; add 401 interceptor (stub for now)
- Create `frontend/lib/auth.ts` — token storage helpers
- Create `frontend/providers/AppProviders.tsx` — wrap with `QueryClientProvider`
- Create `frontend/lib/queryClient.ts` and `frontend/lib/utils.ts` (`cn` helper)

### Day 6 — Auth Pages: Register and Login (FE)

- Create `frontend/app/(auth)/register/page.tsx` — registration form using `react-hook-form` + Zod
- Create `frontend/app/(auth)/login/page.tsx` — login form
- Create `frontend/hooks/useAuth.ts` — `login`, `register`, `logout` mutations using TanStack Query
- Wire `useAuth` to register and login pages — on success, store tokens and redirect to `/dashboard`
- Create `frontend/components/layout/AuthGuard.tsx` — redirect unauthenticated users to `/login`
- Create `frontend/app/(app)/layout.tsx` — app shell with `AuthGuard` wrapper (sidebar and topbar as empty placeholders for now)
- Create `frontend/app/(app)/dashboard/page.tsx` — empty placeholder page confirming auth works
- Verify end-to-end: register in browser → redirect to dashboard; refresh page → stay on dashboard; logout → redirect to login

### Day 7 — App Shell: Sidebar, Topbar, Shared Components (FE)

- Add ShadCN components: `sheet`, `separator`, `avatar`, `dropdown-menu`, `progress`, `badge`, `skeleton`
- Create `frontend/components/layout/Sidebar.tsx` — nav links: Dashboard, Roadmap, History, Settings; active state highlight
- Create `frontend/components/layout/Topbar.tsx` — user avatar, name, logout dropdown
- Create `frontend/components/shared/LoadingSpinner.tsx`, `ErrorMessage.tsx`, `PageHeader.tsx`
- Create `frontend/types/api.types.ts` — copy and sync type interfaces from backend
- Wire Sidebar and Topbar into `(app)/layout.tsx`
- Create `frontend/app/api/auth/refresh/route.ts` — Next.js route handler for silent token refresh
- Complete `frontend/lib/apiClient.ts` — wire 401 interceptor to call the refresh route and retry
- Verify: navigate between sidebar links; topbar shows logged-in user name; token refresh works silently

---

## Week 2 — Onboarding, AI Roadmap Generation, Roadmap Pages

### Day 8 — AI Client and Roadmap Generation Service (BE)

- Install `openai` SDK
- Create `backend/src/services/ai/ai.client.ts` — OpenAI client singleton, model config (`gpt-4o`)
- Create `backend/src/services/ai/generateRoadmap.ts` — prompt engineering: system prompt instructs model to return JSON only; parse and validate output; handle malformed JSON with retry (up to 2 retries)
- Create `backend/src/services/ai/recommendResources.ts` — generates 3–5 resources per topic as JSON; same JSON-only prompt pattern
- Write the prompt templates for both functions as exported constants alongside each file for easy future editing
- Test both AI functions in isolation with hardcoded inputs using `ts-node` — verify JSON output parses correctly

### Day 9 — Onboarding Backend: Repositories, Service, Route (BE)

- Create `backend/src/validators/onboarding.validators.ts` — `OnboardingBody` Zod schema
- Create `backend/src/repositories/roadmap.repository.ts` — `create`, `findActiveByUserId`, `archiveById`, `rename`
- Create `backend/src/repositories/phase.repository.ts` — `createMany`, `findByRoadmapId`
- Create `backend/src/repositories/topic.repository.ts` — `createMany`, `findById`, `findByPhaseId`, `updateOrder`
- Create `backend/src/repositories/resource.repository.ts` — `createMany`, `findByTopicId`, `create` (user), `deleteById`
- Create `backend/src/services/onboarding.service.ts` — saves profile, calls `generateRoadmap` AI, calls `recommendResources` AI per topic (batch), persists all to DB in one Prisma transaction
- Create `backend/src/controllers/onboarding.controller.ts` and `backend/src/routes/onboarding.routes.ts` — `POST /onboarding`
- Verify with Postman: submit onboarding body → roadmap + resources appear in database via Prisma Studio

### Day 10 — Roadmap Backend: Get, Rename, Regenerate (BE)

- Create `backend/src/repositories/progress.repository.ts` — `findByUserAndTopic`, `upsert`, `findAllByUserAndRoadmap`
- Create `backend/src/services/roadmap.service.ts` — `getActiveRoadmap` (fetches roadmap with phases, topics, resources, and user progress joined), `renameRoadmap`, `regenerateRoadmap` (archive + regenerate)
- Create `backend/src/controllers/roadmap.controller.ts` and `backend/src/routes/roadmap.routes.ts`
- Endpoints: `GET /roadmap`, `PATCH /roadmap`, `POST /roadmap/regenerate`
- Verify with Postman: GET returns full nested roadmap including `isBookmarkedByUser: false` on all resources and correct `status: NOT_STARTED` on all topics

### Day 11 — Onboarding Wizard Frontend (FE)

- Install `@dnd-kit/core`, `@dnd-kit/sortable` (needed later but install now to avoid mid-build dependency issues)
- Create `frontend/app/(app)/onboarding/page.tsx` — redirect to `/dashboard` if `onboardingDone: true`
- Create `frontend/components/onboarding/OnboardingWizard.tsx` — stepper parent managing step index and form state
- Create `frontend/components/onboarding/StepCurrentRole.tsx` — text input, 300 char limit, character counter
- Create `frontend/components/onboarding/StepTargetRole.tsx` — text input with hardcoded autocomplete suggestions
- Create `frontend/components/onboarding/StepWeeklyHours.tsx` — ShadCN slider 2–20, live label
- Create `frontend/components/onboarding/StepTimeline.tsx` — ShadCN select: 3, 6, 12 months
- Wire wizard to `POST /onboarding` API on final step submit; show loading state during AI generation (estimated wait message: "Generating your personalised roadmap…")
- On success: set `onboardingDone` in auth state, redirect to `/roadmap`

### Day 12 — Roadmap Page: Full Roadmap View (FE)

- Create `frontend/hooks/useRoadmap.ts` — TanStack Query `useQuery` wrapping `GET /roadmap`
- Create `frontend/app/(app)/roadmap/page.tsx` — loading skeleton, error state, full roadmap rendered on success
- Create `frontend/components/roadmap/RoadmapView.tsx` — renders phases in order with overall Career Readiness Score banner at top
- Create `frontend/components/roadmap/PhaseAccordion.tsx` — ShadCN collapsible; shows phase title, phase progress bar, topic list
- Create `frontend/components/roadmap/TopicRow.tsx` — topic title, estimated hours badge, status pill (Not Started / In Progress / Complete), checkpoint icon if `isCheckpoint: true`
- Verify: onboarding → roadmap page shows all phases and topics with correct status indicators

### Day 13 — Drag and Drop Topic Reorder (FE + BE)

- Create `backend/src/validators/topic.validators.ts` — `ReorderTopicsBody` Zod schema
- Create `backend/src/services/topic.service.ts` — `reorderTopics` (validates array matches phase topic IDs, updates `order` field on each topic in a Prisma transaction)
- Create `backend/src/controllers/topic.controller.ts` and add `PATCH /topics/:topicId/reorder` route
- Create `frontend/components/roadmap/DragDropTopicList.tsx` — wrap `TopicRow` items with `@dnd-kit/sortable`; on drag end, optimistically update local order and call `PATCH /topics/:topicId/reorder`
- Wire `DragDropTopicList` into `PhaseAccordion`
- Verify: drag a topic to a new position → order persists on page refresh

### Day 14 — Topic Detail Page: Shell and Resources (FE + BE)

- Create `backend/src/services/topic.service.ts` — add `getTopicById` (fetches topic with resources, user progress, latest quiz attempt)
- Add `GET /topics/:topicId` route
- Create `frontend/hooks/useTopic.ts` — TanStack Query `useQuery` wrapping `GET /topics/:topicId`
- Create `frontend/app/(app)/roadmap/[topicId]/page.tsx` — loading skeleton, topic detail shell
- Create `frontend/components/topic/TopicDetail.tsx` — phase breadcrumb, topic title, description, status action button, resources section
- Create `frontend/components/topic/ResourceList.tsx` — renders `ResourceCard` for each resource
- Create `frontend/components/topic/ResourceCard.tsx` — title, type badge, "Search" button that opens `https://www.google.com/search?q=<searchQuery>` in new tab, bookmark toggle (stub for now)
- Create `frontend/components/topic/AddResourceForm.tsx` — inline form; stub submit for now
- Verify: click a topic on roadmap page → topic detail renders with all resources

---

## Week 3 — Progress Tracking, Resources, Bookmarks, Career Readiness Score

### Day 15 — Progress Tracking Backend (BE)

- Complete `backend/src/services/topic.service.ts` — add `updateTopicProgress`: upserts `UserTopicProgress`, enforces checkpoint rule (if `isCheckpoint: true` and status is `COMPLETE`, verifies latest quiz attempt has `passed: true`, otherwise returns 403)
- Add `PATCH /topics/:topicId/progress` route
- Create `backend/src/services/streak.service.ts` — `calculateStreak(userId)`: pure function, queries `UserTopicProgress.lastActivityAt`, walks backwards from today, returns integer streak count
- Write unit test for `streak.service.ts` immediately (it is pure logic — easy to test in isolation)
- Verify with Postman: update topic status → DB row created/updated; checkpoint enforcement returns 403 correctly

### Day 16 — Progress Tracking Frontend (FE)

- Add `PATCH /topics/:topicId/progress` mutation to `useTopic.ts`
- Wire status action button in `TopicDetail.tsx` — "Mark In Progress" / "Mark Complete" (complete disabled for checkpoints with no passing quiz — show tooltip explaining why)
- On status change: invalidate TanStack Query cache for `useRoadmap` and `useTopic` so roadmap page progress bars update automatically
- Update `TopicRow.tsx` — status pill reflects live status from cache
- Add phase progress bar calculation to `PhaseAccordion.tsx` — `(completedTopicsInPhase / totalTopicsInPhase) × 100`
- Verify end-to-end: mark topics complete on topic page → roadmap page shows updated progress bars immediately

### Day 17 — Resource Management Backend (BE)

- Complete `backend/src/services/resource.service.ts` — `addUserResource` (validates `source = USER`, saves with `addedByUserId`), `deleteResource` (validates resource belongs to user's roadmap and `source = USER`, returns 403 for AI resources)
- Create `backend/src/controllers/resource.controller.ts` and routes: `POST /topics/:topicId/resources`, `DELETE /resources/:resourceId`
- Create `backend/src/repositories/bookmark.repository.ts` — `create`, `deleteByUserAndResource`, `findAllByUser`, `existsByUserAndResource`
- Create `backend/src/services/bookmark.service.ts` — `addBookmark` (checks duplicate → 409), `removeBookmark` (checks exists → 404), `getAllBookmarksForUser`
- Create `backend/src/controllers/bookmark.controller.ts` and routes: `POST /resources/:resourceId/bookmark`, `DELETE /resources/:resourceId/bookmark`, `GET /bookmarks`
- Verify with Postman: add resource, delete resource, bookmark, unbookmark, list bookmarks — all return correct shapes

### Day 18 — Resource Management and Bookmarks Frontend (FE)

- Wire `AddResourceForm.tsx` submit to `POST /topics/:topicId/resources` mutation; invalidate topic query on success
- Add delete button to `ResourceCard.tsx` for `source = USER` resources; wire to `DELETE /resources/:resourceId`
- Create `frontend/hooks/useBookmark.ts` — `addBookmark` and `removeBookmark` mutations with optimistic UI update (toggle `isBookmarkedByUser` immediately, revert on error)
- Wire bookmark toggle in `ResourceCard.tsx` to `useBookmark`
- Add bookmarks page link to sidebar; create `frontend/app/(app)/bookmarks/page.tsx` — fetches `GET /bookmarks`, renders grouped by topic
- Verify: add resource → appears in list; delete → removed; bookmark toggle → instant UI feedback; bookmarks page shows grouped list

### Day 19 — Career Readiness Score Service (BE)

- Create `backend/src/services/careerScore.service.ts` — implement full weighted formula:
  - `completionScore`: queries `UserTopicProgress` count WHERE status = COMPLETE vs total topics
  - `quizScore`: queries most recent `QuizAttempt` per checkpoint topic, averages scores
  - `consistencyScore`: computes `paceRatio` from `user.createdAt`, `user.targetMonths`, completion count
  - Handles all edge cases: zero topics, zero checkpoints attempted, day zero
  - Returns typed object: `{ total, breakdown: { completionScore, quizScore, consistencyScore }, components: { ... } }`
- Create `backend/src/routes/scores.routes.ts` — `GET /scores/career-readiness`
- Create `backend/src/controllers/scores.controller.ts`
- Write unit tests for `careerScore.service.ts` — test all three components independently with known inputs and expected outputs; test edge cases (all topics complete + no quizzes = max 50)

### Day 20 — Career Readiness Score Frontend (FE)

- Add ShadCN component: `tooltip`
- Create `frontend/components/dashboard/CareerReadinessScore.tsx` — circular gauge showing score 0–100; colour transitions: 0–39 red, 40–69 amber, 70–100 green; breakdown tooltip on hover showing three component scores with labels and values
- Wire to `GET /scores/career-readiness` via a dedicated `useCareerScore` hook
- Add `CareerReadinessScore` component to roadmap page header (above phases) and to the dashboard page (stub layout for now)
- Verify: complete a topic → score updates; complete a checkpoint quiz → score increases on quiz component; fall behind pace → consistency score visible in tooltip

### Day 21 — Topic Reorder Polish and Week 3 Integration Check

- Polish `DragDropTopicList.tsx` — add drag handle icon, drag overlay, smooth animation
- Add keyboard accessibility to drag and drop (dnd-kit supports this natively — wire it)
- Verify all Week 3 features work together end-to-end: onboarding → roadmap → topic detail → mark progress → bookmark → career readiness score updates
- Fix any TypeScript errors or API response shape mismatches discovered during integration
- Commit all work with a clean git history; tag as `v0.3-week3-complete`

---

## Week 4 — Quiz System, Concept Explanation (SSE Streaming)

### Day 22 — Quiz Backend: Generate and Session Store (BE)

- Create `backend/src/services/ai/generateQuiz.ts` — prompt engineering: instructs model to return JSON array of 5 questions; each question has `question`, `options` (4 strings), `correctIndex`; parse and validate output; retry on malformed JSON
- Create `backend/src/utils/quizSessionStore.ts` — in-memory `Map<string, { questions: QuizQuestion[], expiresAt: number }>` keyed by `userId:topicId`; `set` with 30-minute TTL, `get` with expiry check, `delete` after submission
- Create `backend/src/services/quiz.service.ts` — `generateQuiz`: verifies topic `isCheckpoint: true` (403 otherwise), calls AI, stores in session, returns questions WITHOUT `correctIndex` to client
- Create `backend/src/controllers/quiz.controller.ts` and `backend/src/routes/quiz.routes.ts` — `POST /topics/:topicId/quiz/generate`
- Verify with Postman: call generate → receive 5 questions with no `correctIndex`; call again → new questions generated; non-checkpoint topic → 403

### Day 23 — Quiz Backend: Submit, Score, Store Attempts (BE)

- Create `backend/src/services/ai/scoreQuiz.ts` — given incorrect question/answer pairs, generates a short plain-language explanation for each wrong answer; returns JSON array of explanations
- Create `backend/src/repositories/quiz.repository.ts` — `createAttempt`, `findLatestByUserAndTopic`, `findAllByUserAndTopic`
- Complete `backend/src/services/quiz.service.ts` — `submitQuiz`: retrieves session from store (404 if expired), scores answers using stored `correctIndex` (never trusts client), calls `scoreQuiz` AI for wrong answers, persists `QuizAttempt` with full JSON snapshot, deletes session, returns results
- Add `POST /topics/:topicId/quiz/submit` and `GET /topics/:topicId/quiz/attempts` routes
- Verify with Postman: submit correct answers → score 5, passed true; submit wrong answers → score returned with AI explanations; submit after session expires → 404

### Day 24 — Quiz Frontend: Generate and Question UI (FE)

- Add ShadCN components: `dialog`, `radio-group`
- Create `frontend/hooks/useQuiz.ts` — `generateQuiz` mutation (calls generate endpoint, stores questions in hook state), `submitQuiz` mutation (sends answers, receives results)
- Create `frontend/components/quiz/QuizQuestion.tsx` — question text, 4 radio button options with ShadCN `RadioGroup`; selected option highlighted; disabled after submission
- Create `frontend/components/topic/QuizModal.tsx` — ShadCN Dialog; three internal states: `idle` (show "Take Quiz" button), `in-progress` (show questions), `results` (show score); manages question navigation
- Wire "Take Quiz" button in `TopicDetail.tsx` to open `QuizModal`
- Verify: open quiz modal → questions render; select options → selections tracked; UI clearly shows which question user is on

### Day 25 — Quiz Frontend: Results, Scoring, Feedback (FE)

- Create `frontend/components/quiz/QuizResults.tsx` — score display (e.g. "4 / 5"), pass/fail banner, per-question result rows showing correct answer and AI explanation for wrong answers
- Wire `submitQuiz` mutation in `QuizModal.tsx` — on submit, show loading state, then transition to results state
- On pass (score ≥ 4): show green success banner, "Mark Complete" button that calls `PATCH /topics/:topicId/progress` with `status: COMPLETE`; invalidate topic and roadmap caches; invalidate career readiness score cache
- On fail: show amber banner, "Review and Retry" button that closes modal; topic stays In Progress
- Add quiz attempt history to `TopicDetail.tsx` — "Previous attempts" section below resources showing date and score of past attempts (fetched from `GET /topics/:topicId/quiz/attempts`)
- Verify full quiz flow: generate → answer → submit → pass → mark complete → career readiness score updates

### Day 26 — Concept Explanation Backend: SSE Streaming (BE)

- Create `backend/src/services/ai/explainConcept.ts` — takes topic title, description, conversation history, user message; calls OpenAI with `stream: true`; returns the stream object for the controller to pipe
- Create `backend/src/validators/explain.validators.ts` — `ExplainBody` Zod schema: `conversationHistory` max 10 turns, `userMessage` max 1000 chars
- Create `backend/src/controllers/explain.controller.ts` — sets `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`; pipes OpenAI stream chunks as `data: {"chunk": "..."}` SSE events; sends `data: {"done": true}` on completion; handles stream errors gracefully
- Create `backend/src/routes/explain.routes.ts` — `POST /topics/:topicId/explain`
- Verify with curl: call explain endpoint → text streams token by token in terminal; `done` event fires at end

### Day 27 — Concept Explanation Frontend: Streaming Panel (FE)

- Add ShadCN component: `sheet` (slide-over panel)
- Create `frontend/hooks/useExplain.ts` — manages SSE connection using `fetch` with `ReadableStream`; accumulates chunks into a single string; exposes `{ explanation, isStreaming, error, sendMessage, conversationHistory }`
- Create `frontend/components/topic/ExplainPanel.tsx` — ShadCN `Sheet` opening from the right; initial state shows topic title and "Explain this topic" button; on click, initiates stream and renders text as it arrives (character-by-character reveal effect); follow-up input field appears after first explanation; conversation history rendered as alternating user/assistant bubbles
- Wire "Explain this topic" button in `TopicDetail.tsx` to open `ExplainPanel`
- Verify: click explain → panel opens → text streams in real time; type follow-up question → new streamed response appears below

### Day 28 — Quiz and Explanation Integration Polish and Week 4 Check

- Polish `QuizModal.tsx` — add progress indicator (Question 1 of 5), keyboard shortcut to select options (1–4 keys)
- Polish `ExplainPanel.tsx` — add loading pulse animation while first chunk arrives; disable input while streaming; show error state if stream fails
- Verify all Week 4 features end-to-end: topic → quiz → pass → complete; topic → explain → follow-up question → answer streams
- Fix any TypeScript errors or race conditions in streaming logic
- Commit and tag `v0.4-week4-complete`

---

## Week 5 — Dashboard, Next Topic AI, Weekly Reviews, History, Settings

### Day 29 — Dashboard Backend: Aggregator and Next Topic AI (BE)

- Create `backend/src/services/ai/nextTopic.ts` — takes completed topic titles, in-progress topics, remaining topics, pace data; returns `{ topicId, title, reason }` as JSON
- Create `backend/src/services/dashboard.service.ts` — single function `getDashboardData(userId)` that:
  - Fetches active roadmap summary (title, current phase, phase progress)
  - Calls `careerScore.service.ts` for score and breakdown
  - Calls `streak.service.ts` for current streak
  - Fetches latest `WeeklyReview` for the user
  - Calls `nextTopic.ts` AI service for recommendation
  - Assembles and returns the full dashboard response object
- Create `backend/src/controllers/dashboard.controller.ts` and `backend/src/routes/dashboard.routes.ts` — `GET /dashboard`
- Create `backend/src/routes/nextTopic.routes.ts` — `POST /ai/next-topic` (calls same AI function, lighter payload)
- Verify with Postman: `GET /dashboard` returns all sections correctly populated; `POST /ai/next-topic` returns topic and reason

### Day 30 — Dashboard Frontend: Main Dashboard Page (FE)

- Update `frontend/components/dashboard/ProgressOverview.tsx` — rename to reflect Career Readiness Score as primary metric; show score gauge, breakdown tooltip, current phase label
- Create `frontend/hooks/useDashboard.ts` — TanStack Query `useQuery` wrapping `GET /dashboard`
- Create `frontend/components/dashboard/StreakCard.tsx` — streak count with flame icon, "last active" timestamp
- Create `frontend/components/dashboard/NextTopicCard.tsx` — topic title, estimated hours, checkpoint badge if applicable, one-sentence AI reason, "Start Learning" button linking to topic page
- Create `frontend/components/dashboard/LatestReviewCard.tsx` — week start date, career readiness score at review, summary snippet, link to full history
- Wire all components into `frontend/app/(app)/dashboard/page.tsx` with loading skeletons for each card
- Verify: dashboard loads with all four cards; career readiness score matches score on roadmap page

### Day 31 — Weekly Review Backend: Service, Cron Job, Manual Trigger (BE)

- Create `backend/src/services/ai/weeklyReview.ts` — takes user name, topics completed this week, quiz scores this week, career readiness score, current streak, days remaining; returns narrative (200–300 words) + `nextTopicTitle` + `nextTopicReason` as JSON
- Create `backend/src/repositories/review.repository.ts` — `create`, `findLatestByUserId`, `findAllByUserId`, `existsForWeek` (deduplication check)
- Create `backend/src/services/review.service.ts` — `generateReview(userId)`: checks for existing review this week (409 if exists), assembles context, calls AI, persists `WeeklyReview` row with `careerReadinessScoreAtReview` populated; `getAllReviews(userId)`
- Create `backend/src/jobs/weeklyReview.job.ts` — `node-cron` schedule `0 8 * * 0` (Sunday 08:00 UTC); fetches all users with `onboardingDone: true`; calls `generateReview` for each; logs successes and errors without throwing
- Create `backend/src/controllers/review.controller.ts` and `backend/src/routes/review.routes.ts` — `GET /reviews`, `POST /reviews/generate`
- Verify with Postman: `POST /reviews/generate` → review created and returned; call again → 409; `GET /reviews` → list returned

### Day 32 — History Page and Settings Page (FE)

- Create `frontend/app/(app)/history/page.tsx` — fetches `GET /reviews`; renders list of weekly reviews with week date, career readiness score at review, topics completed count, avg quiz score, narrative, and next topic suggestion
- Add ShadCN component: `accordion` — each review is collapsible; shows summary line when collapsed, full narrative when expanded
- Create `frontend/app/(app)/settings/page.tsx` — three sections:
  - Profile: `PATCH /users/me` form (first name, last name, weekly hours, target months)
  - Password: `PATCH /users/me/password` form (current password, new password, confirm)
  - Roadmap: "Regenerate Roadmap" button → confirmation dialog → calls `POST /roadmap/regenerate` → redirects to onboarding page with pre-filled values
- Wire all settings forms with `react-hook-form` + Zod validation and success/error toasts
- Verify: update profile → changes reflected in topbar; change password → old password rejected; regenerate → new roadmap appears

### Day 33 — Landing Page (FE)

- Create `frontend/app/page.tsx` — public landing page with:
  - Hero section: product name, one-line value proposition, "Get Started" CTA → `/register`
  - Three feature highlights: AI Roadmap, Career Readiness Score, Quiz-Gated Progress
  - How it works: three steps (Onboard → Learn → Track)
  - Footer with login link
- No external images required — use SVG illustrations or ShadCN `Card` components for feature blocks
- Redirect already-logged-in users from `/` to `/dashboard`
- Verify: landing page renders correctly at 1280px, 1024px, 768px

### Day 34 — Toast Notifications, Error States, Loading States Polish (FE)

- Add ShadCN component: `sonner` (toast notifications)
- Add success toasts: topic marked complete, resource added, bookmark toggled, settings saved, review generated
- Add error toasts: API errors (non-401), AI generation failures, quiz session expired
- Polish all loading skeletons — every page that fetches data must show a skeleton, not a blank screen, while loading
- Add empty states: roadmap page if no roadmap exists yet (redirect to onboarding), history page if no reviews yet, bookmarks page if none
- Verify: disconnect backend → frontend shows error toasts, not blank screens or console errors

### Day 35 — Week 5 Integration and Responsive Check

- Full end-to-end walkthrough of the entire user journey: register → onboard → roadmap → topic → progress → quiz → explain → dashboard → review → history → settings
- Fix any broken flows or mismatched API response shapes discovered during walkthrough
- Test all pages at 1280px, 1024px, and 768px — fix any layout breakages at 768px
- Commit and tag `v0.5-week5-complete`

---

## Week 6 — Testing, Polish, Bug Fixes, README

### Day 36 — Backend Unit Tests: Auth and Utilities (BE)

- Configure Jest: install `jest`, `ts-jest`, `@types/jest`; create `jest.config.ts`
- Write `backend/tests/unit/utils/jwt.test.ts` — test `signAccessToken`, `signRefreshToken`, `verifyToken` with valid and expired tokens
- Write `backend/tests/unit/utils/password.test.ts` — test `hashPassword` and `comparePassword`
- Write `backend/tests/unit/services/auth.service.test.ts` — mock repositories; test register (duplicate email → error), login (wrong password → error), refresh (revoked token → error)
- Run `npm test` — all pass with zero failures

### Day 37 — Backend Unit Tests: Business Logic Services (BE)

- Write `backend/tests/unit/services/streak.service.test.ts` — test with: 5 consecutive days (streak = 5), gap in middle (streak = days since gap), no activity (streak = 0), activity today only (streak = 1)
- Write `backend/tests/unit/services/careerScore.service.test.ts` — test all three components with known inputs; test: all topics complete + no quizzes = 50; all complete + all quizzes passed = 80 (if on pace); edge cases (day zero, no checkpoints)
- Write `backend/tests/unit/services/quiz.service.test.ts` — mock AI client and session store; test: non-checkpoint topic → 403; expired session → 404; correct scoring logic (4 correct = passed: true)
- Run full test suite — all pass

### Day 38 — Backend Integration Tests: Auth and Roadmap (BE)

- Install `supertest`, `@types/supertest`
- Set up test database: create `skillkraft_test` PostgreSQL database; add `DATABASE_URL_TEST` to `.env`; configure Jest to use test DB; add `beforeAll` migration and `afterAll` teardown
- Write `backend/tests/integration/auth.test.ts` — test full HTTP cycle: register → 201; login → 200 with tokens; refresh → 200 with new tokens; logout → 204; login after logout with old token → 401
- Write `backend/tests/integration/roadmap.test.ts` — mock AI services (return fixture JSON); test: `POST /onboarding` → roadmap created in DB; `GET /roadmap` → correct nested shape returned; `PATCH /roadmap` → title updated; `POST /roadmap/regenerate` → old roadmap archived, new one active

### Day 39 — Backend Integration Tests: Topics, Quiz, Reviews (BE)

- Write `backend/tests/integration/topic.test.ts` — test: `PATCH /topics/:topicId/progress` with valid status → 200; checkpoint topic with no quiz → 403 on COMPLETE; non-existent topic → 404
- Write `backend/tests/integration/quiz.test.ts` — mock AI; test: generate on non-checkpoint → 403; generate → session stored; submit with correct answers → passed: true, attempt persisted; submit after session expired → 404
- Write `backend/tests/integration/review.test.ts` — mock AI; test: `POST /reviews/generate` → 201, review in DB; call again same week → 409; `GET /reviews` → array returned
- Run full integration suite — all pass; fix any failures before proceeding

### Day 40 — Frontend Smoke Tests and Accessibility (FE)

- Install `@testing-library/react`, `@testing-library/jest-dom`, `jest-environment-jsdom`
- Write smoke test for `CareerReadinessScore.tsx` — mock hook data; verify score renders; verify tooltip content renders on hover
- Write smoke test for `QuizModal.tsx` — verify idle state renders; verify questions render when in-progress state; verify results render with pass/fail
- Write smoke test for `OnboardingWizard.tsx` — verify step navigation works; verify submit calls API mock
- Accessibility pass: add `aria-label` to all icon-only buttons; verify all form inputs have associated `label` elements; verify skip navigation is not needed (sidebar links are reachable by keyboard)
- Run Lighthouse in Chrome on dashboard page — aim for accessibility score ≥ 90

### Day 41 — Bug Fixes, Edge Cases, Final Polish

- Dedicated bug fix day — address all issues found during testing in Days 36–40
- Known edge cases to verify explicitly:
  - User with no quiz attempts — career readiness score quiz component shows 0, not NaN
  - User on day 0 (just onboarded) — consistency score shows 20 (full marks), not division by zero error
  - Roadmap with 0 completed topics — score shows 0, not undefined
  - Quiz session expires mid-attempt — user sees clear error message, not a 404 stack trace
  - SSE stream drops mid-explanation — `ExplainPanel` shows partial text with an error notice, not a blank panel
  - `POST /reviews/generate` called twice in same week — second call returns 409 with existing review ID
- Re-run full test suite after fixes — all pass

### Day 42 — README, Environment Documentation, Final Commit

- Write `README.md` at monorepo root:
  - Project description and feature list
  - Prerequisites: Node.js 20+, PostgreSQL 15+, OpenAI API key
  - Setup instructions: clone → install → env vars → DB migrate → run
  - How to run tests (unit and integration separately)
  - Folder structure overview (link to artefact)
  - API base URL and brief note on Postman collection
- Write `backend/.env.example` — all required keys with placeholder values and one-line comment explaining each
- Write `frontend/.env.local.example` — `NEXT_PUBLIC_API_URL` with placeholder
- Final end-to-end walkthrough of complete user journey — record a short Loom video for portfolio (optional but recommended)
- Final git commit: clean history, meaningful commit messages, no commented-out code
- Tag release `v1.0.0-skillkraft`

---

## Sprint Summary

```
Week 1  Days  1–7   Foundation: monorepo, backend core, auth, DB, frontend scaffold, app shell
Week 2  Days  8–14  Onboarding, AI roadmap generation, roadmap pages, topic detail shell
Week 3  Days 15–21  Progress tracking, resources, bookmarks, Career Readiness Score
Week 4  Days 22–28  Quiz system (generate, submit, results), concept explanation (SSE streaming)
Week 5  Days 29–35  Dashboard aggregator, next topic AI, weekly reviews, history, settings, landing page
Week 6  Days 36–42  Unit tests, integration tests, accessibility, bug fixes, README, final commit
```

**Total endpoints built:** 26  
**Total pages built:** 9 (landing, login, register, onboarding, dashboard, roadmap, topic detail, history, settings)  
**Total AI features integrated:** 6 (roadmap generation, resource recommendations, concept explanation, quiz generation, weekly review, next topic suggestion)  
**Total test files:** 11 (6 backend unit, 5 backend integration, 3 frontend smoke tests)

---

*End of Sprint Plan v1.0*
