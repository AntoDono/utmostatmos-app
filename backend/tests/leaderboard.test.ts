import request from 'supertest';
import { app } from '../server.js';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Helper to create a user with Auth0 schema
const createTestUser = async (data: {
  email: string;
  firstName: string;
  lastName: string;
  leaderboardScore: number;
  role?: string;
}) => {
  return prisma.user.create({
    data: {
      id: uuidv4(),
      auth0Id: `auth0|test-${uuidv4()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      leaderboardScore: data.leaderboardScore,
      role: data.role || 'user',
    }
  });
};

describe('Leaderboard Routes', () => {
  describe('GET /leaderboard', () => {
    it('should return top 10 users sorted by leaderboardScore desc', async () => {
      // Create users with different scores
      const users = [
        { email: 'user1@test.com', firstName: 'User', lastName: 'One', leaderboardScore: 100 },
        { email: 'user2@test.com', firstName: 'User', lastName: 'Two', leaderboardScore: 250 },
        { email: 'user3@test.com', firstName: 'User', lastName: 'Three', leaderboardScore: 50 },
        { email: 'user4@test.com', firstName: 'User', lastName: 'Four', leaderboardScore: 300 },
        { email: 'user5@test.com', firstName: 'User', lastName: 'Five', leaderboardScore: 150 },
        { email: 'user6@test.com', firstName: 'User', lastName: 'Six', leaderboardScore: 200 },
        { email: 'user7@test.com', firstName: 'User', lastName: 'Seven', leaderboardScore: 75 },
        { email: 'user8@test.com', firstName: 'User', lastName: 'Eight', leaderboardScore: 400 },
        { email: 'user9@test.com', firstName: 'User', lastName: 'Nine', leaderboardScore: 175 },
        { email: 'user10@test.com', firstName: 'User', lastName: 'Ten', leaderboardScore: 225 },
        { email: 'user11@test.com', firstName: 'User', lastName: 'Eleven', leaderboardScore: 125 },
      ];

      // Create all users
      for (const user of users) {
        await createTestUser(user);
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

      // Verify users have correct structure
      response.body.leaderboard.forEach((user: any) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('firstName');
        expect(user).toHaveProperty('lastName');
        expect(user).toHaveProperty('leaderboardScore');
        expect(user).toHaveProperty('role');
        expect(user).toHaveProperty('auth0Id');
      });
    });

    it('should return all users when less than 10 exist', async () => {
      // Create only 5 users
      const users = [
        { email: 'a@test.com', firstName: 'A', lastName: 'User', leaderboardScore: 100 },
        { email: 'b@test.com', firstName: 'B', lastName: 'User', leaderboardScore: 200 },
        { email: 'c@test.com', firstName: 'C', lastName: 'User', leaderboardScore: 300 },
        { email: 'd@test.com', firstName: 'D', lastName: 'User', leaderboardScore: 50 },
        { email: 'e@test.com', firstName: 'E', lastName: 'User', leaderboardScore: 150 },
      ];

      for (const user of users) {
        await createTestUser(user);
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
        { email: 'same1@test.com', firstName: 'Same', lastName: 'One', leaderboardScore: 100 },
        { email: 'same2@test.com', firstName: 'Same', lastName: 'Two', leaderboardScore: 100 },
        { email: 'same3@test.com', firstName: 'Same', lastName: 'Three', leaderboardScore: 100 },
        { email: 'higher@test.com', firstName: 'Higher', lastName: 'Score', leaderboardScore: 200 },
      ];

      for (const user of users) {
        await createTestUser(user);
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

    it('should include admin users in leaderboard', async () => {
      const adminUser = await createTestUser({
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        leaderboardScore: 1000,
        role: 'admin',
      });

      const regularUser = await createTestUser({
        email: 'regular@test.com',
        firstName: 'Regular',
        lastName: 'User',
        leaderboardScore: 500,
        role: 'user',
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
