const express = require('express');
const auth = require('../middleware/auth');
const Question = require('../models/Question');
const PLANS = require('../config/plans');

const router = express.Router();

const checkQuestionLimit = async (user) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!user.lastQuestionDate || user.lastQuestionDate < today) {
    user.questionsToday = 0;
    user.lastQuestionDate = new Date();
  }

  if (user.planExpiry && user.planExpiry < new Date()) {
    user.plan = 'free';
    user.planExpiry = null;
  }

  const planDetails = PLANS[user.plan];
  const limit = planDetails.questionsPerDay;

  if (user.questionsToday >= limit) {
    return { allowed: false, limit, current: user.questionsToday };
  }

  return { allowed: true, limit, current: user.questionsToday };
};

router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const limitCheck = await checkQuestionLimit(req.user);

    if (!limitCheck.allowed) {
      return res.status(403).json({
        error: 'Daily question limit reached',
        message: `Your ${PLANS[req.user.plan].name} allows ${limitCheck.limit} questions per day. You've posted ${limitCheck.current} today.`,
        upgrade: 'Consider upgrading your plan for more questions.'
      });
    }

    const question = new Question({
      userId: req.user._id,
      title,
      content,
      tags: tags || []
    });

    await question.save();

    req.user.questionsToday += 1;
    await req.user.save();

    res.status(201).json({
      message: 'Question posted successfully',
      question,
      remaining: limitCheck.limit === Infinity ? 'Unlimited' : limitCheck.limit - req.user.questionsToday
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const questions = await Question.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      questions,
      plan: req.user.plan,
      questionsToday: req.user.questionsToday,
      limit: PLANS[req.user.plan].questionsPerDay
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
