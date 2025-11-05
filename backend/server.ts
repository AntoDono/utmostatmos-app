import express from 'express';
import 'dotenv/config';
import { authRoutes } from './routes/auth.js';
import { quizRoutes } from './routes/quiz.js';
import { leaderboardRoutes } from './routes/leaderboard.js';
import { trackerRoutes } from './routes/tracker.js';

const app = express();
const port = process.env.PORT || 3000;

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