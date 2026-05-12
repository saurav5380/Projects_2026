#projects #bloggs #sprint-plan

# 7-Day Sprint Plan
## Blog with Markdown Editor

**Sprint Duration:** February 23 - March 1, 2026 (7 days)  
**Project:** Blog with Markdown Editor  
**Stack:** Next.js + React + Tailwind + Express + PostgreSQL  
**Methodology:** Agile Sprint with daily goals

---

## Sprint Overview

### Sprint Goals
1. ✅ Complete MVP with all core features
2. ✅ Deploy to production
3. ✅ Portfolio-ready project with documentation

### Daily Time Commitment
- **Weekdays (Mon-Fri):** 6-8 hours/day
- **Weekends (Sat-Sun):** 8-10 hours/day
- **Total:** ~50 hours

### Working Hours Suggestion
- **Morning (9 AM - 12 PM):** Backend/Core features
- **Afternoon (2 PM - 6 PM):** Frontend/UI
- **Evening (7 PM - 9 PM):** Testing/Polish/Documentation

---

## Sprint Backlog

### High Priority (Must Have)
- [x] User authentication (register, login, logout) ✅ 2026-03-19
- [x] Create/Edit/Delete posts ✅ 2026-05-04
- [ ] Markdown editor with live preview
- [ ] Image upload functionality
- [x] Slug generation ✅ 2026-05-04
- [ ] Homepage with post list
- [ ] Individual post view
- [ ] Basic pagination
- [ ] SEO meta tags
- [ ] Deployment

### Medium Priority (Should Have)
- [ ] Tags system
- [ ] Dashboard for user posts
- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling

### Low Priority (Nice to Have)
- [ ] Search functionality (if time permits)
- [ ] Post statistics
- [ ] Enhanced UI polish

---

# Day-by-Day Task List

---

## 📅 Day 1: Sunday, February 23, 2026
**Theme:** Project Setup & Foundation  
**Estimated Hours:** 8-10 hours

### Morning (4-5 hours): Environment Setup

#### Task 1.1: Initialize Projects
**Time:** 1.5 hours

**Frontend Setup:**
- [x] Create Next.js 14 app with App Router ✅ 2026-03-19
  - Run: `npx create-next-app@latest blog-frontend`
  - Choose: TypeScript (if comfortable), Tailwind CSS, App Router
- [x] Verify Next.js runs on http://localhost:3000 ✅ 2026-03-19
- [x] Initialize Git repository ✅ 2026-03-19
- [x] Create `.gitignore` file ✅ 2026-03-19

**Backend Setup:**
- [x] Create Express app folder: `blog-backend` ✅ 2026-03-19
- [x] Initialize npm: `npm init -y` ✅ 2026-03-19
- [x] Install dependencies: ✅ 2026-03-19
  ```
  express, pg, bcrypt, jsonwebtoken, 
  multer, cors, dotenv, express-validator
  ```
- [x] Install dev dependencies: `nodemon` ✅ 2026-03-19
- [x] Create folder structure: ✅ 2026-03-19
  ```
  /backend
    /routes
    /controllers
    /middleware
    /utils
    /uploads
    server.js
    .env
  ```
- [x] Verify Express runs on http://localhost:5000 ✅ 2026-03-19

**Acceptance Criteria:**
- ✅ Both frontend and backend run without errors
- ✅ Git initialized with initial commit
- ✅ Folder structure organized

---

#### Task 1.2: Database Setup
**Time:** 1.5 hours

- [x] Create PostgreSQL database (local or Railway/Supabase) ✅ 2026-03-19
- [x] Note down connection string ✅ 2026-03-19
- [x] Create `.env` file in backend with: ✅ 2026-03-19
  ```
  DATABASE_URL=your_connection_string
  JWT_SECRET=your_secret_key
  PORT=5000
  ```
- [x] Create database schema file: `schema.sql` ✅ 2026-03-19
- [x] Write SQL for all tables: ✅ 2026-03-19
  - `users` table
  - `posts` table
  - `tags` table
  - `post_tags` junction table
- [x] Create indexes for optimization ✅ 2026-03-19
- [x] Run schema.sql to create tables ✅ 2026-03-19
- [x] Test connection with a simple SELECT query ✅ 2026-03-19

**Acceptance Criteria:**
- ✅ Database created and accessible
- ✅ All tables created successfully
- ✅ Can query database from backend

---

#### Task 1.3: Database Connection Module
**Time:** 1 hour

- [x] Create `db.js` file in backend ✅ 2026-03-19
- [x] Write connection function using `pg` package ✅ 2026-03-19
- [x] Export pool for reusable queries ✅ 2026-03-19
- [x] Test connection on server start ✅ 2026-03-19
- [x] Add connection error handling ✅ 2026-03-19

**Acceptance Criteria:**
- ✅ Database connects on server start
- ✅ Connection logs appear in console
- ✅ Error handling works (test by using wrong credentials)

---

### Afternoon (3-4 hours): Auth Backend

#### Task 1.4: User Registration API
**Time:** 2 hours

- [x] Create `auth.js` ✅ 2026-03-19
- [x] Create `authRoutes.js` ✅ 2026-03-19
- [x] Implement `POST /api/auth/register`: ✅ 2026-03-19
  - Accept: name, email, password
  - Validate: email format, password length (min 6 chars)
  - Hash password with bcrypt (10 rounds)
  - Check if email already exists
  - Insert user into database
  - Return success message
- [x] Test with Postman/Thunder Client: ✅ 2026-03-19
  - Valid registration
  - Duplicate email (should fail)
  - Invalid email format (should fail)
  - Short password (should fail)

**Acceptance Criteria:**
- ✅ Can register new user successfully
- ✅ Password is hashed (not stored in plain text)
- ✅ Duplicate emails rejected
- ✅ Validation errors return proper messages

---

#### Task 1.5: User Login API
**Time:** 1.5 hours

- [x] Implement `POST /api/auth/login`: ✅ 2026-03-19
  - Accept: email, password
  - Find user by email
  - Compare password with bcrypt
  - Generate JWT token (expires in 7 days)
  - Set httpOnly cookie with token
  - Return user data (without password)
- [x] Test with Postman: ✅ 2026-03-19
  - Successful login
  - Wrong password (should fail)
  - Non-existent email (should fail)
  - Check if cookie is set

**Acceptance Criteria:**
- ✅ User can login with correct credentials
- ✅ JWT token generated and sent as cookie
- ✅ Wrong credentials rejected with proper error
- ✅ Password not returned in response

---

### Evening (1-2 hours): Auth Middleware

#### Task 1.6: JWT Auth Middleware
**Time:** 1 hour

- [x] Create `authMiddleware.js` ✅ 2026-03-25
- [x] Write middleware to: ✅ 2026-03-25
  - Extract JWT from cookie
  - Verify JWT token
  - Decode user ID from token
  - Attach user to request object: `req.user`
  - Handle expired/invalid tokens
- [x] Create `GET /api/auth/me` endpoint (protected) ✅ 2026-03-26
  - Use auth middleware
  - Return current user data
- [ ] Test in Postman:
  - With valid token (should return user)
  - Without token (should return 401)
  - With invalid token (should return 401)

**Acceptance Criteria:**
- ✅ Middleware correctly validates tokens
- ✅ User data attached to request
- ✅ Invalid tokens rejected
- ✅ `/api/auth/me` returns logged-in user

---

#### Task 1.7: Logout Endpoint
**Time:** 30 minutes

- [x] Implement `POST /api/auth/logout`: ✅ 2026-03-30
  - Clear JWT cookie
  - Return success message
- [x] Test logout flow ✅ 2026-03-30

**Acceptance Criteria:**
- ✅ Cookie cleared on logout
- ✅ Subsequent requests fail auth check

---

### End of Day 1 Review (30 min)
- [x] Commit all changes with clear messages ✅ 2026-03-26
- [x] Test all auth endpoints in sequence: ✅ 2026-03-26
  1. Register → Login → Get Me → Logout
- [x] Document any issues for tomorrow ✅ 2026-03-26
- [x] Update README with setup instructions ✅ 2026-03-26

**Day 1 Deliverables:**
- ✅ Project structure set up
- ✅ Database created with schema
- ✅ User registration working
- ✅ User login working
- ✅ Auth middleware protecting routes
- ✅ Logout functionality

---

## 📅 Day 2: Monday, February 24, 2026
**Theme:** Backend Posts CRUD  
**Estimated Hours:** 6-8 hours

### Morning (3-4 hours): Create & Read Posts

#### Task 2.1: Slug Generation Utility
**Time:** 45 minutes

- [x] Create `slugify.js` utility function: ✅ 2026-04-01
  - Convert string to lowercase
  - Replace spaces with hyphens
  - Remove special characters (keep only a-z, 0-9, hyphens)
  - Example: "My First Post!" → "my-first-post"
- [x] Add uniqueness check function: ✅ 2026-04-01
  - Query database for existing slug
  - If exists, append number: "my-post-2", "my-post-3"
- [ ] Write test cases manually



**Acceptance Criteria:**
- ✅ Function generates clean slugs
- ✅ Handles uniqueness conflicts
- ✅ No special characters in output

---

#### Task 2.2: Create Post API
**Time:** 2 hours

- [x] Create `postsController.js` ✅ 2026-05-04
- [x] Create `postsRoutes.js` ✅ 2026-05-04
- [x] Implement `POST /api/posts`: ✅ 2026-05-04
  - Require authentication (use authMiddleware)
  - Accept: title, content (markdown), meta_description, status
  - Generate slug from title
  - Set author_id from req.user.id
  - Set published_at if status is 'published'
  - Insert into database
  - Return created post
- [x] Validate: ✅ 2026-04-03
  - Title is required (max 200 chars)
  - Content is required
  - Status is 'draft' or 'published'
- [ ] Test with Postman:
  - Create draft post
  - Create published post
  - Try without auth (should fail)
  - Try with missing title (should fail)

**Acceptance Criteria:**
- ✅ Authenticated users can create posts
- ✅ Slug generated automatically
- ✅ Published posts have published_at timestamp
- ✅ Draft posts saved correctly
- ✅ Validation works

---

#### Task 2.3: Get All Posts API (Public)
**Time:** 1 hour

- [x] Implement `GET /api/posts`: ✅ 2026-05-04
  - No authentication required
  - Query only published posts (status = 'published')
  - Order by published_at DESC (newest first)
  - Limit to 10 posts per page
  - Include author name (JOIN with users table)
  - Accept query params: `page` (default 1), `limit` (default 10)
  - Calculate offset: (page - 1) * limit
  - Return: posts array + total count
- [ ] Test in Postman:
  - Get page 1
  - Get page 2 (if enough posts)
  - Verify only published posts returned

**Acceptance Criteria:**
- ✅ Returns only published posts
- ✅ Pagination works correctly
- ✅ Author information included
- ✅ Total count returned for pagination

---

#### Task 2.4: Get Single Post by Slug
**Time:** 30 minutes

- [x] Implement `GET /api/posts/:slug`: ✅ 2026-05-05
  - No authentication required
  - Find post by slug
  - Only return if published (or if author)
  - Include author information
  - Return 404 if not found
- [x] Test in Postman: ✅ 2026-05-05
  - Get existing post
  - Try non-existent slug (should 404)

**Acceptance Criteria:**
- ✅ Returns post by slug
- ✅ Includes author data
- ✅ 404 for invalid slugs

---

### Afternoon (2-3 hours): Update & Delete Posts

#### Task 2.5: Get User's Posts (My Posts)
**Time:** 45 minutes

- [x] Implement `GET /api/posts/my-posts`: ✅ 2026-05-05
  - Require authentication
  - Get all posts by current user (drafts + published)
  - Order by updated_at DESC
  - Return posts array

**Acceptance Criteria:**
- ✅ Returns only logged-in user's posts
- ✅ Includes drafts and published
- ✅ Requires authentication

---

#### Task 2.6: Update Post API
**Time:** 1.5 hours

- [x] Implement `PUT /api/posts/:id`: ✅ 2026-05-05
  - Require authentication
  - Find post by ID
  - Check if current user is author (authorization)
  - Update fields: title, content, meta_description, status
  - Regenerate slug if title changed
  - Update updated_at timestamp
  - If status changes to 'published', set published_at
  - Return updated post
- [x] Test in Postman: ✅ 2026-05-05
  - Update own post (should succeed)
  - Try to update another user's post (should fail)
  - Update title and verify slug changed
  - Change draft to published

**Acceptance Criteria:**
- ✅ Authors can update their posts
- ✅ Non-authors cannot update
- ✅ Slug updates when title changes
- ✅ published_at set when publishing

---

#### Task 2.7: Delete Post API
**Time:** 45 minutes

- [x] Implement `DELETE /api/posts/:id`: ✅ 2026-05-05
  - Require authentication
  - Find post by ID
  - Check if current user is author
  - Soft delete: SET deleted_at = NOW()
  - Return success message
- [x] Update GET endpoints to filter out deleted posts: ✅ 2026-05-05
  - Add WHERE deleted_at IS NULL to all queries
- [x] Test deletion flow ✅ 2026-05-05

**Acceptance Criteria:**
- ✅ Authors can delete their posts
- ✅ Deleted posts not returned in queries
- ✅ Non-authors cannot delete

---

### Evening (1-2 hours): File Upload

#### Task 2.8: Image Upload API
**Time:** 1.5 hours

- [ ] Configure Multer:
  - Set upload directory: `/uploads`
  - File size limit: 5MB
  - Accept only: jpg, jpeg, png, webp
  - Generate unique filename: timestamp + random + extension
- [ ] Create `POST /api/upload`:
  - Require authentication
  - Use multer middleware
  - Save file to /uploads folder
  - Return file URL: `/uploads/filename.jpg`
- [ ] Add static file serving in server.js:
  - `app.use('/uploads', express.static('uploads'))`
- [ ] Test in Postman:
  - Upload valid image
  - Try invalid file type (should reject)
  - Try file > 5MB (should reject)
  - Access uploaded image URL in browser

**Acceptance Criteria:**
- ✅ Images upload successfully
- ✅ File validation works
- ✅ Uploaded images accessible via URL
- ✅ Files stored in /uploads folder

---

#### Task 2.9: Update Posts to Include cover_image_url
**Time:** 30 minutes

- [ ] Add cover_image_url field to POST /api/posts
- [ ] Add cover_image_url to PUT /api/posts
- [ ] Include cover_image_url in GET responses
- [ ] Test complete flow:
  1. Upload image
  2. Create post with returned image URL
  3. Verify image appears in post data

**Acceptance Criteria:**
- ✅ Posts can have cover images
- ✅ Cover image URL stored in database
- ✅ Image URL returned with post data

---

### End of Day 2 Review (30 min)
- [ ] Test complete CRUD flow:
  1. Create post → Read post → Update post → Delete post
- [ ] Test image upload and attachment to post
- [ ] Commit all changes
- [ ] Document API endpoints

**Day 2 Deliverables:**
- ✅ Create post with slug generation
- ✅ Read posts (all + single)
- ✅ Update posts
- ✅ Delete posts (soft delete)
- ✅ Image upload working
- ✅ Cover images attachable to posts

---

## 📅 Day 3: Wednesday, February 26, 2026
**Theme:** Frontend Foundation & Auth Pages  
**Estimated Hours:** 6-8 hours

### Morning (3-4 hours): Frontend Setup & Components

#### Task 3.1: Configure Tailwind & Base Styles
**Time:** 45 minutes

- [ ] Verify Tailwind is working
- [ ] Update `tailwind.config.js` if needed
- [ ] Create `globals.css` with:
  - Base styles
  - Custom utility classes (if needed)
  - Color scheme variables
- [ ] Choose color palette (e.g., blue primary, gray neutral)
- [ ] Test by adding some colored divs

**Acceptance Criteria:**
- ✅ Tailwind classes working
- ✅ Colors defined and applied
- ✅ Base styles look clean

---

#### Task 3.2: Create Layout Components
**Time:** 1.5 hours

- [ ] Create `components/Navbar.js`:
  - Logo/site title
  - Navigation links: Home, Dashboard (if logged in)
  - Auth buttons: Login/Register or Logout
  - Mobile-responsive menu
- [ ] Create `components/Footer.js`:
  - Copyright text
  - Social links (placeholder)
- [ ] Create `app/layout.js`:
  - Wrap children with Navbar + Footer
  - Add max-width container
- [ ] Test by viewing homepage

**Acceptance Criteria:**
- ✅ Navbar appears on all pages
- ✅ Footer appears on all pages
- ✅ Responsive on mobile
- ✅ Navigation links work

---

#### Task 3.3: Create Reusable UI Components
**Time:** 1.5 hours

- [ ] Create `components/Button.js`:
  - Accept props: variant (primary/secondary), size, onClick
  - Style with Tailwind
- [ ] Create `components/Input.js`:
  - Text input with label
  - Accept props: label, type, value, onChange, error
  - Show error message below input
- [ ] Create `components/Textarea.js`:
  - Similar to Input but for multi-line text
- [ ] Create `components/LoadingSpinner.js`:
  - Spinning animation using Tailwind
- [ ] Test components in isolation

**Acceptance Criteria:**
- ✅ Components render correctly
- ✅ Props work as expected
- ✅ Styling is consistent

---

### Afternoon (2-3 hours): Authentication Pages

#### Task 3.4: Register Page
**Time:** 1.5 hours

- [ ] Create `app/register/page.js`
- [ ] Build registration form:
  - Name input
  - Email input
  - Password input
  - Confirm password input
  - Submit button
- [ ] Implement form submission:
  - Validate passwords match
  - Call `POST /api/auth/register`
  - Handle success: redirect to /login
  - Handle errors: show error message
- [ ] Add loading state during submission
- [ ] Add link to login page: "Already have an account?"

**Acceptance Criteria:**
- ✅ Form validates input
- ✅ Successful registration creates user
- ✅ Redirects to login after success
- ✅ Error messages displayed
- ✅ Loading state shows during API call

---

#### Task 3.5: Login Page
**Time:** 1 hour

- [ ] Create `app/login/page.js`
- [ ] Build login form:
  - Email input
  - Password input
  - Submit button
- [ ] Implement form submission:
  - Call `POST /api/auth/login`
  - Store JWT token (cookie handled by backend)
  - On success: redirect to /dashboard
  - On error: show error message
- [ ] Add loading state
- [ ] Add link to register page: "Don't have an account?"

**Acceptance Criteria:**
- ✅ User can login
- ✅ Redirects to dashboard on success
- ✅ Error messages shown
- ✅ Loading state works

---

#### Task 3.6: Auth Context & Protected Routes
**Time:** 1.5 hours

- [ ] Create `context/AuthContext.js`:
  - State: user, loading
  - Function: login, logout, checkAuth
  - On mount: call GET /api/auth/me to check if logged in
- [ ] Wrap app with AuthContext provider
- [ ] Create `middleware.js` or auth check in layout:
  - Redirect to /login if accessing protected routes
- [ ] Update Navbar to:
  - Show "Login" + "Register" if logged out
  - Show "Dashboard" + "Logout" if logged in
- [ ] Implement logout:
  - Call POST /api/auth/logout
  - Clear user from context
  - Redirect to homepage

**Acceptance Criteria:**
- ✅ Auth state managed globally
- ✅ Navbar updates based on login status
- ✅ Protected routes redirect to login
- ✅ Logout works correctly

---

### Evening (1-2 hours): Auth Flow Testing

#### Task 3.7: Test Complete Auth Flow
**Time:** 1 hour

- [ ] Test registration:
  - Fill form
  - Verify redirects to login
  - Check database for new user
- [ ] Test login:
  - Login with registered user
  - Verify redirects to dashboard
  - Check navbar updated
- [ ] Test protected routes:
  - Try accessing /dashboard without login (should redirect)
  - Login and access /dashboard (should work)
- [ ] Test logout:
  - Click logout
  - Verify redirected to home
  - Try accessing /dashboard (should redirect to login)

**Acceptance Criteria:**
- ✅ Complete auth flow works
- ✅ Protected routes secured
- ✅ Navigation reflects auth state

---

#### Task 3.8: Error Handling & UX Polish
**Time:** 30 minutes

- [ ] Add toast notifications for:
  - "Registration successful!"
  - "Login successful!"
  - "Logged out successfully"
  - "Error: [error message]"
- [ ] Add form validation feedback:
  - Show red border on invalid inputs
  - Show error text below inputs
- [ ] Disable submit button during loading

**Acceptance Criteria:**
- ✅ User gets feedback on actions
- ✅ Forms show validation errors
- ✅ Loading states prevent double-submission

---

### End of Day 3 Review (30 min)
- [ ] Test entire auth flow multiple times
- [ ] Verify responsive design on mobile
- [ ] Commit all changes
- [ ] Take screenshots for documentation

**Day 3 Deliverables:**
- ✅ Frontend layout components (Navbar, Footer)
- ✅ Reusable UI components
- ✅ Register page working
- ✅ Login page working
- ✅ Auth context managing state
- ✅ Protected routes implemented
- ✅ Logout functionality

---

## 📅 Day 4: Thursday, February 27, 2026
**Theme:** Post Editor & Dashboard  
**Estimated Hours:** 6-8 hours

### Morning (3-4 hours): Markdown Editor

#### Task 4.1: Install & Configure Markdown Editor
**Time:** 1 hour

- [ ] Install markdown editor:
  - `npm install react-simplemde-editor easymde`
  - OR `npm install react-markdown-editor-lite react-markdown`
- [ ] Install markdown parser:
  - `npm install marked` (to convert markdown to HTML)
- [ ] Create test page to verify editor works:
  - Import editor component
  - Set up state for markdown content
  - Add preview pane
  - Style with Tailwind

**Acceptance Criteria:**
- ✅ Editor renders on page
- ✅ Can type markdown
- ✅ Preview shows formatted content
- ✅ No console errors

---

#### Task 4.2: Create New Post Page
**Time:** 2.5 hours

- [ ] Create `app/dashboard/new/page.js`
- [ ] Build post editor form:
  - Title input (auto-generates slug preview below)
  - Slug input (editable, shows preview URL)
  - Markdown editor (split pane: write | preview)
  - Cover image upload section:
    - File input
    - Preview uploaded image
    - Remove image button
  - Meta description textarea (max 160 chars, show count)
  - Tags input (comma-separated or tag chips)
  - Status dropdown: Draft or Published
  - Action buttons: Save Draft, Publish
- [ ] Implement slug generation:
  - On title change, generate slug
  - Show preview: `/blog/your-slug-here`
  - Allow manual override
- [ ] Implement image upload:
  - On file select, call POST /api/upload
  - Show loading spinner during upload
  - Store returned URL in state
  - Show preview of image
- [ ] Implement auto-save:
  - Save to localStorage every 30 seconds
  - Show "Last saved: X seconds ago"
  - (Optional: can skip auto-save for MVP)

**Acceptance Criteria:**
- ✅ All form fields work
- ✅ Markdown editor functional
- ✅ Slug auto-generates from title
- ✅ Image upload works
- ✅ Image preview shows
- ✅ Character count for meta description

---

### Afternoon (2-3 hours): Save Post & Dashboard

#### Task 4.3: Post Submission Logic
**Time:** 1.5 hours

- [ ] Implement form submission:
  - Validate required fields (title, content)
  - Call POST /api/posts with all data
  - Handle success:
    - Show success toast
    - Redirect to /dashboard
  - Handle errors:
    - Show error message
    - Keep form data (don't clear)
- [ ] Add separate buttons:
  - "Save as Draft" → status: 'draft'
  - "Publish" → status: 'published'
- [ ] Add loading state during save
- [ ] Test creating posts:
  - Create draft post
  - Create published post
  - Try submitting without title (should show error)

**Acceptance Criteria:**
- ✅ Can save draft posts
- ✅ Can publish posts
- ✅ Validation works
- ✅ Success/error feedback shown
- ✅ Redirects after save

---

#### Task 4.4: User Dashboard
**Time:** 1.5 hours

- [ ] Create `app/dashboard/page.js`
- [ ] Fetch user's posts:
  - Call GET /api/posts/my-posts
  - Show loading spinner while fetching
- [ ] Display posts in a table or card grid:
  - Show: title, status (draft/published), date, actions
  - Each row/card has:
    - Edit button → navigate to /dashboard/edit/[id]
    - Delete button → show confirmation modal
    - View button → navigate to /blog/[slug]
- [ ] Implement delete functionality:
  - Click delete → show modal "Are you sure?"
  - On confirm: call DELETE /api/posts/:id
  - Remove post from list
  - Show success toast
- [ ] Add "New Post" button at top
  - Navigates to /dashboard/new
- [ ] Show message if no posts: "No posts yet. Create your first post!"

**Acceptance Criteria:**
- ✅ Dashboard shows user's posts
- ✅ Can edit posts
- ✅ Can delete posts
- ✅ Confirmation modal for delete
- ✅ "New Post" button works
- ✅ Loading state while fetching

---

### Evening (1-2 hours): Edit Post Page

#### Task 4.5: Edit Post Page
**Time:** 1.5 hours

- [ ] Create `app/dashboard/edit/[id]/page.js`
- [ ] Fetch post data by ID:
  - Call GET /api/posts/:id
  - Load data into form fields
- [ ] Reuse form from "New Post" page:
  - Pre-fill all fields with existing data
  - Show existing cover image if present
  - Load markdown content into editor
- [ ] Implement update logic:
  - Call PUT /api/posts/:id
  - Handle success: show toast, redirect to dashboard
  - Handle errors: show error message
- [ ] Test editing flow:
  - Edit title and see slug update
  - Edit content
  - Change cover image
  - Update status (draft ↔ published)
  - Save changes and verify in database

**Acceptance Criteria:**
- ✅ Existing post data loads correctly
- ✅ Can modify all fields
- ✅ Updates save successfully
- ✅ Redirects after save
- ✅ Slug updates if title changes

---

#### Task 4.6: Dashboard Polish & Edge Cases
**Time:** 30 minutes

- [ ] Add proper error handling:
  - If post not found (404)
  - If user doesn't own post (403)
- [ ] Add "Back to Dashboard" links
- [ ] Make forms responsive for mobile
- [ ] Test on different screen sizes

**Acceptance Criteria:**
- ✅ Error cases handled gracefully
- ✅ Navigation intuitive
- ✅ Works on mobile devices

---

### End of Day 4 Review (30 min)
- [ ] Test complete workflow:
  1. Create new post → Save as draft
  2. Edit post → Publish it
  3. View in dashboard
  4. Delete post
- [ ] Commit all changes
- [ ] Take screenshots of dashboard and editor

**Day 4 Deliverables:**
- ✅ Markdown editor integrated
- ✅ New post page with all fields
- ✅ Image upload working
- ✅ Dashboard showing user posts
- ✅ Edit post functionality
- ✅ Delete post with confirmation
- ✅ Draft and publish states working

---

## 📅 Day 5: Friday, February 28, 2026
**Theme:** Public Pages & Pagination  
**Estimated Hours:** 6-8 hours

### Morning (3-4 hours): Homepage & Post List

#### Task 5.1: Homepage with Post List
**Time:** 2.5 hours

- [ ] Create/Update `app/page.js` (homepage)
- [ ] Fetch published posts:
  - Call GET /api/posts?page=1&limit=10
  - Show loading spinner while fetching
  - Store posts and total count in state
- [ ] Design post card component:
  - Create `components/PostCard.js`
  - Display: cover image, title, excerpt (first 150 chars), date, author
  - Make entire card clickable → navigate to /blog/[slug]
  - Style with Tailwind:
    - Use grid or flex layout
    - Shadow on hover
    - Responsive: 1 column mobile, 2 tablet, 3 desktop
- [ ] Render list of posts using PostCard
- [ ] Handle empty state: "No posts yet"
- [ ] Test with multiple posts

**Acceptance Criteria:**
- ✅ Homepage shows published posts
- ✅ Posts displayed in cards with images
- ✅ Excerpt generated from content
- ✅ Clickable cards navigate to post
- ✅ Responsive layout
- ✅ Loading state during fetch

---

#### Task 5.2: Pagination Component
**Time:** 1 hour

- [ ] Create `components/Pagination.js`
- [ ] Accept props:
  - currentPage
  - totalPages
  - onPageChange callback
- [ ] Design pagination UI:
  - Previous button (disabled on page 1)
  - Page numbers (1, 2, 3, ... or show 5 at a time)
  - Next button (disabled on last page)
  - Show "Page X of Y"
- [ ] Implement page change logic:
  - On click, call onPageChange(newPage)
  - Update URL query params: ?page=2
  - Scroll to top
- [ ] Style with Tailwind:
  - Highlight current page
  - Disabled buttons grayed out

**Acceptance Criteria:**
- ✅ Pagination buttons appear
- ✅ Current page highlighted
- ✅ Can navigate between pages
- ✅ Disabled states work correctly
- ✅ URL updates with page number

---

#### Task 5.3: Integrate Pagination in Homepage
**Time:** 45 minutes

- [ ] Add Pagination component to homepage
- [ ] Implement page change:
  - Update state with new page number
  - Fetch posts for new page
  - Scroll to top of page
- [ ] Calculate total pages:
  - totalPages = Math.ceil(totalPosts / postsPerPage)
- [ ] Test pagination:
  - Navigate to page 2
  - Click Previous back to page 1
  - Try going beyond last page (should be disabled)
- [ ] Add URL query param: ?page=2
  - Read page from URL on mount
  - Update URL when page changes

**Acceptance Criteria:**
- ✅ Pagination functional
- ✅ Posts load for each page
- ✅ URL reflects current page
- ✅ Can bookmark page URLs

---

### Afternoon (2-3 hours): Single Post View

#### Task 5.4: Blog Post Detail Page
**Time:** 2.5 hours

- [ ] Create `app/blog/[slug]/page.js`
- [ ] Fetch post by slug:
  - Call GET /api/posts/:slug
  - Show loading spinner
  - Handle 404: show "Post not found" message
- [ ] Design post layout:
  - Hero section:
    - Cover image (full width or large)
    - Post title (large heading)
    - Author name and date
    - Tags as chips
  - Content section:
    - Parse markdown to HTML using `marked`
    - Style markdown elements with Tailwind:
      - Headings: larger text, bold
      - Paragraphs: readable line height
      - Code blocks: background, monospace font
      - Lists: proper indentation
      - Links: underline, color
    - Add max-width for readability (e.g., prose class)
- [ ] Add metadata section:
  - Author info (name, maybe avatar placeholder)
  - Published date (formatted: "Feb 28, 2026")
  - Reading time estimate (optional)
- [ ] Add tags list:
  - Display tags as clickable chips
  - Click tag → navigate to /tag/[slug] (future)

**Acceptance Criteria:**
- ✅ Post loads by slug
- ✅ Cover image displays
- ✅ Markdown rendered as HTML
- ✅ Content styled and readable
- ✅ Author and date shown
- ✅ Tags displayed
- ✅ 404 handling works

---

### Evening (1-2 hours): SEO Implementation

#### Task 5.5: SEO Meta Tags
**Time:** 1.5 hours

- [ ] Create `utils/generateMetadata.js`:
  - Function to generate meta tags for posts
  - Function to generate Open Graph tags
- [ ] Add metadata to post detail page:
  - In `app/blog/[slug]/page.js`, export `generateMetadata`:
    ```javascript
    export async function generateMetadata({ params }) {
      // Fetch post
      // Return metadata object
    }
    ```
  - Include:
    - `<title>`: Post Title | Site Name
    - `<meta name="description">`: meta_description
    - `<meta property="og:title">`: Post title
    - `<meta property="og:description">`: meta_description
    - `<meta property="og:image">`: cover image URL
    - `<meta property="og:url">`: Post URL
    - `<meta property="og:type">`: "article"
- [ ] Add metadata to homepage:
  - Title: "Blog | Site Name"
  - Description: Site description
- [ ] Test meta tags:
  - View page source in browser
  - Verify tags present in `<head>`
  - Use OpenGraph debugger (optional): https://www.opengraph.xyz/

**Acceptance Criteria:**
- ✅ Each post has unique title and description
- ✅ Open Graph tags present
- ✅ Meta tags visible in page source
- ✅ Images have alt text

---

#### Task 5.6: Create sitemap.xml (Optional - if time)
**Time:** 30 minutes

- [ ] Create `app/sitemap.xml/route.js`
- [ ] Generate XML with all post URLs:
  - Fetch all published posts
  - Create XML structure with URLs
  - Include lastmod date
- [ ] Test accessing `/sitemap.xml`

**Acceptance Criteria:**
- ✅ Sitemap accessible at /sitemap.xml
- ✅ Contains all published post URLs

---

### End of Day 5 Review (30 min)
- [ ] Test public-facing pages:
  - Homepage with pagination
  - Individual post pages
  - SEO tags
- [ ] Test responsive design
- [ ] Commit changes
- [ ] Take screenshots

**Day 5 Deliverables:**
- ✅ Homepage with post listing
- ✅ Post cards designed
- ✅ Pagination working
- ✅ Single post view with styled markdown
- ✅ SEO meta tags implemented
- ✅ Open Graph tags
- ✅ Sitemap (if time)

---

## 📅 Day 6: Saturday, March 1, 2026
**Theme:** Polish, Deploy & Documentation  
**Estimated Hours:** 8-10 hours

### Morning (3-4 hours): Final Features & Polish

#### Task 6.1: Tags Implementation
**Time:** 1.5 hours

- [ ] Backend: Create tags endpoints
  - GET /api/tags (list all)
  - POST /api/tags (create tag)
  - Modify POST/PUT /api/posts to handle tags:
    - Accept tags array
    - Create tags if don't exist
    - Link post to tags in post_tags table
- [ ] Frontend: Add tags input to post form
  - Comma-separated input or chip input
  - Show selected tags as chips
  - Save tags with post
- [ ] Display tags on:
  - Post cards (homepage)
  - Post detail page
- [ ] Test tags workflow

**Acceptance Criteria:**
- ✅ Can add tags when creating post
- ✅ Tags saved to database
- ✅ Tags displayed on posts
- ✅ Multiple posts can share tags

---

#### Task 6.2: Error Pages
**Time:** 45 minutes

- [ ] Create `app/not-found.js`:
  - 404 page design
  - "Page not found" message
  - Link back to homepage
- [ ] Create `app/error.js`:
  - Global error boundary
  - Friendly error message
  - "Try again" button
- [ ] Test error states:
  - Invalid URL (404)
  - API error (500)

**Acceptance Criteria:**
- ✅ Custom 404 page
- ✅ Error page catches crashes
- ✅ User-friendly error messages

---

#### Task 6.3: Loading States & Skeleton Screens
**Time:** 1 hour

- [ ] Add loading skeletons:
  - Homepage: skeleton post cards while loading
  - Post detail: skeleton for content
  - Dashboard: skeleton for post list
- [ ] Ensure all async operations show loading:
  - Form submissions
  - Data fetching
  - Image uploads
- [ ] Test loading states by throttling network

**Acceptance Criteria:**
- ✅ Loading states on all async operations
- ✅ Skeleton screens look polished
- ✅ No blank screens during loading

---

#### Task 6.4: Responsive Design Check
**Time:** 45 minutes

- [ ] Test on different screen sizes:
  - Mobile (375px)
  - Tablet (768px)
  - Desktop (1280px)
- [ ] Fix any responsive issues:
  - Navbar mobile menu
  - Post cards layout
  - Editor on mobile
  - Forms on small screens
- [ ] Test touch interactions on mobile
- [ ] Verify images resize properly

**Acceptance Criteria:**
- ✅ Works on all screen sizes
- ✅ Mobile navigation functional
- ✅ Forms usable on mobile
- ✅ No horizontal scroll

---

### Afternoon (3-4 hours): Deployment

#### Task 6.5: Prepare for Deployment
**Time:** 1 hour

- [ ] Backend preparation:
  - Review .env variables
  - Add CORS settings for production domain
  - Ensure all sensitive data in .env (not hardcoded)
  - Add error logging
  - Set NODE_ENV=production
- [ ] Frontend preparation:
  - Update API URLs to production backend
  - Use environment variables: NEXT_PUBLIC_API_URL
  - Verify all images/assets referenced correctly
  - Run build locally: `npm run build`
  - Check for build errors

**Acceptance Criteria:**
- ✅ Environment variables documented
- ✅ No hardcoded secrets
- ✅ Build succeeds locally
- ✅ Production configs ready

---

#### Task 6.6: Deploy Database
**Time:** 30 minutes

- [ ] Set up production database:
  - Option 1: Railway PostgreSQL
  - Option 2: Supabase
  - Option 3: Neon
- [ ] Run schema.sql on production DB
- [ ] Create test user and posts
- [ ] Note down connection string

**Acceptance Criteria:**
- ✅ Production database created
- ✅ Schema applied
- ✅ Connection string secured
- ✅ Test data created

---

#### Task 6.7: Deploy Backend
**Time:** 1 hour

- [ ] Choose platform:
  - Option 1: Railway
  - Option 2: Render
  - Option 3: Fly.io
- [ ] Connect GitHub repository
- [ ] Configure environment variables:
  - DATABASE_URL
  - JWT_SECRET
  - PORT
  - NODE_ENV=production
- [ ] Deploy backend
- [ ] Test endpoints with Postman:
  - Auth endpoints
  - Posts endpoints
  - Upload endpoint
- [ ] Fix any deployment issues
- [ ] Note down backend URL

**Acceptance Criteria:**
- ✅ Backend deployed and running
- ✅ All endpoints accessible
- ✅ Database connected
- ✅ No crashes or errors

---

#### Task 6.8: Deploy Frontend
**Time:** 45 minutes

- [ ] Deploy to Vercel:
  - Connect GitHub repository
  - Configure build settings (should auto-detect Next.js)
  - Set environment variables:
    - NEXT_PUBLIC_API_URL=your_backend_url
  - Deploy
- [ ] Wait for build to complete
- [ ] Visit deployed site
- [ ] Test functionality:
  - Browse posts
  - Register account
  - Login
  - Create post
  - Upload image
  - View post
- [ ] Fix any issues
- [ ] Note down frontend URL

**Acceptance Criteria:**
- ✅ Frontend deployed to Vercel
- ✅ Site accessible publicly
- ✅ Connected to backend successfully
- ✅ All features working

---

#### Task 6.9: Post-Deployment Testing
**Time:** 45 minutes

- [ ] Test complete workflow on production:
  - Register new user
  - Login
  - Create post with image
  - Publish post
  - View on homepage
  - View individual post
  - Edit post
  - Delete post
  - Logout
- [ ] Test on mobile device (real phone)
- [ ] Test in multiple browsers (Chrome, Firefox, Safari)
- [ ] Check console for errors
- [ ] Verify images load
- [ ] Test pagination
- [ ] Check SEO meta tags in production

**Acceptance Criteria:**
- ✅ All features work in production
- ✅ No console errors
- ✅ Mobile-responsive
- ✅ Cross-browser compatible
- ✅ Images load correctly

---

### Evening (2-3 hours): Documentation & Final Polish

#### Task 6.10: Create Comprehensive README
**Time:** 1.5 hours

- [ ] Write README.md with:
  - Project title and description
  - Features list
  - Tech stack
  - Screenshots (homepage, editor, post view)
  - Live demo link
  - Installation instructions:
    - Prerequisites
    - Clone repository
    - Install dependencies
    - Set up database
    - Configure environment variables
    - Run locally
  - Environment variables documentation
  - API endpoints documentation
  - Project structure overview
  - Future enhancements
  - License
  - Author/contact info
- [ ] Take quality screenshots
- [ ] Add badges (optional): build status, license

**Acceptance Criteria:**
- ✅ README is comprehensive
- ✅ Screenshots included
- ✅ Setup instructions clear
- ✅ All sections complete

---

#### Task 6.11: Code Cleanup
**Time:** 1 hour

- [ ] Remove console.logs
- [ ] Remove commented-out code
- [ ] Check for unused imports
- [ ] Ensure consistent formatting
- [ ] Add comments where code is complex
- [ ] Review error handling
- [ ] Check for hardcoded values
- [ ] Verify all files properly named

**Acceptance Criteria:**
- ✅ Code is clean
- ✅ No debug logs
- ✅ Commented appropriately
- ✅ Consistent style

---

#### Task 6.12: Create Portfolio Entry
**Time:** 30 minutes

- [ ] Write project description for portfolio:
  - Problem solved
  - Technologies used
  - Key features
  - Challenges faced
  - What you learned
- [ ] Prepare demo talking points:
  - Create post flow
  - Markdown editing
  - SEO features
  - Responsive design
- [ ] Take video demo (optional):
  - Screen recording of key features
  - 2-3 minutes max

**Acceptance Criteria:**
- ✅ Portfolio description ready
- ✅ Demo talking points prepared
- ✅ Can explain project confidently

---

#### Task 6.13: Final Review & Checklist
**Time:** 30 minutes

- [ ] **Functionality Checklist:**
  - ✅ User registration works
  - ✅ User login works
  - ✅ User logout works
  - ✅ Create post works
  - ✅ Edit post works
  - ✅ Delete post works
  - ✅ Image upload works
  - ✅ Markdown rendering works
  - ✅ Homepage pagination works
  - ✅ Slug generation works
  - ✅ Draft/Published status works
  - ✅ Tags display
  - ✅ SEO meta tags present
  
- [ ] **Quality Checklist:**
  - ✅ No critical bugs
  - ✅ Responsive on mobile
  - ✅ Loading states present
  - ✅ Error handling works
  - ✅ Forms validated
  
- [ ] **Deployment Checklist:**
  - ✅ Frontend deployed
  - ✅ Backend deployed
  - ✅ Database hosted
  - ✅ Environment variables set
  - ✅ URLs publicly accessible
  
- [ ] **Documentation Checklist:**
  - ✅ README complete
  - ✅ Screenshots added
  - ✅ Setup instructions clear
  - ✅ API endpoints documented

---

### End of Day 6 (Project Complete!) 🎉

**Final Deliverables:**
- ✅ Fully functional blog application
- ✅ Deployed to production (Vercel + Railway/Render)
- ✅ Comprehensive README with screenshots
- ✅ Clean, organized code
- ✅ Portfolio-ready project
- ✅ All learning objectives achieved:
  - Rich text editing with markdown
  - File uploads
  - Basic SEO
  - Pagination
  - Slug generation

---

## Sprint Retrospective

### What Went Well
- [ ] List 3-5 things that went smoothly

### Challenges Faced
- [ ] List 3-5 challenges and how you overcame them

### What You Learned
- [ ] Technical skills gained
- [ ] Tools/libraries learned
- [ ] Best practices discovered

### What You'd Do Differently
- [ ] List 2-3 things to improve in next project

### Next Steps
- [ ] Potential features to add later
- [ ] How to showcase this project
- [ ] What to build next

---

## Time Tracking Summary

| Day | Focus Area | Actual Hours | Tasks Completed |
|-----|-----------|--------------|-----------------|
| Day 1 | Setup & Backend Auth | __ hours | ✅ / ✅ / ✅ |
| Day 2 | Backend Posts CRUD | __ hours | ✅ / ✅ / ✅ |
| Day 3 | Frontend Auth | __ hours | ✅ / ✅ / ✅ |
| Day 4 | Editor & Dashboard | __ hours | ✅ / ✅ / ✅ |
| Day 5 | Public Pages & SEO | __ hours | ✅ / ✅ / ✅ |
| Day 6 | Deploy & Polish | __ hours | ✅ / ✅ / ✅ |
| **Total** | **Complete Project** | **~50 hours** | **All Tasks ✅** |

---

## Resources & References

### Documentation to Keep Open
- Next.js Docs: https://nextjs.org/docs
- Express Docs: https://expressjs.com/
- Tailwind Docs: https://tailwindcss.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- React SimpleMDE: https://github.com/RIP21/react-simplemde-editor
- Marked.js: https://marked.js.org/

### When You Get Stuck
1. Read error message carefully
2. Check browser console
3. Check server logs
4. Review documentation
5. Search error on Google/Stack Overflow
6. Take a break and come back fresh

---

## Daily Standup Template

**Use this template each morning:**

```
TODAY'S PLAN:
Date: ___________
Sprint Day: ___ of 7

YESTERDAY I:
- Completed: [tasks]
- Struggled with: [challenges]
- Learned: [insights]

TODAY I WILL:
- Priority 1: [task]
- Priority 2: [task]
- Priority 3: [task]

BLOCKERS:
- [Any issues that need resolution]

ENERGY LEVEL: [High/Medium/Low]
CONFIDENCE: [High/Medium/Low]
```

---

## Success Tips

### Daily Habits
- ✅ Commit code at end of each session
- ✅ Write clear commit messages
- ✅ Test features before moving on
- ✅ Take breaks every 90 minutes
- ✅ Stay hydrated

### Problem-Solving Strategy
1. **Understand:** What is the actual problem?
2. **Break Down:** What are the smaller parts?
3. **Research:** What do docs/examples show?
4. **Try:** Implement one approach
5. **Test:** Does it work?
6. **Iterate:** Refine until it works

### Debugging Mindset
- "There's no such thing as broken code, only code I don't understand yet"
- Console.log is your friend
- Read error messages carefully
- Check Network tab for API issues
- Use React DevTools / Redux DevTools

---

## Motivation Boosters

### When You Feel Stuck
- Remember: Every developer gets stuck
- Take a 15-minute walk
- Explain the problem out loud
- Sleep on it and try tomorrow
- The solution is closer than you think

### When You Feel Behind Schedule
- Focus on MVP only
- Skip "nice-to-have" features
- Quality > perfect
- "Done is better than perfect"
- You can always improve v2

### When You Want to Quit
- Look how far you've come!
- Remember why you started
- One more hour can change everything
- Tomorrow you might solve it in 5 minutes
- This struggle = learning = growth

---

**Remember: This is YOUR project. Adjust the schedule as needed. The goal is to learn and build, not to be perfect. You've got this! 🚀**

---

**Sprint Status:** [  ] Not Started  
**Sprint Start Date:** February 23, 2026  
**Expected Completion:** March 1, 2026  
**Actual Completion:** __________

**Good luck! Build something amazing! 💪**
