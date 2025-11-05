import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Setup: Clear database before all tests
beforeAll(async () => {
  // Use test database if specified, otherwise use dev database
  // You can set TEST_DATABASE_URL in your .env for tests
  await prisma.$connect();
});

// Cleanup: Disconnect Prisma after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Clean database before each test
beforeEach(async () => {
  await prisma.session.deleteMany();
  await prisma.tracker.deleteMany();
  await prisma.binQuiz.deleteMany();
  await prisma.user.deleteMany();
});

