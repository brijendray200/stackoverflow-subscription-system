const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Question = require('../models/Question');

const router = express.Router();

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPayments = await Payment.countDocuments({ status: 'success' });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalQuestions = await Question.countDocuments();

    const planDistribution = await User.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalPayments,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalQuestions,
      planDistribution
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent payments
router.get('/payments', auth, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
