const PLANS = {
  free: {
    name: 'Free Plan',
    price: 0,
    currency: 'INR',
    questionsPerDay: 1,
    duration: null
  },
  bronze: {
    name: 'Bronze Plan',
    price: 100,
    currency: 'INR',
    questionsPerDay: 5,
    duration: 30 // days
  },
  silver: {
    name: 'Silver Plan',
    price: 300,
    currency: 'INR',
    questionsPerDay: 10,
    duration: 30
  },
  gold: {
    name: 'Gold Plan',
    price: 1000,
    currency: 'INR',
    questionsPerDay: Infinity,
    duration: 30
  }
};

module.exports = PLANS;
