# API Specification
## Epitech Dashboard Project

**Source of truth for behaviour:** `backend/internal/handlers/`, `backend/internal/usecases/`, `backend/internal/models/`, `backend/internal/dashborderrors/`. This document describes what the server does today. Where `backend/doc.md` describes something the server does not yet do, that is noted explicitly.
**Scope:** only the endpoints implemented so far. New endpoints are added here in the same change that implements them.
**Frontend contract:** `FRONTEND_SPECIFICATION.md` §5 and §6 describe how the client consumes these responses.

---

## 1. Conventions

### 1.1 Base URL

| Environment | Base URL |
|---|---|
| Local (`go run . serve`) | `http://localhost:8080` |
| Docker Compose, from the host | `http://localhost:8080` |
| Docker Compose, from another container | `http://backend:8080` |

The port comes from the `PORT` environment variable. `8080` is the value required by the Epitech subject.

### 1.2 Content type

Request bodies are JSON and must be sent with `Content-Type: application/json`. Responses are JSON.

### 1.3 Identifiers

All entity identifiers are UUID strings in the canonical 36-character form, for example `6f2c1e2a-8b1d-4c3e-9f7a-2d5b6c7e8f90`. Clients must treat them as opaque strings.

### 1.4 Authentication

Protected endpoints require an access token in the `Authorization` header:

```
Authorization: Bearer <token>
```

- The access token is a JWT signed with HS256. Its `sub` claim is the user ID.
- Its lifetime is `TOKEN_EXPIRY` seconds (3600 in the example configuration).
- The refresh token is an opaque 64-character hexadecimal string. It is valid for 7 days and is rotated on every use: each `POST /auth/refresh` returns a new one, and the previous one stops working immediately.

### 1.5 Error responses

Every error response, from every endpoint, has this shape:

```json
{
  "code": "USERNAME_TAKEN",
  "message": "Username already taken"
}
```

There is exactly one error per response — if a request fails for more than one reason, only the first one found is returned. Internal details (SQL, stack traces, underlying library errors) are never included.

Every `code` the server can return:

| Code | Status | Message | Identified in |
|---|---|---|---|
| `INVALID_REQUEST_BODY` | 400 | Invalid request body | generic, any handler's JSON bind |
| `INVALID_USERNAME` | 400 | Username must be 3-50 alphanumeric characters or underscores | usecases |
| `INVALID_EMAIL` | 400 | Invalid email format | usecases |
| `INVALID_PASSWORD` | 400 | Password must contain at least 8 characters, including uppercase, lowercase, digit, and special character | usecases |
| `USERNAME_TAKEN` | 409 | Username already taken | usecases |
| `EMAIL_TAKEN` | 409 | Email already registered | usecases |
| `INVALID_CREDENTIALS` | 401 | Invalid email or password | usecases |
| `INVALID_REFRESH_TOKEN` | 401 | Invalid or expired refresh token | usecases |
| `OAUTH_REQUIRED` | 400 | This service requires OAuth | usecases |
| `ALREADY_SUBSCRIBED` | 409 | Already subscribed to this service | usecases |
| `SERVICE_NOT_FOUND` | 404 | Service not found | models |
| `DUPLICATE_ENTRY` | 409 | This value already exists | models (a unique-constraint violation the database itself raised) |
| `MISSING_AUTH_HEADER` | 401 | Missing or invalid authorization header | middleware |
| `INVALID_TOKEN` | 401 | Invalid or expired token | middleware |
| `INTERNAL_SERVER_ERROR` | 500 | Internal server error | generic fallback — anything that isn't one of the codes above |

Two codes exist in the code (`models.ErrUserNotFound`, `models.ErrRefreshTokenNotFound`) but are never returned to a client directly — `POST /auth/login` and `POST /auth/refresh` always substitute `INVALID_CREDENTIALS`/`INVALID_REFRESH_TOKEN` instead, so a client can never tell "no such account" apart from "wrong password," or "token doesn't exist" apart from "token expired."

**Unmatched routes** return Gin's default plain-text `404 page not found`, not the error shape above.

### 1.6 HTTP status codes used

| Status | When |
|---|---|
| 200 | Successful read or token exchange |
| 201 | Resource created (account registration, subscription) |
| 400 | Malformed body or failed input validation |
| 401 | Missing, invalid, or expired credentials |
| 404 | Resource with the given ID does not exist |
| 409 | Conflict with existing data |
| 500 | Internal or database failure |

---

## 2. Endpoints

### 2.1 Status

| Method | Path | Auth | Status |
|---|---|---|---|
| GET | `/about.json` | None | Implemented (placeholder body) |
| POST | `/auth/register` | None | Implemented |
| POST | `/auth/login` | None | Implemented |
| POST | `/auth/refresh` | None | Implemented |
| GET | `/api/services` | Bearer | Implemented |
| POST | `/api/services/:id/subscribe` | Bearer | Implemented |

---

### 2.2 GET `/about.json`

Service metadata for the Epitech checker.

**Auth:** none.

**Response `200`:**

```json
{ "ans": "OK" }
```

**Status:** placeholder. It must be replaced with the full schema (services and widgets metadata) under ticket T037 before the project is submitted.

---

### 2.3 POST `/auth/register`

Creates an account, logs the user in, and returns tokens. Implements UC1.

**Auth:** none.

**Request body:**

| Field | Type | Required | Rule |
|---|---|---|---|
| `username` | string | yes | 3–50 characters, `[a-zA-Z0-9_]` |
| `email` | string | yes | Valid email address |
| `password` | string | yes | At least 8 characters, with an uppercase letter, a lowercase letter, a digit, and a special character |

```json
{
  "username": "alice_01",
  "email": "alice@example.com",
  "password": "Passw0rd!"
}
```

**Response `201`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "3f9a…64 hex characters…",
  "user": {
    "id": "6f2c1e2a-8b1d-4c3e-9f7a-2d5b6c7e8f90",
    "username": "alice_01",
    "email": "alice@example.com"
  }
}
```

The password and its hash are never returned.

**Errors:**

| Status | `code` | Cause |
|---|---|---|
| 400 | `INVALID_REQUEST_BODY` | Body is not valid JSON or has the wrong types |
| 400 | `INVALID_USERNAME` | Username rule failed |
| 400 | `INVALID_EMAIL` | Email rule failed |
| 400 | `INVALID_PASSWORD` | Password rule failed |
| 409 | `USERNAME_TAKEN` | Username exists |
| 409 | `EMAIL_TAKEN` | Email exists |
| 409 | `DUPLICATE_ENTRY` | Race between the exists-checks and the insert — generic, since the database can't say which column collided |
| 500 | `INTERNAL_SERVER_ERROR` | Any other failure (database, password hashing, token signing) |

---

### 2.4 POST `/auth/login`

Verifies credentials and returns tokens. Implements UC2.

**Auth:** none.

**Request body:**

| Field | Type | Required |
|---|---|---|
| `email` | string | yes |
| `password` | string | yes |

```json
{
  "email": "alice@example.com",
  "password": "Passw0rd!"
}
```

**Response `200`:** same shape as `POST /auth/register`.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "3f9a…64 hex characters…",
  "user": {
    "id": "6f2c1e2a-8b1d-4c3e-9f7a-2d5b6c7e8f90",
    "username": "alice_01",
    "email": "alice@example.com"
  }
}
```

**Errors:**

| Status | `code` | Cause |
|---|---|---|
| 400 | `INVALID_REQUEST_BODY` | Malformed body |
| 401 | `INVALID_CREDENTIALS` | Unknown email **or** wrong password. The two cases are deliberately indistinguishable. |
| 500 | `INTERNAL_SERVER_ERROR` | Any other failure |

**Not implemented:** rate limiting (5 failed attempts per 15 minutes per IP, `doc.md` UC2). Tracked under ticket T039.

---

### 2.5 POST `/auth/refresh`

Exchanges a valid refresh token for a new access token and a new refresh token. The submitted refresh token is consumed. Implements T010.

**Auth:** none. The refresh token is the credential.

**Request body:**

| Field | Type | Required |
|---|---|---|
| `refresh_token` | string | yes |

```json
{ "refresh_token": "3f9a…64 hex characters…" }
```

**Response `200`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "b71e…64 hex characters…"
}
```

The response has no `user` object; the client already holds it from login.

**Behaviour:**
- The token is looked up by its SHA-256 hash, never by the raw value.
- An expired token is deleted and rejected.
- A new refresh token is created before the old one is deleted, so a failure between the two steps leaves the user with a valid token.
- Reusing a token after it has been rotated fails with `401`.

**Errors:**

| Status | `code` | Cause |
|---|---|---|
| 400 | `INVALID_REQUEST_BODY` | Malformed body |
| 401 | `INVALID_REFRESH_TOKEN` | Unknown, already rotated, or expired. The three cases are deliberately indistinguishable. |
| 500 | `INTERNAL_SERVER_ERROR` | Any other failure |

**Known limitation:** creating the new token and deleting the old one are not wrapped in a database transaction. A failure between them can leave both tokens valid for a short time. Tracked for hardening.

---

### 2.6 GET `/api/services`

Lists every service available to subscribe to. Implements UC3.

**Auth:** `Bearer` access token required.

**Request:** no body, no query parameters.

```
GET /api/services
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response `200`:** an array, possibly empty.

```json
[
  {
    "id": "6f2c1e2a-8b1d-4c3e-9f7a-2d5b6c7e8f90",
    "name": "weather",
    "description": "Weather data from OpenWeatherMap",
    "requires_auth": false,
    "oauth_provider": null
  },
  {
    "id": "a91d4b7c-2e5f-4a10-8c3d-7b6e5f4a3d21",
    "name": "github",
    "description": "GitHub activity and repositories",
    "requires_auth": true,
    "oauth_provider": "github"
  }
]
```

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | |
| `name` | string | Stable key, unique |
| `description` | string | |
| `requires_auth` | boolean | `true` if subscribing needs an OAuth flow |
| `oauth_provider` | string or `null` | `null` when `requires_auth` is `false` |

The list is empty until the services are seeded (ticket T006).

**Errors:**

| Status | `code` | Cause |
|---|---|---|
| 401 | `MISSING_AUTH_HEADER` | No `Authorization` header, or it is not `Bearer <token>` |
| 401 | `INVALID_TOKEN` | Token has a bad signature, is malformed, or has expired |
| 500 | `INTERNAL_SERVER_ERROR` | Database failure |

---

### 2.7 POST `/api/services/:id/subscribe`

Subscribes the authenticated user to a service that does not require OAuth (Weather and RSS). Implements UC4 for the non-OAuth path.

**Auth:** `Bearer` access token required. The user is taken from the token's `sub` claim. The request must not include a user identifier.

**Path parameter:**

| Name | Type | Description |
|---|---|---|
| `id` | string (UUID) | ID of the service, from `GET /api/services` |

**Request:** no body.

```
POST /api/services/6f2c1e2a-8b1d-4c3e-9f7a-2d5b6c7e8f90/subscribe
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response `201`:**

```json
{
  "id": "c4e8a2f0-1b7d-4e6a-9c3f-8d2b5a1e7f60",
  "service_id": "6f2c1e2a-8b1d-4c3e-9f7a-2d5b6c7e8f90",
  "created_at": "2026-10-05T10:21:44Z"
}
```

**Errors:**

| Status | `code` | Cause |
|---|---|---|
| 401 | `MISSING_AUTH_HEADER` | As §2.6 |
| 401 | `INVALID_TOKEN` | As §2.6 |
| 400 | `OAUTH_REQUIRED` | The service has `requires_auth = true`. Use the OAuth flow (ticket T016). |
| 404 | `SERVICE_NOT_FOUND` | No service with this ID |
| 409 | `ALREADY_SUBSCRIBED` | The user already has a subscription to this service (RG4) |
| 409 | `DUPLICATE_ENTRY` | Race between the exists-check and the insert — generic, same reasoning as §2.3 |
| 500 | `INTERNAL_SERVER_ERROR` | Database failure |

**Notes:**
- A subscription has no credentials. The `user_services` row has `credentials`, `oauth_token` and `oauth_refresh_token` set to `NULL`.
- The `UNIQUE (user_id, service_id)` constraint is the last line of defence against the exact same race `ALREADY_SUBSCRIBED` is meant to catch — it's what produces `DUPLICATE_ENTRY` instead, in the narrow window between the check and the insert.

---

## 3. Document history

| Change | Ticket |
|---|---|
| Initial specification: `/about.json`, auth endpoints, `/api/services` | T008, T009, T010, T014 |
| `POST /api/services/:id/subscribe` implemented, replacing the earlier `/api/user-services/:id/subscribe` path | T015 |
| Error shape changed from a grouped `{"errors": [{"code", "messages": [...]}]}` envelope to a single flat `{"code", "message"}` object, and error codes became specific per failure instead of three generic categories | — |
