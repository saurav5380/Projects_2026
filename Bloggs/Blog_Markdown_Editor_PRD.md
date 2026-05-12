#projects #bloggs

# Product Requirements Document (PRD)
## Blog with Markdown Editor

**Project Code:** PROJECT-001  
**Complexity Level:** 1  
**Tech Stack:** Next.js + React + Tailwind CSS + Express + PostgreSQL  
**Duration:** 7 days (Feb 23 - Mar 1, 2026)

---

## 1. Project Overview

### 1.1 Purpose
Build a full-stack blog application where users can create, edit, and publish blog posts using a markdown editor. The application will demonstrate fundamental CRUD operations, file handling, SEO basics, and content management.

### 1.2 Target Audience
- Content creators who prefer writing in Markdown
- Developers building personal blogs
- Anyone learning full-stack web development with markdown integration

### 1.3 Success Metrics
- All CRUD operations working correctly
- Markdown preview renders accurately
- Posts are SEO-optimized with meta tags
- Page load time < 2 seconds
- Successfully deployed to production

---

## 2. Core Learning Objectives

By completing this project, you will learn:
1. **Rich Text Editing:** Integrate markdown editor with live preview
2. **File Uploads:** Handle image uploads for blog posts
3. **Basic SEO:** Implement meta tags, slugs, and Open Graph tags
4. **Pagination:** Implement cursor-based or offset pagination
5. **Slug Generation:** Auto-generate URL-friendly slugs from titles

---

## 3. Functional Requirements

### 3.1 User Management
**Priority:** High  
**Status:** MVP

| Feature  | Description             | Acceptance Criteria                                                                                           |
| -------- | ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| Register | User can create account | - Email validation<br>- Password strength check<br>- Unique email constraint<br>- Account created in database |
| Login    | User can authenticate   | - JWT token generated<br>- Token stored in httpOnly cookie<br>- Redirect to dashboard                         |
| Logout   | User can logout         | - Clear auth token<br>- Redirect to homepage                                                                  |

**Technical Notes:**
- Use bcrypt for password hashing (10 rounds)
- JWT expires in 7 days
- Store user sessions in PostgreSQL

---

### 3.2 Blog Post Management

#### 3.2.1 Create Post
**Priority:** High  
**Status:** MVP

| Feature          | Description                   | Acceptance Criteria                                                                                                                     |
| ---------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Markdown Editor  | Write content in markdown     | - Split-pane editor (markdown left, preview right)<br>- Toolbar with basic formatting buttons<br>- Auto-save draft every 30 seconds     |
| Title Input      | Enter post title              | - Max 200 characters<br>- Required field<br>- Generate slug automatically                                                               |
| Slug Generation  | Auto-create URL-friendly slug | - Replace spaces with hyphens<br>- Remove special characters<br>- Convert to lowercase<br>- Check uniqueness<br>- Allow manual override |
| Cover Image      | Upload featured image         | - Accept jpg, png, webp<br>- Max size 5MB<br>- Store in /uploads folder<br>- Generate thumbnail (300x200)                               |
| Meta Description | SEO description field         | - Max 160 characters<br>- Optional but recommended<br>- Used in search results                                                          |
| Tags             | Add tags to post              | - Input multiple tags<br>- Create new or select existing<br>- Max 5 tags per post                                                       |
| Publish Status   | Draft or Published            | - Toggle between draft/published<br>- Only published posts visible publicly                                                             |

**User Flow:**
1. Click "New Post" button
2. Enter title → Slug auto-generated
3. Write content in markdown editor
4. Upload cover image (optional)
5. Add meta description and tags
6. Click "Save as Draft" or "Publish"
7. Redirect to post preview

---

#### 3.2.2 Edit Post
**Priority:** High  
**Status:** MVP

| Feature         | Description                  | Acceptance Criteria                                                                                                                 |
| --------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Edit Existing   | Modify published/draft posts | - Load post data into editor<br>- Preserve images and formatting<br>- Update slug if title changes<br>- Show last updated timestamp |
| Version History | Track post changes           | - Store updated_at timestamp<br>- Display "Last edited: X ago"                                                                      |

**User Flow:**
1. Navigate to "My Posts"
2. Click "Edit" on post
3. Modify content
4. Save changes
5. See "Post updated successfully" message

---

#### 3.2.3 Delete Post
**Priority:** Medium  
**Status:** MVP

| Feature       | Description             | Acceptance Criteria                                                                               |
| ------------- | ----------------------- | ------------------------------------------------------------------------------------------------- |
| Soft Delete   | Mark post as deleted    | - Don't permanently delete from DB<br>- Add deleted_at timestamp<br>- Confirmation modal required |
| Delete Images | Remove associated files | - Delete cover image from /uploads<br>- Clean up orphaned files                                   |

**User Flow:**
1. Click "Delete" on post
2. Confirm in modal: "Are you sure? This cannot be undone."
3. Post removed from list
4. Show success message

---

#### 3.2.4 View Posts (Public)
**Priority:** High  
**Status:** MVP

| Feature     | Description                 | Acceptance Criteria                                                                                                          |
| ----------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Post List   | Display all published posts | - Show 10 posts per page<br>- Display: title, excerpt, cover image, date, author<br>- Clickable to full post                 |
| Post Detail | View single post            | - Render markdown as HTML<br>- Display formatted content<br>- Show author info, date, tags<br>- Include social share buttons |
| Pagination  | Navigate between pages      | - Previous/Next buttons<br>- Page numbers (1, 2, 3...)<br>- Total count displayed<br>- Disable buttons at boundaries         |

**User Flow (Homepage):**
```
┌─────────────────────────────────────┐
│  Blog Homepage                      │
│                                     │
│  [Post 1: Title, Image, Excerpt]   │
│  [Post 2: Title, Image, Excerpt]   │
│  [Post 3: Title, Image, Excerpt]   │
│  ...                                │
│                                     │
│  [< Previous] [1] [2] [3] [Next >] │
└─────────────────────────────────────┘
```

---

### 3.3 Search & Filtering
**Priority:** Low  
**Status:** Post-MVP (if time permits)

| Feature         | Description           | Acceptance Criteria                                                                  |
| --------------- | --------------------- | ------------------------------------------------------------------------------------ |
| Search by Title | Find posts by keyword | - Search input in navbar<br>- Query database with LIKE<br>- Display matching results |
| Filter by Tag   | Show posts with tag   | - Clickable tags<br>- Filter results page                                            |

---

### 3.4 SEO Requirements
**Priority:** High  
**Status:** MVP

| Feature    | Description             | Implementation                                 |
| ---------- | ----------------------- | ---------------------------------------------- |
| Meta Tags  | HTML meta tags per post | `<title>`, `<meta name="description">`         |
| Open Graph | Social sharing tags     | `og:title`, `og:description`, `og:image`       |
| Sitemap    | XML sitemap for SEO     | `/sitemap.xml` with all published posts        |
| Slugs      | SEO-friendly URLs       | `/blog/my-awesome-post` instead of `/blog/123` |
| Alt Tags   | Image descriptions      | All images have descriptive alt text           |

**Example Post Meta Tags:**
```html
<head>
  <title>10 Tips for Learning React | MyBlog</title>
  <meta name="description" content="Learn React faster with these proven tips..." />
  <meta property="og:title" content="10 Tips for Learning React" />
  <meta property="og:description" content="Learn React faster..." />
  <meta property="og:image" content="https://myblog.com/uploads/react-tips.jpg" />
  <meta property="og:url" content="https://myblog.com/blog/10-tips-learning-react" />
</head>
```

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Homepage loads in < 2 seconds
- Images optimized and lazy-loaded
- Markdown parsing happens server-side (not client-side for every page load)

### 4.2 Security
- Passwords hashed with bcrypt
- JWT tokens in httpOnly cookies (not localStorage)
- SQL injection prevention (use parameterized queries)
- XSS prevention (sanitize markdown output)
- File upload validation (type, size)

### 4.3 Usability
- Mobile-responsive design (Tailwind breakpoints)
- Clear error messages
- Loading states for all async operations
- Form validation with helpful feedback

### 4.4 Accessibility
- Semantic HTML elements
- Keyboard navigation support
- Alt text for images
- Color contrast meets WCAG AA standards

---

## 5. Database Schema

### 5.1 Tables

#### users
```sql
id              SERIAL PRIMARY KEY
email           VARCHAR(255) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL
name            VARCHAR(100) NOT NULL
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

#### posts
```sql
id              SERIAL PRIMARY KEY
author_id       INTEGER REFERENCES users(id) ON DELETE CASCADE
title           VARCHAR(200) NOT NULL
slug            VARCHAR(250) UNIQUE NOT NULL
content         TEXT NOT NULL (markdown)
meta_description VARCHAR(160)
cover_image_url VARCHAR(500)
status          VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published'))
published_at    TIMESTAMP
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
deleted_at      TIMESTAMP (for soft deletes)
```

#### tags
```sql
id              SERIAL PRIMARY KEY
name            VARCHAR(50) UNIQUE NOT NULL
slug            VARCHAR(60) UNIQUE NOT NULL
created_at      TIMESTAMP DEFAULT NOW()
```

#### post_tags (junction table)
```sql
post_id         INTEGER REFERENCES posts(id) ON DELETE CASCADE
tag_id          INTEGER REFERENCES tags(id) ON DELETE CASCADE
PRIMARY KEY (post_id, tag_id)
```

### 5.2 Indexes
```sql
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_published ON posts(published_at);
```

---

## 6. API Endpoints

### 6.1 Authentication

| Method | Endpoint             | Description      | Auth Required |
| ------ | -------------------- | ---------------- | ------------- |
| POST   | `/api/auth/register` | Create new user  | No            |
| POST   | `/api/auth/login`    | Login user       | No            |
| POST   | `/api/auth/logout`   | Logout user      | Yes           |
| GET    | `/api/auth/me`       | Get current user | Yes           |

### 6.2 Posts

| Method | Endpoint              | Description                          | Auth Required     |
| ------ | --------------------- | ------------------------------------ | ----------------- |
| GET    | `/api/posts`          | List all published posts (paginated) | No                |
| GET    | `/api/posts/:slug`    | Get single post by slug              | No                |
| POST   | `/api/posts`          | Create new post                      | Yes               |
| PUT    | `/api/posts/:id`      | Update post                          | Yes (author only) |
| DELETE | `/api/posts/:id`      | Delete post                          | Yes (author only) |
| GET    | `/api/posts/my-posts` | Get user's posts (including drafts)  | Yes               |

### 6.3 Tags

| Method | Endpoint                | Description        | Auth Required |
| ------ | ----------------------- | ------------------ | ------------- |
| GET    | `/api/tags`             | List all tags      | No            |
| GET    | `/api/tags/:slug/posts` | Get posts with tag | No            |

### 6.4 Uploads

| Method | Endpoint      | Description  | Auth Required |
| ------ | ------------- | ------------ | ------------- |
| POST   | `/api/upload` | Upload image | Yes           |

---

## 7. Frontend Pages/Routes

| Route                 | Page           | Description             | Auth Required |
| --------------------- | -------------- | ----------------------- | ------------- |
| `/`                   | Homepage       | List of published posts | No            |
| `/blog/:slug`         | Post Detail    | Single post view        | No            |
| `/login`              | Login          | User login form         | No            |
| `/register`           | Register       | User registration       | No            |
| `/dashboard`          | User Dashboard | User's posts list       | Yes           |
| `/dashboard/new`      | New Post       | Create post editor      | Yes           |
| `/dashboard/edit/:id` | Edit Post      | Edit post editor        | Yes           |
| `/tag/:slug`          | Tag Page       | Posts filtered by tag   | No            |

---

## 8. Technical Stack Details

### 8.1 Frontend (Next.js)
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Markdown Editor:** `react-simplemde-editor` or `react-markdown-editor-lite`
- **Markdown Rendering:** `marked` or `react-markdown`
- **Form Handling:** React Hook Form
- **HTTP Client:** Native fetch API

### 8.2 Backend (Express)
- **Framework:** Express.js
- **Database:** PostgreSQL with `pg` driver
- **Auth:** JWT via `jsonwebtoken`
- **Password:** `bcrypt`
- **File Upload:** `multer`
- **Validation:** `express-validator`
- **CORS:** `cors` middleware

### 8.3 DevOps
- **Frontend Deployment:** Vercel
- **Backend Deployment:** Railway or Render
- **Database:** Railway PostgreSQL or Supabase
- **Image Storage:** Local filesystem (for now)

---

## 9. User Stories

### Story 1: Create and Publish Blog Post
**As a** content creator  
**I want to** write a blog post in markdown with live preview  
**So that** I can publish content easily without HTML knowledge

**Acceptance Criteria:**
- ✅ I can write in markdown on the left pane
- ✅ I see formatted preview on the right pane
- ✅ I can upload a cover image
- ✅ Slug is auto-generated from title
- ✅ I can save as draft or publish immediately
- ✅ Published posts appear on homepage

---

### Story 2: Edit Existing Post
**As a** blog author  
**I want to** edit my previously published posts  
**So that** I can fix typos or update information

**Acceptance Criteria:**
- ✅ I can access my posts from dashboard
- ✅ Clicking "Edit" loads post in editor
- ✅ All content and images are preserved
- ✅ Changes are saved when I click "Update"
- ✅ Updated timestamp is shown

---

### Story 3: View Blog Posts
**As a** visitor  
**I want to** browse and read blog posts  
**So that** I can consume content

**Acceptance Criteria:**
- ✅ Homepage shows list of posts with images
- ✅ I can click a post to read full content
- ✅ Markdown is rendered as formatted HTML
- ✅ I can navigate between pages if >10 posts
- ✅ Page loads quickly (< 2s)

---

### Story 4: SEO Optimization
**As a** blog owner  
**I want my** posts to be SEO-friendly  
**So that** they rank well in search engines

**Acceptance Criteria:**
- ✅ Each post has unique, descriptive slug
- ✅ Meta tags are automatically generated
- ✅ Open Graph tags for social sharing
- ✅ Images have alt text
- ✅ Sitemap.xml is accessible

---

## 10. Out of Scope (Future Enhancements)

The following features are NOT included in this MVP but can be added later:

### 10.1 Not in MVP
- ❌ Comments system
- ❌ Like/reaction system
- ❌ Social login (Google, GitHub)
- ❌ Email notifications
- ❌ Rich media embeds (YouTube, Twitter)
- ❌ Categories (only tags supported)
- ❌ Author profiles
- ❌ Newsletter subscription
- ❌ Analytics dashboard
- ❌ Dark mode
- ❌ Multi-language support
- ❌ Full-text search (only title search if time permits)
- ❌ Image optimization/CDN
- ❌ RSS feed

---

## 11. Success Criteria

**MVP is complete when:**

✅ **Functionality:**
- User can register, login, logout
- User can create posts with markdown
- User can edit and delete their posts
- Visitors can view published posts
- Pagination works correctly
- Image uploads work
- Slugs are generated automatically

✅ **Quality:**
- No critical bugs
- Responsive on mobile, tablet, desktop
- All forms have validation
- Loading states on async operations
- Error handling for failed requests

✅ **SEO:**
- Each post has proper meta tags
- Open Graph tags implemented
- Slugs are URL-friendly
- Sitemap.xml generated

✅ **Deployment:**
- Frontend deployed to Vercel
- Backend deployed to Railway/Render
- Database hosted and accessible
- Environment variables configured
- Application is publicly accessible

✅ **Documentation:**
- README with setup instructions
- Environment variables documented
- API endpoints documented
- Screenshots in README

---

## 12. Definition of Done

A task/feature is "Done" when:

1. ✅ Code is written and working locally
2. ✅ Code is tested (manual testing for MVP)
3. ✅ Code is committed to Git with clear message
4. ✅ Feature works in deployed environment
5. ✅ No console errors or warnings
6. ✅ Responsive design verified
7. ✅ Acceptance criteria met

---

**Document Version:** 1.0  
**Last Updated:** February 23, 2026  
**Author:** Developer  
**Status:** Approved for Development
