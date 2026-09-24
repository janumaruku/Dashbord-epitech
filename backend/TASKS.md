# Project Backlog — Epitech Dashboard

A prioritized, ready-to-copy list of tickets for the GitHub Project board. Ordered top to bottom: **most blocking / highest priority first**, bonus features last. Each ticket maps to a single GitHub issue — copy the heading as the issue title, the label as the GitHub label, and the body below it as the issue description.

Every ticket references the relevant section of `backend/doc.md` so the acceptance criteria stay traceable to the spec.

**Labels used:** `backend`, `frontend`, `devops`, `docs`, `bonus`

**Current state (as of this writing):** Docker scaffolding exists for both services, `docker-compose.yml` wires them together, the frontend is the default `create-next-app` starter, and the backend is a single stub handler returning `{"ans": "OK"}` on `/about.json`. Nothing else is built yet — everything below is from scratch.

---

## Phase 0 — Infrastructure Foundations

### T001 — Add MySQL service to docker-compose
`devops`
No database container exists yet. Add a `mysql:8.0` service with a named volume for persistence, environment variables for root password/user/db name, and a healthcheck. Wire `backend` to `depends_on: mysql` with `condition: service_healthy`.
**Acceptance:** `docker-compose up` starts a MySQL instance the backend can connect to; data survives a container restart.

### T002 — Align backend/frontend ports with Epitech requirements
`devops`
`docker-compose.yml` currently exposes the backend on port 8000; doc.md §1 (Success Criteria, Epitech G-EPI-G-400) requires port **8080**. Frontend is currently mapped to 4242 instead of the conventional 3000. Decide and align — either fix the compose file to 8080/3000, or update doc.md if there's a reason to deviate.
**Acceptance:** Compose ports match whatever doc.md ends up specifying, no mismatch between spec and config.

### T003 — Create `.env.example` and environment config loader (backend)
`backend`
Per doc.md §8 (Deployment): database connection string (MySQL DSN), JWT secret (32+ chars), token expiry, server port, OpenWeatherMap API key, GitHub OAuth client id/secret. Add a `config.go` that loads and validates these at startup (fail fast if a required var is missing).
**Acceptance:** Backend refuses to start with a clear error if `JWT_SECRET` or the DB URL is missing.

### T004 — Create `.env.local.example` for frontend
`frontend`
`NEXT_PUBLIC_API_URL` per doc.md §8. Document it in the frontend README.
**Acceptance:** Fresh clone + copy `.env.local.example` → app can reach the backend.

### T004A — Scaffold the Cobra CLI (serve/migrate/seed)
`backend`
Replace the current `main.go` (which calls `gin.Run` directly) with a Cobra root command exposing three subcommands: `serve` (starts the Gin server), `migrate` (runs Goose up/down), `seed` (seeds services/widgets). See doc.md §3 directory structure (`internal/cli/`).
**Acceptance:** `./server migrate up`, `./server seed`, and `./server serve` all work independently from the same binary.

---

## Phase 1 — Database Schema

### T005 — Write Goose migration files for all 7 tables
`backend`
Implement the MLD from doc.md §4.4 as Goose migrations (`-- +goose Up` / `-- +goose Down` pairs) in `backend/migrations/`: `users`, `services`, `user_services`, `widgets`, `widget_params`, `widget_instances`, `widget_data`, with all PKs, FKs, UNIQUE constraints, and the `refresh_rate BETWEEN 5 AND 3600` CHECK constraint. Runs via the `migrate` Cobra command (T004A).
**Acceptance:** `./server migrate up` against a clean MySQL database creates the full schema; `./server migrate down` cleanly reverses it.

### T006 — Seed initial services & widgets data
`backend`
Insert the 3 required services (weather, github, rss) and their widgets/params (doc.md §6): 3 weather widgets, 3 GitHub widgets, 2 RSS widgets — satisfies the "3 services / 6 widgets" minimum (doc.md §1).
**Acceptance:** `GET /api/services` (once built) returns all 3 seeded services with correct `requires_auth`/`oauth_provider`.

---

## Phase 2 — Authentication (Backend)

### T007 — POST /auth/register
`backend`
Implements UC1. Validate username (3-50 chars, alphanumeric+underscore), email (RFC 5322), password (8+ chars, mixed case, digit, special char). Hash with bcrypt (10+ rounds), issue JWT (1h expiry).
**Acceptance:** Duplicate username/email rejected with the exact error strings in UC1's alternative scenarios; weak password rejected.

### T008 — POST /auth/login
`backend`
Implements UC2. Verify credentials, issue JWT + optional refresh token. Enforce max 5 failed attempts / 15 min / IP (lockout).
**Acceptance:** Wrong credentials always return the generic "Invalid email or password" (never reveal which field was wrong, per doc.md §9).

### T009 — JWT auth middleware
`backend`
Extracts and validates the JWT (HMAC-SHA256, expiry check) from the Authorization header on every protected route; attaches user ID to request context; returns 401 on invalid/missing/expired token.
**Acceptance:** Any protected endpoint called without a valid JWT returns 401, never a 500 or a silent pass-through.

### T010 — POST /auth/refresh
`backend`
Refresh token flow from doc.md §5. Validates refresh token (7-day validity), issues new access token, optionally rotates the refresh token.
**Acceptance:** Expired access token + valid refresh token → new access token issued without re-login.

---

## Phase 3 — Authentication (Frontend)

### T011 — Registration page
`frontend`
`/auth/register` per directory structure in doc.md §3. Form validation mirrors backend rules; on success, store JWT and redirect to `/dashboard`.
**Acceptance:** Client-side validation errors match backend messages; successful registration lands on the dashboard.

### T012 — Login page
`frontend`
`/auth/login`. Same JWT storage/redirect pattern as registration.
**Acceptance:** Invalid login shows the generic error; valid login redirects to `/dashboard`.

### T013 — Auth context, token storage, and protected route guard
`frontend`
`useAuth` hook + Context API (doc.md §3 State layer). Attach JWT to all Axios requests via interceptor; redirect unauthenticated users away from `/dashboard` and `/services`; handle 401 by attempting `/auth/refresh` once before forcing logout.
**Acceptance:** Refreshing the page keeps the user logged in; an expired token triggers a silent refresh, not an immediate logout.

---

## Phase 4 — Services (Backend)

### T014 — GET /api/services
`backend`
Implements UC3. Returns all services with `requires_auth`/`oauth_provider`.
**Acceptance:** Matches the JSON shape in UC3's Output Data exactly.

### T015 — POST /api/user-services/:id/subscribe (non-OAuth path)
`backend`
Implements UC4's Weather scenario. Creates a `user_services` row with no credentials required.
**Acceptance:** Subscribing twice to the same service is rejected (RG4); subscribing to weather requires no OAuth code.

### T016 — GitHub OAuth flow (authorize + callback + token exchange)
`backend`
Implements UC4's OAuth scenario. CSRF-protected via `state` param, exchanges code for token, encrypts with AES-256-GCM (doc.md §5/§9) before storing in `user_services`.
**Acceptance:** Token never appears in logs or the API response body; nonce is unique per encryption (doc.md §9).

---

## Phase 5 — Services (Frontend)

### T017 — Services browse page
`frontend`
`/services` per UC3. Lists services with "Subscribe" / "Connected" state per service.
**Acceptance:** Already-subscribed services show "Connected" instead of "Subscribe" (UC3 alt scenario).

### T018 — Subscribe / GitHub Connect UI + OAuth callback page
`frontend`
One-click subscribe for Weather; "Connect GitHub" button that redirects into the OAuth flow (T016) and lands on `/auth/callback`.
**Acceptance:** Full GitHub connect round-trip works end to end against the real backend flow.

---

## Phase 6 — Widgets (Backend Core)

### T019 — GET /api/widgets (catalog, by service)
`backend`
Returns available widget types + their `widget_params` so the frontend can build dynamic config forms.
**Acceptance:** Response includes param name/type/description for each widget, matching §4.1 dictionary.

### T020 — POST /dashboard/widgets (create instance)
`backend`
Implements UC5. Validates: user subscribed to the widget's service (RG6), config matches widget_params (RG7), refresh_rate in [5,3600] (RG8), position valid (RG9).
**Acceptance:** All four business rules are enforced with the specific error responses from UC5's alt scenarios.

### T021 — GET /dashboard/widgets (list instances + cached data)
`backend`
Implements UC8's read path (cache-check logic lands fully in Phase 9, but the endpoint and its response shape should exist now, backed by a cache stub).
**Acceptance:** Returns instance + latest cached `widget_data` + `fetched_at`/`cached` flags matching UC8's Output Data.

### T022 — PUT /dashboard/widgets/:id (update config/position/refresh_rate)
`backend`
Implements UC6 and UC7's drag-and-drop path. Ownership check (RG10) — 403/401 if the instance isn't the caller's.
**Acceptance:** Editing another user's widget is rejected (UC6 alt scenario).

### T023 — DELETE /dashboard/widgets/:id
`backend`
Implements UC7's delete path. Immediate, no soft-delete/restore (RG per UC7).
**Acceptance:** 200 with no body on success, per UC7's Output Data.

---

## Phase 7 — Widgets (Frontend Core)

### T024 — Dashboard grid with react-grid-layout
`frontend`
`DashboardGrid` component (doc.md §3). Renders widget instances at their stored position/size.
**Acceptance:** Layout persists across reloads (positions come from the backend, not local state).

### T025 — Add Widget flow with dynamic config form
`frontend`
Implements UC5's frontend half: pick service → pick widget type → form generated from `widget_params` (T019) → refresh-rate slider (5-3600s) → submit.
**Acceptance:** Form fields and validation match the widget's param types; submitting an unsubscribed-service widget is blocked client-side too.

### T026 — Drag, resize, and delete interactions
`frontend`
Implements UC7. On drop → `PUT` (T022); delete button → confirm modal → `DELETE` (T023).
**Acceptance:** Drag works on both desktop and touch/mobile (UC4/US4 "mobile drag-friendly").

### T027 — WidgetCard + per-type display components
`frontend`
`WeatherWidget.tsx`, `GitHubWidget.tsx`, `RSSWidget.tsx` (doc.md §3 directory structure) rendering the shapes from §6's per-service tables.
**Acceptance:** Each widget type renders its documented fields (e.g. temperature/condition/humidity for `city_temperature`).

---

## Phase 8 — External Service Integrations (Backend)

### T028 — OpenWeatherMap client
`backend`
`pkg/external/weather.go`. Implements the 3 weather widgets from doc.md §6 (city_temperature, city_forecast, current_conditions) with their documented error handling (401/404/429/503).
**Acceptance:** Rate-limited (429) response returns cached data, not an error.

### T029 — GitHub API client
`backend`
`pkg/external/github.go`. Implements the 3 GitHub widgets (user_profile, recent_repos, recent_commits) using the stored OAuth token, with documented error handling (401/403/404/429/500).
**Acceptance:** Expired token (401) triggers refresh-or-reauth path, not a crash.

### T030 — RSS feed client
`backend`
`pkg/external/rss.go`. Implements feed_latest and feed_summary. Validates `feed_url` is `https://` (RG-level validation per §6).
**Acceptance:** Malformed XML or feed timeout falls back to cached data with a warning, per §6's error table.

### T031 — Unified fallback/error-handling layer
`backend`
Implements the 4-step strategy from doc.md §6 (Input Validation → Cache Check → API Call → Cache Fallback) as a shared wrapper so all three clients behave consistently.
**Acceptance:** Every external call path (weather/github/rss) goes through the same fallback logic — no per-service special-casing.

---

## Phase 9 — Caching & Scheduler (Backend)

### T032 — widget_data cache read/write layer
`backend`
Read/write `widget_data` with `expires_at = fetched_at + refresh_rate` (RG11).
**Acceptance:** A fresh cache hit never triggers an external API call.

### T033 — Scheduler goroutine (time.Ticker, 60s tick)
`backend`
`internal/scheduler/widget_refresh.go` per doc.md §7. Checks all widget instances every 60s, spawns a goroutine per stale one, `sync.WaitGroup` to bound each tick.
**Acceptance:** Widgets refresh independently at their own `refresh_rate`, verified with the timeline example in doc.md §7.

### T034 — Concurrent fetch coordination & graceful shutdown
`backend`
Ensure goroutines don't leak or overlap across ticks; scheduler stops cleanly on server shutdown.
**Acceptance:** Load test with 20+ simultaneous stale widgets completes one tick without errors or goroutine leaks.

---

## Phase 10 — Live Data (Frontend)

### T035 — React Query polling per widget's refresh_rate
`frontend`
Each widget polls `GET /dashboard/widgets` (or a per-widget endpoint) at its own configured interval, not a single global interval.
**Acceptance:** Two widgets with different refresh rates on the same dashboard refetch independently.

### T036 — "Last updated" / cache-state indicator
`frontend`
Shows fetch timestamp and whether data is cached vs. fresh (UC8), plus any warning from the fallback layer (T031).
**Acceptance:** A rate-limited widget visibly shows a warning instead of failing silently.

---

## Phase 11 — Epitech Compliance

### T037 — Full /about.json implementation
`backend`
Replace the current stub (`{"ans": "OK"}`) with the real schema: accurate service and widget metadata per doc.md §1's success criteria.
**Acceptance:** Endpoint reflects the live seeded services/widgets, not hardcoded values.

### T038 — Verify docker-compose build/up end-to-end
`devops`
Full `docker-compose build && docker-compose up` from a clean clone must satisfy every box in doc.md §1's Success Criteria.
**Acceptance:** A teammate can clone, copy `.env.example`, run one command, and reach a working dashboard.

---

## Phase 12 — Security Hardening

### T039 — Registration/login rate limiting middleware
`backend`
5 login attempts / 15min / IP, 3 registrations / hour / IP, 100 API requests / min / user (doc.md §9).
**Acceptance:** 6th login attempt within 15 minutes from the same IP is rejected before hitting the DB.

### T040 — Security headers & CORS
`backend`
CSP, X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security (doc.md §9).
**Acceptance:** Headers present on every response, verified with a curl/security-scan check.

### T041 — Audit logging/error-message hygiene
`backend`
Confirm no JWT, password, or OAuth token ever reaches logs or error responses; confirm errors stay generic (doc.md §9 "At runtime").
**Acceptance:** Grep the codebase/logs for accidental secret leakage — none found.

---

## Phase 13 — Error Handling & UX Polish

### T042 — Consistent error response envelope (backend)
`backend`
Standardize error JSON shape across all endpoints (code, message, no internals leaked).
**Acceptance:** Every documented alt-scenario error message (UC1-UC8) matches what the API actually returns.

### T043 — Toast/error UI system (frontend)
`frontend`
Surface backend error messages and fallback warnings (T031/T036) consistently across the app.
**Acceptance:** Every alt-scenario from the use cases has a visible, non-generic UI reaction.

---

## Phase 14 — Responsive & Accessibility

### T044 — Responsive layout pass (mobile/tablet/desktop)
`frontend`
Per doc.md §2 Success Criteria and US4 ("mobile drag-friendly").
**Acceptance:** Dashboard, auth pages, and services page usable at 375px, 768px, and 1440px widths.

### T045 — WCAG 2.1 AA accessibility pass
`frontend`
Keyboard navigation, contrast, ARIA labels on interactive widgets/forms.
**Acceptance:** Passes an automated audit (e.g. axe) with no critical violations.

---

## Phase 15 — Testing

### T046 — Backend unit tests (handlers, services, auth)
`backend`
Per doc.md §10 coverage goals (80%+ overall, 100% for auth/authorization/widget CRUD).
**Acceptance:** `go test ./...` passes with coverage report meeting the stated targets.

### T047 — Backend integration tests (DB + external API mocks)
`backend`
testcontainers for MySQL; mocked weather/GitHub/RSS responses covering the error-handling paths from §6.
**Acceptance:** Rate-limit/timeout/malformed-response scenarios are all covered, not just the happy path.

### T048 — Frontend unit/integration tests
`frontend`
Jest + React Testing Library + MSW, targeting doc.md §10 goals (70%+ overall, 90%+ utilities).
**Acceptance:** Coverage report meets stated targets.

### T049 — E2E critical-path tests
`frontend`
Playwright/Cypress covering: register → login → subscribe → create widget → drag → see live data.
**Acceptance:** The full UC1→UC8 chain passes as one automated flow.

---

## Phase 16 — Documentation

### T050 — API_SPECIFICATION.md
`docs`
Full endpoint reference (method, path, auth requirement, request/response shapes) — currently listed as "to be created" in doc.md §11.D.
**Acceptance:** Every endpoint referenced across T007-T037 is documented.

### T051 — FRONTEND_SPECIFICATION.md
`docs`
Pages, components, state management, matching what actually got built in Phases 3/5/7/10.
**Acceptance:** No component in the frontend directory is undocumented.

### T052 — README.md setup instructions
`docs`
Clone → env setup → `docker-compose up` → first login, written for someone who has never seen the project.
**Acceptance:** A teammate unfamiliar with the repo can follow it without asking a question.

---

## Phase 17 — Bonus (only after everything above is done)

### T053 — Password reset flow
`bonus`
Email-based recovery (doc.md §2 Feature List, Low priority).

### T054 — Admin dashboard
`bonus`
Manage users and services (UC9/UC10 — Admin actor already defined in the use-case diagram but not detailed).

### T055 — WebSocket-based live updates
`bonus`
Replace polling with push updates, removing the need for per-widget `refresh_rate` polling on the frontend.
