import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { authRoutes } from './routes/auth.js';
import { quizRoutes } from './routes/quiz.js';
import { leaderboardRoutes } from './routes/leaderboard.js';
import { trackerRoutes } from './routes/tracker.js';

// Validate Auth0 environment variables
const requiredEnvVars = ['AUTH0_DOMAIN', 'AUTH0_AUDIENCE'];
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingEnvVars.length > 0 && !process.env.JEST_WORKER_ID) {
  console.warn(`Warning: Missing Auth0 environment variables: ${missingEnvVars.join(', ')}`);
  console.warn('Auth0 authentication will not work until these are configured.');
}

const app = express();
const port = process.env.PORT || 3000;

// CORS middleware - allow all origins
if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: '*',
    credentials: true,
  }));
}
else {
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }));
}

// Middleware to parse JSON request bodies
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/tracker', trackerRoutes);

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Utmostatmost online.');
});

// Export app for testing
export { app };

// Start server when run directly (not when imported for tests)
// Jest sets JEST_WORKER_ID when running tests
if (!process.env.JEST_WORKER_ID) {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}