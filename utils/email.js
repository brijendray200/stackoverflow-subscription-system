const nodemailer = require('nodemailer');
const { generateInvoiceHTML } = require('./invoiceGenerator');

const getTransporter = () => nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendInvoiceEmail = async (user, payment, plan) => {
  try {
    const emailContent = generateInvoiceHTML(user, payment, plan);
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: `✓ Payment Successful - ${plan.name} Subscription - Invoice ${payment.invoiceNumber}`,
      html: emailContent
    });
    console.log('✓ Invoice email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('✗ Error sending email:', error.message);
    return false;
  }
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'https://stackoverflow-sub-app.vercel.app'}?token=${resetToken}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f48024, #d97316); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🔐 Password Reset</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e4e6e8; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px; color: #232629;">Hi <strong>${user.name}</strong>,</p>
        <p style="color: #555; line-height: 1.6;">We received a request to reset your password. Click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #f48024; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #9fa6ad; font-size: 14px;">This link expires in <strong>1 hour</strong>. If you didn't request this, ignore this email.</p>
      </div>
    </div>
  `;
  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: '🔐 Password Reset Request',
      html
    });
    console.log('✓ Password reset email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('✗ Error sending reset email:', error.message);
    return false;
  }
};

module.exports = { sendInvoiceEmail, sendPasswordResetEmail };
