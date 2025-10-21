import express from 'express';
import type { User } from '../schema/user.ts';
import { createUser, deleteUser, sanitizeUser } from '../schema/user.ts';
import { createSession, deleteSession, getSession, sanitizeSession } from '../schema/session.ts';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/signup', async (req, res) => {
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
});

router.post('/delete-account', async (req, res) => {
    const { sessionId } = req.body;
    const session = await getSession(sessionId);
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    const deletedUser = deleteUser(session.userId);
    res.status(200).json(sanitizeSession(session));
});

router.post('/logout', async (req, res) => {
    const { sessionId } = req.body;
    const session = await getSession(sessionId);
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    const deletedSession = deleteSession(sessionId);
    res.status(200).json(sanitizeSession(deletedSession));
});

export { router as authRoutes };