import express, { Request, Response } from 'express';
import { getBinQuizzesWithLimit } from '../schema/binQuiz.js';
import { getUserByAuth0Id, updateUserByAuth0Id } from '../schema/user.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = express.Router();

const DEFAULT_LIMIT = 10;

router.get('/', async (req: Request, res: Response) => {
    try {
        const limitParam = req.query.limit as string | undefined;
        const limit = limitParam ? parseInt(limitParam, 10) : DEFAULT_LIMIT;

        // Validate limit
        if (isNaN(limit) || limit < 1) {
            return res.status(400).json({ error: 'Limit must be a positive number' });
        }

        // Optional: set a max limit to prevent abuse
        const maxLimit = 100;
        const finalLimit = Math.min(limit, maxLimit);

        const quizzes = await getBinQuizzesWithLimit(finalLimit);

        res.status(200).json({
            quizzes,
            count: quizzes.length,
            limit: finalLimit,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Submit quiz answer - requires authentication
router.post('/submit', requireAuth, async (req: Request, res: Response) => {
    try {
        const { points } = req.body;
        const user = (req as AuthenticatedRequest).user;

        if (!user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        if (typeof points !== 'number' || points < 0) {
            return res.status(400).json({ error: 'Invalid points value' });
        }

        // Update user's leaderboard score
        const updatedUser = await updateUserByAuth0Id(user.auth0Id, {
            leaderboardScore: user.leaderboardScore + points
        });

        res.status(200).json({
            message: 'Score updated successfully',
            newScore: updatedUser.leaderboardScore,
            pointsAdded: points
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export { router as quizRoutes };

