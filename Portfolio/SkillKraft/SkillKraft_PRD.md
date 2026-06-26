# SkillKraft — Product Requirements Document

**Version:** 1.1  
**Status:** Updated — Career Readiness Score added  
**Last Updated:** June 2026

---

## 1. Product Overview

### 1.1 Vision

SkillKraft is an AI-powered web application that helps working professionals plan and execute career transitions. It removes the paralysis of "where do I start?" by generating a personalised learning roadmap, curating the right resources, tracking progress, and continuously testing proficiency — all in one place.

### 1.2 Problem Statement

Professionals wanting to switch careers (e.g., moving from sales into data science, or from manual QA into software engineering) face three recurring pain points:

- They do not know which skills to learn, in what order, or how long each will take.
- They find resources on their own but have no structured way to track what they have covered.
- They have no reliable way to check whether they have actually understood a topic before moving forward.

SkillKraft solves all three.

### 1.3 Target Users

**Primary user:** A working professional (25–45 years old) who wants to transition into a new career domain such as software development, data science, UX design, digital marketing, or product management. They are time-constrained, self-motivated, and comfortable using modern web apps.

**Secondary user:** A freelancer or consultant upskilling within their existing domain to command higher rates or take on new types of client work.

---

## 2. Goals and Non-Goals

### 2.1 Goals

- Let a user describe their current background and target career, and instantly receive a structured, week-by-week AI-generated learning roadmap.
- Surface curated learning resources (courses, articles, documentation) mapped to each topic in the roadmap.
- Allow the user to mark topics as complete and track overall progress visually.
- Test the user's understanding at key checkpoints using AI-generated quizzes.
- Provide an AI assistant that can explain any concept on the roadmap in plain language.
- Send a weekly AI-generated progress summary and suggest the next recommended topic.
- Show the user a **Career Readiness Score** — a weighted composite metric that reflects not just how much they have covered, but how well they have understood it and how consistently they have been learning.

### 2.2 Non-Goals for v1.0

- SkillKraft does not create or host its own course video content.
- SkillKraft does not integrate with LinkedIn, GitHub, or external job boards.
- SkillKraft does not support team or organisational accounts (multi-tenant) in v1.0.
- SkillKraft does not offer a native mobile application; the web app will be responsive but desktop-first.
- SkillKraft does not process payments or offer paid tiers in v1.0.

---

## 3. User Personas

### Persona A — "Career Switcher" Priya

Priya is a 32-year-old marketing manager who wants to move into product management. She has heard about product frameworks and tools but does not know where to begin. She has 1–2 hours per day to learn. She needs a clear plan, not another YouTube rabbit hole.

### Persona B — "Upskilling Freelancer" Marcus

Marcus is a 38-year-old backend developer who mostly works with PHP. He wants to pick up the modern JavaScript/TypeScript full-stack ecosystem to win better freelance contracts. He has a rough idea of what to learn but wants someone to organise it for him and keep him accountable.

---

## 4. User Journeys

### 4.1 Onboarding and Roadmap Generation

1. User lands on the marketing page and clicks "Get Started."
2. User signs up with email and password.
3. User is taken to the onboarding wizard:
   - Step 1: Current role and experience summary (free text, up to 300 characters).
   - Step 2: Target career role (free text with autocomplete suggestions).
   - Step 3: Available weekly learning hours (slider: 2–20 hours per week).
   - Step 4: Target timeline to transition (dropdown: 3 months, 6 months, 12 months).
4. On submission, SkillKraft calls the AI service and generates a personalised roadmap.
5. The roadmap is displayed as a structured list of phases, each containing topics in sequence.
6. User can rename their roadmap or regenerate it with a revised prompt.

### 4.2 Daily Learning Loop

1. User logs in and sees their dashboard: current phase, next recommended topic, and overall progress.
2. User clicks into a topic and sees a description and a list of curated resources (courses, articles).
3. User reads or watches the linked resource externally, then returns to SkillKraft.
4. User marks the topic as "In Progress" or "Complete."
5. If the topic is a checkpoint topic, the user is prompted to take an AI-generated quiz before the topic can be marked complete.

### 4.3 Quiz and Proficiency Check

1. User clicks "Take Quiz" on a checkpoint topic.
2. AI generates 5 multiple-choice questions on that topic, freshly each time.
3. User answers all 5 questions and submits.
4. Results are shown immediately: score, correct answers, and a brief AI explanation for each incorrect answer.
5. A score of 4/5 or above marks the topic as complete. Below that, the user is encouraged to review and retake.
6. All quiz attempts and scores are stored for the user's progress history.

### 4.4 Concept Explanation

1. On any topic page, the user can click "Explain This Topic."
2. A side panel opens with an AI-generated plain-language explanation of the topic.
3. The user can ask follow-up questions in the same panel (a simple multi-turn chat scoped to that topic).

### 4.5 Weekly Progress Review

1. Every Sunday, a weekly review is triggered (either automatically via a cron job, or manually by the user clicking "Generate Weekly Review").
2. AI generates a summary covering: topics completed this week, current streak, quiz performance, and the recommended focus for next week.
3. The review is stored in the user's history and displayed on the dashboard.

---

## 5. Functional Requirements

### 5.1 Authentication

- Users can register with email and password.
- Passwords are hashed using bcrypt.
- JWT-based session management (access token + refresh token).
- Protected routes redirect unauthenticated users to the login page.

### 5.2 Onboarding Wizard

- A multi-step form (4 steps) collects current role, target role, weekly hours, and timeline.
- All fields are validated client-side (Zod schemas) and server-side (Zod on the Express API).
- On completion, the AI roadmap generation is triggered and the user is redirected to their dashboard.

### 5.3 Roadmap

- A roadmap consists of phases (e.g., "Phase 1: Foundations"), each containing an ordered list of topics.
- Each topic has a title, a short description, an estimated duration in hours, and a flag indicating whether it is a checkpoint topic (requiring a quiz).
- Roadmaps are stored in PostgreSQL and associated with the user account.
- Users can regenerate a roadmap at any time, which archives the previous one.
- Users can manually reorder topics within a phase by drag and drop.

### 5.4 Resource Recommendations

- Each topic has a list of associated resources (title, URL, type: article / course / documentation / video).
- Resources are AI-generated at the time the roadmap is created and stored in the database.
- Users can manually add their own resource links to any topic.
- Users can mark a resource as "Bookmarked" for quick access later.

### 5.5 Progress Tracking

- Each topic has a status: Not Started, In Progress, or Complete.
- A visual progress indicator on the dashboard and roadmap page shows topic completion across all phases.
- A streak counter tracks how many consecutive days the user has engaged (marked at least one topic as In Progress or Complete).
- Raw completion percentage (topics complete ÷ total topics) is used internally as one input to the Career Readiness Score but is not displayed as a standalone metric on the dashboard. The Career Readiness Score is the primary progress indicator shown to the user.

### 5.6 AI Quiz

- Quizzes are generated on demand per topic; they are not pre-stored.
- Each quiz has exactly 5 multiple-choice questions, each with 4 options and one correct answer.
- Quiz attempts (questions, user answers, score, timestamp) are stored for history.
- A topic can only be marked Complete via quiz if the user scores 4/5 or above.
- Users may retake quizzes; only the most recent attempt's score is used for completion status.

### 5.7 Concept Explanation Panel

- Available on every topic page.
- Opens as a slide-over panel with an initial AI explanation of the topic.
- Supports follow-up questions in a threaded chat interface (up to 10 turns per session).
- Sessions are not persisted — they reset on page reload.

### 5.8 Weekly Progress Review

- A cron job runs every Sunday at 08:00 UTC and generates a weekly review for every active user.
- Reviews are also triggerable manually from the dashboard.
- Each review is stored and visible in a "History" tab on the dashboard.
- The review includes: topics completed, quiz scores, current streak, Career Readiness Score at time of review, and the AI-suggested next topic.

### 5.9 Suggest Next Topic

- The dashboard always shows a "Recommended Next" card.
- The recommendation is AI-driven: it considers current position in the roadmap, quiz scores, and pace relative to the target timeline.
- The recommendation is recalculated after each topic status change.

### 5.10 Career Readiness Score

The Career Readiness Score is the primary progress metric displayed to the user. It is a weighted composite of three signals, scored from 0 to 100.

It is intentionally different from a plain completion percentage. A user who marks every topic complete but fails every quiz will score significantly lower than a user who completes fewer topics but passes all checkpoints and maintains consistent pace. The score reflects genuine readiness, not just activity.

**Component 1 — Roadmap Completion (50% weight)**

Measures how much of the learning plan has been covered.

```
completion_score = (topics_marked_complete / total_topics_in_roadmap) × 50
```

**Component 2 — Quiz Performance (30% weight)**

Measures how well the user has demonstrated understanding at checkpoint topics. Only checkpoint topics that have at least one quiz attempt contribute. If no checkpoints have been attempted yet, this component returns 0.

```
quiz_score = (average_score_across_all_checkpoint_attempts / 5) × 30
```

The average is calculated using only the most recent attempt per checkpoint topic, consistent with the quiz retake rule.

**Component 3 — Learning Consistency (20% weight)**

Measures whether the user is on pace relative to their declared target timeline. A user ahead of or on pace scores 1.0. A user behind pace scores proportionally less.

```
expected_completion = days_elapsed / total_days_in_target_timeline
actual_completion   = topics_marked_complete / total_topics_in_roadmap
pace_ratio          = actual_completion / expected_completion  (capped at 1.0)
consistency_score   = pace_ratio × 20
```

If `days_elapsed` is 0 (first day), `consistency_score` defaults to 20 (full marks) to avoid division by zero on day one.

**Final formula:**

```
Career Readiness Score = completion_score + quiz_score + consistency_score
                       = (0–50) + (0–30) + (0–20)
                       = integer between 0 and 100
```

The score is rounded to the nearest integer before display.

**Calculation location:** The score is computed entirely in the Express service layer (`services/careerScore.service.ts`) on each dashboard load. It is not stored in the database, which avoids stale values and removes the need for a scheduled recalculation job. The inputs (topic statuses, quiz attempts, onboarding dates) are already fetched for the dashboard response, so no additional database queries are required.

**Display:** The score is shown prominently on the dashboard as a circular gauge or large number with a label ("Career Readiness Score"), alongside a brief breakdown showing the contribution of each component. The score is also included in weekly review narratives so the user can track it over time.

---

## 6. AI Features Detail

### 6.1 Generate Learning Roadmap

- **Trigger:** Onboarding wizard completion or manual regeneration.
- **Input to AI:** Current role, target role, weekly hours, target timeline.
- **Output expected:** A structured JSON object containing phases, each with an array of topics (title, description, estimated hours, isCheckpoint flag).
- **Model behaviour note:** The prompt should instruct the model to return only valid JSON with no markdown fencing or preamble, to allow safe parsing.

### 6.2 Recommend Resources

- **Trigger:** Roadmap generation (batch, one call per topic, or a single call for all topics).
- **Input to AI:** Topic title and description.
- **Output expected:** An array of 3–5 resource objects (title, URL, type).
- **Note:** The AI will suggest plausible resource URLs. A link-validation step should be added in a future version. For v1.0, resources are displayed as-is with a disclaimer.

### 6.3 Explain Concepts

- **Trigger:** User clicks "Explain This Topic" on a topic page.
- **Input to AI:** Topic title, topic description, and any follow-up user question.
- **Output expected:** A plain-language explanation in 150–300 words for the initial call; conversational follow-up responses thereafter.
- **UI:** Streamed response using the OpenAI/Anthropic streaming API so text appears progressively.

### 6.4 Generate Quizzes

- **Trigger:** User clicks "Take Quiz" on a checkpoint topic.
- **Input to AI:** Topic title and description.
- **Output expected:** A JSON array of 5 question objects, each with: question text, 4 options (array of strings), and the index of the correct answer.
- **Model behaviour note:** The prompt must instruct the model to return only valid JSON.

### 6.5 Weekly Progress Review

- **Trigger:** Cron job (Sunday 08:00 UTC) or manual trigger.
- **Input to AI:** User's name, topics completed this week, quiz scores this week, overall completion percentage, current streak, days remaining to target date.
- **Output expected:** A short narrative summary (200–300 words) with a "focus recommendation" section at the end.

### 6.6 Suggest Next Topic

- **Trigger:** After any topic status change, or on dashboard load if no cached suggestion exists.
- **Input to AI:** Completed topics, in-progress topics, remaining topics in the roadmap, and pace data (topics completed per week vs. target pace).
- **Output expected:** The title of the recommended next topic and a one-sentence reason (returned as JSON).

---

## 7. Non-Functional Requirements

### 7.1 Performance

- Dashboard must load within 2 seconds on a standard broadband connection.
- AI-generated content (roadmap, quizzes) should display a loading state with estimated wait time. Streaming is preferred for explanations.
- The application must handle up to 100 concurrent users without degradation in v1.0.

### 7.2 Security

- All API routes are protected by JWT middleware except `/auth/register` and `/auth/login`.
- Zod validation is applied on all incoming request bodies on the Express API layer.
- Environment variables (API keys, database URL, JWT secret) are never committed to source control.
- CORS is configured to allow only the Next.js frontend origin.

### 7.3 Responsiveness

- The application is built desktop-first but is fully usable on tablets (768px and above).
- Minimum supported viewport: 768px width.
- Core pages (Dashboard, Roadmap, Topic Detail) must be tested at 1280px, 1024px, and 768px.

### 7.4 Data Persistence

- All user-generated data (roadmaps, progress, quiz attempts, reviews) is persisted in PostgreSQL via Prisma ORM.
- No data is stored in local storage except for the JWT access token.

---

## 8. Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, TailwindCSS, ShadCN UI
- **Backend:** Express.js, TypeScript, Zod (request validation)
- **Database:** PostgreSQL with Prisma ORM
- **AI:** OpenAI API (GPT-4o) as primary; Anthropic Claude API as fallback option
- **Authentication:** JWT (access + refresh token pattern)
- **Background Jobs:** node-cron (for weekly review generation)
- **File/Asset Storage:** Not required for v1.0

---

## 9. Pages and Navigation

### 9.1 Public Pages

- `/` — Landing page (product description, CTA to sign up)
- `/login` — Login form
- `/register` — Registration form

### 9.2 Authenticated Pages

- `/dashboard` — Main dashboard: progress overview, recommended next topic, streak, recent weekly review
- `/onboarding` — Multi-step wizard (only shown once, redirects to `/dashboard` on completion)
- `/roadmap` — Full roadmap view: all phases and topics with status indicators
- `/roadmap/[topicId]` — Topic detail page: description, resources, quiz CTA, explain panel
- `/history` — Past weekly reviews
- `/settings` — Update profile, regenerate roadmap, change password

---

## 10. Out of Scope for v1.0 (Future Considerations)

- Social features: sharing roadmaps with other users, community forums.
- Integration with learning platforms (Coursera, Udemy APIs) for real-time course data.
- Native mobile application.
- Team/organisational accounts and admin dashboards.
- Paid subscription tiers and Stripe billing.
- Gamification elements beyond streak tracking (badges, leaderboards).
- Certificate generation on roadmap completion.

---

## 11. Success Metrics

- A user can complete onboarding and receive a roadmap in under 5 minutes from first landing.
- At least 70% of quiz attempts result in a pass score on the first or second try (indicative of appropriate question difficulty).
- A user who logs in on at least 3 days in a week can clearly see their progress reflected on the dashboard.
- All 6 AI features work end-to-end without returning a raw error to the user.
- A user who completes all topics but has never taken a quiz scores no higher than 50 on the Career Readiness Score, confirming the score correctly penalises unchecked completion.
- A user who is on pace and has passed all checkpoint quizzes scores 80 or above, confirming the score rewards genuine engagement.

---

*End of PRD v1.1*
