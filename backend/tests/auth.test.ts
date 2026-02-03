import request from 'supertest';
import { app } from '../server.js';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Mock the express-oauth2-jwt-bearer module
jest.mock('express-oauth2-jwt-bearer', () => ({
  auth: () => (req: any, res: any, next: any) => {
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token was found' });
    }

    const token = authHeader.split(' ')[1];
    
    // For testing, we use the token as the auth0Id
    // In real scenarios, Auth0 validates and decodes the JWT
    if (token === 'invalid-token') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Mock the decoded JWT payload
    req.auth = {
      payload: {
        sub: token, // Use token as auth0Id for testing
        email: `${token}@test.com`,
      }
    };
    
    next();
  },
  requiredScopes: () => (req: any, res: any, next: any) => next(),
}));

describe('Auth Routes with JWT', () => {
  beforeEach(async () => {
    // Clean up users before each test
    await prisma.user.deleteMany({});
  });

  describe('GET /auth/profile', () => {
    it('should return 401 without authorization header', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should create and return user profile for new auth0 user', async () => {
      const auth0Id = `auth0|${uuidv4()}`;
      
      const response = await request(app)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${auth0Id}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.auth0Id).toBe(auth0Id);
      expect(response.body.user.email).toBe(`${auth0Id}@test.com`);
      expect(response.body.user.role).toBe('user');
      expect(response.body.user.leaderboardScore).toBe(0);
    });

    it('should return existing user profile', async () => {
      const auth0Id = `auth0|${uuidv4()}`;
      
      // Create user first
      await prisma.user.create({
        data: {
          auth0Id,
          email: 'existing@example.com',
          firstName: 'Existing',
          lastName: 'User',
          leaderboardScore: 100,
          role: 'user',
        }
      });

      const response = await request(app)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${auth0Id}`)
        .expect(200);

      expect(response.body.user.auth0Id).toBe(auth0Id);
      expect(response.body.user.firstName).toBe('Existing');
      expect(response.body.user.lastName).toBe('User');
      expect(response.body.user.leaderboardScore).toBe(100);
    });
  });

  describe('PUT /auth/profile', () => {
    it('should update user profile', async () => {
      const auth0Id = `auth0|${uuidv4()}`;
      
      // Create user first
      await prisma.user.create({
        data: {
          auth0Id,
          email: 'update@example.com',
          firstName: null,
          lastName: null,
          role: 'user',
        }
      });

      const response = await request(app)
        .put('/auth/profile')
        .set('Authorization', `Bearer ${auth0Id}`)
        .send({ firstName: 'Updated', lastName: 'Name' })
        .expect(200);

      expect(response.body.user.firstName).toBe('Updated');
      expect(response.body.user.lastName).toBe('Name');

      // Verify in database
      const user = await prisma.user.findUnique({ where: { auth0Id } });
      expect(user?.firstName).toBe('Updated');
      expect(user?.lastName).toBe('Name');
    });

    it('should allow partial updates', async () => {
      const auth0Id = `auth0|${uuidv4()}`;
      
      await prisma.user.create({
        data: {
          auth0Id,
          email: 'partial@example.com',
          firstName: 'Original',
          lastName: 'Name',
          role: 'user',
        }
      });

      const response = await request(app)
        .put('/auth/profile')
        .set('Authorization', `Bearer ${auth0Id}`)
        .send({ firstName: 'NewFirst' })
        .expect(200);

      expect(response.body.user.firstName).toBe('NewFirst');
      expect(response.body.user.lastName).toBe('Name'); // Unchanged
    });

    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .put('/auth/profile')
        .send({ firstName: 'Test' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /auth/account', () => {
    it('should delete user account', async () => {
      const auth0Id = `auth0|${uuidv4()}`;
      
      // Create user first
      const user = await prisma.user.create({
        data: {
          auth0Id,
          email: 'delete@example.com',
          firstName: 'Delete',
          lastName: 'Me',
          role: 'user',
        }
      });

      const response = await request(app)
        .delete('/auth/account')
        .set('Authorization', `Bearer ${auth0Id}`)
        .expect(200);

      expect(response.body.message).toBe('Account deleted successfully');

      // Verify user is deleted
      const deletedUser = await prisma.user.findUnique({ where: { id: user.id } });
      expect(deletedUser).toBeNull();
    });

    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .delete('/auth/account')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});
