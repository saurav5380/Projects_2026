# Product Requirements Document (PRD)
## Cryptocurrency Coin Dashboard with Real-Time SSE Streaming

**Project Code:** PROJECT-005  
**Complexity Level:** 2 (Intermediate)  
**Tech Stack:** Next.js + React + Tailwind CSS + Express + PostgreSQL + Redis + CoinCap API  
**Duration:** 10 days (June 5-14, 2026)  
**Daily Commitment:** 7-8 hours/day  

---

## 1. Project Overview

### 1.1 Purpose

Build a full-stack cryptocurrency dashboard that streams real-time cryptocurrency prices to users via Server-Sent Events (SSE). Users can create personalized watchlists, track price changes, set price alerts, and view live price charts. This project teaches real-time streaming architecture, caching strategies, and unidirectional server-to-client communication patterns.

### 1.2 Target Audience

Cryptocurrency traders who want live price tracking, developers learning real-time communication systems, and anyone building portfolio monitoring applications.

### 1.3 Success Criteria

All features working end-to-end, SSE streaming delivering price updates in real-time, Redis caching reducing API calls, unit tests covering all features, and application deployed to production.

---

## 2. Core Learning Objectives

By completing this project, you will master:

**1. Server-Sent Events (SSE) Architecture** - Understand one-way real-time communication from server to browser, auto-reconnection, event ID tracking, and message replay without implementing complex WebSocket logic.

**2. Redis Caching Strategy** - Learn how to cache frequently accessed data (crypto prices) with TTL (time-to-live) expiration, cache invalidation patterns, and when to use cache versus database queries.

**3. Real-Time Data Streaming** - Design a system that efficiently pushes live updates to multiple concurrent clients without overwhelming the server or the external API.

**4. External API Integration** - Integrate with CoinCap API, handling rate limits, data transformation, and fallback mechanisms when APIs are unavailable.

**5. Feature Slice Development** - Build complete features from backend API design through database modeling to frontend UI implementation, understanding data flow end-to-end.

**6. Testing Real-Time Systems** - Write unit tests for SSE endpoints, caching logic, API integration, and frontend event handling, ensuring reliability in async scenarios.

**7. User Authentication & Authorization** - Implement JWT-based authentication ensuring users can only access and modify their own watchlists.

**8. Database Relationships** - Model user-to-watchlist and watchlist-to-coins relationships in PostgreSQL, understanding many-to-many and one-to-many relationships.

---

## 3. Concept Alignment with Learning Objectives

### Reinforced from Blog Project

**User Authentication:** You implemented JWT tokens and protected routes in the Blog project. Here you'll deepen this by securing user-specific data (watchlists) with proper authorization checks.

**CRUD Operations:** Blog taught you create, read, update, delete patterns. Crypto dashboard applies the same patterns to watchlists and coins with slightly different complexity.

**Express Routing & Middleware:** You're familiar with route definitions and middleware chains. Here you'll add streaming middleware for SSE endpoints.

**React Hooks & State Management:** Blog used useState and useEffect. Dashboard adds EventSource listener hooks and manages streaming state.

**Form Validation & Error Handling:** Blog included form validation. Crypto dashboard emphasizes error handling for unreliable external APIs and network disconnections.

### New Concepts Introduced

**Server-Sent Events (SSE):** One-way real-time communication (unlike request-response pattern). Browser opens connection and listens to server pushes. Auto-reconnection built-in. Perfect for unidirectional data flows like price updates, notifications, logs.

**Redis In-Memory Cache:** Stores data in RAM instead of disk. Extremely fast. CoinCap API has rate limits - Redis prevents hammering the API every time someone views prices. You'll learn cache keys, expiration times, cache-aside pattern.

**Streaming Architecture:** Multiple users connect simultaneously. Each gets own SSE connection. Server broadcasts updates efficiently to all connected clients. Teaches concurrent connection management.

**Real-Time Chart Updates:** Integrate charting library that updates dynamically as new prices arrive via SSE. Teaches efficient re-rendering of data visualization.

**Price Alerts System:** Users set thresholds (e.g., "Alert me if Bitcoin > $50,000"). Your backend monitors prices and notifies users when thresholds are crossed. Simple pub-sub pattern.

---

## 4. Functional Requirements

### 4.1 User Management

**Register User**

Users can create accounts by providing email and password. System validates email format, enforces password requirements (minimum 6 characters), checks for duplicate emails in the database, and stores password hashed with bcrypt.

Acceptance Criteria: Users receive confirmation they can now login, duplicate emails rejected with clear error message, passwords never stored in plain text, account data in database.

**Login User**

Users authenticate with email and password. System verifies credentials, generates JWT token valid for 7 days, sets httpOnly cookie, and redirects to dashboard.

Acceptance Criteria: Successful login grants access to protected pages, failed login shows error message, token stored securely in httpOnly cookie, subsequent requests include token automatically.

**Logout User**

Users clear their session by clicking logout button. System clears JWT token and redirects to homepage.

Acceptance Criteria: Token cleared from browser, protected routes redirect to login, user can logout and login with different account.

### 4.2 Watchlist Management

**Create Watchlist**

Users create named watchlists (e.g., "My Portfolio", "Long-term Holds"). Each watchlist can track multiple coins. User provides watchlist name (required, max 50 chars).

Acceptance Criteria: Watchlist created in database linked to user, only creator can access their watchlist, multiple watchlists supported per user, watchlist name displayed in UI.

**Add Coin to Watchlist**

Users add cryptocurrencies to their watchlist. System fetches coin data from CoinCap API, validates coin exists, adds coin to watchlist, prevents duplicate coins in same watchlist.

Acceptance Criteria: Coin added to watchlist in database, price data fetched and stored, UI shows added coin immediately, duplicate adds rejected with friendly message.

**Remove Coin from Watchlist**

Users remove coins they no longer want to track. System deletes relationship between watchlist and coin.

Acceptance Criteria: Coin removed from watchlist, no longer appears in watchlist UI, other watchlists unaffected, confirmation dialog prevents accidental deletion.

**View Watchlist**

Users see their watchlist displaying all coins, current prices, 24-hour change percentage, market cap, and trading volume. Data refreshes via SSE streaming.

Acceptance Criteria: All coins in watchlist displayed, prices update in real-time via SSE, 24-hour change shown as red (negative) or green (positive), sorting options available (by price, change %, name).

**Edit Watchlist Name**

Users rename watchlists (e.g., "My Portfolio" → "Active Trades"). Single click renaming with inline edit.

Acceptance Criteria: Watchlist name updates in database and UI, only creator can edit, other watchlists unaffected.

**Delete Watchlist**

Users delete entire watchlists including all coins in them. Soft delete - data marked as deleted but not permanently removed.

Acceptance Criteria: Watchlist disappears from user's list, confirmation modal prevents accidental deletion, can be restored from admin panel if needed, coins themselves not deleted (other users' watchlists unaffected).

### 4.3 Real-Time Price Streaming via SSE

**SSE Connection Establishment**

Frontend opens EventSource connection to backend `/api/stream/prices` endpoint when user views dashboard. Connection stays open and listens for price updates.

Acceptance Criteria: Connection established when page loads, connection ID logged, user can see prices streaming in real-time, connection survives brief network interruptions (auto-reconnect).

**Price Updates Broadcasting**

Backend queries CoinCap API for top cryptocurrencies (or user's watched coins), caches prices in Redis with 10-second TTL, broadcasts prices to all connected SSE clients every 5 seconds.

Acceptance Criteria: Prices update every 5 seconds minimum, all connected clients receive same data at same time, cache reduces API calls significantly, if API fails, cached data used temporarily.

**Personalized Price Streams**

Users see only coins in their watchlists. Backend filters prices before broadcasting to each user.

Acceptance Criteria: User A sees Bitcoin in their watchlist, User B sees Ethereum, each user sees only their coins in the stream, separate EventSource connections for each user.

**Real-Time Chart Updates**

As price updates arrive via SSE, chart component updates in real-time showing price history over last hour.

Acceptance Criteria: Chart updates smoothly (no flickering), 60-minute price history displayed, candlestick or line chart visible, legend shows current price and change percentage.

**Price Alert Notifications**

Users set alert thresholds (e.g., "Notify me when Bitcoin > $50,000"). System monitors prices and triggers notifications when threshold crossed.

Acceptance Criteria: User creates alert in UI, alert condition monitored continuously, notification appears when threshold crossed, notification includes coin name, current price, and threshold that was crossed.

### 4.4 Caching Layer

**Redis Cache Setup**

Express backend connects to Redis on startup. All cryptocurrency price queries check Redis first before hitting CoinCap API.

Acceptance Criteria: Redis connection logged on server start, cache misses handled gracefully, cache hits prevent unnecessary API calls, connection pooling configured for efficiency.

**Cache-Aside Pattern**

When price data requested: Check Redis cache first. If present and not expired (TTL), return cached data. If missing or expired, fetch from CoinCap API, update Redis with 10-second TTL, return fresh data.

Acceptance Criteria: Repeated requests for same coin return instantly from cache, expired cache refreshed from API, cache key naming convention consistent and documented.

**Cache Invalidation**

Price caches expire after 10 seconds automatically via Redis TTL. When user manually refreshes or requests specific price, cache is bypassed and fresh API data fetched.

Acceptance Criteria: Old cached data removed automatically after TTL, manual refresh fetches fresh data immediately, no stale price data shown to users.

### 4.5 Price Alerts System

**Create Alert**

Users set price threshold for a coin (e.g., "Alert when Ethereum < $2,000"). System stores alert in database linked to user and coin.

Acceptance Criteria: Alert stored in database, user can create multiple alerts per coin, alert parameters validated (threshold price > 0), alert displayed in UI.

**Monitor Alerts**

Backend continuously monitors prices against user alerts. When a monitored price crosses the threshold, system creates a notification.

Acceptance Criteria: All active alerts checked when prices update, notification created when threshold crossed, notification includes coin name and current price, alert can fire only once per crossing (don't spam user).

**View & Dismiss Alerts**

Users see notification bell with count of unread alerts. Click bell to see alert history. Click alert to dismiss.

Acceptance Criteria: Notification bell shows count, alert history displayed, dismissed alerts removed from list, alert details show coin name, threshold, and time alert triggered.

**Delete Alert**

Users remove alerts they no longer need. Delete button removes alert from database.

Acceptance Criteria: Alert removed and no longer monitored, user can delete multiple alerts, deletion confirmed in UI.

### 4.6 Dashboard

**Main Dashboard View**

Users see summary of all their watchlists on one page. Each watchlist displayed as card or table showing top 5 coins, current total value (if prices provided), and last update time.

Acceptance Criteria: All watchlists visible, quick access to each watchlist, live price updates visible, responsive design on mobile/tablet.

**Watchlist Detail Page**

Click watchlist to see all coins in detail. Full price chart, 24-hour change, market cap, volume, alerts for each coin.

Acceptance Criteria: All coins in watchlist displayed with full data, prices stream in real-time via SSE, charts update smoothly, loading states shown during data fetch.

**Search & Add Coins**

Users search for coins by name or symbol (e.g., "Bitcoin" or "BTC") to add to watchlist. Search queries CoinCap API and displays top matches.

Acceptance Criteria: Search returns relevant coins, symbols displayed alongside names, can add any coin from search results, duplicate detection prevents adding same coin twice.

**Responsive Design**

Application works perfectly on mobile (375px), tablet (768px), and desktop (1280px) views using Tailwind CSS breakpoints.

Acceptance Criteria: Layout adapts to all screen sizes, touch-friendly buttons on mobile, charts readable on small screens, no horizontal scroll needed.

---

## 5. Non-Functional Requirements

**Performance**

Dashboard homepage loads in under 2 seconds. Price updates via SSE arrive within 1-2 seconds of market change. API calls to CoinCap complete within 500ms.

**Scalability**

System designed to handle 100+ concurrent SSE connections per server. Redis caching prevents API rate limit issues even with many users requesting same coins.

**Reliability**

SSE connections auto-reconnect if dropped. Stale cache data served gracefully if API temporarily unavailable. No data loss if server restarts (Redis persists to disk).

**Security**

Passwords hashed with bcrypt (10 rounds). JWT tokens stored in httpOnly cookies (not accessible to JavaScript). SQL injection prevented with parameterized queries. XSS prevented by sanitizing user input. HTTPS enforced in production.

**Maintainability**

Code organized in feature-based folders. Each feature has corresponding unit tests. Database schema documented. API endpoints documented with request/response examples.

**Usability**

Error messages clear and actionable ("Bitcoin not found" vs "Error"). Loading states shown during async operations. Forms provide real-time validation feedback. Dark/light mode toggles for reduced eye strain when monitoring markets 24/7.

**Accessibility**

Semantic HTML used throughout. Keyboard navigation supported (Tab to navigate, Enter to select). Color contrast meets WCAG AA standards. Alt text on images. Screen reader compatible.

---

## 6. Technology Stack Details

**Frontend (Next.js 14)**

Framework: Next.js with App Router, React 18, Tailwind CSS for styling, React Hook Form for watchlist forms, Recharts for price charts, EventSource native API for SSE (no library needed), SWR for data fetching and caching.

**Backend (Express)**

Framework: Express.js, PostgreSQL with pg driver, Redis client for caching, CoinCap API integration, JWT authentication, bcrypt for password hashing, CORS middleware, helmet for security headers.

**Database (PostgreSQL)**

Three main tables: users (id, email, password_hash, created_at), watchlists (id, user_id, name, created_at), watchlist_coins (watchlist_id, coin_id, price_at_add, created_at), coin_alerts (id, user_id, coin_id, threshold_price, alert_type, created_at).

**Caching (Redis)**

In-memory data store for price caching. Simple key-value structure: `coin:BTC` -> `{ price: 52000, change: 2.5 }`. TTL set to 10 seconds. Used for price data only (not user data).

**External APIs**

CoinCap WebSocket API for real-time prices. Fallback to REST endpoint if WebSocket unavailable. Rate limits: 50 requests per minute (sufficient for our needs).

**Deployment**

Frontend: Vercel (auto-deploys from GitHub). Backend: Railway or Render (with PostgreSQL). Redis: Upstash or Railway Redis. Domain: Custom domain with SSL certificate.

---

## 7. Database Schema

**users Table**

Column: id (SERIAL PRIMARY KEY), email (VARCHAR 255 UNIQUE NOT NULL), password_hash (VARCHAR 255 NOT NULL), name (VARCHAR 100 NOT NULL), created_at (TIMESTAMP DEFAULT NOW()), updated_at (TIMESTAMP DEFAULT NOW()).

Purpose: Store user account information. Email used for login. Password hashed never stored plain text.

**watchlists Table**

Column: id (SERIAL PRIMARY KEY), user_id (INTEGER REFERENCES users ON DELETE CASCADE), name (VARCHAR 100 NOT NULL), created_at (TIMESTAMP DEFAULT NOW()), updated_at (TIMESTAMP DEFAULT NOW()).

Purpose: Each user can create multiple watchlists. user_id ensures watchlist belongs to specific user. Deleted watchlists cascaded deleted if user deleted.

**coins Table**

Column: id (SERIAL PRIMARY KEY), symbol (VARCHAR 10 UNIQUE NOT NULL), name (VARCHAR 100 NOT NULL), coingecko_id (VARCHAR 100 UNIQUE), created_at (TIMESTAMP DEFAULT NOW()).

Purpose: Master list of all coins. symbol: BTC, ETH, etc. name: Bitcoin, Ethereum. coingecko_id: Used for API lookups. Populated initially with top 100 coins, new coins added as users search.

**watchlist_coins Table**

Column: watchlist_id (INTEGER REFERENCES watchlists ON DELETE CASCADE), coin_id (INTEGER REFERENCES coins ON DELETE CASCADE), price_at_add (DECIMAL 15 8), created_at (TIMESTAMP DEFAULT NOW()), PRIMARY KEY (watchlist_id, coin_id).

Purpose: Junction table for many-to-many relationship. watchlist_id + coin_id composite key prevents duplicates. price_at_add stores price when user added coin (for reference). Deleted if coin removed from watchlist.

**coin_alerts Table**

Column: id (SERIAL PRIMARY KEY), user_id (INTEGER REFERENCES users ON DELETE CASCADE), coin_id (INTEGER REFERENCES coins ON DELETE CASCADE), threshold_price (DECIMAL 15 8 NOT NULL), alert_type (VARCHAR 20 CHECK (alert_type IN ('ABOVE', 'BELOW'))), is_active (BOOLEAN DEFAULT true), triggered_at (TIMESTAMP), created_at (TIMESTAMP DEFAULT NOW()).

Purpose: Track price alerts. user_id: Alert belongs to specific user. coin_id: Alert for specific coin. threshold_price: Alert triggers when price crosses this. alert_type: ABOVE (alert when price > threshold) or BELOW (alert when price < threshold). is_active: Can toggle alert on/off. triggered_at: When alert last fired (prevent duplicate notifications).

**Indexes for Performance**

CREATE INDEX idx_watchlists_user ON watchlists(user_id). CREATE INDEX idx_watchlist_coins_watchlist ON watchlist_coins(watchlist_id). CREATE INDEX idx_coin_alerts_user ON coin_alerts(user_id). CREATE INDEX idx_coin_alerts_coin ON coin_alerts(coin_id). CREATE INDEX idx_coins_symbol ON coins(symbol).

---

## 8. API Endpoints

**Authentication Endpoints**

POST /api/auth/register: Create new user account. Request body: { email, password, name }. Response: { id, email, name, token }. Status 201 on success, 400 on validation error (duplicate email, weak password).

POST /api/auth/login: Authenticate user. Request body: { email, password }. Response: { id, email, name, token }. Status 200 on success, 401 if credentials invalid. Token sent as httpOnly cookie.

POST /api/auth/logout: Clear user session. No request body. Response: { message: "Logged out successfully" }. Status 200. Clears httpOnly cookie.

GET /api/auth/me: Get current logged-in user (protected). No request body. Response: { id, email, name }. Status 200. Used on app load to restore user session.

**Watchlist Endpoints**

GET /api/watchlists: Get all watchlists for logged-in user (protected). Response: Array of { id, name, coin_count, created_at }. Status 200.

POST /api/watchlists: Create new watchlist (protected). Request body: { name }. Response: { id, name, created_at }. Status 201.

GET /api/watchlists/:id: Get specific watchlist with all coins (protected). Response: { id, name, coins: [{ id, symbol, name, current_price, change_24h }], created_at }. Status 200. Only owner can access.

PUT /api/watchlists/:id: Update watchlist name (protected). Request body: { name }. Response: { id, name, updated_at }. Status 200. Only owner can update.

DELETE /api/watchlists/:id: Delete watchlist (protected). No request body. Response: { message: "Deleted" }. Status 200. Only owner can delete. Soft delete (mark deleted_at).

**Watchlist Coins Endpoints**

POST /api/watchlists/:watchlistId/coins: Add coin to watchlist (protected). Request body: { coin_id or symbol }. Response: { watchlist_id, coin_id, price_at_add, created_at }. Status 201. Prevents duplicates.

DELETE /api/watchlists/:watchlistId/coins/:coinId: Remove coin from watchlist (protected). No request body. Response: { message: "Removed" }. Status 200. Only watchlist owner can remove.

**Coin Search Endpoints**

GET /api/coins/search?q=bitcoin: Search coins by name or symbol. Query param: q (search string). Response: Array of { id, symbol, name, current_price }. Status 200. No auth required. Queries CoinCap API.

GET /api/coins/top?limit=50: Get top coins by market cap. Query param: limit (default 50, max 250). Response: Array of coins with price data. Status 200. No auth required.

**Real-Time Price Stream (SSE)**

GET /api/stream/prices: Open SSE connection for real-time price updates (protected). Streams: { event: 'price', data: { coin_id, symbol, price, change_24h, timestamp } } every 5 seconds. Uses EventSource on frontend. Auto-reconnects if disconnected. LastEventID header used for replay (in case of disconnect).

GET /api/stream/prices?coins=bitcoin,ethereum: Filter stream to specific coins (protected). Query param: coins (comma-separated symbols). Only updates for specified coins streamed. Lighter payload for users watching few coins.

**Alert Endpoints**

GET /api/alerts: Get all alerts for logged-in user (protected). Response: Array of { id, coin: { symbol, name }, threshold_price, alert_type, is_active, triggered_at, created_at }. Status 200.

POST /api/alerts: Create new price alert (protected). Request body: { coin_id, threshold_price, alert_type: 'ABOVE' | 'BELOW' }. Response: { id, coin_id, threshold_price, alert_type, created_at }. Status 201.

PUT /api/alerts/:id: Update alert (change threshold or toggle active). Request body: { threshold_price?, is_active? }. Response: { id, threshold_price, is_active, updated_at }. Status 200. Only creator can update.

DELETE /api/alerts/:id: Delete alert (protected). Response: { message: "Deleted" }. Status 200. Only creator can delete.

GET /api/alerts/notifications: Get alert notifications for current user (protected). Response: Array of { id, alert_id, coin, triggered_at }. Status 200. Unread notifications marked.

---

## 9. Frontend Routes & Pages

**/**: Homepage. Unauthenticated users see marketing copy. Authenticated users redirected to /dashboard.

**/register**: User registration page. Email, password, name inputs. Success redirects to /login with message "Account created, please login".

**/login**: User login page. Email and password inputs. Success redirects to /dashboard.

**/dashboard**: Main authenticated page. Lists all user's watchlists. Shows summary card for each with coin count and last update time. "Create Watchlist" button. Requires authentication (redirects to login if not auth'd).

**/dashboard/watchlist/:id**: Detailed view of specific watchlist. Lists all coins in watchlist with real-time price updates via SSE. Chart shows price history. Add coin search bar. Remove coin buttons. Requires authentication and ownership.

**/dashboard/alerts**: User's price alerts. Lists all active and inactive alerts. Shows coin, threshold, and type (ABOVE/BELOW). Can toggle active/inactive. Can delete alerts. "Create Alert" button opens modal. Requires authentication.

**/api/stream/prices**: Not a page, but SSE endpoint. Frontend opens EventSource to this endpoint. Receives continuous price updates.

---

## 10. Feature Development Strategy (Feature Slices)

Each feature developed end-to-end from backend to frontend, ensuring developer understands complete data flow.

**Feature Slice #1: User Authentication**

Backend: Express routes (register, login, logout, me), JWT generation, bcrypt password hashing, PostgreSQL users table, middleware to protect routes. Testing: Unit tests for auth logic, invalid credentials, password hashing, JWT token validity.

Frontend: Register page form, login page form, auth context to manage logged-in user state, protected route wrapper. Testing: Form validation tests, successful login redirects to dashboard, invalid credentials show error, logout clears session.

Data flow: User enters email/password → POST /api/auth/login → Backend validates and returns JWT → Frontend stores in cookie → Subsequent requests include JWT automatically → Backend middleware verifies JWT before granting access to protected endpoints.

**Feature Slice #2: Watchlist CRUD**

Backend: Express routes (GET/POST/PUT/DELETE watchlists), PostgreSQL watchlists table with user_id foreign key, authorization middleware ensuring user can only modify own watchlists. Testing: Unit tests for create, read, update, delete, authorization checks, database constraints.

Frontend: Watchlist list page, create watchlist modal, edit watchlist inline, delete watchlist confirmation. Testing: Can create, edit, delete watchlists, only own watchlists shown, confirm before delete, API errors handled gracefully.

Data flow: User clicks "Create Watchlist" → Frontend opens modal → User enters name → POST /api/watchlists → Backend stores in DB → Returns new watchlist → Frontend adds to list without page reload.

**Feature Slice #3: Add/Remove Coins**

Backend: Express routes (POST coin to watchlist, DELETE coin from watchlist), CoinCap API integration to fetch coin data, PostgreSQL coins table and watchlist_coins junction table. Testing: Unit tests for adding coin, duplicate detection, API error handling, authorization.

Frontend: Search coins input, search results display, add coin button, remove coin button in watchlist. Testing: Can search coins, search results accurate, can add coin to watchlist, can remove coin, duplicate adds rejected with message.

Data flow: User searches "Bitcoin" → GET /api/coins/search?q=bitcoin → Backend queries CoinCap API → Returns top matches → Frontend displays. User clicks add → POST /api/watchlists/:id/coins → Backend adds to junction table → Frontend updates watchlist view.

**Feature Slice #4: Real-Time Price Streaming (SSE)**

Backend: Express SSE endpoint (/api/stream/prices), Redis client for caching, CoinCap API polling every 5 seconds, EventSource connection management, broadcasting prices to all connected clients. Testing: Unit tests for SSE endpoint, cache behavior, API error handling, concurrent connections.

Frontend: EventSource listener hook, component subscribing to price updates, state management for incoming prices, error handling for disconnections. Testing: SSE connection established on mount, prices update in real-time, reconnect on disconnect, component cleanup on unmount.

Data flow: Frontend opens EventSource → Backend stores connection → Every 5 sec backend queries CoinCap API → Checks Redis cache → Updates cache if fresh → Broadcasts to all connected clients → Frontend receives event → Updates local state → Component re-renders with new prices.

**Feature Slice #5: Price Charts**

Backend: Same as Feature Slice #4 (prices already streaming). Additional endpoint to get historical prices (last 60 minutes).

Frontend: Recharts component displaying line/candlestick chart, updates real-time as prices arrive via SSE, tooltip showing exact price at timestamp, legend showing current price. Testing: Chart renders correctly, updates smoothly on new prices, responsive to screen size.

Data flow: Frontend fetches 60-minute historical data → GET /api/coins/:id/history?minutes=60 → Displays on chart. As SSE prices arrive, chart appends new data point and shifts old ones off. No page reload needed.

**Feature Slice #6: Price Alerts**

Backend: Express routes (GET/POST/PUT/DELETE alerts), PostgreSQL coin_alerts table, alert monitoring logic checking prices against thresholds, notification creation logic. Testing: Unit tests for alert creation, monitoring logic, threshold detection, only one notification per crossing.

Frontend: Alerts page listing all alerts, create alert modal, toggle active/inactive button, delete alert button, notification bell in navbar. Testing: Can create alert, alerts displayed, can toggle and delete, notification appears when triggered.

Data flow: User sets alert "Bitcoin > $50k" → POST /api/alerts → Backend stores in DB. Backend continuously monitors price updates. When price > $50k → Creates notification → Sends to frontend via SSE or polling → Notification bell updates with count.

**Feature Slice #7: Redis Caching**

Backend: Redis client initialization, cache-aside pattern implementation in price-fetching logic, TTL set to 10 seconds, cache invalidation on manual refresh. Testing: Unit tests verifying cache hits reduce API calls, cache misses trigger API calls, expired cache refreshes.

Frontend: Manual refresh button, button shows loading state, refreshes latest prices from API bypassing cache. Testing: Manual refresh fetches fresh data immediately, repeated requests use cached data.

Data flow: Request price → Check Redis cache → If hit and not expired, return cached data → If miss or expired, query CoinCap API → Store in Redis with 10-sec TTL → Return data. Next request within 10 sec hits cache (much faster).

**Feature Slice #8: Testing & Deployment**

Unit testing: Each feature includes Jest tests for backend logic, critical paths, error cases. Frontend tests for component rendering, user interactions, API integration.

Integration testing: SSE connection establishment and streaming, watchlist data flowing correctly from API to frontend, alerts monitoring and notification triggers.

E2E testing (if time): User creates account → Creates watchlist → Adds coins → Sees prices streaming → Sets alert → Alert triggers notification.

Deployment: Backend to Railway/Render, frontend to Vercel, Redis to Upstash, database migrations applied, SSL certificates configured, environment variables set securely.

---

## 11. Learning Outcomes by Feature

**Authentication:** Understand JWT workflow, password security, protected routes, session management.

**Watchlists:** Understand user-to-resource relationship, ownership-based access control, soft deletes, cascading deletes.

**Coin Management:** Understand external API integration, caching, many-to-many relationships, data normalization.

**SSE Streaming:** Understand unidirectional real-time communication, long-lived connections, EventSource API, efficient broadcasting to multiple clients.

**Charts:** Understand data visualization, real-time updates without page reload, responsive chart sizing.

**Alerts:** Understand monitoring systems, threshold detection, notification systems, preventing duplicate notifications.

**Caching:** Understand Redis, TTL, cache-aside pattern, when to use cache vs database, performance impact of caching.

---

## 12. Success Criteria

**Functionality Complete**

All features working end-to-end. Users can register, login, create watchlists, add coins, see real-time prices, set alerts, and receive notifications. No critical bugs.

**Performance Acceptable**

Dashboard loads in under 2 seconds. SSE price updates arrive within 1-2 seconds. API calls cached effectively (significant reduction in CoinCap API requests).

**Security Verified**

Passwords hashed, JWT tokens secure, SQL injection prevented, XSS prevented, HTTPS enforced in production.

**Testing Comprehensive**

Unit tests covering all features: authentication, watchlist CRUD, coin management, SSE logic, alert monitoring, caching. Each test focused and isolated. Minimum 80% code coverage on critical paths.

**Deployed to Production**

Frontend accessible at custom domain running on Vercel. Backend running on Railway/Render. Database on managed PostgreSQL. Redis caching functional. Application accessible 24/7.

**Documentation Complete**

README with setup instructions, API endpoint documentation with curl examples, database schema documented, features explained with learning outcomes.

---

## 13. Out of Scope

The following features are intentionally excluded from this MVP:

Advanced charting with technical indicators (RSI, MACD, Bollinger Bands) - Use basic line/candlestick charts only.

Multiple cryptocurrencies watchlists with portfolio values - Track coins, not dollar values.

Social features (share watchlists, follow users) - Focus on personal watchlists only.

Advanced analytics and backtesting - Simple price tracking and alerts only.

Mobile app (iOS/Android) - Web application only, but responsive design works on mobile browsers.

Email notifications for alerts - In-app notifications only via browser.

Advanced authentication (OAuth, 2FA) - Simple email/password only.

Admin dashboard for system management - Not needed for learning SSE.

---

## 14. Success Metrics

**Technical Metrics**

API response time: < 500ms for non-streaming endpoints. SSE latency: < 2 seconds from price change to browser update. Cache hit rate: > 80% for price queries. Concurrent SSE connections: Successfully handle 50+.

**User Experience Metrics**

Time to create watchlist: < 1 minute. Time to add coin: < 30 seconds. Price update visible in real-time without page refresh. Alerts triggered reliably within 30 seconds of threshold crossing.

**Learning Metrics**

Can explain how SSE differs from polling and WebSockets. Can explain Redis caching strategy and TTL. Can write unit tests for async operations. Can implement feature slices from backend to frontend. Can deploy full-stack application to production.

---

## 15. Definition of Done (Per Feature)

**Code Complete**

Feature code written and working locally without errors or console warnings.

**Tested**

Unit tests written covering happy path and error cases. Tests passing locally. Minimum one test per critical function.

**Code Review**

Code organized, readable, consistent with project style. No commented-out code. Proper error handling.

**Integrated**

Feature integrated with existing codebase. Database migrations applied. API endpoints working with frontend. No breaking changes to other features.

**Documented**

Feature documented in README. API endpoints documented with examples. Database changes documented.

**Deployed**

Feature deployed to production and verified working on live site.

---

**Document Version:** 1.0  
**Last Updated:** June 4, 2026  
**Status:** Approved for Development  
**Learning Focus:** Real-Time Systems Architecture (SSE, Caching, Data Streaming)
