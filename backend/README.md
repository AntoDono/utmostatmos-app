# Backend Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 1. Setting Up Prisma

First, install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend` directory with the following:

```env
DATABASE_URL="file:./prisma/dev.db"
```

Then, set up Prisma by generating the client and running migrations:

```bash
npm run setup:prisma
```

This command will:
- Generate the Prisma Client
- Run database migrations to create all tables

## 2. Populating for Development

Populate the database with sample data (users, sessions, bin quizzes, and trackers):

```bash
npm run populate
```

This will create:
- 3 sample users (Alice, Bob, Admin)
- 2 active sessions
- 15 bin quiz questions
- 10 tracker locations

## 3. Running the Server

Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in `PORT` environment variable).

To run tests:

```bash
npm test
```

## 4. API Endpoints

### Authentication (`/auth`)

#### POST `/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "emailVerified": false,
  "leaderboardScore": 0
}
```

#### POST `/auth/delete-account`
Delete a user account (requires valid session).

**Request Body:**
```json
{
  "sessionId": "session-uuid"
}
```

**Response:** `200 OK` or `401 Unauthorized` (if session expired/invalid)

#### POST `/auth/logout`
Logout and delete session (requires valid session).

**Request Body:**
```json
{
  "sessionId": "session-uuid"
}
```

**Response:** `200 OK` or `401 Unauthorized` (if session expired/invalid)

---

### Quiz (`/quiz`)

#### GET `/quiz`
Get bin quiz questions.

**Query Parameters:**
- `limit` (optional): Number of questions to return (default: 10, max: 100)

**Example:**
```
GET /quiz?limit=5
```

**Response:** `200 OK`
```json
{
  "quizzes": [
    {
      "id": "uuid",
      "item": "banana",
      "choices": ["Compost", "Recycling", "Trash", "Donate"],
      "answer": "Compost",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 5,
  "limit": 5
}
```

---

### Leaderboard (`/leaderboard`)

#### GET `/leaderboard`
Get top 10 users sorted by leaderboard score.

**Response:** `200 OK`
```json
{
  "leaderboard": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "leaderboardScore": 500,
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 10
}
```

---

### Tracker (`/tracker`)

#### GET `/tracker`
Get all trackers or filter by type.

**Query Parameters:**
- `type` (optional): Filter by tracker type (e.g., "recycling", "compost", "trash", "hazardous")

**Example:**
```
GET /tracker?type=recycling
```

**Response:** `200 OK`
```json
{
  "trackers": [
    {
      "id": "uuid",
      "type": "recycling",
      "name": "Recycling Bin - Market Street",
      "longitude": -122.4194,
      "latitude": 37.7749,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### GET `/tracker/:id`
Get a specific tracker by ID.

**Response:** `200 OK` or `404 Not Found`

#### POST `/tracker`
Create a new tracker.

**Request Body:**
```json
{
  "type": "recycling",
  "name": "Recycling Bin - Location",
  "longitude": -122.4194,
  "latitude": 37.7749
}
```

**Validation:**
- `longitude` must be between -180 and 180
- `latitude` must be between -90 and 90

**Response:** `201 Created` or `400 Bad Request`

#### PUT `/tracker/:id`
Update a tracker (partial updates supported).

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "longitude": -122.4083,
  "latitude": 37.7833
}
```

**Response:** `200 OK`, `400 Bad Request`, or `404 Not Found`

#### DELETE `/tracker/:id`
Delete a tracker.

**Response:** `200 OK` or `404 Not Found`

---

## Root Endpoint

#### GET `/`
Health check endpoint.

**Response:** `200 OK`
```
Hello from Express with TypeScript!
```

---

## Notes

- All endpoints accept and return JSON
- Session expiration is automatically validated (expired sessions return `401 Unauthorized`)
- Sensitive user data (passwords, tokens) are never returned in responses
- The server uses SQLite for the database (file: `prisma/dev.db`)

