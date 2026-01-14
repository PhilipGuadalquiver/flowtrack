# Railway Build Failed - Fix Guide

## Problem
Railway failed with error: "Railpack could not determine how to build the app" and "The following languages are supported: Php"

This happened because Railway couldn't detect your Node.js backend.

## Solution

### Step 1: Configure Root Directory in Railway

1. Go to your Railway project dashboard
2. Click on **Settings** tab
3. Find **Root Directory** setting
4. Set it to: `backend`
5. Save the changes

### Step 2: Configure Build Command (Optional but Recommended)

Railway will automatically:
- Run `npm install`
- Run `npm run build` (if exists)
- Run `npm start`

I've already added:
- `"build": "prisma generate"` - Generates Prisma Client
- `"postinstall": "prisma generate"` - Runs after npm install

### Step 3: Verify Configuration

In Railway Settings, you should have:

**Root Directory:** `backend`

**Build Command (optional):** Leave empty (uses npm scripts)

**Start Command (optional):** Leave empty (uses npm start)

### Step 4: Redeploy

After saving the settings:
1. Railway will automatically trigger a new deployment
2. Or click **Deployments** → **Redeploy**

## What I Fixed in Your Code

1. ✅ Added `Procfile` in `backend/` directory
2. ✅ Added `"build": "prisma generate"` script
3. ✅ Added `"postinstall": "prisma generate"` script

## Expected Build Process

After fixing:
1. Railway detects Node.js (because of package.json in backend/)
2. Runs `npm install`
3. Runs `prisma generate` (postinstall script)
4. Runs `npm start`
5. Your server starts on the PORT Railway provides

## Still Having Issues?

If build still fails, check:
- ✅ Root Directory is set to `backend`
- ✅ Environment variables are set correctly
- ✅ DATABASE_URL is valid
- ✅ Check build logs for specific errors
