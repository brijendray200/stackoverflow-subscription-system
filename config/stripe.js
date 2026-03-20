const createPaymentIntent = async (amount, currency, metadata) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency.toLowerCase(),
      metadata: metadata,
      automatic_payment_methods: { enabled: true },
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(`Stripe error: ${error.message}`);
  }
};

module.exports = { createPaymentIntent };
