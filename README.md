# StackOverflow Subscription System

A complete subscription-based question posting system with payment gateway integration (Stripe & Razorpay), time-restricted payments, and automated email invoicing.

## 🚀 SERVER IS RUNNING!

Your server is live at: **http://localhost:3001**

### 🎯 Quick Start (Click These URLs):

1. **Test Page** (Start here!): http://localhost:3001/test.html
2. **Main App**: http://localhost:3001
3. **Admin Dashboard**: http://localhost:3001/admin.html

### 📖 Documentation:
- **[START_HERE.md](START_HERE.md)** ← Read this first!
- **[WORKING_GUIDE.md](WORKING_GUIDE.md)** - Complete usage guide
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Fix any errors
- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup

---

## 🎯 Kya Bana Hai (What's Built)

Ek complete system jisme:
- ✅ User registration aur login
- ✅ 4 subscription plans (Free, Bronze ₹100, Silver ₹300, Gold ₹1000)
- ✅ Razorpay aur Stripe payment integration
- ✅ Payment sirf 10-11 AM IST mein allowed
- ✅ Automatic email invoice
- ✅ Daily question posting limits
- ✅ Beautiful responsive UI
- ✅ Admin dashboard

## 🚀 Kaise Chalaye (Quick Start)

### Windows Users
```bash
# Bas double-click karo
START.bat
```

### Command Line
```bash
# 1. Dependencies install karo
npm install

# 2. .env file configure karo (MongoDB, Razorpay, Email)

# 3. Server start karo
npm start

# 4. Browser mein kholo
http://localhost:3001
```

### Test with Seed Data (Recommended)
```bash
npm run seed
```
Creates test accounts:
- free@test.com / password123
- bronze@test.com / password123
- gold@test.com / password123

## Features

- **4 Subscription Plans:**
  - Free: 1 question/day (₹0)
  - Bronze: 5 questions/day (₹100/month)
  - Silver: 10 questions/day (₹300/month)
  - Gold: Unlimited questions (₹1000/month)

- **Payment Gateways:** Stripe & Razorpay integration
- **Time Restriction:** Payments only allowed 10:00-11:00 AM IST
- **Email Invoicing:** Automatic invoice email after successful payment
- **Daily Limits:** Question posting limits based on subscription plan
- **User Authentication:** JWT-based secure authentication

## 📁 Project Structure

```
├── config/           # Plans, Razorpay, Stripe config
├── middleware/       # Auth, time restriction, error handling
├── models/           # User, Payment, Question models
├── routes/           # API endpoints
├── utils/            # Email, invoice generator
├── public/           # Frontend (HTML, CSS, JS)
├── scripts/          # Database seeder
└── server.js         # Main server
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required configurations:
- MongoDB connection string
- JWT secret key
- Stripe API keys (get from https://stripe.com)
- Razorpay API keys (get from https://razorpay.com)
- Email SMTP settings (Gmail example provided)

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Run the Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

### 5. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## 💳 Testing Payments

### Razorpay Test Card
```
Card: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
```

### Stripe Test Card
```
Card: 4242 4242 4242 4242
CVV: 123
Expiry: 12/25
```

## 🧪 Test with Seed Data

```bash
npm run seed
```

Creates test accounts:
- free@test.com / password123 (Free Plan)
- bronze@test.com / password123 (Bronze Plan)
- gold@test.com / password123 (Gold Plan)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Subscription
- `GET /api/subscription/plans` - Get all plans
- `POST /api/subscription/create-razorpay-order` - Create Razorpay order
- `POST /api/subscription/create-stripe-payment` - Create Stripe payment intent
- `POST /api/subscription/confirm-payment` - Confirm payment and activate plan

### Questions
- `POST /api/questions` - Post a new question
- `GET /api/questions` - Get user's questions

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/payments` - Payment history

## Testing Payment Time Restriction

The system only allows payments between 10:00-11:00 AM IST. To test:

1. Try making a payment outside this window - you'll get an error
2. For testing purposes, you can temporarily modify `middleware/timeRestriction.js`

## 📚 Documentation

- **QUICK_START.md** - 5-minute setup guide
- **SETUP.md** - Detailed installation steps
- **HOW_TO_USE.md** - Complete usage guide
- **FEATURES.md** - Full feature list
- **PROJECT_SUMMARY.md** - Complete overview

## Email Configuration

For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in EMAIL_PASSWORD

## Payment Gateway Setup

### Razorpay
1. Sign up at https://razorpay.com
2. Get your Key ID and Key Secret from Dashboard
3. Add to .env file

### Stripe
1. Sign up at https://stripe.com
2. Get your API keys from Dashboard
3. Add to .env file

## Notes

- Payment window is strictly enforced (10-11 AM IST)
- Daily question limits reset at midnight
- Plan expiry is automatically checked
- Invoice emails are sent after successful payment
- Both Stripe and Razorpay are supported

## 🎯 All Requirements Met

✅ Free Plan: 1 question/day
✅ Bronze Plan: ₹100/month, 5 questions/day
✅ Silver Plan: ₹300/month, 10 questions/day
✅ Gold Plan: ₹1000/month, unlimited questions
✅ Payment time restriction: 10-11 AM IST only
✅ Email invoice after payment
✅ Dual payment gateway (Razorpay + Stripe)

**Sab kuch complete hai! 🎉**
# stackoverflow-subscription-system
