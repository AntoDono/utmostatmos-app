import request from 'supertest';
import { app } from '../server.js';
import { PrismaClient } from '@prisma/client';
import { createTracker } from '../schema/tracker.js';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

describe('Tracker Routes', () => {
  describe('GET /tracker', () => {
    it('should return all trackers', async () => {
      // Create multiple trackers
      const tracker1 = await createTracker({
        id: uuidv4(),
        type: 'bin',
        name: 'Recycling Bin',
        longitude: -122.4194,
        latitude: 37.7749,
      });

      const tracker2 = await createTracker({
        id: uuidv4(),
        type: 'compost',
        name: 'Compost Bin',
        longitude: -122.4083,
        latitude: 37.7833,
      });

      const response = await request(app)
        .get('/tracker')
        .expect(200);

      expect(response.body).toHaveProperty('trackers');
      expect(response.body).toHaveProperty('count');
      expect(response.body.count).toBe(2);
      expect(response.body.trackers).toHaveLength(2);

      // Verify tracker structure
      response.body.trackers.forEach((tracker: any) => {
        expect(tracker).toHaveProperty('id');
        expect(tracker).toHaveProperty('type');
        expect(tracker).toHaveProperty('name');
        expect(tracker).toHaveProperty('longitude');
        expect(tracker).toHaveProperty('latitude');
        expect(tracker).toHaveProperty('createdAt');
        expect(tracker).toHaveProperty('updatedAt');
      });
    });

    it('should filter trackers by type', async () => {
      await createTracker({
        id: uuidv4(),
        type: 'bin',
        name: 'Recycling Bin 1',
        longitude: -122.4194,
        latitude: 37.7749,
      });

      await createTracker({
        id: uuidv4(),
        type: 'bin',
        name: 'Recycling Bin 2',
        longitude: -122.4083,
        latitude: 37.7833,
      });

      await createTracker({
        id: uuidv4(),
        type: 'compost',
        name: 'Compost Bin',
        longitude: -122.4000,
        latitude: 37.8000,
      });

      const response = await request(app)
        .get('/tracker?type=bin')
        .expect(200);

      expect(response.body.count).toBe(2);
      response.body.trackers.forEach((tracker: any) => {
        expect(tracker.type).toBe('bin');
      });
    });

    it('should return empty array when no trackers exist', async () => {
      const response = await request(app)
        .get('/tracker')
        .expect(200);

      expect(response.body.trackers).toEqual([]);
      expect(response.body.count).toBe(0);
    });
  });

  describe('GET /tracker/:id', () => {
    it('should return a specific tracker', async () => {
      const tracker = await createTracker({
        id: uuidv4(),
        type: 'bin',
        name: 'Test Bin',
        longitude: -122.4194,
        latitude: 37.7749,
      });

      const response = await request(app)
        .get(`/tracker/${tracker.id}`)
        .expect(200);

      expect(response.body.id).toBe(tracker.id);
      expect(response.body.type).toBe('bin');
      expect(response.body.name).toBe('Test Bin');
      expect(response.body.longitude).toBe(-122.4194);
      expect(response.body.latitude).toBe(37.7749);
    });

    it('should return 404 for non-existent tracker', async () => {
      const nonExistentId = uuidv4();
      const response = await request(app)
        .get(`/tracker/${nonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Tracker not found');
    });
  });

  describe('POST /tracker', () => {
    it('should create a new tracker successfully', async () => {
      const trackerData = {
        type: 'bin',
        name: 'New Recycling Bin',
        longitude: -122.4194,
        latitude: 37.7749,
      };

      const response = await request(app)
        .post('/tracker')
        .send(trackerData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.type).toBe(trackerData.type);
      expect(response.body.name).toBe(trackerData.name);
      expect(response.body.longitude).toBe(trackerData.longitude);
      expect(response.body.latitude).toBe(trackerData.latitude);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();

      // Verify it exists in database
      const dbTracker = await prisma.tracker.findUnique({
        where: { id: response.body.id },
      });
      expect(dbTracker).toBeTruthy();
    });

    it('should return 400 if type is missing', async () => {
      const trackerData = {
        name: 'Test Bin',
        longitude: -122.4194,
        latitude: 37.7749,
      };

      const response = await request(app)
        .post('/tracker')
        .send(trackerData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Missing required fields');
    });

    it('should return 400 if name is missing', async () => {
      const trackerData = {
        type: 'bin',
        longitude: -122.4194,
        latitude: 37.7749,
      };

      const response = await request(app)
        .post('/tracker')
        .send(trackerData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if longitude is missing', async () => {
      const trackerData = {
        type: 'bin',
        name: 'Test Bin',
        latitude: 37.7749,
      };

      const response = await request(app)
        .post('/tracker')
        .send(trackerData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if latitude is missing', async () => {
      const trackerData = {
        type: 'bin',
        name: 'Test Bin',
        longitude: -122.4194,
      };

      const response = await request(app)
        .post('/tracker')
        .send(trackerData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if longitude is out of range (too high)', async () => {
      const trackerData = {
        type: 'bin',
        name: 'Test Bin',
        longitude: 200,
        latitude: 37.7749,
      };

      const response = await request(app)
        .post('/tracker')
        .send(trackerData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Longitude must be between -180 and 180');
    });

    it('should return 400 if longitude is out of range (too low)', async () => {
      const trackerData = {
        type: 'bin',
        name: 'Test Bin',
        longitude: -200,
        latitude: 37.7749,
      };

      const response = await request(app)
        .post('/tracker')
        .send(trackerData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if latitude is out of range (too high)', async () => {
      const trackerData = {
        type: 'bin',
        name: 'Test Bin',
        longitude: -122.4194,
        latitude: 100,
      };

      const response = await request(app)
        .post('/tracker')
        .send(trackerData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Latitude must be between -90 and 90');
    });

    it('should return 400 if latitude is out of range (too low)', async () => {
      const trackerData = {
        type: 'bin',
        name: 'Test Bin',
        longitude: -122.4194,
        latitude: -100,
      };

      const response = await request(app)
        .post('/tracker')
        .send(trackerData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if longitude is not a number', async () => {
      const trackerData = {
        type: 'bin',
        name: 'Test Bin',
        longitude: 'not-a-number',
        latitude: 37.7749,
      };

      const response = await request(app)
        .post('/tracker')
        .send(trackerData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should accept valid boundary coordinates', async () => {
      const trackerData = {
        type: 'bin',
        name: 'Boundary Test',
        longitude: 180,
        latitude: 90,
      };

      const response = await request(app)
        .post('/tracker')
        .send(trackerData)
        .expect(201);

      expect(response.body.longitude).toBe(180);
      expect(response.body.latitude).toBe(90);
    });
  });

  describe('PUT /tracker/:id', () => {
    it('should update a tracker successfully', async () => {
      const tracker = await createTracker({
        id: uuidv4(),
        type: 'bin',
        name: 'Original Name',
        longitude: -122.4194,
        latitude: 37.7749,
      });

      const updateData = {
        name: 'Updated Name',
        longitude: -122.4083,
        latitude: 37.7833,
      };

      const response = await request(app)
        .put(`/tracker/${tracker.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(tracker.id);
      expect(response.body.name).toBe('Updated Name');
      expect(response.body.longitude).toBe(-122.4083);
      expect(response.body.latitude).toBe(37.7833);
      expect(response.body.type).toBe('bin'); // Unchanged
    });

    it('should update only provided fields', async () => {
      const tracker = await createTracker({
        id: uuidv4(),
        type: 'bin',
        name: 'Original Name',
        longitude: -122.4194,
        latitude: 37.7749,
      });

      const updateData = {
        name: 'Updated Name',
      };

      const response = await request(app)
        .put(`/tracker/${tracker.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe('Updated Name');
      expect(response.body.longitude).toBe(-122.4194); // Unchanged
      expect(response.body.latitude).toBe(37.7749); // Unchanged
      expect(response.body.type).toBe('bin'); // Unchanged
    });

    it('should return 404 if tracker does not exist', async () => {
      const nonExistentId = uuidv4();
      const response = await request(app)
        .put(`/tracker/${nonExistentId}`)
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Tracker not found');
    });

    it('should validate longitude range on update', async () => {
      const tracker = await createTracker({
        id: uuidv4(),
        type: 'bin',
        name: 'Test',
        longitude: -122.4194,
        latitude: 37.7749,
      });

      const response = await request(app)
        .put(`/tracker/${tracker.id}`)
        .send({ longitude: 200 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should validate latitude range on update', async () => {
      const tracker = await createTracker({
        id: uuidv4(),
        type: 'bin',
        name: 'Test',
        longitude: -122.4194,
        latitude: 37.7749,
      });

      const response = await request(app)
        .put(`/tracker/${tracker.id}`)
        .send({ latitude: 100 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /tracker/:id', () => {
    it('should delete a tracker successfully', async () => {
      const tracker = await createTracker({
        id: uuidv4(),
        type: 'bin',
        name: 'To Delete',
        longitude: -122.4194,
        latitude: 37.7749,
      });

      const response = await request(app)
        .delete(`/tracker/${tracker.id}`)
        .expect(200);

      expect(response.body.id).toBe(tracker.id);

      // Verify it's deleted from database
      const dbTracker = await prisma.tracker.findUnique({
        where: { id: tracker.id },
      });
      expect(dbTracker).toBeNull();
    });

    it('should return 404 if tracker does not exist', async () => {
      const nonExistentId = uuidv4();
      const response = await request(app)
        .delete(`/tracker/${nonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Tracker not found');
    });
  });
});

