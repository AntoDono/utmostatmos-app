import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function populate() {
  console.log('Starting database population...');

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.tracker.deleteMany();
    await prisma.contest.deleteMany();
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
      {
        id: uuidv4(),
        auth0Id: 'auth0|sample-claire-004',
        email: 'claire@example.com',
        firstName: 'Claire',
        lastName: 'Lee',
        role: 'user',
        leaderboardScore: 175,
      },
      {
        id: uuidv4(),
        auth0Id: 'auth0|sample-daniel-005',
        email: 'daniel@example.com',
        firstName: 'Daniel',
        lastName: 'Kim',
        role: 'user',
        leaderboardScore: 120,
      },
      {
        id: uuidv4(),
        auth0Id: 'auth0|sample-elena-006',
        email: 'elena@example.com',
        firstName: 'Elena',
        lastName: 'Martinez',
        role: 'user',
        leaderboardScore: 185,
      },
      {
        id: uuidv4(),
        auth0Id: 'auth0|sample-fiona-007',
        email: 'fiona@example.com',
        firstName: 'Fiona',
        lastName: 'Wong',
        role: 'user',
        leaderboardScore: 160,
      },
      {
        id: uuidv4(),
        auth0Id: 'auth0|sample-george-008',
        email: 'george@example.com',
        firstName: 'George',
        lastName: 'Brown',
        role: 'user',
        leaderboardScore: 220,
      },
      {
        id: uuidv4(),
        auth0Id: 'auth0|sample-hannah-009',
        email: 'hannah@example.com',
        firstName: 'Hannah',
        lastName: 'Davis',
        role: 'user',
        leaderboardScore: 143,
      },
      {
        id: uuidv4(),
        auth0Id: 'auth0|sample-irene-010',
        email: 'irene@example.com',
        firstName: 'Irene',
        lastName: 'Nguyen',
        role: 'user',
        leaderboardScore: 133,
      }
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
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash']),
        answer: 'Compost',
      },
      {
        id: uuidv4(),
        item: 'plastic bottle',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash']),
        answer: 'Recycling',
      },
      {
        id: uuidv4(),
        item: 'used battery',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash']),
        answer: 'Trash',
      },
      {
        id: uuidv4(),
        item: 'newspaper',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash']),
        answer: 'Recycling',
      },
      {
        id: uuidv4(),
        item: 'apple core',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash']),
        answer: 'Compost',
      },
      {
        id: uuidv4(),
        item: 'broken glass',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash']),
        answer: 'Trash',
      },
      {
        id: uuidv4(),
        item: 'cardboard box',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash']),
        answer: 'Recycling',
      },
      {
        id: uuidv4(),
        item: 'coffee grounds',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash']),
        answer: 'Compost',
      },
      {
        id: uuidv4(),
        item: 'aluminum can',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash']),
        answer: 'Recycling',
      },
      {
        id: uuidv4(),
        item: 'plastic bag',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash']),
        answer: 'Trash',
      },
      {
        id: uuidv4(),
        item: 'egg shells',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash']),
        answer: 'Compost',
      },
      {
        id: uuidv4(),
        item: 'pizza box',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash']),
        answer: 'Compost',
      },
      {
        id: uuidv4(),
        item: 'light bulb',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash']),
        answer: 'Trash',
      },
      {
        id: uuidv4(),
        item: 'tin can',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash']),
        answer: 'Recycling',
      },
      {
        id: uuidv4(),
        item: 'styrofoam',
        choices: JSON.stringify(['Compost', 'Recycling', 'Trash']),
        answer: 'Trash',
      },
    ];

    const createdQuizzes = await Promise.all(
      binQuizzes.map(quiz => prisma.binQuiz.create({ data: quiz }))
    );
    console.log(`Created ${createdQuizzes.length} bin quizzes`);

    // Create Contests
    console.log('Creating contests...');
    const contests = [
      {
        id: uuidv4(),
        title: 'National STEM Video Game Challenge',
        organization: 'Entertainment Software Association',
        scope: 'National',
        grade: '5-12',
        deadline: 'March 20, 2026',
        prize: '$5,000 + Mentorship',
        description: 'Design, build, and showcase your own video game with a focus on STEM learning and environmental awareness. Games should incorporate elements of sustainability, climate science, or ecological conservation.',
        requirements: JSON.stringify([
          'Original game concept',
          'Environmental or STEM theme',
          'Working prototype or demo',
          'Design document (5-10 pages)',
          'Video presentation (3-5 minutes)'
        ]),
      },
      {
        id: uuidv4(),
        title: 'Youth Climate Action Challenge',
        organization: 'Climate Reality Project',
        scope: 'International',
        grade: '9-12',
        deadline: 'April 15, 2026',
        prize: '$10,000 + Summit Attendance',
        description: 'Develop innovative solutions to address climate change in your community. Projects should demonstrate measurable environmental impact and community engagement.',
        requirements: JSON.stringify([
          'Detailed project proposal',
          'Community impact assessment',
          'Implementation timeline',
          'Budget breakdown',
          'Letter of support from local organization'
        ]),
      },
      {
        id: uuidv4(),
        title: 'Eco-Innovation App Competition',
        organization: 'Green Tech Foundation',
        scope: 'National',
        grade: '9-12',
        deadline: 'May 1, 2026',
        prize: '$7,500 + Internship Opportunity',
        description: 'Create a mobile or web application that promotes sustainable living, waste reduction, or environmental education. Apps will be judged on innovation, usability, and potential impact.',
        requirements: JSON.stringify([
          'Functional app prototype',
          'Technical documentation',
          'User testing results',
          'Marketing plan',
          'Demo video (5 minutes)'
        ]),
      },
      {
        id: uuidv4(),
        title: 'Congressional App Challenge',
        organization: 'U.S. House of Representatives',
        scope: 'Congressional District',
        grade: '7-12',
        deadline: 'November 1, 2026',
        prize: 'Congressional Recognition + Tech Package',
        description: 'Develop a mobile, web, or computer application to address a problem or issue in your community. Winners are invited to showcase their apps at the U.S. Capitol.',
        requirements: JSON.stringify([
          'Original source code',
          'Working application',
          'Project description',
          'Video demo (up to 3 minutes)',
          'Team photo (if applicable)'
        ]),
      },
      {
        id: uuidv4(),
        title: 'Regeneron Science Talent Search',
        organization: 'Society for Science',
        scope: 'National',
        grade: '12',
        deadline: 'November 15, 2026',
        prize: 'Up to $250,000 in Scholarships',
        description: 'The nation\'s oldest and most prestigious science and math competition for high school seniors. Conduct independent research on environmental science, sustainability, or related fields.',
        requirements: JSON.stringify([
          'Original research project',
          'Research report (20 pages max)',
          'Online application',
          'Educator recommendation',
          'Transcripts'
        ]),
      },
      {
        id: uuidv4(),
        title: 'Stockholm Junior Water Prize',
        organization: 'Stockholm International Water Institute',
        scope: 'International',
        grade: '9-12',
        deadline: 'March 31, 2026',
        prize: '$15,000 + Trip to Stockholm',
        description: 'Conduct research focused on water-related environmental issues, including water quality, conservation, treatment, or protection of water resources and the environment.',
        requirements: JSON.stringify([
          'Research paper (15 pages max)',
          'Abstract (500 words)',
          'Lab notebook or field notes',
          'Teacher endorsement',
          'Proof of age and enrollment'
        ]),
      },
      {
        id: uuidv4(),
        title: 'Samsung Solve for Tomorrow',
        organization: 'Samsung Electronics America',
        scope: 'National',
        grade: '6-12',
        deadline: 'December 1, 2026',
        prize: '$100,000 + Technology',
        description: 'Use STEM skills to solve real-world problems in your community. Focus on environmental sustainability, waste reduction, or climate solutions.',
        requirements: JSON.stringify([
          'Problem statement',
          'Solution proposal',
          'STEM curriculum alignment',
          'Video pitch (3 minutes)',
          'Teacher sponsor'
        ]),
      },
      {
        id: uuidv4(),
        title: 'Google Science Fair',
        organization: 'Google',
        scope: 'International',
        grade: '7-12',
        deadline: 'January 15, 2027',
        prize: '$50,000 + Mentorship',
        description: 'Online science and engineering competition. Projects related to environmental science, sustainability, and climate action are highly encouraged.',
        requirements: JSON.stringify([
          'Online project submission',
          'Scientific research',
          'Project presentation',
          'Safety and ethics compliance',
          'Parental consent (if under 18)'
        ]),
      },
    ];

    const createdContests = await Promise.all(
      contests.map(contest => prisma.contest.create({ data: contest }))
    );
    console.log(`Created ${createdContests.length} contests`);

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
        type: 'trash',
        name: 'Trash Bin - City Hall',
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
    console.log(`- Contests: ${createdContests.length}`);
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
