import express, { Request, Response } from 'express';
import { getTopUsers, getUserRankByAuth0Id } from '../schema/user.js';
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, async (req: Request, res: Response) => {
    try {
        const topUsers = await getTopUsers(10);

        const authReq = req as AuthenticatedRequest;
        let currentUser: {
            id: string;
            firstName: string | null;
            lastName: string | null;
            leaderboardScore: number;
        } | null = null;
        let currentUserRank: number | null = null;

        if (authReq.user) {
            const rankInfo = await getUserRankByAuth0Id(authReq.user.auth0Id);
            if (rankInfo) {
                currentUserRank = rankInfo.rank;
                const u = rankInfo.user;
                currentUser = {
                    id: u.id,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    leaderboardScore: u.leaderboardScore,
                };
            }
        }

        res.status(200).json({
            leaderboard: topUsers,
            count: topUsers.length,
            currentUser,
            currentUserRank,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export { router as leaderboardRoutes };

