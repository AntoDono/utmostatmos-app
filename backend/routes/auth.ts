import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import type { User } from '../schema/user.js';
import { createUser, deleteUser, sanitizeUser, getUserByEmail } from '../schema/user.js';
import { createSession, deleteSession, validateSession, sanitizeSession } from '../schema/session.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const SALT_ROUNDS = 10;

router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user: User = {
            id: uuidv4(),
            role: 'user',
            email,
            password: hashedPassword,
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
        res.status(500).json({ error: error.message || 'Failed to create user' });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create session
        const sessionId = uuidv4();
        const token = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Session expires in 7 days

        const session = await createSession({
            id: sessionId,
            userId: user.id,
            token,
            expiresAt,
            createdAt: new Date(),
        });

        res.status(200).json({
            sessionId: session.id,
            user: sanitizeUser(user),
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to login' });
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
        res.status(500).json({ error: error.message || 'Failed to delete account' });
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
        res.status(500).json({ error: error.message || 'Failed to logout' });
    }
});

export { router as authRoutes };