const express = require('express');
const { createOrder } = require('../config/razorpay');
const { createPaymentIntent } = require('../config/stripe');
const auth = require('../middleware/auth');
const checkPaymentTime = require('../middleware/timeRestriction');
const User = require('../models/User');
const Payment = require('../models/Payment');
const PLANS = require('../config/plans');
const { sendInvoiceEmail } = require('../utils/email');

const router = express.Router();

router.get('/plans', (req, res) => {
  res.json(PLANS);
});

// Stripe Payment Intent
router.post('/create-stripe-payment', auth, checkPaymentTime, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!PLANS[plan] || plan === 'free') {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const planDetails = PLANS[plan];

    // For demo/testing, return simplified response
    // In production, create actual Stripe session
    res.json({
      sessionId: 'demo_session_' + Date.now(),
      amount: planDetails.price,
      plan: planDetails.name,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_demo'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Razorpay Order Creation
router.post('/create-razorpay-order', auth, checkPaymentTime, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!PLANS[plan] || plan === 'free') {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const planDetails = PLANS[plan];

    const order = await createOrder(
      planDetails.price,
      'INR',
      `receipt_${Date.now()}`,
      {
        userId: req.user._id.toString(),
        plan: plan
      }
    );

    res.json({
      orderId: order.id,
      amount: planDetails.price,
      plan: planDetails.name,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Payment Confirmation (works for both Stripe and Razorpay)
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { plan, transactionId, gateway } = req.body;

    if (!PLANS[plan] || plan === 'free') {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const planDetails = PLANS[plan];
    const invoiceNumber = `INV-${Date.now()}-${req.user._id.toString().slice(-6)}`;

    const payment = new Payment({
      userId: req.user._id,
      plan: plan,
      amount: planDetails.price,
      gateway: gateway,
      transactionId: transactionId,
      status: 'success',
      invoiceNumber: invoiceNumber
    });

    await payment.save();

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + planDetails.duration);

    req.user.plan = plan;
    req.user.planExpiry = expiryDate;
    req.user.questionsToday = 0;
    await req.user.save();

    await sendInvoiceEmail(req.user, payment, planDetails);

    res.json({
      message: 'Payment successful! Check your email for invoice.',
      user: {
        plan: req.user.plan,
        planExpiry: req.user.planExpiry
      },
      payment: {
        invoiceNumber: payment.invoiceNumber,
        amount: payment.amount,
        transactionId: payment.transactionId
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
