import express, { Request, Response } from 'express';
import { getBinQuizzesWithLimit } from '../schema/binQuiz.js';

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
        res.status(500).json({ error: error.message || 'Failed to fetch quizzes' });
    }
});

export { router as quizRoutes };

