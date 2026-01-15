# Fix Frontend API URL in Vercel

## Problem

Your frontend (deployed on Vercel) is trying to call:
- ❌ `https://flowtrack-philipguadalquivers-projects.vercel.app/api/auth/login` (wrong - this is the Vercel frontend URL)

Instead of:
- ✅ `https://flowtrack-production.up.railway.app/api/auth/login` (correct - your Railway backend)

## Solution

Set the `VITE_API_URL` environment variable in Vercel to point to your Railway backend.

## Steps to Fix

### Step 1: Go to Vercel Dashboard

1. Go to: https://vercel.com/
2. Sign in to your account
3. Click on your project: **flowtrack** (or whatever your project name is)

### Step 2: Go to Settings → Environment Variables

1. Click on **Settings** tab (top navigation)
2. Click on **Environment Variables** (left sidebar)

### Step 3: Add VITE_API_URL Variable

1. In the **Key** field, enter: `VITE_API_URL`
2. In the **Value** field, enter: `https://flowtrack-production.up.railway.app/api`
   - ⚠️ **Important:** Use `/api` at the end (not `/api/auth/login`)
   - ⚠️ **Important:** No quotes around the value
   - ⚠️ **Important:** Include `https://` at the beginning
3. Select environments: Check **Production**, **Preview**, and **Development** (or just **Production** if you only want it in production)
4. Click **Save**

### Step 4: Redeploy Your Frontend

After adding the environment variable:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **⋯** (three dots) menu
4. Click **Redeploy**
5. Or push a new commit to trigger a new deployment

### Step 5: Verify

After redeployment:

1. Open your Vercel frontend URL in browser
2. Open browser DevTools (F12)
3. Go to **Network** tab
4. Try to login or make an API call
5. Check the network requests - they should now go to:
   - ✅ `https://flowtrack-production.up.railway.app/api/auth/login`

## Environment Variable Format

```
Key: VITE_API_URL
Value: https://flowtrack-production.up.railway.app/api
```

**Important Notes:**
- ✅ Use `VITE_` prefix (required for Vite to expose it to client-side code)
- ✅ Use full URL: `https://flowtrack-production.up.railway.app/api`
- ✅ Include `/api` at the end
- ✅ No quotes around the value
- ✅ No trailing slash after `/api`

## Why This Works

In `client/src/api/axios.js`, the code checks for `VITE_API_URL`:

```javascript
const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || '/api'  // Uses VITE_API_URL in production
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api'  // Development
}
```

When `VITE_API_URL` is set in Vercel:
- ✅ Frontend uses: `https://flowtrack-production.up.railway.app/api`
- ✅ All API calls go to your Railway backend

When `VITE_API_URL` is NOT set:
- ❌ Frontend uses: `/api` (relative path)
- ❌ This makes calls to the same domain (Vercel frontend URL)

## Troubleshooting

### Still seeing wrong URL?

1. **Make sure variable is set correctly:**
   - Key: `VITE_API_URL` (must have `VITE_` prefix)
   - Value: `https://flowtrack-production.up.railway.app/api` (no quotes)

2. **Redeploy after adding variable:**
   - Environment variables are only available after redeployment
   - Old deployments don't have the new variable

3. **Check deployment logs:**
   - Go to **Deployments** → Click on deployment → **Build Logs**
   - Make sure build succeeded

4. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or clear browser cache

### CORS Errors?

If you see CORS errors after fixing the URL:

1. Make sure Railway backend has `CLIENT_URL` set correctly:
   - Go to Railway → Your service → **Variables** tab
   - Check `CLIENT_URL` is set to: `https://flowtrack-philipguadalquivers-projects.vercel.app`
   - No quotes around the value

2. Make sure Railway backend CORS is configured to allow your Vercel domain

## Summary

1. ✅ Add `VITE_API_URL` = `https://flowtrack-production.up.railway.app/api` in Vercel
2. ✅ Redeploy frontend
3. ✅ Verify API calls go to Railway backend
