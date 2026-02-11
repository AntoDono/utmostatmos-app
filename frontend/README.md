# Frontend - Utmostatmos App

React Native mobile and web application built with Expo.

## 📱 Supported Platforms

- **iOS** - Native mobile app
- **Android** - Native mobile app  
- **Web** - Progressive web app

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Running the App

```bash
npm start
```

Then press:
- `w` - Open in web browser
- `a` - Open Android emulator
- `i` - Open iOS simulator
- `r` - Reload app
- `m` - Toggle menu

### Platform-Specific Commands

```bash
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
```

## ⚙️ Environment Setup

Create a `.env` file in the `frontend` directory:

```env
# Backend API URL
EXPO_PUBLIC_API_URL=http://localhost:3000

# Frontend URL (for web auth callbacks)
EXPO_PUBLIC_FRONTEND_URL=http://localhost:8081

# Auth0 Configuration
EXPO_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
EXPO_PUBLIC_AUTH0_CLIENT_ID=your_client_id_here
EXPO_PUBLIC_AUTH0_AUDIENCE=https://your-tenant.auth0.com/api/v2/
```

**Note**: For production, update `EXPO_PUBLIC_FRONTEND_URL` to your deployed web URL.

## 🔐 Auth0 Configuration

This app uses Auth0 for authentication with platform-specific implementations:
- **iOS/Android**: Uses `react-native-auth0` with deep linking
- **Web**: Custom OAuth 2.0 Implicit Flow implementation

### Required Auth0 Setup

#### 1. Create Auth0 Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **Create Application**
3. Choose **Native** application type
4. Note your **Domain** and **Client ID**

#### 2. Configure Callback URLs

Add these to your Auth0 Application Settings → **Allowed Callback URLs**:

```
org.utmostatmos.utmostatmos://YOUR_AUTH0_DOMAIN/ios/org.utmostatmos.utmostatmos/callback,
org.utmostatmos.utmostatmos://YOUR_AUTH0_DOMAIN/android/org.utmostatmos.utmostatmos/callback,
http://localhost:8081/callback
```

**Replace `YOUR_AUTH0_DOMAIN`** with your Auth0 tenant domain (e.g., `dev-abc123.us.auth0.com`)

**For production, also add**:
```
https://yourdomain.com/callback
```

#### 3. Configure Logout URLs

Add to **Allowed Logout URLs**:

```
http://localhost:8081
```

**For production, also add**:
```
https://yourdomain.com
```

#### 4. Configure Web Origins

Add to **Allowed Web Origins**:

```
http://localhost:8081
```

#### 5. Enable Implicit Flow (Web Only)

1. Go to **Application Settings** → **Advanced Settings**
2. Navigate to **OAuth** tab
3. Enable **Implicit Flow**
4. Enable **Allow ID Token**

### Platform-Specific Auth Behavior

| Platform | Login Flow | Logout Behavior | Token Storage |
|----------|-----------|-----------------|---------------|
| iOS | Native browser with deep link | Local only (no browser popup) | Secure keychain |
| Android | Native browser with deep link | Full Auth0 logout | Secure storage |
| Web | Browser redirect | Local only | localStorage |

**For detailed web authentication setup, see [AUTH0_WEB_SETUP.md](./AUTH0_WEB_SETUP.md)**

## 📁 Project Structure

```
frontend/
├── app/                    # Expo Router pages (file-based routing)
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── home.jsx       # Home screen
│   │   ├── quiz.jsx       # Quiz screen
│   │   ├── tracker.jsx    # Tracker map screen
│   │   └── profile.jsx    # User profile
│   ├── auth/              # Authentication screens
│   │   ├── signIn.jsx     # Sign in page
│   │   └── signUp.jsx     # Sign up page
│   ├── callback.jsx       # Auth0 callback handler (web)
│   └── _layout.jsx        # Root layout
│
├── components/            # Reusable UI components
│   └── Alert.jsx          # Alert component
│
├── context/               # React Context providers
│   └── AuthContext.jsx    # Authentication context
│
├── constants/             # App constants
│   ├── config.js          # Environment configuration
│   ├── colors.jsx         # Color palette
│   └── authStyles.jsx     # Auth screen styles
│
├── assets/                # Images, fonts, etc.
│   └── images/            # App images and icons
│
├── app.json               # Expo configuration
├── package.json           # Dependencies
└── .env                   # Environment variables (create this)
```

## 🎨 Key Features

### Authentication (`context/AuthContext.jsx`)
- Platform detection (iOS/Android/Web)
- Automatic token management
- Secure token storage
- Session persistence

### Routing (`app/`)
- File-based routing with Expo Router
- Tab navigation
- Protected routes
- Deep linking support

### Maps (`app/(tabs)/tracker.jsx`)
- Interactive map with markers
- Bin type filtering (recycling, compost, trash, hazardous)
- Location-based bin discovery

### Quiz System (`app/(tabs)/quiz.jsx`)
- Educational waste sorting quiz
- Multiple choice questions
- Score tracking
- Leaderboard integration

## 🔧 Configuration Files

### `app.json`

Main Expo configuration including:
- App name, icon, and splash screen
- Platform-specific settings (iOS bundle ID, Android package)
- Auth0 plugin configuration
- Deep linking scheme

### `eas.json`

Expo Application Services (EAS) build configuration for:
- Development builds
- Preview builds
- Production builds

## 🌐 API Integration

The app communicates with the backend API using the `EXPO_PUBLIC_API_URL` environment variable.

Example API call:

```javascript
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../constants/config';

function MyComponent() {
  const { accessToken } = useAuth();
  
  const fetchData = async () => {
    const response = await fetch(`${API_URL}/api/endpoint`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  };
}
```

## 🐛 Troubleshooting

### Web: Loading circle stuck on Sign In

**Cause**: Web platform requires specific Auth0 configuration.

**Fix**: 
1. Verify callback URL is added to Auth0 Dashboard
2. Enable Implicit Flow in Auth0 settings
3. Check browser console for errors
4. See [AUTH0_WEB_SETUP.md](./AUTH0_WEB_SETUP.md) for detailed instructions

### iOS: Login not working

**Possible causes**:
- Bundle identifier mismatch
- Callback URL not configured in Auth0
- Deep linking not set up

**Fix**:
1. Verify `bundleIdentifier` in `app.json` matches Auth0 callback URL
2. Check that callback URL includes iOS platform: `org.utmostatmos.utmostatmos://...`

### Android: Build errors

**Fix**:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Environment variables not loading

**Fix**:
1. Ensure `.env` file exists in `frontend/` directory
2. All Expo env vars must start with `EXPO_PUBLIC_`
3. Restart the development server after changing `.env`

### Map not showing

**Cause**: Missing Google Maps API key (Android only).

**Fix**:
1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Add to `app.json` under `android.config.googleMaps.apiKey`

## 📦 Key Dependencies

```json
{
  "expo": "~54.0.10",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "expo-router": "~6.0.8",
  "react-native-auth0": "^5.4.0",
  "expo-maps": "~0.12.10",
  "react-native-maps": "^1.27.1"
}
```

## 🏗️ Building for Production

### EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Web Deployment

```bash
# Build web assets
npm run web

# Build for production
expo export:web

# Deploy the web-build folder to your hosting provider
```

## 🔒 Security Considerations

### Token Storage
- **iOS/Android**: Tokens stored in secure native storage
- **Web**: Tokens in localStorage (acceptable for SPAs)

### API Calls
- All authenticated requests include JWT Bearer token
- Tokens automatically refreshed by Auth0 SDK (native)
- Web tokens require manual refresh implementation

### Environment Variables
- Never commit `.env` file to version control
- Use different Auth0 applications for dev/staging/production
- Rotate Auth0 client secrets regularly

## 📱 Platform-Specific Notes

### iOS
- Requires Xcode 14+ for development
- Requires Apple Developer account for TestFlight/App Store
- Uses UIKit-based native browser for Auth0

### Android
- Requires Android Studio
- Minimum SDK: 21 (Android 5.0)
- Target SDK: 34 (Android 14)
- Uses Chrome Custom Tabs for Auth0

### Web
- Works in any modern browser (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile and desktop
- PWA-capable (can be installed on home screen)

## 📄 Additional Documentation

- [AUTH0_WEB_SETUP.md](./AUTH0_WEB_SETUP.md) - Detailed web authentication guide
- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [Auth0 React Native SDK](https://auth0.com/docs/quickstart/native/react-native)

## 🆘 Getting Help

1. Check the [troubleshooting section](#-troubleshooting)
2. Review [AUTH0_WEB_SETUP.md](./AUTH0_WEB_SETUP.md) for auth issues
3. Check Expo documentation
4. Review browser/Xcode console logs for errors

---

**Back to**: [Main README](../README.md) | [Backend README](../backend/README.md)
