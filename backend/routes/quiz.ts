import express, { Request, Response } from 'express';
import { getBinQuizzesWithLimit, createBinQuiz, getAllBinQuizzes, getBinQuiz, updateBinQuiz, deleteBinQuiz } from '../schema/binQuiz.js';
import { getUserByAuth0Id, updateUserByAuth0Id } from '../schema/user.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

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

// Admin routes - require authentication
// GET /quiz/admin - Get all quizzes (admin only)
router.get('/admin', requireAuth, async (req: Request, res: Response) => {
    try {
        const quizzes = await getAllBinQuizzes();
        res.status(200).json({
            quizzes,
            count: quizzes.length,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /quiz/admin/:id - Get a specific quiz (admin only)
router.get('/admin/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const quiz = await getBinQuiz(id);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.status(200).json(quiz);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST /quiz/admin - Create a new quiz (admin only)
router.post('/admin', requireAuth, async (req: Request, res: Response) => {
    try {
        const { item, choices, answer } = req.body;

        // Validate required fields
        if (!item || !choices || !answer) {
            return res.status(400).json({ error: 'Missing required fields: item, choices, answer' });
        }

        // Validate choices is an array
        if (!Array.isArray(choices)) {
            return res.status(400).json({ error: 'Choices must be an array' });
        }

        const quiz = {
            id: uuidv4(),
            item,
            choices,
            answer,
        };

        const newQuiz = await createBinQuiz(quiz);
        res.status(201).json(newQuiz);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /quiz/admin/:id - Update a quiz (admin only)
router.put('/admin/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { item, choices, answer } = req.body;

        // Check if quiz exists
        const existingQuiz = await getBinQuiz(id);
        if (!existingQuiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Validate choices if provided
        if (choices !== undefined && !Array.isArray(choices)) {
            return res.status(400).json({ error: 'Choices must be an array' });
        }

        const updatedQuiz = await updateBinQuiz({
            id,
            item: item ?? existingQuiz.item,
            choices: choices ?? existingQuiz.choices,
            answer: answer ?? existingQuiz.answer,
        });

        res.status(200).json(updatedQuiz);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /quiz/admin/:id - Delete a quiz (admin only)
router.delete('/admin/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const quiz = await getBinQuiz(id);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        const deletedQuiz = await deleteBinQuiz(id);
        res.status(200).json(deletedQuiz);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export { router as quizRoutes };

