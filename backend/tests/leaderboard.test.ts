import request from 'supertest';
import { app } from '../server.js';
import { PrismaClient } from '@prisma/client';
import { createUser } from '../schema/user.js';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

describe('Leaderboard Routes', () => {
  describe('GET /leaderboard', () => {
    it('should return top 10 users sorted by leaderboardScore desc', async () => {
      // Create users with different scores
      const users = [
        { id: uuidv4(), email: 'user1@test.com', password: 'pass', firstName: 'User', lastName: 'One', leaderboardScore: 100, role: 'user' },
        { id: uuidv4(), email: 'user2@test.com', password: 'pass', firstName: 'User', lastName: 'Two', leaderboardScore: 250, role: 'user' },
        { id: uuidv4(), email: 'user3@test.com', password: 'pass', firstName: 'User', lastName: 'Three', leaderboardScore: 50, role: 'user' },
        { id: uuidv4(), email: 'user4@test.com', password: 'pass', firstName: 'User', lastName: 'Four', leaderboardScore: 300, role: 'user' },
        { id: uuidv4(), email: 'user5@test.com', password: 'pass', firstName: 'User', lastName: 'Five', leaderboardScore: 150, role: 'user' },
        { id: uuidv4(), email: 'user6@test.com', password: 'pass', firstName: 'User', lastName: 'Six', leaderboardScore: 200, role: 'user' },
        { id: uuidv4(), email: 'user7@test.com', password: 'pass', firstName: 'User', lastName: 'Seven', leaderboardScore: 75, role: 'user' },
        { id: uuidv4(), email: 'user8@test.com', password: 'pass', firstName: 'User', lastName: 'Eight', leaderboardScore: 400, role: 'user' },
        { id: uuidv4(), email: 'user9@test.com', password: 'pass', firstName: 'User', lastName: 'Nine', leaderboardScore: 175, role: 'user' },
        { id: uuidv4(), email: 'user10@test.com', password: 'pass', firstName: 'User', lastName: 'Ten', leaderboardScore: 225, role: 'user' },
        { id: uuidv4(), email: 'user11@test.com', password: 'pass', firstName: 'User', lastName: 'Eleven', leaderboardScore: 125, role: 'user' },
      ];

      // Create all users
      for (const user of users) {
        await createUser({
          ...user,
          emailVerified: false,
          verificationToken: null,
          passwordResetToken: null,
        });
      }

      const response = await request(app)
        .get('/leaderboard')
        .expect(200);

      expect(response.body).toHaveProperty('leaderboard');
      expect(response.body).toHaveProperty('count');
      expect(response.body.count).toBe(10);
      expect(response.body.leaderboard).toHaveLength(10);

      // Verify ordering: highest score first
      const scores = response.body.leaderboard.map((user: any) => user.leaderboardScore);
      expect(scores).toEqual([400, 300, 250, 225, 200, 175, 150, 125, 100, 75]);

      // Verify users have correct structure (no sensitive data)
      response.body.leaderboard.forEach((user: any) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('firstName');
        expect(user).toHaveProperty('lastName');
        expect(user).toHaveProperty('leaderboardScore');
        expect(user).toHaveProperty('role');
        expect(user).not.toHaveProperty('password');
        expect(user).not.toHaveProperty('verificationToken');
        expect(user).not.toHaveProperty('passwordResetToken');
      });
    });

    it('should return all users when less than 10 exist', async () => {
      // Create only 5 users
      const users = [
        { id: uuidv4(), email: 'a@test.com', password: 'pass', firstName: 'A', lastName: 'User', leaderboardScore: 100, role: 'user' },
        { id: uuidv4(), email: 'b@test.com', password: 'pass', firstName: 'B', lastName: 'User', leaderboardScore: 200, role: 'user' },
        { id: uuidv4(), email: 'c@test.com', password: 'pass', firstName: 'C', lastName: 'User', leaderboardScore: 300, role: 'user' },
        { id: uuidv4(), email: 'd@test.com', password: 'pass', firstName: 'D', lastName: 'User', leaderboardScore: 50, role: 'user' },
        { id: uuidv4(), email: 'e@test.com', password: 'pass', firstName: 'E', lastName: 'User', leaderboardScore: 150, role: 'user' },
      ];

      for (const user of users) {
        await createUser({
          ...user,
          emailVerified: false,
          verificationToken: null,
          passwordResetToken: null,
        });
      }

      const response = await request(app)
        .get('/leaderboard')
        .expect(200);

      expect(response.body.count).toBe(5);
      expect(response.body.leaderboard).toHaveLength(5);

      // Verify ordering
      const scores = response.body.leaderboard.map((user: any) => user.leaderboardScore);
      expect(scores).toEqual([300, 200, 150, 100, 50]);
    });

    it('should return empty array when no users exist', async () => {
      const response = await request(app)
        .get('/leaderboard')
        .expect(200);

      expect(response.body.leaderboard).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    it('should handle users with same scores correctly', async () => {
      // Create users with duplicate scores
      const users = [
        { id: uuidv4(), email: 'same1@test.com', password: 'pass', firstName: 'Same', lastName: 'One', leaderboardScore: 100, role: 'user' },
        { id: uuidv4(), email: 'same2@test.com', password: 'pass', firstName: 'Same', lastName: 'Two', leaderboardScore: 100, role: 'user' },
        { id: uuidv4(), email: 'same3@test.com', password: 'pass', firstName: 'Same', lastName: 'Three', leaderboardScore: 100, role: 'user' },
        { id: uuidv4(), email: 'higher@test.com', password: 'pass', firstName: 'Higher', lastName: 'Score', leaderboardScore: 200, role: 'user' },
      ];

      for (const user of users) {
        await createUser({
          ...user,
          emailVerified: false,
          verificationToken: null,
          passwordResetToken: null,
        });
      }

      const response = await request(app)
        .get('/leaderboard')
        .expect(200);

      expect(response.body.leaderboard).toHaveLength(4);
      
      // Higher score should be first
      expect(response.body.leaderboard[0].leaderboardScore).toBe(200);
      
      // All users with score 100 should be included
      const score100Users = response.body.leaderboard.filter((user: any) => user.leaderboardScore === 100);
      expect(score100Users.length).toBe(3);
    });

    it('should exclude sensitive user data', async () => {
      const user = await createUser({
        id: uuidv4(),
        email: 'test@example.com',
        password: 'secretpassword',
        firstName: 'Test',
        lastName: 'User',
        leaderboardScore: 500,
        role: 'user',
        emailVerified: false,
        verificationToken: 'some-token',
        passwordResetToken: 'reset-token',
      });

      const response = await request(app)
        .get('/leaderboard')
        .expect(200);

      const returnedUser = response.body.leaderboard.find((u: any) => u.id === user.id);
      expect(returnedUser).toBeTruthy();
      expect(returnedUser).not.toHaveProperty('password');
      expect(returnedUser).not.toHaveProperty('verificationToken');
      expect(returnedUser).not.toHaveProperty('passwordResetToken');
      expect(returnedUser.email).toBe('test@example.com');
      expect(returnedUser.leaderboardScore).toBe(500);
    });

    it('should include admin users in leaderboard', async () => {
      const adminUser = await createUser({
        id: uuidv4(),
        email: 'admin@test.com',
        password: 'pass',
        firstName: 'Admin',
        lastName: 'User',
        leaderboardScore: 1000,
        role: 'admin',
        emailVerified: true,
        verificationToken: null,
        passwordResetToken: null,
      });

      const regularUser = await createUser({
        id: uuidv4(),
        email: 'regular@test.com',
        password: 'pass',
        firstName: 'Regular',
        lastName: 'User',
        leaderboardScore: 500,
        role: 'user',
        emailVerified: false,
        verificationToken: null,
        passwordResetToken: null,
      });

      const response = await request(app)
        .get('/leaderboard')
        .expect(200);

      expect(response.body.leaderboard[0].id).toBe(adminUser.id);
      expect(response.body.leaderboard[0].role).toBe('admin');
      expect(response.body.leaderboard[1].id).toBe(regularUser.id);
      expect(response.body.leaderboard[1].role).toBe('user');
    });
  });
});

