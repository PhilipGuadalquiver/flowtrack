# Quick Guide: Seed Database on Railway

## The Problem
Your production database is empty - no users exist. That's why you're getting "User not found" errors.

## Quick Solution (3 Steps)

### Step 1: Open Railway Shell
1. Go to [Railway Dashboard](https://railway.app)
2. Click on your **backend service**
3. Click on the **latest deployment** (top of the page)
4. Click **View Logs** button
5. Look for a **Shell** or **Terminal** button/tab (usually at the top right of the logs view)

### Step 2: Run Seed Command
In the Railway shell, type:
```bash
npm run prisma:seed
```

### Step 3: Wait for Completion
You should see output like:
```
🌱 Seeding database...
✅ Users created: { admin: 'admin123@sample.com', ... }
✅ Project created: E-Commerce Platform
🎉 Seeding completed!
```

## Alternative: If Shell Not Available

### Option A: Use Railway CLI
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project (select your backend service)
railway link

# Run seed
railway run npm run prisma:seed
```

### Option B: Add to Build Command (Temporary)
⚠️ **Only do this once, then remove it!**

1. In Railway, go to your backend service
2. Go to **Settings** → **Deploy**
3. Find **Build Command**
4. Change it to:
   ```bash
   npm install && npm run prisma:generate && npm run prisma:seed
   ```
5. Click **Save**
6. Railway will redeploy and seed automatically
7. **IMPORTANT:** After first deployment, change Build Command back to:
   ```bash
   npm install && npm run prisma:generate
   ```

## Verify It Worked

After seeding, check the logs. On next server start, you should see:
```
✅ Database connected successfully
📊 Database name: flowtrack
👥 Users in database: 3
```

And when you try to login with `admin123@sample.com`, it should work!

## Default Login Credentials

After seeding:
- **Email:** `admin123@sample.com`
- **Password:** `123`

⚠️ **Change the password after first login in production!**

