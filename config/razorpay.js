const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (amount, currency, receipt, notes) => {
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: currency,
      receipt: receipt,
      notes: notes
    });

    return order;
  } catch (error) {
    throw new Error(`Razorpay error: ${error.message}`);
  }
};

const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const text = `${orderId}|${paymentId}`;
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');

  return generated_signature === signature;
};

module.exports = {
  razorpay,
  createOrder,
  verifyPaymentSignature
};
