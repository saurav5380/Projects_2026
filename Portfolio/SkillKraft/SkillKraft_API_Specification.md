# SkillKraft — API Specification

**Version:** 1.1  
**Status:** Updated — Career Readiness Score added to dashboard response; new score endpoint added  
**Depends on:** PRD v1.1, Database Schema v1.1  
**Base URL:** `http://localhost:4000/api/v1` (development)  
**Content Type:** `application/json` for all requests and responses unless noted otherwise

---

## 1. Conventions

### 1.1 Authentication

All endpoints except `POST /auth/register`, `POST /auth/login`, and `POST /auth/refresh` require a valid JWT access token in the `Authorization` header.

```
Authorization: Bearer <access_token>
```

The access token expires after **15 minutes**. Use `POST /auth/refresh` with the refresh token to obtain a new one. The refresh token is returned in the login response body and should be stored securely by the client (not in localStorage).

### 1.2 Response Envelope

All responses follow a consistent envelope structure.

Success response:

```json
{
  "success": true,
  "data": { }
}
```

Error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description of what went wrong",
    "details": [ ]
  }
}
```

The `details` array is only present for validation errors (HTTP 422). Each item in `details` contains `field` and `message` strings.

### 1.3 HTTP Status Codes Used

- `200 OK` — Successful GET, PATCH, DELETE
- `201 Created` — Successful POST that created a resource
- `204 No Content` — Successful DELETE with no body returned
- `400 Bad Request` — Malformed request (e.g. invalid JSON)
- `401 Unauthorized` — Missing or invalid JWT
- `403 Forbidden` — Valid JWT but insufficient permission
- `404 Not Found` — Resource does not exist or does not belong to the authenticated user
- `409 Conflict` — Duplicate resource (e.g. bookmarking an already-bookmarked resource)
- `422 Unprocessable Entity` — Request body failed Zod validation
- `500 Internal Server Error` — Unexpected server or AI service error

### 1.4 ID Format

All resource IDs are UUID v4 strings.

### 1.5 Date Format

All timestamps are returned as ISO 8601 strings in UTC (e.g. `"2026-06-25T08:00:00.000Z"`).

---

## 2. Authentication

### POST /auth/register

Creates a new user account.

**Auth required:** No

**Request body:**

```json
{
  "firstName": "Priya",
  "lastName": "Sharma",
  "email": "priya@example.com",
  "password": "MinLength8!"
}
```

**Zod validation rules:**
- `firstName` — string, min 1 character, max 50 characters
- `lastName` — string, min 1 character, max 50 characters
- `email` — valid email format
- `password` — string, min 8 characters, max 72 characters

**Success response — 201:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "Priya",
      "lastName": "Sharma",
      "email": "priya@example.com",
      "onboardingDone": false,
      "createdAt": "2026-06-25T08:00:00.000Z"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

**Error cases:**
- `409` — Email already registered

---

### POST /auth/login

Authenticates a user and returns tokens.

**Auth required:** No

**Request body:**

```json
{
  "email": "priya@example.com",
  "password": "MinLength8!"
}
```

**Success response — 200:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "Priya",
      "lastName": "Sharma",
      "email": "priya@example.com",
      "onboardingDone": true
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

**Error cases:**
- `401` — Invalid email or password (deliberately vague to prevent user enumeration)

---

### POST /auth/refresh

Issues a new access token using a valid refresh token.

**Auth required:** No

**Request body:**

```json
{
  "refreshToken": "eyJ..."
}
```

**Success response — 200:**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

The old refresh token is revoked on use (token rotation). The client must store the newly returned refresh token.

**Error cases:**
- `401` — Refresh token is invalid, expired, or already revoked

---

### POST /auth/logout

Revokes the provided refresh token.

**Auth required:** Yes

**Request body:**

```json
{
  "refreshToken": "eyJ..."
}
```

**Success response — 204:** No body.

---

## 3. User Profile

### GET /users/me

Returns the authenticated user's profile.

**Auth required:** Yes

**Success response — 200:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Priya",
    "lastName": "Sharma",
    "email": "priya@example.com",
    "currentRole": "Marketing Manager",
    "targetRole": "Product Manager",
    "weeklyHours": 10,
    "targetMonths": 6,
    "onboardingDone": true,
    "createdAt": "2026-06-25T08:00:00.000Z"
  }
}
```

---

### PATCH /users/me

Updates the authenticated user's profile fields.

**Auth required:** Yes

**Request body** (all fields optional — only send what is changing):

```json
{
  "firstName": "Priya",
  "lastName": "Sharma",
  "currentRole": "Senior Marketing Manager",
  "targetRole": "Product Manager",
  "weeklyHours": 12,
  "targetMonths": 6
}
```

**Zod validation rules:**
- `firstName` — string, min 1, max 50 (optional)
- `lastName` — string, min 1, max 50 (optional)
- `currentRole` — string, max 100 (optional)
- `targetRole` — string, max 100 (optional)
- `weeklyHours` — integer, min 2, max 20 (optional)
- `targetMonths` — one of `3`, `6`, `12` (optional)

**Success response — 200:** Returns the updated user object (same shape as `GET /users/me`).

---

### PATCH /users/me/password

Changes the authenticated user's password.

**Auth required:** Yes

**Request body:**

```json
{
  "currentPassword": "OldPassword1!",
  "newPassword": "NewPassword2!"
}
```

**Zod validation rules:**
- `currentPassword` — string, required
- `newPassword` — string, min 8, max 72

**Success response — 204:** No body.

**Error cases:**
- `401` — Current password is incorrect

---

## 4. Onboarding

### POST /onboarding

Saves the user's onboarding answers, sets `onboardingDone = true`, and triggers AI roadmap generation. This is the most compute-heavy endpoint — the AI generates the full roadmap and resources before responding, so clients should display a loading state.

**Auth required:** Yes

**Request body:**

```json
{
  "currentRole": "Marketing Manager",
  "targetRole": "Product Manager",
  "weeklyHours": 10,
  "targetMonths": 6
}
```

**Zod validation rules:**
- `currentRole` — string, min 1, max 300
- `targetRole` — string, min 1, max 100
- `weeklyHours` — integer, min 2, max 20
- `targetMonths` — one of `3`, `6`, `12`

**Success response — 201:**

```json
{
  "success": true,
  "data": {
    "roadmapId": "uuid",
    "title": "Marketing Manager → Product Manager",
    "phases": [
      {
        "id": "uuid",
        "title": "Phase 1: Foundations",
        "order": 1,
        "topics": [
          {
            "id": "uuid",
            "title": "Introduction to Product Thinking",
            "description": "Understand how product managers frame problems...",
            "estimatedHours": 3,
            "isCheckpoint": false,
            "order": 1,
            "resources": [
              {
                "id": "uuid",
                "title": "Product Thinking 101",
                "searchQuery": "product thinking for beginners guide",
                "resourceType": "ARTICLE"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

**Error cases:**
- `409` — User has already completed onboarding (redirect to dashboard)
- `500` — AI service failed to generate roadmap

---

## 5. Roadmap

### GET /roadmap

Returns the authenticated user's active roadmap with all phases, topics, resources, and the user's progress status on each topic.

**Auth required:** Yes

**Success response — 200:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Marketing Manager → Product Manager",
    "createdAt": "2026-06-25T08:00:00.000Z",
    "progressPercent": 24,
    "phases": [
      {
        "id": "uuid",
        "title": "Phase 1: Foundations",
        "order": 1,
        "phaseProgressPercent": 50,
        "topics": [
          {
            "id": "uuid",
            "title": "Introduction to Product Thinking",
            "description": "Understand how product managers frame problems...",
            "estimatedHours": 3,
            "isCheckpoint": false,
            "order": 1,
            "status": "COMPLETE",
            "completedAt": "2026-06-20T14:00:00.000Z",
            "resources": [
              {
                "id": "uuid",
                "title": "Product Thinking 101",
                "searchQuery": "product thinking for beginners guide",
                "resourceType": "ARTICLE",
                "source": "AI",
                "isBookmarkedByUser": false
              }
            ]
          }
        ]
      }
    ]
  }
}
```

Note: `isBookmarkedByUser` is computed per-request by checking `UserResourceBookmark` for the authenticated user. It is not stored on the `Resource` row.

**Error cases:**
- `404` — No active roadmap exists (user has not completed onboarding)

---

### PATCH /roadmap

Renames the active roadmap.

**Auth required:** Yes

**Request body:**

```json
{
  "title": "My PM Transition Plan"
}
```

**Zod validation rules:**
- `title` — string, min 1, max 150

**Success response — 200:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "My PM Transition Plan",
    "updatedAt": "2026-06-25T09:00:00.000Z"
  }
}
```

---

### POST /roadmap/regenerate

Archives the current active roadmap and generates a new one using updated onboarding parameters. The request body is identical to `POST /onboarding`.

**Auth required:** Yes

**Request body:**

```json
{
  "currentRole": "Senior Marketing Manager",
  "targetRole": "Product Manager",
  "weeklyHours": 12,
  "targetMonths": 6
}
```

**Success response — 201:** Same shape as `POST /onboarding` response.

**Behaviour note:** The user's `UserTopicProgress` records from the old roadmap are preserved for historical reference but are no longer returned in the active roadmap view.

---

## 6. Topics

### GET /topics/:topicId

Returns a single topic with its resources and the authenticated user's progress on it.

**Auth required:** Yes

**Success response — 200:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Introduction to Product Thinking",
    "description": "Understand how product managers frame problems...",
    "estimatedHours": 3,
    "isCheckpoint": false,
    "order": 1,
    "status": "IN_PROGRESS",
    "completedAt": null,
    "lastActivityAt": "2026-06-24T10:00:00.000Z",
    "phase": {
      "id": "uuid",
      "title": "Phase 1: Foundations"
    },
    "resources": [
      {
        "id": "uuid",
        "title": "Product Thinking 101",
        "searchQuery": "product thinking for beginners guide",
        "resourceType": "ARTICLE",
        "source": "AI",
        "isBookmarkedByUser": true
      }
    ],
    "latestQuizAttempt": {
      "score": 3,
      "passed": false,
      "attemptedAt": "2026-06-23T09:00:00.000Z"
    }
  }
}
```

`latestQuizAttempt` is `null` if no attempt exists. It is only returned for checkpoint topics.

**Error cases:**
- `404` — Topic does not exist or does not belong to the user's active roadmap

---

### PATCH /topics/:topicId/progress

Updates the user's progress status on a topic. For checkpoint topics, the status can only be set to `COMPLETE` if the latest quiz attempt has `passed = true`. The server enforces this rule.

**Auth required:** Yes

**Request body:**

```json
{
  "status": "IN_PROGRESS"
}
```

**Zod validation rules:**
- `status` — one of `"NOT_STARTED"`, `"IN_PROGRESS"`, `"COMPLETE"`

**Success response — 200:**

```json
{
  "success": true,
  "data": {
    "topicId": "uuid",
    "status": "IN_PROGRESS",
    "lastActivityAt": "2026-06-25T10:30:00.000Z",
    "completedAt": null
  }
}
```

**Error cases:**
- `403` — Attempted to set `COMPLETE` on a checkpoint topic without a passing quiz attempt

---

### PATCH /topics/:topicId/reorder

Updates the display order of topics within their phase. Used by the drag-and-drop reorder feature. Sends the full new order for the phase, not just the moved item.

**Auth required:** Yes

**Request body:**

```json
{
  "topicIds": ["uuid-1", "uuid-2", "uuid-3"]
}
```

`topicIds` must be an ordered array containing all topic IDs belonging to the phase — no additions or omissions.

**Zod validation rules:**
- `topicIds` — array of UUID strings, min 1 item

**Success response — 204:** No body.

**Error cases:**
- `400` — Array does not match the set of topic IDs in the phase

---

## 7. Resources

### POST /topics/:topicId/resources

Allows a user to manually add a resource to a topic.

**Auth required:** Yes

**Request body:**

```json
{
  "title": "Lenny's Newsletter — PM Fundamentals",
  "searchQuery": "Lenny Rachitsky product manager fundamentals newsletter",
  "resourceType": "ARTICLE"
}
```

**Zod validation rules:**
- `title` — string, min 1, max 200
- `searchQuery` — string, min 1, max 300
- `resourceType` — one of `"ARTICLE"`, `"COURSE"`, `"DOCUMENTATION"`, `"VIDEO"`

**Success response — 201:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Lenny's Newsletter — PM Fundamentals",
    "searchQuery": "Lenny Rachitsky product manager fundamentals newsletter",
    "resourceType": "ARTICLE",
    "source": "USER",
    "isBookmarkedByUser": false,
    "createdAt": "2026-06-25T11:00:00.000Z"
  }
}
```

---

### DELETE /resources/:resourceId

Deletes a user-added resource. AI-generated resources cannot be deleted.

**Auth required:** Yes

**Success response — 204:** No body.

**Error cases:**
- `403` — Resource was AI-generated (`source = "AI"`) and cannot be deleted
- `404` — Resource not found

---

## 8. Bookmarks

### POST /resources/:resourceId/bookmark

Bookmarks a resource for the authenticated user.

**Auth required:** Yes

**Request body:** None.

**Success response — 201:**

```json
{
  "success": true,
  "data": {
    "resourceId": "uuid",
    "bookmarkedAt": "2026-06-25T11:05:00.000Z"
  }
}
```

**Error cases:**
- `409` — Resource is already bookmarked by this user

---

### DELETE /resources/:resourceId/bookmark

Removes a bookmark for the authenticated user.

**Auth required:** Yes

**Success response — 204:** No body.

**Error cases:**
- `404` — Bookmark does not exist for this user and resource

---

### GET /bookmarks

Returns all resources bookmarked by the authenticated user, grouped by topic.

**Auth required:** Yes

**Success response — 200:**

```json
{
  "success": true,
  "data": [
    {
      "topicId": "uuid",
      "topicTitle": "Introduction to Product Thinking",
      "resources": [
        {
          "id": "uuid",
          "title": "Product Thinking 101",
          "searchQuery": "product thinking for beginners guide",
          "resourceType": "ARTICLE",
          "bookmarkedAt": "2026-06-25T11:05:00.000Z"
        }
      ]
    }
  ]
}
```

---

## 9. Quizzes

### POST /topics/:topicId/quiz/generate

Calls the AI service to generate a fresh 5-question multiple-choice quiz for the topic. The generated quiz is returned to the client but is **not persisted** at this point — it is only stored when the user submits answers via `/quiz/submit`.

**Auth required:** Yes

**Request body:** None.

**Success response — 200:**

```json
{
  "success": true,
  "data": {
    "topicId": "uuid",
    "topicTitle": "Introduction to Product Thinking",
    "questions": [
      {
        "index": 0,
        "question": "What is the primary responsibility of a product manager?",
        "options": [
          "Writing code for new features",
          "Defining the product vision and prioritising the roadmap",
          "Managing the sales pipeline",
          "Designing the user interface"
        ]
      },
      {
        "index": 1,
        "question": "...",
        "options": ["...", "...", "...", "..."]
      }
    ]
  }
}
```

Note: The `correctIndex` for each question is deliberately omitted from this response. It is included in the stored snapshot during submit.

**Error cases:**
- `403` — Topic is not a checkpoint topic (quiz not applicable)
- `500` — AI service failed to generate quiz

---

### POST /topics/:topicId/quiz/submit

Submits the user's answers for a quiz session. The server re-calls the AI for the `correctIndex` values (which were generated but not sent to the client), scores the attempt, persists the full snapshot, and returns results with per-question feedback.

**Auth required:** Yes

**Request body:**

```json
{
  "questions": [
    {
      "index": 0,
      "question": "What is the primary responsibility of a product manager?",
      "options": [
        "Writing code for new features",
        "Defining the product vision and prioritising the roadmap",
        "Managing the sales pipeline",
        "Designing the user interface"
      ],
      "correctIndex": 1
    }
  ],
  "answers": [1, 2, 0, 3, 1]
}
```

The client sends back the full questions array (including `correctIndex` which was held server-side), plus the `answers` array (one selected option index per question, in order).

**Implementation note:** To avoid trusting the client's `correctIndex`, the recommended pattern is: store the quiz session server-side in memory (or a short-lived Redis key) when `/generate` is called, keyed by `userId + topicId`. On `/submit`, retrieve the stored session to get the authoritative `correctIndex` values rather than accepting them from the client.

**Zod validation rules:**
- `questions` — array of 5 question objects, each with `index`, `question`, `options` (4 strings), `correctIndex` (0–3)
- `answers` — array of exactly 5 integers, each 0–3

**Success response — 200:**

```json
{
  "success": true,
  "data": {
    "attemptId": "uuid",
    "score": 4,
    "passed": true,
    "results": [
      {
        "index": 0,
        "userAnswer": 1,
        "correctIndex": 1,
        "isCorrect": true,
        "explanation": null
      },
      {
        "index": 2,
        "userAnswer": 0,
        "correctIndex": 2,
        "isCorrect": false,
        "explanation": "A product manager defines the product vision and coordinates across teams, not just manages the sales pipeline."
      }
    ]
  }
}
```

`explanation` is only present (non-null) for questions the user got wrong. It is a short AI-generated clarification.

**Error cases:**
- `400` — Answer array length does not match question count
- `403` — Topic is not a checkpoint topic

---

### GET /topics/:topicId/quiz/attempts

Returns all quiz attempts for the authenticated user on a specific topic, most recent first.

**Auth required:** Yes

**Success response — 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "score": 4,
      "passed": true,
      "attemptedAt": "2026-06-25T12:00:00.000Z"
    },
    {
      "id": "uuid",
      "score": 2,
      "passed": false,
      "attemptedAt": "2026-06-24T09:00:00.000Z"
    }
  ]
}
```

---

## 10. AI — Concept Explanation

### POST /topics/:topicId/explain

Calls the AI service to explain the topic or answer a follow-up question. **Returns a streaming response** — the `Content-Type` is `text/event-stream` and the response body is a series of Server-Sent Events (SSE).

**Auth required:** Yes

**Content-Type for request:** `application/json`  
**Content-Type for response:** `text/event-stream`

**Request body:**

```json
{
  "conversationHistory": [
    {
      "role": "user",
      "content": "Can you explain this topic in simple terms?"
    },
    {
      "role": "assistant",
      "content": "Product thinking means..."
    }
  ],
  "userMessage": "Can you give me a real-world example?"
}
```

For the initial explanation (no prior turns), send `conversationHistory` as an empty array and `userMessage` as `"Explain this topic."`.

**Zod validation rules:**
- `conversationHistory` — array of `{ role: "user" | "assistant", content: string }`, max 10 items
- `userMessage` — string, min 1, max 1000

**Streaming response format (SSE):**

```
data: {"chunk": "Product thinking "}

data: {"chunk": "is the practice of "}

data: {"chunk": "framing every decision around user needs."}

data: {"done": true}
```

Each event carries a `chunk` of the AI response text. The final event carries `{"done": true}` to signal completion. The client assembles chunks as they arrive.

**Error cases:**
- `400` — `conversationHistory` exceeds 10 turns
- `500` — AI service error (returned as a regular JSON error before the stream opens)

---

## 11. Dashboard

### GET /dashboard

Returns all data needed to render the main dashboard in a single request. This avoids multiple sequential round-trips from the frontend on page load.

**Auth required:** Yes

**Success response — 200:**

```json
{
  "success": true,
  "data": {
    "user": {
      "firstName": "Priya",
      "targetRole": "Product Manager",
      "targetMonths": 6
    },
    "roadmap": {
      "id": "uuid",
      "title": "Marketing Manager → Product Manager",
      "currentPhase": {
        "id": "uuid",
        "title": "Phase 1: Foundations",
        "phaseProgressPercent": 50
      }
    },
    "careerReadinessScore": {
      "total": 61,
      "breakdown": {
        "completionScore": 24,
        "quizScore": 22,
        "consistencyScore": 15
      },
      "components": {
        "topicsComplete": 8,
        "totalTopics": 32,
        "avgCheckpointQuizScore": 3.7,
        "totalCheckpointsTaken": 3,
        "daysElapsed": 18,
        "totalDaysInPlan": 180,
        "paceRatio": 0.75
      }
    },
    "streak": {
      "currentStreak": 5,
      "lastActivityAt": "2026-06-24T18:00:00.000Z"
    },
    "latestWeeklyReview": {
      "id": "uuid",
      "weekStartDate": "2026-06-22T00:00:00.000Z",
      "narrative": "Great week Priya! You completed 3 topics...",
      "careerReadinessScoreAtReview": 54,
      "nextTopicTitle": "Prioritisation Frameworks",
      "nextTopicReason": "This is the logical next step after understanding product thinking.",
      "generatedAt": "2026-06-22T08:00:00.000Z"
    },
    "nextRecommendedTopic": {
      "id": "uuid",
      "title": "Prioritisation Frameworks",
      "estimatedHours": 4,
      "isCheckpoint": true,
      "reason": "You are on track with your 6-month plan. This topic builds directly on your completed foundation work."
    }
  }
}
```

`latestWeeklyReview` is `null` if no review has been generated yet.

`careerReadinessScore.total` is an integer 0–100 computed in the service layer on each request. The `breakdown` object shows the individual component scores (max 50 + 30 + 20). The `components` object exposes the raw inputs used to compute the score, which the frontend uses to render the breakdown tooltip or detail view.

`nextRecommendedTopic` is computed fresh by the AI service on each dashboard load (or served from a short-lived server cache if the user's progress has not changed since last load).

---

## 12. Career Readiness Score

### GET /scores/career-readiness

Returns the user's current Career Readiness Score with full breakdown. This is the same score object embedded in `GET /dashboard`, but available as a standalone endpoint for lightweight polling after a topic status change or quiz submission — without reloading the full dashboard payload.

**Auth required:** Yes

**Request body:** None. All inputs are derived from the authenticated user's data in the database.

**Success response — 200:**

```json
{
  "success": true,
  "data": {
    "total": 61,
    "breakdown": {
      "completionScore": 24,
      "quizScore": 22,
      "consistencyScore": 15
    },
    "components": {
      "topicsComplete": 8,
      "totalTopics": 32,
      "avgCheckpointQuizScore": 3.7,
      "totalCheckpointsTaken": 3,
      "daysElapsed": 18,
      "totalDaysInPlan": 180,
      "paceRatio": 0.75
    },
    "computedAt": "2026-06-25T12:00:00.000Z"
  }
}
```

**Score computation rules (enforced in service layer):**

- `completionScore` = `(topicsComplete / totalTopics) × 50`, rounded to nearest integer
- `quizScore` = `(avgCheckpointQuizScore / 5) × 30`, rounded to nearest integer. Returns 0 if no checkpoint quizzes have been attempted yet.
- `consistencyScore` = `paceRatio × 20`, rounded to nearest integer. `paceRatio` is `min((actualCompletion / expectedCompletion), 1.0)`. Returns 20 (full marks) if `daysElapsed` is 0.
- `total` = sum of all three component scores, guaranteed to be an integer between 0 and 100.

**Error cases:**
- `404` — No active roadmap exists (user has not completed onboarding)

---

## 13. AI — Next Topic Suggestion

### POST /ai/next-topic

Explicitly requests an AI-generated next topic recommendation. Called automatically by `GET /dashboard`, but also available as a standalone endpoint for the frontend to call after a topic status change without reloading the full dashboard.

**Auth required:** Yes

**Request body:** None. The server assembles the required context (completed topics, pace data) from the database.

**Success response — 200:**

```json
{
  "success": true,
  "data": {
    "topicId": "uuid",
    "title": "Prioritisation Frameworks",
    "reason": "You are on track with your 6-month plan. This topic builds directly on your completed foundation work."
  }
}
```

**Error cases:**
- `404` — No active roadmap or all topics are already complete

---

## 14. Weekly Reviews

### GET /reviews

Returns all weekly reviews for the authenticated user, most recent first.

**Auth required:** Yes

**Success response — 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "weekStartDate": "2026-06-22T00:00:00.000Z",
      "narrative": "Great week Priya! You completed 3 topics...",
      "topicsCompleted": 3,
      "avgQuizScore": 4.5,
      "nextTopicTitle": "Prioritisation Frameworks",
      "nextTopicReason": "This is the logical next step after understanding product thinking.",
      "generatedAt": "2026-06-22T08:00:00.000Z"
    }
  ]
}
```

---

### POST /reviews/generate

Manually triggers generation of a weekly review for the authenticated user. The cron job calls the same underlying service function.

**Auth required:** Yes

**Request body:** None.

**Success response — 201:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "weekStartDate": "2026-06-22T00:00:00.000Z",
    "narrative": "Great week Priya! You completed 3 topics...",
    "topicsCompleted": 3,
    "avgQuizScore": 4.5,
    "nextTopicTitle": "Prioritisation Frameworks",
    "nextTopicReason": "This is the logical next step after understanding product thinking.",
    "generatedAt": "2026-06-25T11:30:00.000Z"
  }
}
```

**Error cases:**
- `409` — A review has already been generated for the current week (to prevent duplicate generation). Return the existing review ID in the error response so the client can redirect to it.

---

## 14. Complete Endpoint Index

```
AUTH
  POST   /auth/register
  POST   /auth/login
  POST   /auth/refresh
  POST   /auth/logout

USER
  GET    /users/me
  PATCH  /users/me
  PATCH  /users/me/password

ONBOARDING
  POST   /onboarding

ROADMAP
  GET    /roadmap
  PATCH  /roadmap
  POST   /roadmap/regenerate

TOPICS
  GET    /topics/:topicId
  PATCH  /topics/:topicId/progress
  PATCH  /topics/:topicId/reorder

RESOURCES
  POST   /topics/:topicId/resources
  DELETE /resources/:resourceId

BOOKMARKS
  POST   /resources/:resourceId/bookmark
  DELETE /resources/:resourceId/bookmark
  GET    /bookmarks

QUIZZES
  POST   /topics/:topicId/quiz/generate
  POST   /topics/:topicId/quiz/submit
  GET    /topics/:topicId/quiz/attempts

AI
  POST   /topics/:topicId/explain        (SSE streaming)
  POST   /ai/next-topic

DASHBOARD
  GET    /dashboard

SCORES
  GET    /scores/career-readiness

REVIEWS
  GET    /reviews
  POST   /reviews/generate
```

**Total endpoints: 26**

---

*End of API Specification v1.1*
