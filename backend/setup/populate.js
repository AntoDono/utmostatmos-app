import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function populate() {
  console.log('Starting database population...');

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.session.deleteMany();
    await prisma.tracker.deleteMany();
    await prisma.binQuiz.deleteMany();
    await prisma.user.deleteMany();

    // Create Users
    console.log('Creating users...');
    const users = [
      {
        id: uuidv4(),
        email: 'alice@example.com',
        password: 'password123',
        firstName: 'Alice',
        lastName: 'Smith',
        role: 'user',
        emailVerified: true,
        leaderboardScore: 150,
      },
      {
        id: uuidv4(),
        email: 'bob@example.com',
        password: 'password123',
        firstName: 'Bob',
        lastName: 'Johnson',
        role: 'user',
        emailVerified: true,
        leaderboardScore: 200,
      },
      {
        id: uuidv4(),
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        emailVerified: true,
        leaderboardScore: 0,
      },
    ];

    const createdUsers = await Promise.all(
      users.map(user => prisma.user.create({ data: user }))
    );
    console.log(`Created ${createdUsers.length} users`);

    // Create Sessions
    console.log('Creating sessions...');
    const sessions = [
      {
        id: uuidv4(),
        userId: createdUsers[0].id,
        token: uuidv4(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
      {
        id: uuidv4(),
        userId: createdUsers[1].id,
        token: uuidv4(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    ];

    const createdSessions = await Promise.all(
      sessions.map(session => prisma.session.create({ data: session }))
    );
    console.log(`Created ${createdSessions.length} sessions`);

    // Create Bin Quizzes - "Where does this {item} belong to?"
    console.log('Creating bin quizzes...');
    const binQuizzes = [
      {
        id: uuidv4(),
        item: 'banana',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash', 'Donate']),
        answer: 'Compost',
      },
      {
        id: uuidv4(),
        item: 'plastic bottle',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash', 'Donate']),
        answer: 'Recycling',
      },
      {
        id: uuidv4(),
        item: 'used battery',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash', 'Hazardous Waste']),
        answer: 'Hazardous Waste',
      },
      {
        id: uuidv4(),
        item: 'newspaper',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash', 'Donate']),
        answer: 'Recycling',
      },
      {
        id: uuidv4(),
        item: 'apple core',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash', 'Donate']),
        answer: 'Compost',
      },
      {
        id: uuidv4(),
        item: 'broken glass',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash', 'Hazardous Waste']),
        answer: 'Trash',
      },
      {
        id: uuidv4(),
        item: 'cardboard box',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash', 'Donate']),
        answer: 'Recycling',
      },
      {
        id: uuidv4(),
        item: 'coffee grounds',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash', 'Donate']),
        answer: 'Compost',
      },
      {
        id: uuidv4(),
        item: 'aluminum can',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash', 'Donate']),
        answer: 'Recycling',
      },
      {
        id: uuidv4(),
        item: 'plastic bag',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash', 'Donate']),
        answer: 'Trash',
      },
      {
        id: uuidv4(),
        item: 'egg shells',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash', 'Donate']),
        answer: 'Compost',
      },
      {
        id: uuidv4(),
        item: 'pizza box',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash', 'Donate']),
        answer: 'Compost',
      },
      {
        id: uuidv4(),
        item: 'light bulb',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash', 'Hazardous Waste']),
        answer: 'Hazardous Waste',
      },
      {
        id: uuidv4(),
        item: 'tin can',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash', 'Donate']),
        answer: 'Recycling',
      },
      {
        id: uuidv4(),
        item: 'styrofoam',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash', 'Donate']),
        answer: 'Trash',
      },
    ];

    const createdQuizzes = await Promise.all(
      binQuizzes.map(quiz => prisma.binQuiz.create({ data: quiz }))
    );
    console.log(`Created ${createdQuizzes.length} bin quizzes`);

    // Create Trackers
    console.log('Creating trackers...');
    const trackers = [
      {
        id: uuidv4(),
        type: 'recycling',
        name: 'Recycling Bin - Market Street',
        longitude: -122.4194,
        latitude: 37.7749,
      },
      {
        id: uuidv4(),
        type: 'compost',
        name: 'Compost Bin - Golden Gate Park',
        longitude: -122.4833,
        latitude: 37.7694,
      },
      {
        id: uuidv4(),
        type: 'recycling',
        name: 'Recycling Bin - Union Square',
        longitude: -122.4083,
        latitude: 37.7879,
      },
      {
        id: uuidv4(),
        type: 'trash',
        name: 'Trash Bin - Fisherman\'s Wharf',
        longitude: -122.4194,
        latitude: 37.8081,
      },
      {
        id: uuidv4(),
        type: 'compost',
        name: 'Compost Bin - Mission District',
        longitude: -122.4194,
        latitude: 37.7599,
      },
      {
        id: uuidv4(),
        type: 'recycling',
        name: 'Recycling Bin - Castro District',
        longitude: -122.4350,
        latitude: 37.7600,
      },
      {
        id: uuidv4(),
        type: 'hazardous',
        name: 'Hazardous Waste Drop-off - City Hall',
        longitude: -122.4194,
        latitude: 37.7799,
      },
      {
        id: uuidv4(),
        type: 'recycling',
        name: 'Recycling Bin - Embarcadero',
        longitude: -122.3958,
        latitude: 37.7955,
      },
      {
        id: uuidv4(),
        type: 'compost',
        name: 'Compost Bin - Haight-Ashbury',
        longitude: -122.4469,
        latitude: 37.7699,
      },
      {
        id: uuidv4(),
        type: 'recycling',
        name: 'Recycling Bin - North Beach',
        longitude: -122.4102,
        latitude: 37.8024,
      },
    ];

    const createdTrackers = await Promise.all(
      trackers.map(tracker => prisma.tracker.create({ data: tracker }))
    );
    console.log(`Created ${createdTrackers.length} trackers`);

    console.log('\n✅ Database population completed successfully!');
    console.log(`\nSummary:`);
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Sessions: ${createdSessions.length}`);
    console.log(`- Bin Quizzes: ${createdQuizzes.length}`);
    console.log(`- Trackers: ${createdTrackers.length}`);

  } catch (error) {
    console.error('Error populating database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

populate()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

