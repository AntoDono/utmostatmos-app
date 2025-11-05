import request from 'supertest';
import { app } from '../server.js';
import { PrismaClient } from '@prisma/client';
import { createSession } from '../schema/session.js';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

describe('Auth Routes', () => {
  describe('POST /auth/signup', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
      expect(response.body.firstName).toBe(userData.firstName);
      expect(response.body.lastName).toBe(userData.lastName);
      expect(response.body.role).toBe('user');
      expect(response.body.emailVerified).toBe(false);
      expect(response.body.leaderboardScore).toBe(0);
      
      // Verify password is not returned
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('verificationToken');
      expect(response.body).not.toHaveProperty('passwordResetToken');

      // Verify user exists in database
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      expect(user).toBeTruthy();
      expect(user?.password).toBe(userData.password);
    });

    it('should return 500 if email is missing (Prisma validation)', async () => {
      const userData = {
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 500 if password is missing (Prisma validation)', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(500);
    });

    it('should return 500 if firstName is missing (Prisma validation)', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(500);
    });

    it('should return 500 if lastName is missing (Prisma validation)', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
      };

      const response = await request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(500);
    });

    it('should not allow duplicate emails', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      // Create first user
      await request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(500); // Prisma will throw a unique constraint error

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/delete-account', () => {
    it('should delete user account successfully', async () => {
      // Create a user first
      const userId = uuidv4();
      const user = await prisma.user.create({
        data: {
          id: userId,
          email: 'delete@example.com',
          password: 'password123',
          firstName: 'Delete',
          lastName: 'User',
          role: 'user',
          emailVerified: false,
        },
      });

      // Create a session for the user
      const sessionId = uuidv4();
      const session = await createSession({
        id: sessionId,
        userId: user.id,
        token: uuidv4(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/auth/delete-account')
        .send({ sessionId: session.id })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(session.id);

      // Verify user is deleted
      const deletedUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      expect(deletedUser).toBeNull();
    });

    it('should return 401 if session does not exist', async () => {
      const response = await request(app)
        .post('/auth/delete-account')
        .send({ sessionId: uuidv4() })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Session not found or expired');
    });

    it('should return 401 if sessionId is missing', async () => {
      const response = await request(app)
        .post('/auth/delete-account')
        .send({})
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Session not found or expired');
    });

    it('should return 401 if session has expired', async () => {
      // Create a user first
      const userId = uuidv4();
      const user = await prisma.user.create({
        data: {
          id: userId,
          email: 'expired@example.com',
          password: 'password123',
          firstName: 'Expired',
          lastName: 'User',
          role: 'user',
          emailVerified: false,
        },
      });

      // Create an expired session (expired 1 hour ago)
      const sessionId = uuidv4();
      const expiredSession = await createSession({
        id: sessionId,
        userId: user.id,
        token: uuidv4(),
        expiresAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/auth/delete-account')
        .send({ sessionId: expiredSession.id })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Session not found or expired');

      // Verify expired session was deleted
      const deletedSession = await prisma.session.findUnique({
        where: { id: sessionId },
      });
      expect(deletedSession).toBeNull();
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully and delete session', async () => {
      // Create a user first
      const userId = uuidv4();
      const user = await prisma.user.create({
        data: {
          id: userId,
          email: 'logout@example.com',
          password: 'password123',
          firstName: 'Logout',
          lastName: 'User',
          role: 'user',
          emailVerified: false,
        },
      });

      // Create a session for the user
      const sessionId = uuidv4();
      const session = await createSession({
        id: sessionId,
        userId: user.id,
        token: uuidv4(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/auth/logout')
        .send({ sessionId: session.id })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(session.id);

      // Verify session is deleted
      const deletedSession = await prisma.session.findUnique({
        where: { id: sessionId },
      });
      expect(deletedSession).toBeNull();
    });

    it('should return 401 if session does not exist', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .send({ sessionId: uuidv4() })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Session not found or expired');
    });

    it('should return 401 if sessionId is missing', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .send({})
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Session not found or expired');
    });

    it('should return 401 if session has expired', async () => {
      // Create a user first
      const userId = uuidv4();
      const user = await prisma.user.create({
        data: {
          id: userId,
          email: 'expiredlogout@example.com',
          password: 'password123',
          firstName: 'Expired',
          lastName: 'Logout',
          role: 'user',
          emailVerified: false,
        },
      });

      // Create an expired session (expired 1 hour ago)
      const sessionId = uuidv4();
      const expiredSession = await createSession({
        id: sessionId,
        userId: user.id,
        token: uuidv4(),
        expiresAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/auth/logout')
        .send({ sessionId: expiredSession.id })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Session not found or expired');

      // Verify expired session was deleted
      const deletedSession = await prisma.session.findUnique({
        where: { id: sessionId },
      });
      expect(deletedSession).toBeNull();
    });

    it('should work with valid non-expired session', async () => {
      // Create a user first
      const userId = uuidv4();
      const user = await prisma.user.create({
        data: {
          id: userId,
          email: 'valid@example.com',
          password: 'password123',
          firstName: 'Valid',
          lastName: 'User',
          role: 'user',
          emailVerified: false,
        },
      });

      // Create a valid session (expires in 24 hours)
      const sessionId = uuidv4();
      const session = await createSession({
        id: sessionId,
        userId: user.id,
        token: uuidv4(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/auth/logout')
        .send({ sessionId: session.id })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(session.id);
    });
  });
});

