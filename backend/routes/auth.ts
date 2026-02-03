import express, { Request, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { updateUserByAuth0Id, deleteUserByAuth0Id } from '../schema/user.js';

const router = express.Router();

// Get current user profile
// The requireAuth middleware validates JWT and attaches user to request
router.get('/profile', ...requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
        const authReq = req as AuthenticatedRequest;
        if (!authReq.user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({
            user: authReq.user
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update user profile
router.put('/profile', ...requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
        const authReq = req as AuthenticatedRequest;
        if (!authReq.user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        const { firstName, lastName } = req.body;
        
        // Only allow updating specific fields
        const updateData: { firstName?: string; lastName?: string } = {};
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;

        const updatedUser = await updateUserByAuth0Id(authReq.user.auth0Id, updateData);
        
        res.status(200).json({
            user: updatedUser
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user account
router.delete('/account', ...requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
        const authReq = req as AuthenticatedRequest;
        if (!authReq.user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        await deleteUserByAuth0Id(authReq.user.auth0Id);
        
        res.status(200).json({
            message: 'Account deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export { router as authRoutes };
