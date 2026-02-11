import express, { Request, Response } from 'express';
import { createContest, getAllContests, getContest, updateContest, deleteContest } from '../schema/contest.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET /contest - Get all contests
router.get('/', async (req: Request, res: Response) => {
    try {
        const contests = await getAllContests();
        res.status(200).json({
            contests,
            count: contests.length,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /contest/:id - Get a specific contest
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const contest = await getContest(id);

        if (!contest) {
            return res.status(404).json({ error: 'Contest not found' });
        }

        res.status(200).json(contest);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST /contest - Create a new contest
router.post('/', async (req: Request, res: Response) => {
    try {
        const { title, organization, scope, grade, deadline, prize, description, requirements } = req.body;

        // Validate required fields
        if (!title || !organization || !scope || !grade || !deadline || !prize || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate requirements is an array
        if (!Array.isArray(requirements)) {
            return res.status(400).json({ error: 'Requirements must be an array' });
        }

        const contest = {
            id: uuidv4(),
            title,
            organization,
            scope,
            grade,
            deadline,
            prize,
            description,
            requirements: requirements || [],
        };

        const newContest = await createContest(contest);
        res.status(201).json(newContest);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /contest/:id - Update a contest
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, organization, scope, grade, deadline, prize, description, requirements } = req.body;

        // Check if contest exists
        const existingContest = await getContest(id);
        if (!existingContest) {
            return res.status(404).json({ error: 'Contest not found' });
        }

        // Validate requirements if provided
        if (requirements !== undefined && !Array.isArray(requirements)) {
            return res.status(400).json({ error: 'Requirements must be an array' });
        }

        const updatedContest = await updateContest({
            id,
            title: title ?? existingContest.title,
            organization: organization ?? existingContest.organization,
            scope: scope ?? existingContest.scope,
            grade: grade ?? existingContest.grade,
            deadline: deadline ?? existingContest.deadline,
            prize: prize ?? existingContest.prize,
            description: description ?? existingContest.description,
            requirements: requirements ?? existingContest.requirements,
        });

        res.status(200).json(updatedContest);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /contest/:id - Delete a contest
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const contest = await getContest(id);

        if (!contest) {
            return res.status(404).json({ error: 'Contest not found' });
        }

        const deletedContest = await deleteContest(id);
        res.status(200).json(deletedContest);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export { router as contestRoutes };

