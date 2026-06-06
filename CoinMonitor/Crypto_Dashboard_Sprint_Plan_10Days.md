# 10-Day Sprint Plan
## Cryptocurrency Dashboard with Real-Time SSE Streaming

**Sprint Duration:** June 5-14, 2026 (10 consecutive days)  
**Daily Commitment:** 7-8 hours per day  
**Total Effort:** ~70-80 hours  
**Methodology:** Feature Slices (Backend → Frontend → Testing)  
**Tech Stack:** Next.js + React + Tailwind + Express + PostgreSQL + Redis + CoinCap API  

---

## Overview: Feature Slice Approach

Each feature developed completely from backend through frontend before moving to next feature. Data flow traced: API → Database → Backend Logic → Frontend State → User Interface. Testing integrated daily (unit tests minimum), not left for end of sprint.

---

## 📅 Day 1: Thursday, June 5, 2026
**Theme:** Project Foundation & User Authentication Backend  
**Estimated Hours:** 8 hours  

### Morning Session (4 hours): Environment Setup

**Task 1.1: Initialize Project Structure**

[✅] Create Next.js frontend project using `npx create-next-app@latest crypto-dashboard`. Select: TypeScript (no for MVP), Tailwind CSS (yes), App Router (yes), ESLint (yes).

[✅] Create Express backend folder structure parallel to frontend: `/backend`, `/backend/routes`, `/backend/controllers`, `/backend/middleware`, `/backend/utils`, `/backend/tests`.

[✅] Initialize backend npm project: `npm init -y`. Install dependencies: `express pg redis cors dotenv bcryptjs jsonwebtoken`. Install dev dependencies: `nodemon jest`.

[✅] Create `.env.example` file documenting all required environment variables (DATABASE_URL, REDIS_URL, JWT_SECRET, etc.). Create actual `.env` file with local development values.

[✅] Verify: Frontend runs on http://localhost:3000, backend runs on http://localhost:3001, no errors in console.

[✅] Acceptance Criteria: Project structure organized, both apps start without errors, environment variables documented.

**Task 1.2: PostgreSQL Database Setup & Schema**

[✅] Create PostgreSQL database locally: `createdb crypto_dashboard_dev`.

[] Write `database/schema.sql` file containing all table definitions: users, watchlists, coins, watchlist_coins, coin_alerts. Define column types, constraints, indexes.

[✅] Users table: id (SERIAL PRIMARY KEY), email (VARCHAR 255 UNIQUE NOT NULL), password_hash (VARCHAR 255 NOT NULL), name (VARCHAR 100 NOT NULL), created_at (TIMESTAMP), updated_at (TIMESTAMP).

[✅] Test connection from Express backend using pg library: Write simple query to verify connection works.

[✅] Acceptance Criteria: Database created, schema applied, Express backend connects and queries successfully, no SQL errors.

**Task 1.3: Git Repository & Initial Commit**

Initialize Git in project root (or use GitHub). Create `.gitignore` excluding node_modules, .env, .env.local, build artifacts.

Commit: "Initial project setup - frontend and backend scaffolding, database schema".

Acceptance Criteria: Git repository initialized, first commit includes all setup code, .gitignore prevents committing sensitive files.

### Afternoon Session (4 hours): User Authentication - Backend

**Task 1.4: User Registration Endpoint**

Create `backend/controllers/authController.js` with `register` function.

Function accepts: email, password, name. Validates email format (simple regex), password length (min 6 chars), unique email (query database). Hashes password using bcryptjs with 10 rounds. Inserts user into database. Returns user object (without password hash).

Create `backend/routes/authRoutes.js`. Define POST /api/auth/register route that calls authController.register.

Add validation middleware using express-validator to catch invalid inputs early.

Test in Postman: Valid registration succeeds, duplicate email rejected, weak password rejected, response includes user ID and email (no password hash).

Write unit test file `backend/tests/auth.test.js` with Jest. Test: valid registration creates user, password hashed correctly, duplicate email rejected, weak password rejected.

Acceptance Criteria: Register endpoint works, passwords hashed, validation works, unit tests passing, Postman tests successful.

**Task 1.5: User Login Endpoint**

Create `login` function in authController.js.

Function accepts: email, password. Finds user by email. Compares provided password with stored hash using bcryptjs.compare(). If match: Generates JWT token (algorithm: HS256, expires: 7 days, payload: { userId, email }). Returns token and user object.

Create POST /api/auth/login route in authRoutes.

Test in Postman: Valid login returns token, invalid password returns 401, non-existent email returns 401.

Extract JWT_SECRET to .env file. Generate strong secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

Add unit tests for login: valid credentials return token, invalid password fails, user not found fails.

Acceptance Criteria: Login works, tokens generated correctly, invalid credentials rejected, unit tests passing.

**Task 1.6: Authentication Middleware**

Create `backend/middleware/authMiddleware.js`.

Middleware extracts JWT from Authorization header (format: "Bearer TOKEN") or from cookie. Verifies token signature using JWT_SECRET. Decodes token to extract userId. Attaches user object to request (req.user = { userId, email }). Handles expired tokens (return 401).

Test: Requests with valid token succeed, requests with invalid token fail, requests without token fail.

Add unit tests for middleware: valid token passes, expired token rejected, missing token rejected, wrong signature rejected.

Acceptance Criteria: Middleware protects routes, valid tokens grant access, invalid tokens deny access, unit tests passing.

**Task 1.7: Logout & Me Endpoints**

Create `logout` function in authController: Simply returns success message (JWT is stateless, clearing cookie on client side is sufficient).

Create `me` function: Returns current user data from req.user (populated by middleware).

Add POST /api/auth/logout and GET /api/auth/me routes. Logout requires no auth (returns success). Me requires auth middleware.

Test in Postman: Logout returns 200, me returns user data after login, me returns 401 without token.

Add unit tests: logout succeeds, me returns logged-in user, me fails without auth.

Acceptance Criteria: Logout endpoint exists, me endpoint returns user, both endpoints working correctly, unit tests passing.

### End of Day 1 Review (30 min)

Verify all authentication backend endpoints work in Postman: register new user, login, get me, logout. Check database for created user. Check unit test coverage: Run `npm test` and verify all tests pass (minimum 10 tests).

Commit: "Day 1 - User authentication backend complete with unit tests".

**Day 1 Deliverables:**

✅ Frontend and backend projects initialized  
✅ PostgreSQL database created with schema  
✅ User registration endpoint (validated, hashed passwords)  
✅ User login endpoint (JWT token generation)  
✅ Authentication middleware (JWT verification)  
✅ Logout and me endpoints  
✅ Unit tests for all auth functions (minimum 80% coverage)  
✅ All endpoints tested in Postman  

---

## 📅 Day 2: Friday, June 6, 2026
**Theme:** User Authentication - Frontend & Auth Context  
**Estimated Hours:** 8 hours  

### Morning Session (4 hours): Frontend Auth Pages

**Task 2.1: Register Page Component**

Create `app/auth/register/page.js` (Next.js App Router).

Build registration form with: Email input (type="email"), Name input (type="text"), Password input (type="password"), Confirm Password input (type="password"), Submit button.

Implement form validation using React Hook Form: Email format validation, password length >= 6 chars, passwords match, all fields required. Show inline validation errors in red text below each field.

On submit: Call POST /api/auth/register with form data. Show loading spinner during request. On success: Show success message "Account created! Redirecting to login..." and redirect to /login after 2 seconds. On error: Display error message (duplicate email, weak password, etc).

Style with Tailwind CSS: Clean layout, centered form, proper spacing, button disabled during loading, error messages in red.

Test manually: Valid registration succeeds and redirects, duplicate email shows error, weak password shows error, passwords not matching shows error.

Acceptance Criteria: Form renders correctly, validation works, API call successful, redirects after success, error handling works.

**Task 2.2: Login Page Component**

Create `app/auth/login/page.js`.

Build login form with: Email input, Password input, Submit button, "Don't have an account? Register here" link.

Implement form validation: Email required and valid format, password required (min 6 chars).

On submit: Call POST /api/auth/login with credentials. Show loading spinner. On success: Token received (auto-stored in httpOnly cookie by backend). Redirect to /dashboard. On error: Show error message (invalid credentials, server error).

Add "Forgot password?" link (can be disabled for now).

Style consistently with register page using Tailwind.

Test manually: Valid login succeeds and redirects, invalid credentials show error, form validation works.

Acceptance Criteria: Login form works, token handling automatic, redirects to dashboard, error messages clear.

**Task 2.3: Auth Context Setup**

Create `app/context/AuthContext.js` to manage auth state globally.

Context provides: user (null or { id, email, name }), isLoading (boolean), login function, logout function, checkAuth function.

checkAuth function: Calls GET /api/auth/me to restore user session on app load. If token valid, user data restored. If no token, user stays null.

login function: Accepts email/password, calls POST /api/auth/login, stores response in context state.

logout function: Calls POST /api/auth/logout, clears user from state.

Create `app/providers.js` to wrap Next.js app with AuthContext.Provider.

Update `app/layout.js` to use AuthProvider so all pages have access to auth context.

Test: On page load, check if user is logged in (call checkAuth). Auth state available throughout app.

Acceptance Criteria: Auth context created, providers wrap app, auth state accessible from any page.

**Task 2.4: Protected Routes & Navigation**

Create `app/middleware.js` (Next.js middleware) or use client-side route protection.

For client-side: Create HOC `withAuth.js` wrapper that checks if user logged in. If not, redirect to /login. Use for protected pages like /dashboard.

Update Navbar component (or create new) with: Links to Home, Dashboard (if logged in), Login/Register (if not logged in), Logout button (if logged in), User name/email display.

Login/Register links navigate to /auth/login and /auth/register.

Logout button calls logout function from AuthContext, then redirects to home page.

Style navbar with Tailwind: Logo/site name on left, nav links center, user info right. Mobile hamburger menu for small screens.

Test: Unauthenticated user sees Login/Register buttons. After login, sees Dashboard and Logout. Can logout and returns to home.

Acceptance Criteria: Routes protected, navbar updates based on auth state, logout works.

### Afternoon Session (4 hours): Frontend Auth Testing & Integration

**Task 2.5: Unit Tests for Auth Components**

Create `__tests__/auth.test.js`.

Write tests using Jest and React Testing Library.

Test RegisterPage: Form renders, validation works (invalid email rejected, weak password rejected), submit calls API, success redirects to login, error shows message.

Test LoginPage: Form renders, submit calls API, success redirects to dashboard, invalid credentials show error.

Test AuthContext: User state updates on login, clears on logout, checkAuth restores session, hooks work correctly.

Minimum 10 tests total, covering happy path and error cases.

Run `npm test` and verify all pass.

Acceptance Criteria: All auth tests passing, coverage > 80% of auth code.

**Task 2.6: Integration Testing - Auth Flow**

Test complete auth flow manually:

1. Start app at http://localhost:3000. Page shows Home with Login/Register buttons.

2. Click Register. Navigate to register page.

3. Fill form with: email (unique), name, password. Submit.

4. See success message. Redirect to login page.

5. Fill login form with credentials. Submit.

6. Redirected to /dashboard. Navbar shows "Welcome [name]" and Logout button.

7. Click Logout. Redirected to home. Navbar shows Login/Register buttons again.

8. Verify database: User exists in users table, password is hashed (not plain text).

Test edge cases: Try registering with duplicate email (error shown), try login with wrong password (error shown), try accessing /dashboard without login (redirected to login).

Acceptance Criteria: End-to-end auth flow works, edge cases handled, database state correct.

**Task 2.7: Error Handling & UX Polish**

Add toast/notification system for better UX. On successful actions (login, logout), show green success toast. On errors, show red error toast. Toasts auto-dismiss after 3 seconds.

Add loading indicators: Spinner in button during form submission. Disable form inputs while loading to prevent double-submit.

Add proper error messages from backend in frontend toast.

Test: All actions provide feedback, users understand success/failure, no confusing error codes.

Acceptance Criteria: UX polished, error messages helpful, loading states clear.

**Task 2.8: Commit & Documentation**

Commit: "Day 2 - Frontend authentication complete with tests".

Update README: Add authentication flow description, list auth endpoints, explain how to test auth locally.

Acceptance Criteria: Code committed, README updated.

### End of Day 2 Review (30 min)

Test complete auth flow: Register → Login → Logout. Verify Postman tests from Day 1 still pass (backend unchanged). Verify unit tests pass (Day 2 and Day 1). No console errors on frontend or backend.

**Day 2 Deliverables:**

✅ Registration page component (validated form)  
✅ Login page component  
✅ Auth context managing global auth state  
✅ Protected routes requiring authentication  
✅ Navbar with auth-aware navigation  
✅ Logout functionality  
✅ Unit tests for all auth components (>80% coverage)  
✅ Integration test (manual complete flow)  
✅ Error handling and UX polish  

---

## 📅 Day 3: Saturday, June 7, 2026
**Theme:** Watchlist Management - Backend CRUD  
**Estimated Hours:** 8 hours  

### Morning Session (4 hours): Watchlist Backend Structure

**Task 3.1: Watchlist Database & Schema Review**

Verify watchlists table exists in PostgreSQL (from Day 1 schema).

Watchlists table structure: id (SERIAL PRIMARY KEY), user_id (INTEGER REFERENCES users ON DELETE CASCADE), name (VARCHAR 100 NOT NULL), created_at (TIMESTAMP DEFAULT NOW()), updated_at (TIMESTAMP DEFAULT NOW()).

Add indexes: CREATE INDEX idx_watchlists_user ON watchlists(user_id).

Test: Query database to confirm table exists and structure correct.

Acceptance Criteria: Table exists, indexes created, schema correct.

**Task 3.2: Create Watchlist Endpoint**

Create function `createWatchlist` in new `backend/controllers/watchlistController.js`.

Function receives: user_id (from auth middleware), name (from request body).

Validates: name required, name length 1-100 chars.

Inserts into watchlists table: INSERT INTO watchlists (user_id, name) VALUES ($1, $2) RETURNING *.

Returns created watchlist object including id, name, created_at.

Handle errors: Database errors (constraint violations), validation errors.

Create POST /api/watchlists route in new `backend/routes/watchlistRoutes.js`. Route requires auth middleware (authMiddleware).

Test in Postman: Authenticated POST with valid name creates watchlist, invalid names rejected, only authenticated users can create.

Add unit tests: Valid watchlist created, invalid names rejected, user_id correctly stored, timestamps set.

Acceptance Criteria: Endpoint works, validation correct, unit tests passing.

**Task 3.3: Get All Watchlists Endpoint**

Create function `getWatchlists` in watchlistController.js.

Function receives: user_id (from auth middleware).

Queries: SELECT id, name, created_at FROM watchlists WHERE user_id = $1 ORDER BY created_at DESC.

Returns: Array of watchlist objects. Include count of coins in each watchlist (subquery or separate query).

Handle: No watchlists (return empty array), database errors.

Create GET /api/watchlists route. Requires auth middleware.

Test in Postman: Creates multiple watchlists, GET returns all for logged-in user, empty if no watchlists.

Add unit tests: Returns all user watchlists, excludes other users' watchlists, counts coins correctly.

Acceptance Criteria: Endpoint works, correct filtering by user, coin count accurate.

**Task 3.4: Get Single Watchlist Endpoint**

Create function `getWatchlist` in watchlistController.js.

Function receives: watchlistId (from URL param), user_id (from auth middleware).

Queries: SELECT ... FROM watchlists WHERE id = $1 AND user_id = $2. (Authorization: user must own watchlist).

If not found or not authorized: Return 404 or 403.

Returns: Watchlist object including coins in it (join with watchlist_coins).

Create GET /api/watchlists/:id route. Requires auth middleware.

Test: Authenticated user can view own watchlist, cannot view other users' watchlist (403), non-existent ID returns 404.

Add unit tests: Returns correct watchlist, authorization checked, 404 for missing, 403 for unauthorized.

Acceptance Criteria: Endpoint works, authorization enforced, proper error codes.

### Afternoon Session (4 hours): Watchlist Backend - Update/Delete & Testing

**Task 3.5: Update Watchlist Endpoint**

Create function `updateWatchlist` in watchlistController.js.

Function receives: watchlistId (URL param), name (request body), user_id (auth).

Validates: name required, 1-100 chars. Authorization: user_id must match watchlist owner.

Updates: UPDATE watchlists SET name = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *.

Returns: Updated watchlist object.

Create PUT /api/watchlists/:id route. Requires auth middleware.

Test: Can update own watchlist, cannot update others' (403), invalid name rejected.

Add unit tests: Watchlist updated correctly, authorization checked, updated_at timestamp changes.

Acceptance Criteria: Update works, authorization enforced, timestamp correct.

**Task 3.6: Delete Watchlist Endpoint**

Create function `deleteWatchlist` in watchlistController.js.

Function receives: watchlistId, user_id.

Validates: Authorization check (user_id must own watchlist).

Implements soft delete: UPDATE watchlists SET deleted_at = NOW() WHERE id = $1 AND user_id = $2.

OR hard delete: DELETE FROM watchlists WHERE id = $1 AND user_id = $2. (For MVP, hard delete is fine; soft delete for recovery support).

Returns: Success message or affected row count.

Create DELETE /api/watchlists/:id route. Requires auth middleware.

Test: Can delete own watchlist, cannot delete others', deleted watchlist not returned in GET list.

Add unit tests: Watchlist deleted, soft delete marks deleted_at, cannot delete others', 404 for missing.

Acceptance Criteria: Delete works, authorization checked, watchlist removed from list.

**Task 3.7: Watchlist Route Integration**

Add all watchlist routes to Express server in `backend/server.js`:

app.use('/api/watchlists', authMiddleware, watchlistRoutes);

Test in Postman: All CRUD endpoints work, auth required, authorization enforced.

Acceptance Criteria: Routes accessible, auth middleware works, all endpoints functioning.

**Task 3.8: Comprehensive Unit Testing**

Write `backend/tests/watchlist.test.js` with Jest.

Tests: Create watchlist, update watchlist, delete watchlist, get all watchlists, get single watchlist, authorization checks (cannot access other users' watchlists), validation errors, database constraints.

Minimum 15 tests total for watchlist feature.

Run tests and verify all pass. Check coverage > 80%.

Acceptance Criteria: All tests passing, coverage good, edge cases covered.

### End of Day 3 Review (30 min)

Test all watchlist CRUD operations in Postman: Create multiple watchlists, read all, read one, update name, delete. Verify database state (query watchlists table). Verify authorization (try to access other user's watchlist with different token).

Commit: "Day 3 - Watchlist backend CRUD complete with authorization and tests".

**Day 3 Deliverables:**

✅ Create watchlist endpoint (validated)  
✅ Get all watchlists endpoint (for authenticated user)  
✅ Get single watchlist endpoint (with authorization)  
✅ Update watchlist endpoint (with authorization)  
✅ Delete watchlist endpoint (soft or hard delete)  
✅ Proper authorization checks (users can only manage own watchlists)  
✅ Unit tests for all operations (>80% coverage)  
✅ All endpoints tested in Postman  

---

## 📅 Day 4: Sunday, June 8, 2026
**Theme:** Watchlist Management - Frontend  
**Estimated Hours:** 8 hours  

### Morning Session (4 hours): Watchlist List & Detail Pages

**Task 4.1: Watchlist List Page**

Create `app/dashboard/page.js` (requires authentication via HOC).

Fetch user's watchlists on page load: useEffect(() => { GET /api/watchlists }, []).

Show loading spinner while fetching.

Display each watchlist as card or row with: Watchlist name, coin count, created date, action buttons (View, Edit, Delete).

"Create Watchlist" button at top that opens modal.

Click "View" → Navigate to `/dashboard/watchlist/[id]`.

Click "Edit" → Opens inline edit or modal to rename watchlist.

Click "Delete" → Shows confirmation modal, then deletes.

Style with Tailwind: Grid of cards on desktop, stack on mobile, hover effects on cards.

Test manually: Can see watchlists, can create, can view, can edit name, can delete.

Acceptance Criteria: Page displays watchlists, CRUD actions work, responsive design.

**Task 4.2: Watchlist Detail Page**

Create `app/dashboard/watchlist/[id]/page.js`.

Fetch single watchlist data (including coins in it) on mount: GET /api/watchlists/:id.

Show loading spinner during fetch. Handle 404 (watchlist not found) or 403 (unauthorized).

Display watchlist name as page title.

List all coins in watchlist with: Coin symbol, name, current price (initially empty, will be filled by SSE on Day 6), 24h change.

Add coin search input: User types coin name/symbol, search returns matches from CoinCap API, click to add coin to watchlist.

Remove coin button on each coin row.

"Edit watchlist name" button (optional for this day, can do Day 5).

Style with Tailwind: Table or card layout, responsive.

Test manually: Can view watchlist with coins, can add coin (will test full flow once add-coin endpoint exists), can remove coin.

Acceptance Criteria: Page displays correctly, add/remove buttons present and functional, responsive.

**Task 4.3: Create/Edit Watchlist Modal**

Create reusable modal component `components/WatchlistModal.js`.

Modal accepts props: isOpen (boolean), onClose (function), onSubmit (function), initialName (for edit mode).

Form contains: Input field for watchlist name, Cancel button, Submit button.

Validation: Name required, 1-100 chars. Show error messages.

On submit: Call API (POST /api/watchlists for create, PUT /api/watchlists/:id for edit).

Show loading spinner during API call. On success: Close modal, refresh watchlist list.

On error: Show error message in modal.

Test: Can create new watchlist, can edit existing watchlist, validation works, error handling.

Acceptance Criteria: Modal works for create and edit, validation correct, API calls successful.

**Task 4.4: Delete Watchlist Confirmation**

Create confirmation dialog component `components/ConfirmDialog.js`.

Dialog shows: Message "Delete watchlist? This cannot be undone.", Cancel and Confirm buttons.

On confirm: Call DELETE /api/watchlists/:id. Show loading. On success: Close dialog, refresh watchlist list. On error: Show error message.

Test: Delete confirmation works, can cancel (nothing deleted), can confirm (watchlist deleted).

Acceptance Criteria: Confirmation works, proper error handling, watchlist removed from list after delete.

### Afternoon Session (4 hours): Coin Search & Add to Watchlist

**Task 4.5: Coin Search Component**

Create component `components/CoinSearch.js`.

Input field with debounce (300ms delay): User types coin name or symbol.

On input change (after debounce): Call GET /api/coins/search?q=bitcoin.

Display search results as dropdown: Show coin symbol, name, current price (if available).

Click result → Add coin to watchlist (trigger addCoin function).

If no results: Show "No coins found" message.

Clear results when user clears input.

Test: Search returns coins, can add from results, dropdown works.

Acceptance Criteria: Search component functional, API integration working.

**Task 4.6: Add Coin Backend Endpoint (Day 4 Early)**

This technically belongs to Day 5, but needed for frontend testing. Create quickly if time.

Create `addCoinToWatchlist` function in watchlistController.js.

Function receives: watchlistId, coin_id or symbol, user_id.

Validates: Authorization (user owns watchlist), coin exists.

Prevents duplicates: Check if coin already in watchlist.

Inserts into watchlist_coins: INSERT INTO watchlist_coins (watchlist_id, coin_id) VALUES ($1, $2).

Returns: Success message or coin object.

Create POST /api/watchlists/:watchlistId/coins route.

Test in Postman: Can add coin, duplicate prevented, only authorized users can add.

Acceptance Criteria: Endpoint works, duplicate detection, authorization.

**Task 4.7: Add Coin to Watchlist Frontend**

On watchlist detail page, click "Add Coin" in search results.

Call POST /api/watchlists/:watchlistId/coins with coin_id.

Show loading spinner. On success: Add coin to list displayed on page, clear search input.

On error: Show error message (already in watchlist, etc).

Test: Can add coin to watchlist, duplicate error, coin appears in list.

Acceptance Criteria: Add coin works, error handling, UI updates after add.

**Task 4.8: Unit Tests for Watchlist Frontend**

Write `__tests__/watchlist.test.js`.

Tests: Watchlist list page renders, can see watchlists, can create watchlist, can edit watchlist, can delete watchlist, watchlist detail page renders, can add coin, can remove coin, error handling (404, 403), authorization checks in UI (cannot edit others' watchlists).

Minimum 15 tests.

Run tests and verify all pass.

Acceptance Criteria: All tests passing, >80% coverage on watchlist UI code.

### End of Day 4 Review (30 min)

Test complete watchlist management flow: Create watchlist → View watchlist → Add coin (if backend ready) → Edit watchlist name → Delete watchlist.

Verify database state after each operation.

Commit: "Day 4 - Watchlist frontend complete with coin management and tests".

**Day 4 Deliverables:**

✅ Watchlist list page (shows all user's watchlists)  
✅ Watchlist detail page (shows coins in watchlist)  
✅ Create/edit watchlist modal  
✅ Delete watchlist confirmation dialog  
✅ Coin search component  
✅ Add coin to watchlist (button functional)  
✅ Remove coin from watchlist  
✅ Unit tests for all watchlist frontend components  
✅ Full watchlist CRUD flow working end-to-end  

---

## 📅 Day 5: Monday, June 9, 2026
**Theme:** Coin Management Backend & SSE Preparation  
**Estimated Hours:** 8 hours  

### Morning Session (4 hours): Coin Management Backend

**Task 5.1: Coins Table & Data Population**

Create coins table (if not already in Day 1 schema):

Columns: id (SERIAL PRIMARY KEY), symbol (VARCHAR 10 UNIQUE), name (VARCHAR 100), coingecko_id (VARCHAR 100 UNIQUE), created_at (TIMESTAMP DEFAULT NOW()).

Populate with top 100 cryptocurrencies. Create script `backend/scripts/seedCoins.js` that fetches top 100 from CoinCap API and inserts into coins table.

Run script: `node backend/scripts/seedCoins.js`.

Verify database has 100+ coins.

Acceptance Criteria: Coins table populated, seed script works, data in database.

**Task 5.2: Remove Coin from Watchlist Endpoint**

Create function `removeCoinFromWatchlist` in watchlistController.js.

Function receives: watchlistId, coinId, user_id.

Validates: Authorization (user owns watchlist).

Deletes: DELETE FROM watchlist_coins WHERE watchlist_id = $1 AND coin_id = $2.

Returns: Success message.

Create DELETE /api/watchlists/:watchlistId/coins/:coinId route.

Test: Can remove coin owned by user, cannot remove from others' watchlists (403), non-existent coin returns 404.

Add unit tests: Coin removed correctly, authorization checked, database updated.

Acceptance Criteria: Endpoint works, authorization enforced, database consistent.

**Task 5.3: Complete Coin Add/Remove Backend**

Ensure addCoinToWatchlist works completely (from Day 4).

Update to fetch coin by symbol if coin_id not provided: GET /api/coins/search?q=bitcoin returns coin objects, user clicks to add.

Add to watchlist stores coin_id.

Prevent duplicate coins in same watchlist: Check if watchlist_id + coin_id combination exists before insert.

Test: Can add coin by ID or symbol, duplicate prevented, cannot add to others' watchlists.

Add unit tests: Coin added correctly, duplicate detection, proper error codes.

Acceptance Criteria: Full coin add/remove flow working.

**Task 5.4: CoinCap API Integration**

Create `backend/services/coingeckoService.js` (or coinCapService.js).

Function `searchCoins(query)`: Calls CoinCap API (or similar) with search query, returns array of matching coins (symbol, name, current price).

Function `getCoinsData(coinIds)`: Fetches current prices for array of coin IDs.

Function `getTopCoins(limit)`: Fetches top N coins by market cap.

Error handling: API timeouts, rate limits, malformed responses.

Create GET /api/coins/search?q=bitcoin endpoint.

Calls searchCoins service. Returns: Array of {id, symbol, name, current_price}.

Test in Postman: Search returns coins, handles typos gracefully, rate limiting respected.

Add unit tests: searchCoins returns data, error handling, API call structure.

Acceptance Criteria: API integration working, error handling robust.

### Afternoon Session (4 hours): SSE Preparation & Redis Setup

**Task 5.5: Redis Connection Setup**

Install Redis locally or use Redis Cloud. Test redis-cli connection.

In Express backend, create `backend/services/redisService.js`.

Initialize Redis client: `const redis = require('redis'); const client = redis.createClient(...)`.

Implement functions:

- `setCache(key, value, ttl)`: Stores value with TTL (time-to-live) in seconds.
- `getCache(key)`: Retrieves value from cache.
- `deleteCache(key)`: Removes value from cache.
- `flushCache()`: Clears all cache (for testing).

Error handling: Connection errors, timeouts.

Test: Can set/get/delete from Redis locally.

Add unit tests: Cache operations work, TTL respected, errors handled.

Acceptance Criteria: Redis working, cache operations functional.

**Task 5.6: Price Caching Layer**

Create function `getPriceWithCache(coinId)` in a new service.

Implements cache-aside pattern:

1. Check Redis cache for coin price: `getCache('coin:' + coinId)`.
2. If found and not expired: Return cached price.
3. If not found: Call CoinCap API to fetch price.
4. Store in Redis with 10-second TTL: `setCache('coin:' + coinId, price, 10)`.
5. Return price.

Handle API errors: If API fails and cache exists (expired), return cached value temporarily.

Test: Repeated calls use cache (instant), cache expires and refetches from API.

Add unit tests: Cache hit returns cached value, cache miss fetches from API, expired cache refreshes, API errors handled.

Acceptance Criteria: Caching working, TTL correct, performance improved.

**Task 5.7: SSE Endpoint Skeleton**

Create `backend/controllers/streamController.js`.

Skeleton for `streamPrices` function (actual implementation Day 6).

Function receives: res (response object), user_id (from auth).

Sets SSE headers: res.setHeader('Content-Type', 'text/event-stream'), res.setHeader('Cache-Control', 'no-cache'), res.setHeader('Connection', 'keep-alive').

Placeholder: Send test message to verify SSE connection works.

Create GET /api/stream/prices route with auth middleware that calls streamPrices.

Test in browser (Day 6): Can establish EventSource connection, receives test messages.

Acceptance Criteria: SSE endpoint structure ready, test connection possible.

**Task 5.8: Testing & Commit**

Write tests for coin management (already done mostly in Day 4-5).

Verify all endpoints working: GET /api/coins/search, POST add coin, DELETE remove coin.

Verify Redis working: Cache stores and retrieves data.

Verify API integration: CoinCap API calls successful, data parsed correctly.

Commit: "Day 5 - Coin management backend and SSE/Redis preparation complete".

### End of Day 5 Review (30 min)

Test all coin operations: Search coins, add to watchlist, remove from watchlist. Verify Redis cache working (repeated searches faster). Verify CoinCap API integration.

**Day 5 Deliverables:**

✅ Coins table populated with top cryptocurrencies  
✅ Coin search endpoint (integrated with CoinCap API)  
✅ Complete add coin to watchlist (backend + frontend)  
✅ Remove coin from watchlist  
✅ Redis cache layer (cache-aside pattern)  
✅ Price caching with TTL  
✅ SSE endpoint skeleton  
✅ Unit tests for coin management  
✅ CoinCap API integration tested  

---

## 📅 Day 6: Tuesday, June 10, 2026
**Theme:** Real-Time Price Streaming (SSE) & Redis  
**Estimated Hours:** 8 hours  

### Morning Session (4 hours): SSE Implementation

**Task 6.1: Complete SSE Endpoint**

Implement `streamPrices` function in streamController.js.

Logic:

1. User authenticates and opens EventSource connection to GET /api/stream/prices.
2. Generate unique connection ID and log it.
3. Store connection in in-memory map (or use Redis Pub/Sub for scalability).
4. Loop every 5 seconds:
   - Query watchlist coins for user (expensive, optimize with caching).
   - Get prices using getPriceWithCache (hits Redis, then CoinCap if needed).
   - Format data as SSE event: `event: price\nid: [eventId]\ndata: {json}\n\n`.
   - Send to client: `res.write(event)`.
5. Handle client disconnect: Clean up connection from map.
6. Error handling: API failures, database errors.

Test locally: Can establish connection, receive price updates every 5 seconds, updates contain correct data, client disconnect handled.

Acceptance Criteria: SSE connection works, prices update, proper formatting.

**Task 6.2: Connection Management**

Create `backend/utils/connectionManager.js` to track SSE connections.

Map structure: `{ connectionId: { userId, res, createdAt } }`.

Functions:

- `addConnection(connectionId, userId, res)`: Store connection.
- `removeConnection(connectionId)`: Clean up on disconnect.
- `getConnectionsByUser(userId)`: Get all connections for user (for broadcasting).
- `broadcast(data)`: Send data to all connections (for future use).
- `broadcastToUser(userId, data)`: Send data to specific user's connections only.

Handle cleanup: On client disconnect, remove connection from map.

Prevent memory leaks: Connections older than 1 hour auto-removed.

Test: Connections added/removed correctly, no memory leaks.

Add unit tests: addConnection works, removeConnection cleans up, getConnectionsByUser returns correct connections.

Acceptance Criteria: Connection management working, no memory leaks.

**Task 6.3: Frontend SSE Listener**

Create custom hook `hooks/usePriceStream.js` to handle SSE.

Hook manages:

1. Establish EventSource connection: `new EventSource('/api/stream/prices')`.
2. Listen for 'price' events: `es.addEventListener('price', handlePrice)`.
3. Store prices in state: Update component state with incoming prices.
4. Handle reconnection: EventSource auto-reconnects (browser built-in).
5. Handle errors: Log connection errors, show user notification.
6. Cleanup on unmount: Close EventSource, cancel timers.

Usage: `const { prices, isConnected, error } = usePriceStream()`.

Test: Component connects, receives prices, updates state, disconnects properly.

Add unit tests: Hook establishes connection, updates state, handles errors, cleanup on unmount.

Acceptance Criteria: Hook working, prices updating, error handling.

**Task 6.4: Display Real-Time Prices**

Update watchlist detail page to use usePriceStream hook.

Display coins with real-time prices: Symbol, name, current_price (from SSE), change_24h.

Update price display without page reload: When new price arrives via SSE, update component state and re-render.

Show connection status indicator: Green dot if connected, red if disconnected, spinner if reconnecting.

Show last update timestamp: "Updated 2 seconds ago".

Test: Prices update in real-time as SSE events arrive, UI updates smoothly, connection status shown.

Acceptance Criteria: Real-time price display working, UI updates smooth, connection status visible.

### Afternoon Session (4 hours): Redis Optimization & Testing

**Task 6.5: Redis Pub/Sub for Scalability (Optional Advanced)**

For single-server MVP, in-memory connection manager sufficient.

If building for scale: Use Redis Pub/Sub for broadcasting prices across multiple server instances.

Redis Pub/Sub pattern:

- Price fetch service publishes: `redis.publish('prices', JSON.stringify(prices))`.
- All server instances subscribe: `redis.subscribe('prices')`.
- All instances broadcast to their connected clients.

Skip for now if time tight; in-memory works for MVP.

**Task 6.6: Performance Optimization**

Measure performance:

1. Dashboard load time: Should be < 2 seconds (measure with DevTools).
2. SSE latency: Time from price update at source to visible in browser (should be < 2 seconds).
3. Cache hit rate: Repeated requests should use cache (measure with Redis INFO).

Optimize if needed:

- Reduce watchlist coins query: Cache user's watchlist coins list (30-second TTL).
- Batch price fetches: Instead of N separate API calls, fetch prices for multiple coins once.
- Lazy load prices: Only fetch prices for coins actually displayed on page.

Test: Performance metrics improve after optimization.

Acceptance Criteria: Dashboard loads fast, SSE latency low, cache effective.

**Task 6.7: Unit Tests for SSE & Caching**

Write `backend/tests/stream.test.js`:

Tests: SSE endpoint creates connection, connection stored in manager, prices formatted correctly, client disconnect handled, connection manager cleanup, broadcast to user works, errors handled gracefully.

Minimum 12 tests.

Write `backend/tests/redis.test.js`:

Tests: Cache stores value, cache retrieved, TTL respected, expired cache refetched from API, API errors handled with fallback cache, flushCache works.

Minimum 10 tests.

Run all tests: `npm test`. All passing.

Acceptance Criteria: All tests passing, >80% coverage on stream and cache code.

**Task 6.8: Integration Testing - SSE Flow**

Test complete flow manually:

1. User logs in.
2. Navigate to watchlist with coins.
3. Open DevTools Network tab (EventSource connections).
4. See EventSource connection to /api/stream/prices.
5. Watch Network tab: Every 5 seconds, get price update event.
6. Watch page: Prices update in real-time.
7. Disconnect network (DevTools throttle).
8. See connection status change to disconnected.
9. Re-enable network.
10. See connection status change to connecting, then connected.
11. Prices resume updating.

Test Redis:

1. Monitor Redis: `redis-cli MONITOR`.
2. Watch prices update.
3. See cache hits (repeated coin lookups from cache).
4. See cache expires (prices refetch from API after 10 seconds).

Acceptance Criteria: Complete SSE flow working, caching effective, reconnection working.

### End of Day 6 Review (30 min)

Verify SSE streaming working end-to-end. Check dashboard loads fast. Monitor Redis cache hits. No console errors.

Commit: "Day 6 - SSE streaming and Redis caching complete".

**Day 6 Deliverables:**

✅ SSE endpoint streaming price updates  
✅ Connection management for SSE clients  
✅ Frontend SSE listener hook  
✅ Real-time price display on watchlist page  
✅ Connection status indicator  
✅ Redis optimization and caching  
✅ Performance testing and measurement  
✅ Unit tests for SSE and caching (>80% coverage)  
✅ Complete real-time price streaming flow  

---

## 📅 Day 7: Wednesday, June 11, 2026
**Theme:** Price Charts & Alert Backend  
**Estimated Hours:** 8 hours  

### Morning Session (4 hours): Price Charts

**Task 7.1: Historical Price Data**

Create function `getPriceHistory(coinId, minutes=60)` in coingeckoService.

Fetches price data for last N minutes from CoinCap API.

Format: Array of { timestamp, price, change_24h }.

Store in Redis cache with 5-minute TTL (historical data changes slowly).

Test: Can fetch 60-minute price history, returns correct format.

Add unit tests: History fetched correctly, cached appropriately.

Acceptance Criteria: Historical data endpoint working.

**Task 7.2: Charts Endpoint Backend**

Create GET /api/coins/:id/history?minutes=60 endpoint.

Calls getPriceHistory service. Returns historical price data.

Test in Postman: Returns price history for any coin.

Acceptance Criteria: Endpoint working, returns correct data.

**Task 7.3: Chart Component Frontend**

Install Recharts: `npm install recharts`.

Create component `components/PriceChart.js`.

Props: coinId, coinName, initialData (historical prices), realtimePrice (current price from SSE).

Display: Line or candlestick chart showing last 60 minutes of prices.

Update on new SSE prices: As new price arrives, append to chart data, shift old data off left side.

Legend shows: Current price, high/low for period, change percentage.

Responsive: Chart resizes on screen resize, readable on mobile.

Test: Chart renders, displays historical data, updates with SSE prices, responsive.

Add unit tests: Chart renders correctly, data formatted for Recharts, updates on new prices, responsive styling.

Acceptance Criteria: Chart component working, updates real-time.

**Task 7.4: Integrate Charts into Watchlist Page**

Add chart component to watchlist detail page below coin list.

Show chart for selected coin (click coin to select).

Display: Historical prices (last hour) + real-time updates via SSE.

Test: Can select coin, chart displays, updates in real-time.

Acceptance Criteria: Charts integrated into watchlist page.

### Afternoon Session (4 hours): Price Alerts Backend

**Task 7.5: Price Alerts Database & Backend**

Ensure coin_alerts table exists (from Day 1 schema):

Columns: id, user_id, coin_id, threshold_price, alert_type (ABOVE/BELOW), is_active, triggered_at, created_at.

Create `backend/controllers/alertController.js`.

Function `createAlert`:

- Receives: user_id, coin_id, threshold_price, alert_type.
- Validates: threshold_price > 0, alert_type in ['ABOVE', 'BELOW'].
- Inserts into database.
- Returns created alert.

Function `getAlerts`:

- Receives: user_id.
- Queries: SELECT all alerts for user WHERE is_active = true.
- Returns: Array of alerts.

Function `updateAlert`:

- Toggle is_active status.
- Update threshold_price.

Function `deleteAlert`:

- Receives: alert_id, user_id (authorization).
- Deletes alert from database.

Test in Postman: Can create, read, update, delete alerts.

Add unit tests: CRUD operations, authorization, validation.

Acceptance Criteria: Alert CRUD endpoints working.

**Task 7.6: Alert Monitoring Logic**

Create `backend/services/alertService.js`.

Function `monitorAlerts(currentPrices)`:

- Called every 5 seconds (when prices update via SSE fetch).
- Loop through all active alerts for all users.
- For each alert: Check if current price crossed threshold.
- If ABOVE alert and price > threshold: Trigger alert (create notification).
- If BELOW alert and price < threshold: Trigger alert.
- Prevention: Alert fires only once per threshold crossing (check triggered_at, only fire if last_triggered > 5 minutes ago).

Function `createNotification`:

- Receives: user_id, alert_id, current_price.
- Inserts into notifications table: `INSERT INTO notifications (user_id, alert_id, message, created_at) VALUES (...)`.
- Returns notification object.

Test: Alerts monitored correctly, fire when threshold crossed, don't fire repeatedly.

Add unit tests: Monitoring logic correct, notifications created, duplicate prevention works.

Acceptance Criteria: Alert monitoring working.

**Task 7.7: Integrate Alert Monitoring with SSE**

Modify streamPrices to call alertService.monitorAlerts(prices) before broadcasting prices.

When alerts triggered: Create notifications table (if not exists): id, user_id, alert_id, message, is_read, created_at.

Notifications broadcast to user's SSE connection with event type 'alert'.

Frontend receives alert notifications and updates notification bell.

Test: Alerts fire correctly, notifications appear in frontend.

Acceptance Criteria: Alerts and notifications integrated with SSE.

**Task 7.8: Testing & Cleanup**

Write comprehensive tests for alert management and monitoring.

Test complete alert flow: Create alert → Monitor prices → Alert triggers → Notification created → Notification appears in frontend.

Commit: "Day 7 - Price charts and alert system complete".

### End of Day 7 Review (30 min)

Test charts display correctly. Test alert creation, monitoring, triggering. No console errors.

**Day 7 Deliverables:**

✅ Historical price data endpoint  
✅ Chart component (Recharts)  
✅ Real-time chart updates via SSE  
✅ Charts integrated into watchlist page  
✅ Price alert CRUD endpoints  
✅ Alert monitoring logic  
✅ Notifications system  
✅ Alerts integrated with SSE  
✅ Unit tests for charts and alerts  

---

## 📅 Day 8: Thursday, June 12, 2026
**Theme:** Alert Frontend UI & Real-Time Notifications  
**Estimated Hours:** 8 hours  

### Morning Session (4 hours): Alert Frontend

**Task 8.1: Alerts List Page**

Create `app/dashboard/alerts/page.js`.

Fetch user's alerts on page load: GET /api/alerts.

Display alerts in a table or card list:

- Coin name/symbol.
- Threshold price.
- Alert type (ABOVE/BELOW).
- Status (Active/Inactive).
- Created date.
- Delete button.
- Toggle active/inactive button.

Styling: Tailwind responsive table, proper spacing, action buttons.

Test: Can see alerts, can toggle active, can delete.

Acceptance Criteria: Alerts page displaying correctly.

**Task 8.2: Create Alert Modal**

Create `components/AlertModal.js`.

Modal form with:

- Coin selector (search for coin like add coin feature).
- Threshold price input (number, > 0).
- Alert type selector (radio: ABOVE or BELOW).
- Submit button.

Validation: All fields required, price > 0.

On submit: POST /api/alerts with form data.

On success: Close modal, refresh alerts list.

On error: Show error message.

Test: Can create alert with all fields, validation works, API call successful.

Acceptance Criteria: Create alert modal working.

**Task 8.3: Notification Bell & Toast**

Add notification bell icon to navbar (top right).

Shows count badge of unread notifications.

Click bell → Show dropdown with recent notifications.

Each notification shows: Coin, alert message, timestamp.

Click notification → Mark as read, dismiss.

Toast notifications for real-time events:

- When alert triggers: Green toast "Alert! Bitcoin > $50,000".
- When alert fires: Toast appears, auto-dismiss after 5 seconds.

Test: Bell shows count, dropdown displays notifications, toasts appear.

Acceptance Criteria: Notifications UI complete.

**Task 8.4: Alert Notifications via SSE**

Frontend SSE listener hook receives 'alert' event type.

When alert event received:

1. Update notifications list.
2. Increment notification bell count.
3. Show toast notification.
4. Play sound (optional: notification sound on alert).

Test: Alert fires, notification appears, bell updates.

Acceptance Criteria: Real-time alerts working in UI.

### Afternoon Session (4 hours): Real-Time Updates & Integration

**Task 8.5: Personalized Price Streams**

Modify SSE endpoint to support personalized streams.

Query param: GET /api/stream/prices?coins=bitcoin,ethereum

Backend filters prices: Only send prices for coins in user's watchlists (or specified coins).

Reduces payload and network traffic.

Frontend can listen to specific coins.

Test: Each user sees only their coins' prices.

Acceptance Criteria: Personalized streams working, payload reduced.

**Task 8.6: Notification Management**

Create notifications endpoint:

- GET /api/notifications: Get user's notifications (paginated).
- PUT /api/notifications/:id: Mark as read.
- DELETE /api/notifications/:id: Delete notification.

Frontend integrates:

- Notification dropdown shows recent notifications.
- Can mark read, delete notifications.
- Notification bell shows unread count.

Test: Notifications managed correctly, read status updates, count accurate.

Acceptance Criteria: Notifications management working.

**Task 8.7: Error Recovery & Reconnection**

Test SSE reconnection scenarios:

- Browser goes offline → EventSource shows disconnected.
- Browser comes back online → EventSource auto-reconnects.
- Prices resume streaming.
- No data loss during reconnection.

Test alert scenarios:

- Alert triggers while offline → Notification queued.
- Come back online → Notification delivered.
- No duplicate notifications.

Test edge cases:

- Close browser → Disconnect handled cleanly.
- Fast clicking buttons → No duplicate requests.
- API timeouts → Graceful error handling.

Acceptance Criteria: Error recovery working, reconnection seamless.

**Task 8.8: End-to-End Testing**

Complete user journey test:

1. Register and login.
2. Create 2 watchlists.
3. Add 5 coins to each watchlist.
4. View watchlist: See prices streaming in real-time.
5. View charts: See historical prices updating.
6. Create price alert: Bitcoin > $50,000.
7. Simulate alert trigger (manually set price or wait for market move).
8. See notification appear.
9. Click notification: Mark as read.
10. Logout and login: Verify data persists.

Document any issues found.

Acceptance Criteria: Complete flow working without critical bugs.

### End of Day 8 Review (30 min)

Run complete end-to-end user flow. Verify all features working together. Check performance (load time, SSE latency). No console errors.

Commit: "Day 8 - Alert frontend UI and real-time notifications complete".

**Day 8 Deliverables:**

✅ Alerts list page  
✅ Create alert modal and form  
✅ Notification bell with badge  
✅ Notification dropdown  
✅ Toast notifications for alerts  
✅ Real-time alert notifications via SSE  
✅ Mark notifications as read  
✅ Delete notifications  
✅ Personalized price streams by user watchlist  
✅ Error recovery and reconnection  
✅ End-to-end user journey tested  

---

## 📅 Day 9: Friday, June 13, 2026
**Theme:** Testing, Bug Fixes, Performance  
**Estimated Hours:** 8 hours  

### Morning Session (4 hours): Comprehensive Testing

**Task 9.1: Unit Test Coverage Review**

Review test coverage from all days.

Desired coverage:

- Authentication: >90%.
- Watchlist management: >85%.
- Coin management: >85%.
- SSE/Streaming: >80%.
- Alert system: >85%.
- Caching: >80%.

Run `npm test -- --coverage` in both frontend and backend.

Identify gaps: Any functionality < 80% coverage.

Write additional tests for gaps.

Target: >80% overall coverage.

Acceptance Criteria: Coverage > 80% across codebase.

**Task 9.2: Integration Test Scenarios**

Write integration tests combining multiple features:

Scenario 1: User creates watchlist → Adds coins → Views prices streaming → Creates alert → Alert triggers → Notification appears.

Scenario 2: Two users create watchlists with overlapping coins → Verify SSE isolation (each user sees only their coins).

Scenario 3: User creates alert → Logs out → Logs back in → Alert still active → Triggers correctly.

Scenario 4: Cache expires → Price refetches from API → No stale data shown.

Test edge cases:

- API rate limit: What happens when CoinCap API returns 429?
- Database connection loss: How does system recover?
- SSE connection drop during streaming: Reconnection works?
- Rapid button clicks: No duplicate requests?

Acceptance Criteria: All integration tests passing, edge cases handled.

**Task 9.3: Performance Testing**

Measure key metrics:

- Homepage load time: < 2 seconds.
- Dashboard with 20 coins load: < 2 seconds.
- SSE price update latency: < 2 seconds from API to browser.
- API response times: < 500ms for non-streaming endpoints.
- Cache hit rate: > 80% on price queries.

Tools: Chrome DevTools, Network tab, Timeline, Console timing.

Identify bottlenecks: Slow API calls, large payloads, inefficient queries.

Optimize:

- Lazy load images.
- Minify CSS/JS.
- Optimize database queries (add indexes if needed).
- Reduce SSE payload size.
- Increase cache TTL where appropriate.

Retest and verify improvements.

Acceptance Criteria: All performance targets met.

**Task 9.4: Security Review**

Manual security check:

- Passwords: Verify hashed in database (never plain text).
- JWT tokens: Verify httpOnly cookie set (not accessible to JavaScript).
- Authorization: Verify users can only access own data (watchlists, alerts, notifications).
- SQL injection: Verify parameterized queries used throughout.
- XSS: Verify user input sanitized, API responses sanitized.
- CORS: Verify CORS policy correct (allow frontend domain only).

Test security:

- Try to access another user's watchlist with different token (403).
- Try to delete someone else's alert (403).
- Try SQL injection in search: `bitcoin' OR '1'='1` (should be safe).

Acceptance Criteria: No security vulnerabilities found.

### Afternoon Session (4 hours): Bug Fixes & Polish

**Task 9.5: Bug Fixes from Testing**

During testing (Days 1-8), issues were likely discovered. Day 9 is allocated for fixing them.

Common issues:

- UI layout broken on mobile (fix with responsive CSS).
- Form validation messages unclear (improve error text).
- API error handling insufficient (add proper error messages).
- Loading states missing in some places (add spinners).
- Race conditions in state updates (fix with useEffect cleanup).

For each bug:

1. Reproduce the issue.
2. Identify root cause.
3. Fix in code.
4. Test fix.
5. Add test case to prevent regression.

Acceptance Criteria: All discovered bugs fixed, regression tests added.

**Task 9.6: UX Polish**

Improve user experience based on Day 8 end-to-end testing.

Enhancement ideas:

- Empty states: Show helpful message when user has no watchlists ("Create your first watchlist").
- Loading skeletons: Show placeholder while data loading (better than blank screen).
- Animations: Smooth transitions when prices update, alerts appear.
- Accessibility: Tab navigation works, keyboard shortcuts (Enter to submit), focus indicators visible.
- Mobile UX: Touch-friendly buttons, readable text, no horizontal scroll.
- Notifications: Show summary notification if multiple alerts trigger (e.g., "3 alerts triggered").

Test on actual mobile device (not just browser DevTools).

Acceptance Criteria: UX improved, no rough edges, works smoothly.

**Task 9.7: Documentation Finalization**

Update README.md with:

- Complete feature list.
- Technology stack explanation.
- How to set up locally (install, env vars, database, run).
- How to test (run unit tests, integration tests).
- API endpoint documentation with curl examples.
- Database schema documentation.
- Known limitations or future features.
- Contributing guidelines (for portfolio context).

Update code comments:

- Add JSDoc comments to functions.
- Comment complex logic.
- Document assumptions.

Acceptance Criteria: Documentation complete and accurate.

**Task 9.8: Final Integration Testing**

Complete end-to-end test one more time:

1. Fresh database (delete all data).
2. Register new user.
3. Create watchlist.
4. Add coins.
5. View prices streaming.
6. Create alert.
7. Wait for alert trigger (or manually test).
8. Verify notification.
9. Logout and login (verify session restored).
10. Verify all data still there.
11. Delete alert and watchlist.
12. Verify cleanups work.

No errors should appear in console. All operations should feel smooth. Performance should be acceptable.

Document any remaining issues for post-MVP improvements.

Acceptance Criteria: Complete flow working flawlessly.

### End of Day 9 Review (30 min)

Test coverage > 80%. Performance metrics met. No critical bugs. Security verified. Documentation complete.

Commit: "Day 9 - Testing, bug fixes, and polish complete. MVP ready for deployment."

**Day 9 Deliverables:**

✅ Unit test coverage > 80% across codebase  
✅ Integration tests for complex scenarios  
✅ Performance testing and optimization  
✅ Security review and fixes  
✅ All discovered bugs fixed  
✅ UX polished and refined  
✅ Mobile-responsive verified  
✅ Comprehensive documentation  
✅ End-to-end flow tested  

---

## 📅 Day 10: Saturday, June 14, 2026
**Theme:** Deployment & Production Launch  
**Estimated Hours:** 8 hours  

### Full Day: Production Deployment

**Task 10.1: Deployment Preparation** (2 hours)

Ensure all code committed to GitHub: `git push origin main`.

Create production environment files:

- `.env.production`: Production environment variables.
- Database: Set up production PostgreSQL (Render, Railway, or similar).
- Redis: Set up production Redis (Upstash, Railway, or similar).
- Secrets: Generate strong JWT_SECRET for production.

Configure CORS: Backend should only accept requests from frontend domain.

Configure SSL: All HTTPS (handled by Vercel and hosting providers).

Test build locally: `npm run build` for both frontend and backend. No errors.

**Task 10.2: Backend Deployment** (2 hours)

Choose hosting: Railway, Render, or Fly.io.

Steps (using Railway as example):

1. Connect GitHub repository.
2. Create PostgreSQL service linked to backend.
3. Set environment variables (DATABASE_URL, REDIS_URL, JWT_SECRET, NODE_ENV=production).
4. Deploy: Push to main branch, Railway auto-deploys.
5. Monitor deployment: Check Railway dashboard for errors.
6. Test backend: Call API endpoints from Postman, use production database.
7. Monitor logs: Check for errors in Railway logs.

Acceptance Criteria: Backend running on production URL, API endpoints accessible, no errors in logs.

**Task 10.3: Frontend Deployment** (2 hours)

Use Vercel for frontend.

Steps:

1. Connect GitHub repository.
2. Set environment variable: NEXT_PUBLIC_API_URL=<production_backend_url>.
3. Deploy: Push to main, Vercel auto-deploys.
4. Monitor: Check Vercel dashboard.
5. Test frontend: Visit Vercel URL, test complete user flow.

Acceptance Criteria: Frontend accessible, connects to production backend, user flow works.

**Task 10.4: Custom Domain & SSL** (1 hour)

(Optional, can skip for MVP if time tight.)

Configure custom domain: Point domain to Vercel (frontend) or load balancer.

SSL: Handled automatically by Vercel and hosting providers (Let's Encrypt).

Test: Visit domain name, HTTPS works (no certificate warnings).

Acceptance Criteria: Custom domain accessible via HTTPS.

**Task 10.5: Production Testing** (1 hour)

Complete user journey on production:

1. Visit frontend domain.
2. Register new user.
3. Create watchlist and add coins.
4. View real-time prices.
5. Create alert.
6. Trigger alert (wait or manually test).
7. Verify notification.

Monitor backend logs for any errors.

Monitor Redis cache usage (should have good hit rate).

Acceptance Criteria: All features work on production, no errors.

### End of Day 10: Launch Complete 🎉

**Final Checklist:**

✅ All code committed and pushed.  
✅ Backend deployed and running.  
✅ Frontend deployed and running.  
✅ Database and Redis provisioned.  
✅ Environment variables configured.  
✅ SSL/HTTPS working.  
✅ Complete user flow tested on production.  
✅ Logs monitored, no errors.  
✅ Documentation complete.  
✅ Repository public on GitHub.  

**Day 10 Deliverables:**

✅ Production backend deployed and running  
✅ Production frontend deployed and running  
✅ Production database and Redis configured  
✅ Custom domain configured (optional)  
✅ SSL certificates installed  
✅ Production testing complete  
✅ Monitoring and logging set up  
✅ GitHub repository public  
✅ All documentation final  
✅ MVP officially launched  

---

## Sprint Summary & Metrics

### Features Delivered (10 Days)

**Authentication:** User registration, login, logout, protected routes, JWT tokens, session management.

**Watchlist Management:** Create, read, update, delete watchlists. Authorization ensuring users manage only own watchlists.

**Coin Management:** Search coins, add to watchlist, remove from watchlist. Integration with CoinCap API.

**Real-Time Price Streaming:** Server-Sent Events (SSE) broadcasting live cryptocurrency prices. Real-time dashboard updates.

**Price Charts:** Historical price display with real-time updates. Interactive Recharts visualizations.

**Price Alerts:** Users set price thresholds. System monitors prices. Notifications when thresholds crossed.

**Caching Layer:** Redis caching with cache-aside pattern. 10-second TTL for prices, 5-minute for historical data.

**Responsive Design:** Mobile, tablet, desktop layouts. Touch-friendly UI. Accessible navigation.

**Testing:** Unit tests >80% coverage. Integration tests. End-to-end flows. Security and performance testing.

**Production Deployment:** Deployed to Vercel (frontend), Railway/Render (backend), managed PostgreSQL and Redis.

### Learning Outcomes

**Technical Skills:** SSE architecture, Redis caching, real-time systems, feature slice development, comprehensive testing, production deployment.

**Architecture Understanding:** How data flows from external API → backend → cache → frontend via SSE. How multiple clients connect simultaneously without overwhelming server.

**Real-Time Systems:** One-way communication (SSE), auto-reconnection, connection management, broadcasting to multiple clients, preventing data loss.

**Performance Optimization:** Caching strategies, TTL management, query optimization, lazy loading, reducing API calls.

**Security:** JWT authentication, HTTPS, SQL injection prevention, XSS prevention, authorization checks, secure password storage.

### Time Allocation (70-80 hours total)

Day 1: 8 hours - Auth backend  
Day 2: 8 hours - Auth frontend  
Day 3: 8 hours - Watchlist backend  
Day 4: 8 hours - Watchlist frontend  
Day 5: 8 hours - Coin management + SSE prep  
Day 6: 8 hours - SSE streaming + Redis  
Day 7: 8 hours - Charts + Alerts backend  
Day 8: 8 hours - Alerts frontend + notifications  
Day 9: 8 hours - Testing + bug fixes + polish  
Day 10: 8 hours - Deployment  

Total: 80 hours

### Quality Metrics

**Code Coverage:** >80% unit test coverage.

**Performance:** Dashboard < 2s load time. SSE latency < 2s. Cache hit rate > 80%.

**Uptime:** 99%+ (handled by hosting providers).

**Security:** No vulnerabilities found in security review.

**User Experience:** Smooth real-time updates. Responsive design. Clear error messages.

---

## Conclusion

This 10-day sprint delivers a fully functional, production-ready cryptocurrency dashboard. You'll gain deep understanding of real-time systems (SSE), caching (Redis), and feature-slice development. Every feature tested end-to-end from backend to frontend. On Day 10, you launch to production.

This project demonstrates mastery of intermediate full-stack development and is portfolio-worthy.

---

**Sprint Status:** Ready to Execute  
**Start Date:** June 5, 2026  
**End Date:** June 14, 2026  
**Learning Focus:** Real-Time Systems Architecture (SSE, Caching, Data Streaming)  

**Good luck! You've got this! 🚀**
