# Backend Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Auth0 account with a configured tenant

## 1. Setting Up Prisma

First, install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend` directory with the following:

```env
DATABASE_URL="file:./prisma/dev.db"

# Auth0 Configuration (required for authentication)
AUTH0_DOMAIN="your-tenant.auth0.com"
AUTH0_AUDIENCE="https://your-api-identifier.com"
```

**Replace with your Auth0 values**:
- `your-tenant.auth0.com` - Your Auth0 domain from Dashboard
- `https://your-api-identifier.com` - Your Auth0 API identifier

Then, set up Prisma by generating the client and running migrations:

```bash
npm run setup:prisma
```

This command will:
- Generate the Prisma Client
- Run database migrations to create all tables

## 2. Auth0 Setup

This application uses Auth0 for authentication. You need to:

1. Create an Auth0 account at https://auth0.com
2. Create a new API in Auth0 Dashboard:
   - Go to Applications > APIs > Create API
   - Set the Identifier to match your `AUTH0_AUDIENCE` (e.g., `https://api.yourdomain.com`)
   - Select RS256 as the signing algorithm
3. Create a Native Application for the mobile/web app:
   - Go to Applications > Applications > Create Application
   - Choose "Native" as the application type
   - Note the Domain and Client ID for the frontend configuration
4. Configure callback URLs in the Native Application:
   - Allowed Callback URLs: `org.utmostatmos.utmostatmos://YOUR_AUTH0_DOMAIN/ios/org.utmostatmos.utmostatmos/callback, org.utmostatmos.utmostatmos://YOUR_AUTH0_DOMAIN/android/org.utmostatmos.utmostatmos/callback, http://localhost:8081/callback`
   - Allowed Logout URLs: `http://localhost:8081`
   - Allowed Web Origins: `http://localhost:8081`
   
   **Replace `YOUR_AUTH0_DOMAIN`** with your actual Auth0 domain

## 3. Populating for Development

Populate the database with sample data (users, bin quizzes, and trackers):

```bash
npm run populate
```

This will create:
- 3 sample users (with mock Auth0 IDs for testing)
- 15 bin quiz questions
- 10 tracker locations

Note: Real users are created automatically when they log in via Auth0.

## 4. Running the Server

Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in `PORT` environment variable).

To run tests:

```bash
npm test
```

## 5. API Endpoints

### Authentication (`/auth`)

All auth endpoints require a valid Auth0 JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

#### GET `/auth/profile`
Get current user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "auth0Id": "auth0|abc123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "leaderboardScore": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT `/auth/profile`
Update user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `200 OK`

#### DELETE `/auth/account`
Delete user account.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "message": "Account deleted successfully"
}
```

---

### Quiz (`/quiz`)

#### GET `/quiz`
Get bin quiz questions (public endpoint).

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
Get top 10 users sorted by leaderboard score (public endpoint).

**Response:** `200 OK`
```json
{
  "leaderboard": [
    {
      "id": "uuid",
      "auth0Id": "auth0|abc123",
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
Get all trackers or filter by type (public endpoint).

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
Utmostatmost online.
```

---

## Notes

- All endpoints accept and return JSON
- Authentication is handled via Auth0 JWT tokens
- Protected endpoints require `Authorization: Bearer <token>` header
- Users are automatically created in the database on first login via Auth0
- The server uses SQLite for the database (file: `prisma/dev.db`)
