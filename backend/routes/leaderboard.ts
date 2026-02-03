import express, { Request, Response } from 'express';
import { getTopUsers } from '../schema/user.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const topUsers = await getTopUsers(10);

        res.status(200).json({
            leaderboard: topUsers,
            count: topUsers.length,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export { router as leaderboardRoutes };

