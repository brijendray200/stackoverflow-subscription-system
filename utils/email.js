const nodemailer = require('nodemailer');
const { generateInvoiceHTML } = require('./invoiceGenerator');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendInvoiceEmail = async (user, payment, plan) => {
  const emailContent = generateInvoiceHTML(user, payment, plan);

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: user.email,
    subject: `✓ Payment Successful - ${plan.name} Subscription - Invoice ${payment.invoiceNumber}`,
    html: emailContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✓ Invoice email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('✗ Error sending email:', error.message);
    return false;
  }
};

module.exports = { sendInvoiceEmail };
