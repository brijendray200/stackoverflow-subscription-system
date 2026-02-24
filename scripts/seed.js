require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Question = require('../models/Question');
const Payment = require('../models/Payment');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Question.deleteMany({});
    await Payment.deleteMany({});
    console.log('Cleared existing data');

    // Create test users
    const users = await User.create([
      {
        name: 'Free User',
        email: 'free@test.com',
        password: 'password123',
        plan: 'free'
      },
      {
        name: 'Bronze User',
        email: 'bronze@test.com',
        password: 'password123',
        plan: 'bronze',
        planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'Gold User',
        email: 'gold@test.com',
        password: 'password123',
        plan: 'gold',
        planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log('Created test users:');
    users.forEach(u => console.log(`  - ${u.email} (${u.plan})`));

    // Create sample questions
    await Question.create([
      {
        userId: users[0]._id,
        title: 'How to center a div?',
        content: 'I am trying to center a div element horizontally and vertically.',
        tags: ['css', 'html', 'layout']
      },
      {
        userId: users[1]._id,
        title: 'What is the difference between let and const?',
        content: 'Can someone explain when to use let vs const in JavaScript?',
        tags: ['javascript', 'es6']
      }
    ]);

    console.log('Created sample questions');
    console.log('\nTest credentials:');
    console.log('Free Plan: free@test.com / password123');
    console.log('Bronze Plan: bronze@test.com / password123');
    console.log('Gold Plan: gold@test.com / password123');

    await mongoose.disconnect();
    console.log('\nDatabase seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
