import express, { Request, Response } from 'express';
import type { User } from '../schema/user.js';
import { createUser, deleteUser, sanitizeUser } from '../schema/user.js';
import { createSession, deleteSession, validateSession, sanitizeSession } from '../schema/session.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const user: User = {
            id: uuidv4(),
            role: 'user',
            email,
            password,
            firstName,
            lastName,
            emailVerified: false,
            verificationToken: null,
            passwordResetToken: null,
            leaderboardScore: 0,
        };
        const newUser = await createUser(user);
        res.status(201).json(sanitizeUser(newUser));
    } catch (error: any) {
        // Check if it's a Prisma unique constraint error (duplicate email)
        if (error.code === 'P2002' || error.message?.includes('Unique constraint')) {
            res.status(500).json({ error: error.message || 'Email already exists' });
        } else {
            res.status(500).json({ error: error.message || 'Failed to create user' });
        }
    }
});

router.post('/delete-account', async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(401).json({ error: 'Session not found or expired' });
        }
        const session = await validateSession(sessionId);
        if (!session) {
            return res.status(401).json({ error: 'Session not found or expired' });
        }
        const deletedUser = await deleteUser(session.userId);
        res.status(200).json(sanitizeSession(session));
    } catch (error: any) {
        // If session validation failed, return 401, otherwise 500
        if (error.message?.includes('Session') || error.message?.includes('session')) {
            res.status(401).json({ error: 'Session not found or expired' });
        } else {
            res.status(500).json({ error: error.message || 'Failed to delete account' });
        }
    }
});

router.post('/logout', async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(401).json({ error: 'Session not found or expired' });
        }
        const session = await validateSession(sessionId);
        if (!session) {
            return res.status(401).json({ error: 'Session not found or expired' });
        }
        const deletedSession = await deleteSession(sessionId);
        res.status(200).json(sanitizeSession(deletedSession));
    } catch (error: any) {
        // If session validation failed, return 401, otherwise 500
        if (error.message?.includes('Session') || error.message?.includes('session')) {
            res.status(401).json({ error: 'Session not found or expired' });
        } else {
            res.status(500).json({ error: error.message || 'Failed to logout' });
        }
    }
});

export { router as authRoutes };