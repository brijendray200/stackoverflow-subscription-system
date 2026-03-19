# 🚀 Deployment Guide - Render + MongoDB Atlas

## Step 1: MongoDB Atlas Setup (Free Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" → Register
3. Create a FREE cluster (M0 - Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/stackoverflow-subscription
   ```
6. Replace `<password>` with your actual password

---

## Step 2: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/stackoverflow-subscription-system.git
git push -u origin main
```

---

## Step 3: Deploy on Render (Free Hosting)

1. Go to https://render.com
2. Sign up with GitHub account
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Fill in settings:
   - **Name**: stackoverflow-subscription-system
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

6. Add Environment Variables (click "Add Environment Variable"):

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://...` (from Atlas) |
| `JWT_SECRET` | `any_random_strong_string_here` |
| `RAZORPAY_KEY_ID` | `rzp_live_xxxxx` |
| `RAZORPAY_KEY_SECRET` | `your_secret` |
| `STRIPE_SECRET_KEY` | `sk_live_xxxxx` |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_xxxxx` |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | `your@gmail.com` |
| `EMAIL_PASSWORD` | `gmail_app_password` |
| `EMAIL_FROM` | `noreply@yourdomain.com` |

7. Click "Create Web Service"
8. Wait 2-3 minutes for deployment
9. Your app will be live at: `https://stackoverflow-subscription-system.onrender.com`

---

## Step 4: Verify Deployment

Open your live URL and test:
- Register a new user
- View subscription plans
- Test payment (10-11 AM IST)
- Post a question

---

## Free Tier Limitations

### Render Free Tier:
- ✅ 750 hours/month
- ✅ Auto-deploy on git push
- ⚠️ Sleeps after 15 min inactivity (first request takes ~30 sec)

### MongoDB Atlas Free Tier:
- ✅ 512 MB storage
- ✅ Shared cluster
- ✅ No credit card required

---

## Custom Domain (Optional)

1. In Render dashboard → Settings → Custom Domains
2. Add your domain
3. Update DNS records as shown

---

## Auto-Deploy Setup

Every time you push to GitHub, Render auto-deploys:
```bash
git add .
git commit -m "Update feature"
git push
# Render auto-deploys in 2-3 minutes!
```
