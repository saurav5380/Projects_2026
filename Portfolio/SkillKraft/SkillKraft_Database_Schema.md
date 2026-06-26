# SkillKraft — Database Schema

**Version:** 1.2  
**Status:** Updated — Career Readiness Score computation note added  
**Depends on:** PRD v1.1

---

## 1. Design Decisions

The following choices shape the schema and are worth reviewing before implementation begins.

**Resources use a search query, not a direct URL.** As agreed in the PRD review, AI-generated resource links are unreliable. Each resource stores a `searchQuery` string (e.g., `"React useState hook tutorial"`) and a `resourceType`. The frontend constructs a Google search URL on the fly: `https://www.google.com/search?q=React+useState+hook+tutorial`. This keeps the data honest.

**Quizzes are not stored as templates.** A quiz is generated fresh every time a user requests one. What is stored is the `QuizAttempt` — a snapshot of the questions that were asked, the user's answers, and the score. This means the `questions` field on `QuizAttempt` holds a JSON snapshot, not a foreign key to a reusable question bank.

**Streaks are computed, not stored.** There is no `currentStreak` column on the User table. The streak is derived at query time by inspecting consecutive days with at least one `UserTopicProgress` update. This avoids the common bug of a stale streak counter caused by a missed cron update.

**Roadmap archiving uses a soft delete pattern.** When a user regenerates their roadmap, the old roadmap is not deleted. Its `archivedAt` timestamp is set. The active roadmap is always the one where `archivedAt` is null. This preserves history and makes "undo regeneration" possible in a future version.

**Next topic suggestion is cached per session, not persisted.** The AI suggestion for the next topic is not stored in the database. It is computed on dashboard load (or after a topic status change) and held in the frontend session. This avoids stale recommendations without a complex invalidation strategy.

**Career Readiness Score is computed, not stored.** No column or table is added for the score. It is calculated entirely in `services/careerScore.service.ts` on each request using data already fetched for the dashboard: `UserTopicProgress` rows (for completion and pace), `QuizAttempt` rows (for quiz performance), and the user's `targetMonths` and `createdAt` (for timeline). Storing it would require either a scheduled recalculation job or careful invalidation logic — both add complexity for no real benefit, since the inputs are cheap to query and the formula is fast to compute.

---

## 2. Entity Relationship Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   ┌──────────┐         ┌──────────────┐         ┌──────────────────────┐        │
│   │   User   │ 1 ───── * │   Roadmap   │ 1 ───── * │   RoadmapPhase      │        │
│   └──────────┘         └──────────────┘         └──────────────────────┘        │
│        │  │                                                 │                    │
│        │  │ 1                                               │ 1                  │
│        │  │                                                 │                    │
│        │  * ↓                                               * ↓                  │
│        │  ┌──────────────┐                        ┌──────────────────────┐       │
│        │  │ WeeklyReview │                        │        Topic         │       │
│        │  └──────────────┘                        └──────────────────────┘       │
│        │                                            │ 1     │ 1      │ 1         │
│        │                              ┌─────────────┘        │       └─────────┐ │
│        │                              * ↓                    │                * ↓│
│        │                    ┌──────────────────┐             │       ┌──────────┐│
│        │                    │    Resource      │             │       │QuizAttempt││
│        │                    └──────────────────┘             │       └──────────┘│
│        │                            │ 1                      │            ↑ *    │
│        │                            │                        │            │      │
│        │ 1          * ↓             * ↓                      │            │      │
│        └──── ┌──────────────────────────┐       ┌────────────────────┐   │      │
│              │  UserResourceBookmark    │       │  UserTopicProgress │───┘      │
│              └──────────────────────────┘       └────────────────────┘          │
│                 (User * ↔ * Resource)               (User * ↔ * Topic)          │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Relationships Summary

- A `User` has many `Roadmap` records (one active, rest archived).
- A `User` has many `WeeklyReview` records.
- A `Roadmap` has many `RoadmapPhase` records, ordered by `order` field.
- A `RoadmapPhase` has many `Topic` records, ordered by `order` field.
- A `Topic` has many `Resource` records.
- A `Topic` has many `QuizAttempt` records (one per attempt, across all users).
- A `User` and `Topic` are linked through `UserTopicProgress` (join table with extra fields).
- A `User` and `Resource` are linked through `UserResourceBookmark` (join table). This replaces the old `isBookmarked` boolean on `Resource`, making bookmarks per-user rather than per-resource.
- `QuizAttempt` belongs to both a `User` and a `Topic`.

---

## 3. Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────
// USER
// ─────────────────────────────────────────

model User {
  id               String         @id @default(uuid())
  email            String         @unique
  passwordHash     String
  firstName        String
  lastName         String
  currentRole      String?        // filled during onboarding
  targetRole       String?        // filled during onboarding
  weeklyHours      Int?           // 2–20, filled during onboarding
  targetMonths     Int?           // 3, 6, or 12, filled during onboarding
  onboardingDone   Boolean        @default(false)
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  roadmaps         Roadmap[]
  weeklyReviews    WeeklyReview[]
  topicProgress    UserTopicProgress[]
  quizAttempts     QuizAttempt[]
  refreshTokens    RefreshToken[]
  bookmarks        UserResourceBookmark[]
}

// ─────────────────────────────────────────
// REFRESH TOKEN
// Stored server-side to support token rotation and revocation.
// ─────────────────────────────────────────

model RefreshToken {
  id          String   @id @default(uuid())
  token       String   @unique
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt   DateTime
  createdAt   DateTime @default(now())
  revokedAt   DateTime?
}

// ─────────────────────────────────────────
// ROADMAP
// One active roadmap per user (archivedAt is null).
// Previous roadmaps are kept with archivedAt set.
// ─────────────────────────────────────────

model Roadmap {
  id          String          @id @default(uuid())
  userId      String
  user        User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String          // e.g. "Marketing Manager → Product Manager"
  archivedAt  DateTime?       // null = active; set = archived
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  phases      RoadmapPhase[]
}

// ─────────────────────────────────────────
// ROADMAP PHASE
// e.g. "Phase 1: Foundations", "Phase 2: Core Skills"
// ─────────────────────────────────────────

model RoadmapPhase {
  id         String   @id @default(uuid())
  roadmapId  String
  roadmap    Roadmap  @relation(fields: [roadmapId], references: [id], onDelete: Cascade)
  title      String
  order      Int      // 1-based, controls display order
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  topics     Topic[]
}

// ─────────────────────────────────────────
// TOPIC
// A single learning unit within a phase.
// isCheckpoint = true means the user must pass a quiz to mark it complete.
// ─────────────────────────────────────────

model Topic {
  id              String       @id @default(uuid())
  phaseId         String
  phase           RoadmapPhase @relation(fields: [phaseId], references: [id], onDelete: Cascade)
  title           String
  description     String       // 2–4 sentences, AI-generated
  estimatedHours  Float
  isCheckpoint    Boolean      @default(false)
  order           Int          // 1-based, controls display order within phase
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  resources       Resource[]
  quizAttempts    QuizAttempt[]
  userProgress    UserTopicProgress[]
}

// ─────────────────────────────────────────
// RESOURCE
// AI-generated resources for a topic.
// No direct URL stored — searchQuery is used to construct a Google search link.
// Users can also add their own resources (source = "user").
// Bookmarks are tracked in UserResourceBookmark, not here,
// so multiple users can each bookmark the same resource independently.
// ─────────────────────────────────────────

enum ResourceType {
  ARTICLE
  COURSE
  DOCUMENTATION
  VIDEO
}

enum ResourceSource {
  AI        // generated during roadmap creation
  USER      // manually added by the user
}

model Resource {
  id            String                  @id @default(uuid())
  topicId       String
  topic         Topic                   @relation(fields: [topicId], references: [id], onDelete: Cascade)
  title         String
  searchQuery   String                  // used to build Google search URL on the frontend
  resourceType  ResourceType
  source        ResourceSource          @default(AI)
  addedByUserId String?                 // only set when source = USER; loose reference, not a FK
  createdAt     DateTime                @default(now())

  bookmarks     UserResourceBookmark[]
}

// ─────────────────────────────────────────
// USER RESOURCE BOOKMARK
// Join table between User and Resource.
// Replaces the isBookmarked boolean that was previously on Resource.
// This allows each user to maintain their own independent bookmark list,
// and is safe for future multi-user or shared-roadmap scenarios.
// ─────────────────────────────────────────

model UserResourceBookmark {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  resourceId  String
  resource    Resource @relation(fields: [resourceId], references: [id], onDelete: Cascade)
  bookmarkedAt DateTime @default(now())

  @@unique([userId, resourceId])
}

// ─────────────────────────────────────────
// USER TOPIC PROGRESS
// Join table between User and Topic with status and activity tracking.
// lastActivityAt is updated every time the user changes the status.
// This field is used for streak calculation.
// ─────────────────────────────────────────

enum TopicStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETE
}

model UserTopicProgress {
  id              String      @id @default(uuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  topicId         String
  topic           Topic       @relation(fields: [topicId], references: [id], onDelete: Cascade)
  status          TopicStatus @default(NOT_STARTED)
  lastActivityAt  DateTime    @default(now())
  completedAt     DateTime?   // set when status changes to COMPLETE
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@unique([userId, topicId])
}

// ─────────────────────────────────────────
// QUIZ ATTEMPT
// A snapshot of a single quiz session.
// questions stores the full JSON of what was generated and shown.
// answers stores the user's selected option index per question.
// score is the number of correct answers (0–5).
// ─────────────────────────────────────────

model QuizAttempt {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  topicId     String
  topic       Topic    @relation(fields: [topicId], references: [id], onDelete: Cascade)
  questions   Json     // snapshot: Array<{ question, options: string[], correctIndex: number }>
  answers     Json     // user's responses: Array<number> (selected option index per question)
  score       Int      // 0–5
  passed      Boolean  // true if score >= 4
  attemptedAt DateTime @default(now())
}

// ─────────────────────────────────────────
// WEEKLY REVIEW
// AI-generated narrative stored after each Sunday cron run (or manual trigger).
// ─────────────────────────────────────────

model WeeklyReview {
  id                String   @id @default(uuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  weekStartDate     DateTime // Monday of the reviewed week (for display and deduplication)
  narrative         String   // AI-generated summary, 200–300 words
  topicsCompleted   Int      // count for the week
  avgQuizScore      Float?   // average quiz score for the week (null if no quizzes taken)
  nextTopicTitle    String?  // AI-suggested next topic title
  nextTopicReason   String?  // one-sentence reason from AI
  generatedAt       DateTime @default(now())
}
```

---

## 4. Key Index Recommendations

These indexes should be added via a Prisma migration after the initial schema is created. They target the most frequent query patterns.

**On `Roadmap`**  
`(userId, archivedAt)` — the most common query is "fetch the active roadmap for this user," which filters on both columns.

**On `UserTopicProgress`**  
`(userId, lastActivityAt)` — used for streak calculation, which scans all activity dates for a user sorted by recency.

**On `QuizAttempt`**  
`(userId, topicId, attemptedAt)` — used when fetching "most recent attempt for this user on this topic."

**On `WeeklyReview`**  
`(userId, weekStartDate)` — used for deduplication check before generating a new review, and for the history page query.

**On `UserResourceBookmark`**  
`(userId)` — used when fetching all bookmarks for a user on the dashboard or topic page. The `@@unique([userId, resourceId])` constraint in Prisma already creates a composite index, so a separate single-column index on `userId` is sufficient for list queries.

---

## 5. Notable Query Patterns

### Fetching the active roadmap with all phases and topics

```
Roadmap (archivedAt IS NULL, userId = ?)
  └── RoadmapPhase (ordered by order ASC)
        └── Topic (ordered by order ASC)
              ├── Resource[]
              └── UserTopicProgress (for this user)
```

This is the main query for the `/roadmap` page. It is a single Prisma `findFirst` with nested `include` blocks.

### Computing overall progress percentage

```
Total topics in active roadmap  →  count of Topic records across all phases
Completed topics                →  count of UserTopicProgress where status = COMPLETE
Progress %                      →  (completed / total) * 100
```

### Computing the current streak

```
1. Fetch all UserTopicProgress rows for the user where lastActivityAt is not null,
   ordered by lastActivityAt DESC.
2. Extract the unique dates (ignoring time).
3. Walk backwards from today. If today's date is present, increment streak.
   Then check yesterday, the day before, and so on.
4. Stop at the first missing date.
```

This is computed in the Express service layer, not in SQL, for clarity.

### Fetching the most recent quiz attempt per topic

```
QuizAttempt (userId = ?, topicId = ?)
  ORDER BY attemptedAt DESC
  LIMIT 1
```

---

## 6. Data Integrity Rules

- Deleting a `User` cascades to: `Roadmap`, `WeeklyReview`, `UserTopicProgress`, `QuizAttempt`, `RefreshToken`, `UserResourceBookmark`.
- Deleting a `Roadmap` cascades to: `RoadmapPhase` → `Topic` → `Resource` → `UserResourceBookmark`, `QuizAttempt`, `UserTopicProgress`.
- A `UserTopicProgress` row is created lazily — only when the user first interacts with a topic (changes status from NOT_STARTED). Topics that have never been touched have no progress row.
- `QuizAttempt.passed` is a derived boolean (`score >= 4`) stored explicitly to simplify queries and avoid recomputing the threshold.
- `Resource.addedByUserId` is intentionally not a foreign key relation to `User` in Prisma — it is a loose reference stored for audit purposes only. If the user is deleted, the resource record remains (it belongs to the topic, not the user).
- `UserResourceBookmark` uses a `@@unique([userId, resourceId])` constraint to prevent duplicate bookmarks. Attempting to bookmark an already-bookmarked resource will throw a unique constraint violation, which the service layer should handle gracefully (treat as a no-op).

---

*End of Database Schema v1.2*
