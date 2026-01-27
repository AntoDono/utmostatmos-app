import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function populate() {
  console.log('Starting database population...');

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.tracker.deleteMany();
    await prisma.binQuiz.deleteMany();
    await prisma.user.deleteMany();

    // Create Users (with Auth0 IDs - these would be real Auth0 IDs in production)
    console.log('Creating sample users...');
    const users = [
      {
        id: uuidv4(),
        auth0Id: 'auth0|sample-alice-001',
        email: 'alice@example.com',
        firstName: 'Alice',
        lastName: 'Smith',
        role: 'user',
        leaderboardScore: 150,
      },
      {
        id: uuidv4(),
        auth0Id: 'auth0|sample-bob-002',
        email: 'bob@example.com',
        firstName: 'Bob',
        lastName: 'Johnson',
        role: 'user',
        leaderboardScore: 200,
      },
      {
        id: uuidv4(),
        auth0Id: 'auth0|sample-admin-003',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        leaderboardScore: 0,
      },
    ];

    const createdUsers = await Promise.all(
      users.map(user => prisma.user.create({ data: user }))
    );
    console.log(`Created ${createdUsers.length} users`);

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
    console.log(`- Users: ${createdUsers.length} (sample Auth0 users for testing)`);
    console.log(`- Bin Quizzes: ${createdQuizzes.length}`);
    console.log(`- Trackers: ${createdTrackers.length}`);
    console.log(`\nNote: Real users will be created automatically when they log in via Auth0.`);

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
