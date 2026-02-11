import express, { Request, Response } from 'express';
import { createTracker, getAllTrackers, getTracker, getTrackersByType, updateTracker, deleteTracker } from '../schema/tracker.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET /tracker - Get all trackers or filter by type
router.get('/', async (req: Request, res: Response) => {
    try {
        const type = req.query.type as string | undefined;

        let trackers;
        if (type) {
            trackers = await getTrackersByType(type);
        } else {
            trackers = await getAllTrackers();
        }

        res.status(200).json({
            trackers,
            count: trackers.length,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /tracker/:id - Get a specific tracker
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tracker = await getTracker(id);

        if (!tracker) {
            return res.status(404).json({ error: 'Tracker not found' });
        }

        res.status(200).json(tracker);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST /tracker - Create a new tracker
router.post('/', async (req: Request, res: Response) => {
    try {
        const { type, name, longitude, latitude } = req.body;

        // Validate required fields
        if (!type || !name || longitude === undefined || latitude === undefined) {
            return res.status(400).json({ error: 'Missing required fields: type, name, longitude, latitude' });
        }

        // Validate coordinates
        if (typeof longitude !== 'number' || typeof latitude !== 'number') {
            return res.status(400).json({ error: 'Longitude and latitude must be numbers' });
        }

        // Validate coordinate ranges
        if (longitude < -180 || longitude > 180) {
            return res.status(400).json({ error: 'Longitude must be between -180 and 180' });
        }

        if (latitude < -90 || latitude > 90) {
            return res.status(400).json({ error: 'Latitude must be between -90 and 90' });
        }

        const tracker = {
            id: uuidv4(),
            type,
            name,
            longitude,
            latitude,
        };

        const newTracker = await createTracker(tracker);
        res.status(201).json(newTracker);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /tracker/:id - Update a tracker
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { type, name, longitude, latitude } = req.body;

        // Check if tracker exists
        const existingTracker = await getTracker(id);
        if (!existingTracker) {
            return res.status(404).json({ error: 'Tracker not found' });
        }

        // Validate coordinates if provided
        if (longitude !== undefined) {
            if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
                return res.status(400).json({ error: 'Longitude must be a number between -180 and 180' });
            }
        }

        if (latitude !== undefined) {
            if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
                return res.status(400).json({ error: 'Latitude must be a number between -90 and 90' });
            }
        }

        const updatedTracker = await updateTracker({
            id,
            type: type ?? existingTracker.type,
            name: name ?? existingTracker.name,
            longitude: longitude ?? existingTracker.longitude,
            latitude: latitude ?? existingTracker.latitude,
        });

        res.status(200).json(updatedTracker);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /tracker/:id - Delete a tracker
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tracker = await getTracker(id);

        if (!tracker) {
            return res.status(404).json({ error: 'Tracker not found' });
        }

        const deletedTracker = await deleteTracker(id);
        res.status(200).json(deletedTracker);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export { router as trackerRoutes };

