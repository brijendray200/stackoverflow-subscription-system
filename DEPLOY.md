# Deployment Guide

## Live URL
**https://stackoverflow-subscriptions-app.netlify.app**

---

## Step 1: MongoDB Atlas Setup (REQUIRED)

1. Go to: https://mongodb.com/cloud/atlas
2. Sign up / Login
3. Click **"Build a Database"** → Choose **FREE (M0)**
4. Select region: **AWS / Mumbai (ap-south-1)** (India ke liye best)
5. Cluster name: `Cluster0` → Click **Create**
6. **Database Access** → Add User:
   - Username: `brijendray200`
   - Password: Generate a strong password (copy it!)
   - Role: `Atlas admin`
7. **Network Access** → Add IP: `0.0.0.0/0` (Allow from anywhere - Netlify ke liye zaroori)
8. **Connect** → **Drivers** → Copy connection string:
   ```
   mongodb+srv://brijendray200:<password>@cluster0.xxxxx.mongodb.net/stackoverflow-subscription?retryWrites=true&w=majority
   ```
   Replace `<password>` with your actual password.

---

## Step 2: Update Netlify Environment Variables

Go to: https://app.netlify.com/projects/stackoverflow-subscriptions-app/configuration/env

Update these variables:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your Atlas connection string from Step 1 |
| `JWT_SECRET` | Any random 32+ char string |
| `RAZORPAY_KEY_ID` | From Razorpay dashboard (optional) |
| `RAZORPAY_KEY_SECRET` | From Razorpay dashboard (optional) |
| `STRIPE_PUBLISHABLE_KEY` | From Stripe dashboard (optional) |
| `STRIPE_SECRET_KEY` | From Stripe dashboard (optional) |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASSWORD` | Gmail App Password (not regular password) |

---

## Step 3: Redeploy

After updating env vars, run:
```bash
netlify deploy --build --prod
```

Or trigger redeploy from Netlify dashboard.

---

## Step 4: Test

```
GET https://stackoverflow-subscriptions-app.netlify.app/api/health
```

Should return:
```json
{
  "status": "OK",
  "dbStatus": "connected"
}
```

---

## Gmail App Password Setup (for email invoices)

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Go to **App Passwords**
4. Select app: **Mail**, device: **Other** → name it "StackOverflow App"
5. Copy the 16-char password → use as `EMAIL_PASSWORD`

---

## Local Development

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env
# Edit .env with your values

# Start server
npm start
# Runs on http://localhost:3001
```
