const express = require('express');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const cors = require('cors');

const authRoutes = require('../../routes/auth');
const subscriptionRoutes = require('../../routes/subscription');
const questionRoutes = require('../../routes/question');
const adminRoutes = require('../../routes/admin');
const errorHandler = require('../../middleware/errorHandler');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminRoutes);
app.use(errorHandler);

module.exports.handler = serverless(app);
