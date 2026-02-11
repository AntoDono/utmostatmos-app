# Utmostatmos App

A cross-platform mobile and web application for waste management education and recycling bin tracking.

## 🌍 Features

- **Educational Quiz System** - Learn proper waste sorting through interactive quizzes
- **Bin Tracker** - Find nearby recycling, compost, and waste disposal locations on an interactive map
- **Leaderboard** - Compete with other users and track your environmental impact
- **User Profiles** - Personalized accounts with progress tracking
- **Cross-Platform** - Works on iOS, Android, and Web

## 🏗️ Project Structure

```
utmostatmos-app/
├── backend/          # Node.js/Express API server
│   ├── routes/       # API endpoints
│   ├── prisma/       # Database schema and migrations
│   └── README.md     # Backend setup and API documentation
│
├── frontend/         # React Native mobile/web app
│   ├── app/          # Expo Router pages
│   ├── components/   # Reusable UI components
│   ├── context/      # React Context (Auth, etc.)
│   └── README.md     # Frontend setup and configuration
│
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Auth0 account (free tier available)

### 1. Backend Setup

```bash
cd backend
npm install
npm run setup:prisma
npm run dev
```

**See [backend/README.md](./backend/README.md) for detailed backend setup, API documentation, and Auth0 API configuration.**

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Then press:
- `w` for web
- `a` for Android emulator
- `i` for iOS simulator

**See [frontend/README.md](./frontend/README.md) for detailed frontend setup, Auth0 application configuration, and platform-specific instructions.**

## 🔐 Authentication

This app uses **Auth0** for secure authentication across all platforms (iOS, Android, Web).

- Backend: Auth0 JWT validation
- Frontend: Platform-specific Auth0 integration
  - iOS/Android: `react-native-auth0` with deep linking
  - Web: OAuth 2.0 Implicit Flow with browser redirects

**Important**: You'll need to set up your own Auth0 tenant and configure callback URLs with YOUR Auth0 domain.

For detailed Auth0 setup instructions, see:
- **Backend**: [backend/README.md](./backend/README.md) - API configuration
- **Frontend**: [frontend/README.md](./frontend/README.md) - Application and callback URL configuration

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express
- **Database**: SQLite with Prisma ORM
- **Authentication**: Auth0 (express-oauth2-jwt-bearer)
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React Native (Expo)
- **Routing**: Expo Router (file-based)
- **Platforms**: iOS, Android, Web
- **Authentication**: Auth0 (react-native-auth0 + custom web implementation)
- **Maps**: expo-maps, react-native-maps
- **State Management**: React Context

## 📱 Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests (if available)
cd frontend
npm test
```

### Environment Variables

Both backend and frontend require `.env` files. See the respective README files for required variables:
- [backend/.env.example](./backend/README.md#1-setting-up-prisma)
- [frontend/.env.example](./frontend/README.md#environment-setup)

## 🌐 Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| iOS | ✅ Working | Requires Xcode for development |
| Android | ✅ Working | Requires Android Studio for development |
| Web | ✅ Working | Runs in any modern browser |

## 📝 API Documentation

API endpoints and documentation can be found in [backend/README.md](./backend/README.md#5-api-endpoints).

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test on all platforms (iOS, Android, Web)
4. Submit a pull request

## 📄 License

[Add your license here]

## 👥 Team

[Add your team information here]

---

For detailed setup instructions, see:
- **Backend Documentation**: [backend/README.md](./backend/README.md)
- **Frontend Documentation**: [frontend/README.md](./frontend/README.md)
