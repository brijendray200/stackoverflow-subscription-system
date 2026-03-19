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
  if (isConnected && mongoose.connection.readyState === 1) return;
  
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    isConnected = false;
    throw err;
  }
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err.message);
    return res.status(503).json({ 
      error: 'Database connection failed', 
      message: 'Please check MONGODB_URI environment variable in Netlify settings',
      details: err.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminRoutes);
app.use(errorHandler);

module.exports.handler = serverless(app);
