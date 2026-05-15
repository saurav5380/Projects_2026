# Job Board Platform — Product Requirements Document (PRD)

**Tech Stack:** Next.js + React + Tailwind + Express + PostgreSQL  
**Sprint:** May 13 – May 17, 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [User Roles](#2-user-roles)
3. [Feature Specifications](#3-feature-specifications)
4. [Database Schema](#4-database-schema)
5. [API Endpoints](#5-api-endpoints)
6. [Daily Execution Plan](#6-daily-execution-plan)
7. [Known Pitfalls](#7-known-pitfalls)
8. [Success Criteria](#8-success-criteria)

---

## 1. Project Overview

A full-stack Job Board Platform where **Companies** can post job listings, **Candidates** can browse and apply, and **Admins** can manage the entire ecosystem.

This project mirrors the complexity of the recently completed Markdown Blogging Platform, reusing the same tech stack to reinforce learning while introducing new patterns like role-based access control, application state machines, and email notifications.

### 1.1 Goals

- Reinforce Next.js routing, React state management, and Tailwind styling
- Practice Multer file uploads — company logos and candidate resumes
- Implement slug-based URLs for job listings
- Build paginated, filterable listing pages with basic SEO
- Introduce role-based authentication (Company / Candidate / Admin)
- Add email notifications via Nodemailer

### 1.2 Tech Stack

- **Frontend:** Next.js 14 + React + Tailwind CSS
- **Backend:** Express.js (REST API)
- **Database:** PostgreSQL
- **File Uploads:** Multer (logos + resumes)
- **Auth:** JWT + Role-based middleware
- **Email:** Nodemailer
- **Rich Text:** React-Quill (reused from blogging project)
- **SEO:** Next.js Metadata API

---

## 2. User Roles

### Company
A business that posts job listings on the platform.
- Register and create a company profile with logo
- Post, edit, and delete job listings
- View applicants per listing and update their application status

### Candidate
A job seeker browsing and applying to listings.
- Register and create a candidate profile
- Browse, search, and filter job listings
- Apply to jobs by uploading a resume and optional cover note
- Track the status of their applications

### Admin
The platform administrator (seeded directly in the database).
- Approve or reject newly posted job listings before they go live
- Deactivate Company or Candidate accounts
- View platform-wide stats and all applications

---

## 3. Feature Specifications

### 3.1 Authentication & Role Management

- Register / Login with email and password (JWT-based)
- Role selection at registration: **Company** or **Candidate**
- Protected routes enforced on both Express middleware and Next.js page level
- Admin account seeded directly in the database via a migration script

### 3.2 Company Features

- Company profile page with logo upload via Multer
- Create job listings with a rich text description using React-Quill
- Auto-generated slug from job title (e.g. `/jobs/senior-react-developer-acme-corp`)
- View a list of applicants per job with a resume download link
- Update application status: **Applied → Reviewed → Shortlisted → Rejected / Accepted**
- Email notification sent to the candidate whenever their status is updated

### 3.3 Candidate Features

- Browse all active job listings with pagination (10 listings per page)
- Filter listings by Category, Location, and Job Type (Full-time / Part-time / Remote)
- Keyword search by job title or company name
- Apply to a job by uploading a resume (PDF only, max 2 MB) with an optional cover note
- **My Applications** dashboard showing each application's current status

### 3.4 Admin Features

- Dashboard showing total listings, total users, and pending approvals count
- Approve or Reject newly posted job listings before they go live
- Deactivate user accounts (Company or Candidate)
- View all applications across the platform

### 3.5 SEO

- Dynamic `<title>` and `<meta description>` on every job listing page
- Canonical URLs using the job slug
- Open Graph tags for social sharing previews

### 3.6 Shared / Cross-Cutting Features

- Reusable pagination component (same pattern as the blogging project)
- Toast notifications for success and error feedback on all actions
- Fully responsive layout using Tailwind CSS
- Form validation on both client side and server side

---

## 4. Database Schema (PostgreSQL)

### `users`
- `id` — primary key
- `name` — string
- `email` — unique string
- `password_hash` — string
- `role` — enum: `company | candidate | admin`
- `is_active` — boolean, default true
- `created_at` — timestamp

### `companies`
- `id` — primary key
- `user_id` — foreign key → users
- `company_name` — string
- `logo_url` — string (path to uploaded file)
- `website` — string (optional) 
- `description` — text (optional)

### `candidates`
- `id` — primary key
- `user_id` — foreign key → users
- `headline` — string (e.g. "Full Stack Developer")
- `resume_url` — string (path to uploaded PDF)

### `job_listings`
- `id` — primary key
- `company_id` — foreign key → companies
- `title` — string
- `slug` — unique string (auto-generated)
- `description` — text (rich text HTML)
- `category` — string (e.g. Engineering, Design, Marketing)
- `location` — string
- `job_type` — enum: `full-time | part-time | remote`
- `status` — enum: `pending | active | closed | rejected`
- `created_at` — timestamp

### `applications`
- `id` — primary key
- `job_id` — foreign key → job_listings
- `candidate_id` — foreign key → candidates
- `cover_note` — text (optional)
- `resume_url` — string (path to uploaded PDF)
- `status` — enum: `applied | reviewed | shortlisted | rejected | accepted`
- `applied_at` — timestamp

---

## 5. API Endpoints (Express)

### Auth — Public
- `POST /api/auth/register` — Register a new user (Company or Candidate)
- `POST /api/auth/login` — Login and receive a JWT

### Jobs — Public
- `GET /api/jobs` — List all active jobs (supports filter + pagination query params)
- `GET /api/jobs/:slug` — Get a single job listing by slug

### Jobs — Company (protected)
- `POST /api/jobs` — Create a new job listing
- `PUT /api/jobs/:id` — Edit a job listing (owner only)
- `DELETE /api/jobs/:id` — Delete a job listing (owner only)
- `GET /api/jobs/:id/applicants` — List all applicants for a specific job

### Applications — Candidate (protected)
- `POST /api/jobs/:id/apply` — Apply to a job (includes resume upload via Multer)
- `GET /api/applications/mine` — Get the logged-in candidate's applications

### Applications — Company (protected)
- `PATCH /api/applications/:id/status` — Update the status of an application

### Admin (protected)
- `GET /api/admin/dashboard` — Get platform stats (user count, listing count, pending count)
- `PATCH /api/admin/jobs/:id/approve` — Approve a pending listing
- `PATCH /api/admin/jobs/:id/reject` — Reject a pending listing
- `PATCH /api/admin/users/:id/deactivate` — Deactivate a user account

---

## 6. Daily Execution Plan

> **Rule:** 80% coding, 20% reading and planning — as per the Learning Methodology.  
> Each day builds on the previous one, like adding floors to a building.

---

### Day 1 — May 14 | Project Setup & Database

- [✅] Initialise monorepo: `/frontend` (Next.js) and `/backend` (Express)
- [✅] Configure Tailwind CSS in the frontend
- [✅] Set up PostgreSQL database and `.env` config — DB name: `jobboard_db`
- [✅] Write and run migration scripts for all 5 tables
- [ ] Seed the admin user directly via migration script (use bcrypt for password)
- [✅] Set up Express folder structure: `routes/`, `controllers/`, `middleware/`
- [✅] Test DB connection with a `GET /api/health` smoke test endpoint

---

### Day 2 — May 15 | Authentication & Role-Based Access - Backend routes and middleware

- [✅] Build `POST /api/auth/register` for Company and Candidate roles
- [✅] Build `POST /api/auth/login` — validate credentials and return a JWT with a role claim
- [✅] Write reusable auth middleware: `verifyToken` and `requireRole(role)`

### Day 3 — May 16 | Authentication & Role-Based Access - Frontend Pages 
- [ ] Build the Register page in Next.js with a role selection radio button
- [ ] Build the Login page in Next.js — store JWT in an httpOnly cookie
- [ ] Implement a protected route HOC (Higher Order Component) in Next.js that redirects unauthenticated users
- [ ] Test all auth flows manually: register, login, and access a protected page

---

### Day 4 — May 18 | Job Listings CRUD + Rich Text + Slugs

- [ ] Build `POST /api/jobs` with auto slug generation using the `slugify` library
- [ ] Build `GET /api/jobs` with filter query params (category, location, job_type, page) and `GET /api/jobs/:slug`
- [ ] Build `PUT /api/jobs/:id` and `DELETE /api/jobs/:id` with ownership checks
- [ ] Create the Job Listing form in Next.js with React-Quill for rich text description
- [ ] Build the public job listings browse page with the reusable pagination component
- [ ] Build the single job detail page at `/jobs/[slug]` using Next.js dynamic routes
- [ ] Add SEO metadata: dynamic `<title>`, `<meta description>`, and Open Graph tags on the detail page

---

### Day 5 — May 19 | File Uploads + Search & Filters

- [ ] Set up Multer middleware for two upload types: logo (images) and resume (PDF only, max 2 MB)
- [ ] Build the Company Profile page with logo upload — `PATCH /api/companies/profile`
- [ ] Wire resume upload into `POST /api/jobs/:id/apply`
- [ ] Build keyword search on the browse page using a PostgreSQL `ILIKE` query
- [ ] Build the filter sidebar: Category, Location, and Job Type dropdowns that update URL query params
- [ ] Ensure pagination resets to page 1 whenever any filter changes
- [ ] Test all upload flows and filter combinations including edge cases (wrong file type, oversized file)

---

### May 17 - Gap day due to travel to Pune.


### Day 6 — May 20 | Application Tracking + Email Notifications + Polish

- [ ] Build `GET /api/jobs/:id/applicants` for the Company to view applicants
- [ ] Build `PATCH /api/applications/:id/status` with status transition validation
- [ ] Integrate Nodemailer — send an email to the candidate on every status change (use Ethereal for testing)
- [ ] Build the Applicants page in the Company dashboard with a status dropdown per applicant
- [ ] Build the **My Applications** page in the Candidate dashboard with colour-coded status badges
- [ ] Build the Admin Dashboard page with stats cards and a pending listings table
- [ ] Add toast notifications for all success and error states across the app
- [ ] Full end-to-end walkthrough: register → post job → admin approves → candidate applies → company updates status → candidate receives email
- [ ] Fix all critical bugs found during the walkthrough
- [ ] Write `README.md` with setup instructions, `.env` variables list, and feature summary
- [ ] Push to GitHub and deploy: backend to Railway or Render, frontend to Vercel

---

## 7. Known Pitfalls

These are mapped directly from the Learning Methodology document and are the most common traps at this complexity level.

### Scope Creep
**Watch for:** Wanting to add real-time notifications, a recommendation engine, or a chat feature.  
**Prevention:** Write it down in a "Future Features" note and keep moving. Ship first, enhance later.

### Over-reliance on Frameworks
**Watch for:** You can't explain why JWT is stateless or how a SQL JOIN works without looking it up.  
**Prevention:** Pause and revisit the fundamental concept. Always know your tools under the hood.

### Learning in Isolation
**Watch for:** Your code works but looks nothing like professional examples you find on GitHub.  
**Prevention:** Use Claude for a code review after each day's milestone is complete.

### Tutorial Hell
**Watch for:** It's Day 3 and you're still watching Nodemailer setup videos.  
**Prevention:** Hard cap of 20% on reading and watching. Build first, fix problems as they appear.

### Perfectionism Paralysis
**Watch for:** Restarting the auth system because it "isn't clean enough."  
**Prevention:** Good enough is the standard for a learning project. Refactor in a future pass.

---

## 8. Success Criteria

By **May 18**, you should be able to answer **YES** to all of the following:

- [ ] Can a company register, post a job with rich text, and see it go live after admin approval?
- [ ] Can a candidate browse, filter, search, and apply to a listing by uploading a resume?
- [ ] Does the candidate receive an email when their application status is updated?
- [ ] Is every listing page paginated, SEO-tagged, and mobile responsive?
- [ ] Can the admin approve or reject listings and deactivate user accounts?
- [ ] Is the project live on a public URL and documented in a README?

**If you can demo all six points above, you have successfully delivered a production-grade learning project.**

---
✅
*Happy building! 🚀*
