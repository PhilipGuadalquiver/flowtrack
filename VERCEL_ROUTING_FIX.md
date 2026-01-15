# Fix 404 Errors on Vercel - Routing Configuration

## Problem
Getting 404 errors when accessing routes like `/login` directly on Vercel.

## Solution

### Step 1: Verify Vercel Project Settings

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project: **flowtrack**
3. Go to **Settings** → **General**
4. Check **Root Directory**:
   - ✅ Should be set to `client` (if deploying only frontend)
   - ✅ Or leave empty if using root `vercel.json`

### Step 2: Verify vercel.json Location

**If Root Directory is `client`:**
- ✅ `client/vercel.json` should exist (it does)
- ❌ Root `vercel.json` will be ignored

**If Root Directory is empty (root):**
- ✅ Root `vercel.json` should exist (it does)
- ❌ `client/vercel.json` will be ignored

### Step 3: Current Configuration

We have both files:
- `vercel.json` (root) - for root directory setup
- `client/vercel.json` - for client directory setup

Both contain:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 4: Force Redeploy

After verifying settings:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **⋯** (three dots) → **Redeploy**
4. Make sure to select **Use existing Build Cache** = OFF (to force rebuild)
5. Click **Redeploy**

### Step 5: Alternative - Update Vercel Settings

If rewrites still don't work, try updating Vercel project settings:

1. Go to **Settings** → **General**
2. **Framework Preset**: Should be `Vite` or `Other`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`
6. **Root Directory**: `client` (if deploying frontend only)

### Step 6: Verify Build Output

After deployment, check:

1. Go to deployment → **View Function Logs**
2. Check if build completed successfully
3. Verify `dist/index.html` exists in build output

### Step 7: Test

After redeployment:
- ✅ `https://your-app.vercel.app/` should work
- ✅ `https://your-app.vercel.app/login` should work (not 404)
- ✅ `https://your-app.vercel.app/projects` should work

## Troubleshooting

### If still getting 404:

1. **Check Vercel Build Logs**:
   - Look for errors during build
   - Verify `dist` folder is created

2. **Check Network Tab**:
   - Open DevTools → Network
   - Try accessing `/login`
   - See what file is being requested

3. **Try accessing root first**:
   - Go to `https://your-app.vercel.app/`
   - Then navigate to `/login` via React Router
   - If this works but direct URL doesn't, it's definitely a routing issue

4. **Contact Vercel Support**:
   - If configuration is correct but still not working
   - Vercel support can check project-specific settings

## Current Status

✅ `vercel.json` files are in place
✅ Rewrites configuration is correct
⏳ Waiting for Vercel to redeploy with new configuration

