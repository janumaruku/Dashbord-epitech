# Frontend Specification
## Epitech Dashboard Project

**Source of truth:** `backend/doc.md` (sections 2, 3, 5, 6, 7, 8, 9, 10). Where this document and `doc.md` disagree, `doc.md` wins unless this document says otherwise explicitly.
**Implementation tickets:** `backend/TASKS.md` Phases 3, 5, 7, 10, and T043–T049, T051.
**Status:** Specification. Implementation starts from this document.

---

## 1. Scope

The frontend is a Next.js application that lets an authenticated user subscribe to external services (weather, GitHub, RSS), create widget instances, arrange them on a draggable dashboard, and see their data refresh automatically.

In scope: pages and components for UC1–UC8, the API client, auth session handling, widget data refresh, responsive layout, accessibility (WCAG 2.1 AA), and the frontend tests.

Out of scope: password reset, admin dashboard, WebSockets (bonus features, `doc.md` §2 feature list).

---

## 2. Stack

From `doc.md` §3 (Technology Stack).

| Concern | Technology | Version |
|---|---|---|
| Framework | Next.js, App Router | 14.x |
| UI runtime | React | 18.x |
| Language | TypeScript | 5.x |
| Styling | SCSS (Next.js built-in Sass support) | — |
| Server state | React Query (TanStack Query) | 3.x |
| Client state | React Context API | native |
| HTTP | Axios | 1.x |
| Drag and drop | Hand-rolled with the Pointer Events API | — |
| Lint | ESLint | — |
| Unit / integration tests | Jest, React Testing Library, MSW | — |
| End-to-end tests | Playwright or Cypress | — |

**Forbidden libraries.** The Epitech subject bans (a) OAuth 2.0 libraries that perform the authorization flow automatically, and (b) frontend libraries that build widgets or dashboards for you (for example NuxtUI, UntitledUI React). Epitech staff have also confirmed that `react-grid-layout` and equivalent grid or drag-and-drop libraries are banned. The dashboard grid is implemented directly.

Generic UI primitives (buttons, inputs) are written in-house. A component kit that ships pre-built dashboard or widget components is not allowed.

**Language.** UI copy and code identifiers are in English, matching `doc.md`.

---

## 3. Project structure

From `doc.md` §3.

```
frontend/
├── app/                              # App router (Next.js 13+)
│   ├── auth/
│   │   ├── login/page.tsx            # UC2
│   │   ├── register/page.tsx         # UC1
│   │   └── callback/page.tsx         # UC4, GitHub OAuth callback
│   ├── dashboard/
│   │   └── page.tsx                  # UC5–UC8
│   ├── services/
│   │   └── page.tsx                  # UC3, UC4
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Homepage redirect
├── components/
│   ├── widgets/
│   │   ├── WeatherWidget.tsx
│   │   ├── GitHubWidget.tsx
│   │   └── RSSWidget.tsx
│   ├── DashboardGrid.tsx             # Hand-rolled drag/resize grid
│   ├── WidgetCard.tsx                # Shared chrome for every widget
│   ├── Header.tsx
│   └── Sidebar.tsx
├── lib/
│   ├── api.ts                        # Axios client and interceptors
│   ├── auth.ts                       # Token storage helpers
│   └── utils.ts                      # Formatting and grid helpers
├── hooks/
│   ├── useAuth.ts
│   ├── useDashboard.ts
│   └── useWidgets.ts
├── styles/
│   └── globals.scss                  # Global reset and shared variables and mixins
├── public/
├── .env.local
├── package.json
├── tsconfig.json
└── next.config.js
```

Components added beyond the `doc.md` tree (needed by the use cases):

| Component | Purpose | Use case |
|---|---|---|
| `components/AddWidgetModal.tsx` | Multi-step flow: service, widget type, configuration, refresh rate | UC5 |
| `components/WidgetConfigForm.tsx` | Form generated from a widget type's parameters | UC5, UC6 |
| `components/RefreshRateSlider.tsx` | Slider from 5 to 3600 seconds | UC5, UC6 |
| `components/ConfirmDialog.tsx` | Confirmation before deletion | UC7 |
| `components/ServiceCard.tsx` | One service with its subscribe, connect, or connected state | UC3, UC4 |
| `components/Toast.tsx` | Transient success and error messages | All |
| `components/AuthForm.tsx` | Shared form shell for login and register | UC1, UC2 |

Where a new file is added to `frontend/`, update this tree in the same change.

---

## 4. Environment and build

| Variable | Used by | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Browser bundle, API client | `http://localhost:8080` (local), `http://backend:8080` (inside Compose) |

`NEXT_PUBLIC_` variables are inlined at build time. In Docker the value must be present when `next build` runs, not only when the container starts.

**Docker** (`doc.md` §8): multi-stage build on `node:18-alpine`. Dependencies are installed, the app is built, and only the compiled output and production dependencies are copied into the final image. The container listens on **port 3000** (`doc.md` §3, architecture diagram). Also add a `.dockerignore` that excludes `node_modules` and `.next`, so host build artifacts never reach the image.

**Local development** (`doc.md` §8): `npm run dev` on port 3000, with `.env.local` copied from `.env.local.example`.

---

## 5. Global conventions

### 5.1 API client (`lib/api.ts`)

- A single Axios instance with `baseURL = NEXT_PUBLIC_API_URL`.
- Request interceptor: if a token is stored, set `Authorization: Bearer <token>`.
- Response interceptor: on a 401 for any request other than `/auth/refresh`, call `/auth/refresh` once, store the new tokens, and retry the original request. If the refresh fails, clear the session and redirect to `/auth/login`. Only one refresh runs at a time; concurrent 401s wait for it.
- Tokens are never placed in URLs or query strings (`doc.md` §9).

### 5.2 Error envelope

The backend returns errors as:

```json
{
  "errors": [
    { "code": "DASHBORD_ERROR", "messages": ["Username already taken"] }
  ]
}
```

Codes: `DASHBORD_ERROR` (business rule, message is user-facing), `DB_ERROR` and `SERVER_ERROR` (generic messages only). The client shows the messages of `DASHBORD_ERROR` entries and falls back to "Something went wrong, try again later" for the others. Never display a raw HTTP status, stack trace, or SQL text.

Messages for the auth and widget screens are taken verbatim from the alternative scenarios in `doc.md` §2 (UC1, UC2, UC4, UC5, UC6, UC8), so the user sees the same wording the spec defines.

### 5.3 Dates and freshness

- "Last updated" shows relative time: under 60 seconds → "just now"; under 60 minutes → "N minutes ago"; otherwise a local timestamp (`doc.md` UC8: "Last updated: XX minutes ago").
- A widget whose data was served from cache shows a visible "Cached" indicator next to its timestamp.

### 5.4 Notifications

`Toast` is the only mechanism for transient messages. It uses `role="status"` for success and `role="alert"` for errors, and it auto-dismisses after 5 seconds except for errors, which stay until dismissed.

---

## 6. Authentication

### 6.1 Session model

`doc.md` §5 and UC2:
- Access token: JWT, HS256, expires after 3600 seconds.
- Refresh token: valid 7 days. Rotated on every use: each `/auth/refresh` response contains a new refresh token, which replaces the old one.
- Both tokens are stored client-side in `localStorage` (`doc.md` §3, architecture diagram: "State: localStorage"). Keys: `dashboard.token`, `dashboard.refreshToken`.

### 6.2 Auth context (`hooks/useAuth.ts`, `AuthContext`)

Holds the current user (`id`, `username`, `email`), the tokens, and `status` (`loading`, `authenticated`, `unauthenticated`).

On application start, if a token exists it is treated as authenticated until a request proves otherwise (the interceptor handles the first 401).

Exposes `login(email, password)`, `register(username, email, password)`, `logout()`, `setSession(tokens, user)`.

### 6.3 Route protection

| Route | Access | If not authenticated |
|---|---|---|
| `/` | Redirect only | Redirect to `/auth/login` |
| `/auth/login`, `/auth/register` | Public | If authenticated, redirect to `/dashboard` |
| `/auth/callback` | Requires a session started by the GitHub flow | Redirect to `/auth/login` |
| `/dashboard`, `/services` | Protected | Redirect to `/auth/login` |

The redirect happens in a layout-level guard, so no protected content flashes before the check completes. While `status` is `loading`, render a neutral full-page placeholder.

### 6.4 Logout

Clear both tokens from storage, clear the React Query cache, and redirect to `/auth/login`.

---

## 7. Pages

### 7.1 Homepage redirect (`app/page.tsx`)

No UI. If authenticated, go to `/dashboard`; otherwise go to `/auth/login`.

### 7.2 Login (`app/auth/login/page.tsx`) — UC2

**Inputs:** email, password.

**Behavior:**
1. Client validation: email is required and in a valid format; password is required.
2. Submit: `POST /auth/login` with `{ email, password }`.
3. On success: store tokens and user through `setSession`, go to `/dashboard`.
4. On error: show the returned message. A wrong email and a wrong password both return the same message, "Invalid email or password". Never indicate which one was wrong.

**States:** idle, submitting (button disabled, label "Signing in…"), error (message above the form, `role="alert"`), success (redirect).

**Links:** "Create an account" → `/auth/register`.

### 7.3 Register (`app/auth/register/page.tsx`) — UC1

**Inputs:** username, email, password, confirm password.

**Client validation (mirrors the backend, RG1–RG3):**

| Field | Rule | Message |
|---|---|---|
| username | 3–50 characters, `[a-zA-Z0-9_]` | "Username must be 3-50 alphanumeric characters or underscores" |
| email | Valid format | "Invalid email format" |
| password | At least 8 characters, with an uppercase letter, a lowercase letter, a digit, and a special character | "Password must contain at least 8 characters, including uppercase, lowercase, digit, and special character" |
| confirm password | Equal to password | "Passwords do not match" |

Validation runs on blur and on submit. The backend remains the authority: if it returns a message, show it.

**Submit:** `POST /auth/register` with `{ username, email, password }`. On success: store tokens and user, go to `/dashboard`.

**Backend errors:** "Username already taken" and "Email already registered" appear next to the matching field.

**Links:** "Already have an account?" → `/auth/login`.

### 7.4 GitHub callback (`app/auth/callback/page.tsx`) — UC4

**Input:** query parameters `code` and `state`, from GitHub's redirect to `/auth/callback?code=…&state=…`.

**Behavior:**
1. Read the expected `state` from `sessionStorage` (written just before the redirect to GitHub). If it is missing or does not match, show an error and do not call the backend.
2. Send the code to the backend subscription endpoint (see §11 of this spec, open question 2).
3. On success: remove the stored state, show the confirmation "GitHub connected", and go to `/dashboard`.
4. On error: show the message and offer a link back to `/services`.

The page shows a neutral placeholder while it runs and never displays the code or the state.

### 7.5 Dashboard (`app/dashboard/page.tsx`) — UC5, UC6, UC7, UC8

**Layout:** `Header` on top, `Sidebar` on the left on tablet and desktop (a menu button on mobile), and the `DashboardGrid` filling the rest.

**Data:** on load, `GET /dashboard/widgets` returns every widget instance of the user with its latest cached data. Each widget card then polls its own data (§9).

**Empty state:** when there are no widgets, show a short message and an "Add widget" button. Do not show an empty grid.

**Header actions:** "Add widget" (opens `AddWidgetModal`), and a user menu with the username and "Log out".

**Errors:** if the initial load fails, show an error panel with a "Retry" button. Individual widget failures do not affect the rest of the page (§8.4).

### 7.6 Services (`app/services/page.tsx`) — UC3, UC4

**Data:** `GET /api/services` (requires a session).

**Layout:** a list of `ServiceCard` items. Each card shows the name, the description, and an action based on the service's state:

| Service | Subscription state | Action |
|---|---|---|
| Weather (`requires_auth = false`) | Not subscribed | "Subscribe" → subscribe request, no auth step |
| Weather | Subscribed | "Connected" (disabled), plus "Disconnect" |
| GitHub (`requires_auth = true`) | Not subscribed | "Connect GitHub" → OAuth redirect (§7.4) |
| GitHub | Subscribed | "Connected", plus "Disconnect" |
| RSS (`requires_auth = false`) | Not subscribed | "Subscribe" |
| RSS | Subscribed | "Connected", plus "Disconnect" |

**Empty state:** "No services available", per UC3.

**Disconnect:** a user must be able to disconnect a service at any time. Disconnect asks for confirmation (`ConfirmDialog`) and then removes the subscription. Widgets that depend on it remain on the dashboard but show the "not subscribed" error state (§8.4).

---

## 8. Dashboard components

### 8.1 `DashboardGrid` (hand-rolled)

**Grid model:** 12 columns. Row height 80 px on desktop, 64 px on tablet, and on mobile the grid collapses to one column with cards stacked in `y` order. Each widget has `{x, y, w, h}` in grid units. The constraints from RG9 are enforced on the client too: `x ≥ 0`, `y ≥ 0`, `w > 0`, `h > 0`, and `x + w ≤ 12`.

**Interaction:**
- Drag: pointer down on the card header starts a drag. Movement uses `pointermove` and `setPointerCapture`, so it works with mouse, pen, and touch on the same code path.
- Resize: pointer down on a bottom-right handle starts a resize.
- Snap: positions snap to whole grid cells.
- No overlap ("no layout conflicts"): a move or resize that would overlap another card is rejected, and the card returns to its last valid position.
- Commit: on pointer up, if the position changed, call `PUT /dashboard/widgets/:id` with the new `position`. While the request is pending, the card keeps the new position. If it fails, the card returns to the previous position and a toast shows the error.

**Keyboard alternative (WCAG 2.1 AA):** each card is focusable. With focus on a card, `Alt`+arrow keys move it one cell, `Alt`+`Shift`+arrow keys resize it, and the same commit rule applies. The new position is announced through an `aria-live="polite"` region ("Moved to column 3, row 2").

**Persistence:** positions come from the backend only. No layout state is stored in `localStorage`. After a reload, the grid shows the saved positions.

**Touch ("mobile drag-friendly"):** on touch devices the drag handle is at least 44×44 px, and the page does not scroll while a drag is in progress (`touch-action: none` on the handle).

### 8.2 `WidgetCard`

Shared chrome for every widget type.

**Props:** `instance` (the widget instance from the API), `data` (latest data, fetched_at, cached), `status`, and callbacks for edit, delete, and refresh.

**Layout:**
- Header: widget name, the options menu (Edit, Refresh, Delete), and the drag handle.
- Body: the type-specific content (§8.3), passed as children.
- Footer: "Last updated: …" (§5.3), the "Cached" indicator when applicable, and any warning text.

**Options menu:** Edit → UC6 form in a modal; Refresh → manual refetch (§13); Delete → `ConfirmDialog` (UC7).

**Warning state:** when the backend reports a fallback (rate limited, service down, timeout), show the cached data with a warning line such as "Showing cached data — the service is rate limited". The warning text is the backend's message.

**Error state:** when no cached data exists, show "Loading…" first, then the error message. If the error is "not subscribed", show "Subscribe to this service on the Services page" with a link.

### 8.3 Widget type components

Each type renders the fields `doc.md` §6 defines. These components are presentational: they receive typed data and render it.

**`WeatherWidget`** (`doc.md` §6, Service 1)
- `city_temperature`: city, temperature (°C or °F per the `units` parameter), condition, humidity.
- `city_forecast`: city, five daily cards (day, high, low, condition).
- `current_conditions`: city, wind speed, pressure, UV index.

**`GitHubWidget`** (`doc.md` §6, Service 2)
- `user_profile`: avatar, name, bio, followers, public repos.
- `recent_repos`: a list of up to `limit` repositories, each with name, star count, and description.
- `recent_commits`: a list of up to `limit` commits, each with message, author, and date.

**`RSSWidget`** (`doc.md` §6, Service 3)
- `feed_latest`: up to `limit` articles, each with title (a link) and relative date.
- `feed_summary`: feed title, description, article count.

Links to external content open with `target="_blank" rel="noopener noreferrer"`.

### 8.4 Widget error mapping

Taken from `doc.md` §6. The frontend shows the message, the cached data if present, and the warning.

| Backend condition | Shown to user |
|---|---|
| Weather 401 (invalid key) | "Check the weather service configuration" |
| Weather 404 (city not found) | "City not found" |
| Weather 429 / 503 | Cached data plus "Rate limited" / "Service unavailable" |
| GitHub 401 (token expired) | "Reconnect GitHub" (link to Services) |
| GitHub 403 (wrong scope) | "GitHub permissions are insufficient — reconnect" |
| GitHub 404 (user not found) | "GitHub user not found" |
| GitHub 429 | Cached data plus "GitHub rate limit exceeded" |
| RSS 404 | "Invalid feed URL" |
| RSS timeout | Cached data plus "Feed loading slow" |
| Not subscribed | "Subscribe to this service on the Services page" |

### 8.5 `AddWidgetModal` (UC5)

Four steps, each in the same modal:
1. **Service:** choose from subscribed services. Services the user has not subscribed to are shown disabled, with "Subscribe first" (UC5 alternative scenario).
2. **Widget type:** the widget types of that service. Each shows its name and description.
3. **Configuration:** `WidgetConfigForm` generated from the type's parameters (§8.6). Validation runs before the next step.
4. **Refresh rate and position:** `RefreshRateSlider` (5–3600 seconds, default 300) and the initial position (`x`, `y`, `w`, `h`). The default position is the first free area that fits `w × h`.

Submit: `POST /dashboard/widgets` with `{ widget_id, config, refresh_rate, position }`. On success: close the modal, add the card to the grid, and show a success toast. On "Invalid parameter type" or "Invalid configuration", stay on step 3 and show the message.

### 8.6 `WidgetConfigForm`

Generated from each parameter's `type` and constraints:

| Parameter type | Control | Constraint |
|---|---|---|
| string | text input | Required |
| integer | number input | Range from the parameter, e.g. `days` 1–5, `limit` 1–10 or 1–20 |
| enum | select | Only the listed values, e.g. `celsius` / `fahrenheit` |
| https URL | URL input | Must start with `https://` (`doc.md` §6, RSS validation) |
| username (GitHub) | text input | Required |

Labels are always visible. Errors appear below the field and are linked with `aria-describedby`.

### 8.7 `RefreshRateSlider` (UC5, UC6)

Range input from 5 to 3600, step 5, with a numeric readout showing the value in seconds and in a readable form (for example "5 min"). Keyboard-operable, with an accessible name.

### 8.8 `ConfirmDialog` (UC7)

Modal dialog, focus trapped inside, closed with Escape. Shows the consequence in plain language: "Deleting this widget is immediate and cannot be undone." Buttons: Cancel (default focus) and Delete.

### 8.9 `Header` and `Sidebar`

**`Header`:** application name, "Add widget" button, user menu (username, Log out). On mobile the header keeps only the menu button and the user menu.

**`Sidebar`:** links to Dashboard and Services, with the current route marked `aria-current="page"`. Collapses to a drawer on mobile, opened by a button in `Header`.

---

## 9. Data layer

### 9.1 React Query keys and hooks

| Key | Hook | Source | Refetch |
|---|---|---|---|
| `['services']` | `useServices()` | `GET /api/services` | On focus |
| `['widgets']` | `useDashboard()` | `GET /dashboard/widgets` | On focus |
| `['widget', id]` | `useWidgetData(id, refreshRate)` | `GET /dashboard/widgets/:id` | Every `refreshRate` seconds |

`useWidgets()` returns the widget catalog (`GET /api/widgets`, see §11 of this spec, open question 3), used by `AddWidgetModal`.

Mutations (`useCreateWidget`, `useUpdateWidget`, `useDeleteWidget`, `useSubscribe`, `useUnsubscribe`) invalidate `['widgets']` on success. Position updates from the grid do not invalidate; they update the cache optimistically and roll back on error.

### 9.2 Per-widget refresh (`doc.md` §7)

Each `WidgetCard` runs its own query with `refetchInterval = refresh_rate × 1000`. Two widgets with different rates therefore refetch independently. The query also refetches on window focus and on reconnect.

A manual "Refresh" action calls `refetch()` on that widget's query.

### 9.3 Freshness

The frontend does not compute cache expiry itself. It displays `fetched_at` and `cached` exactly as the backend returns them (UC8 output).

---

## 10. Accessibility and responsiveness

### 10.1 Accessibility (WCAG 2.1 AA, `doc.md` §1 success criteria, `TASKS.md` T045)

- Every input has a visible label. Required fields are marked in text, not only by colour.
- Text contrast at least 4.5:1 and non-text UI at least 3:1, in every state, including focus and disabled.
- Focus is always visible. Tab order follows the visual order.
- Modals trap focus while open and return focus to the trigger on close.
- Status messages use live regions (`role="status"` / `role="alert"`).
- The grid has a keyboard alternative (§8.1).
- Motion respects `prefers-reduced-motion`.
- Icon-only buttons have an accessible name.
- Images and icons that carry meaning have alternative text; decorative icons are hidden from assistive technology.

### 10.2 Responsive breakpoints (T044)

| Name | Width | Layout |
|---|---|---|
| Mobile | up to 767 px | Single column, sidebar as drawer, cards stacked |
| Tablet | 768–1023 px | Sidebar visible, 12-column grid at 64 px rows |
| Desktop | 1024 px and up | Sidebar visible, 12-column grid at 80 px rows |

Acceptance sizes: 375 px, 768 px, 1440 px. Every page is usable at each size without horizontal scrolling.

---

## 11. Open questions

`doc.md` does not settle these. Each needs a decision before the ticket that depends on it is closed.

1. **GitHub subscribe body.** The subscribe endpoint is `POST /api/services/:id/subscribe` (see `backend/API_SPECIFICATION.md` §2.7). The non-OAuth path takes no body. Which fields does the OAuth case take (`code`, `state`)? Ticket T016 settles this.
2. **Subscription endpoint details.** *Resolved:* the path is `POST /api/services/:id/subscribe`, and the user comes from the Bearer token. Still open: the endpoint for disconnect (required by §7.6; `doc.md` does not define it).
3. **Widget catalog endpoint.** `TASKS.md` T019 names `GET /api/widgets` filtered by service. `doc.md` does not define it. Confirm the path and the query parameter.
4. **Single widget endpoint.** Per-widget polling (§9.2) assumes `GET /dashboard/widgets/:id`. `doc.md` only defines the list endpoint. Add it to the API specification, or poll the list and derive each card's data from it.
5. **RSS subscription.** `doc.md` UC4 says RSS "requires OAuth or a URL", but §6 makes the feed URL a widget parameter. Decide whether RSS needs a subscription step at all.
6. **Token storage.** `doc.md` specifies `localStorage` in its architecture diagram but not the trade-off against cookies. Confirm `localStorage`, which keeps tokens readable by any script on the page.
7. **Grid geometry.** The 12-column grid and row heights in §8.1 are a proposal; `doc.md` gives no grid geometry. Confirm before implementation.

---

## 12. Testing (`doc.md` §10, T048, T049)

**Unit and integration (Jest, React Testing Library, MSW):**
- Components render their documented fields and states.
- Hooks: each mutation invalidates the right key; the 401 interceptor refreshes once and retries once.
- Utilities: the grid helpers (snapping, collision, bounds), the relative-time formatter, and the validators (RG1–RG3, URL rule).

Coverage targets from `doc.md` §10: 70% overall, 80% for hooks, 90% for utilities.

**End-to-end (Playwright or Cypress, T049):** one automated flow covering UC1 → UC2 → UC3 → UC5 → UC8, with the backend running: register, log in, subscribe to Weather, create a Weather widget, move it, and see data appear.

**Accessibility (T045):** an automated audit (axe or equivalent) on each page, with no critical violations.

---

## 13. Acceptance criteria

These are the functional requirements the implementation is accepted against. They cover UC1–UC8 and the tickets in `TASKS.md`. They were originally written as user stories in `doc.md` §2; the story text was removed from doc.md during the cleanup, so the criteria are stated here directly.

**Register**
- Username, email, and password are validated as in §7.3.
- On success the JWT is stored and the user reaches the dashboard.
- On error a clear message is displayed.

**Connect a service**
- The OAuth flow completes without errors (§7.4).
- Widgets for the service become available immediately.
- The user can disconnect at any time (§7.6).

**Create and configure a widget**
- The form shows the correct parameters for the chosen type (§8.6).
- The configuration is validated and saved (§8.5).
- The widget appears on the dashboard and its data is displayed.

**Arrange the dashboard**
- Dragging is smooth with mouse and touch (§8.1).
- Positions persist across reloads.
- No two widgets overlap.

**Automatic refresh**
- Each widget refreshes at its configured interval (§9.2).
- A failed refresh falls back to cached data with a warning (§8.2, §8.4).
- A "Last updated" timestamp is shown (§5.3).
- The user can refresh a widget manually.

**Technical**
- The application runs on port 3000 in Docker and locally (§4).
- Auth and dashboard pages are usable at 375, 768 and 1440 px (§10.2).
- WCAG 2.1 AA checks pass with no critical violations (§10.1, T045).
- Error messages match the wording in §5.2 and §8.4.
