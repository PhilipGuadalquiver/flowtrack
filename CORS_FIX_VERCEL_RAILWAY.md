# Fix CORS Error: Vercel Frontend → Railway Backend

## Problem

You're seeing this error:
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://flowtrack-production.up.railway.app/auth/login. (Reason: CORS header 'Access-Control-Allow-Origin' does not match 'https://flowtrack-philipguadalquivers-projects.vercel.app').
```

## Issues to Fix

1. **CORS Configuration:** Railway backend needs `CLIENT_URL` set to your Vercel frontend URL
2. **Missing `/api` in URL:** Request goes to `/auth/login` instead of `/api/auth/login` (check `VITE_API_URL` in Vercel)

## Solution

### Step 1: Fix Railway Backend - Set CLIENT_URL

1. Go to Railway: https://railway.app/
2. Sign in → Click on your project
3. Click on your **backend service**
4. Go to **Variables** tab
5. Find or add `CLIENT_URL`:
   - **Key:** `CLIENT_URL`
   - **Value:** `https://flowtrack-philipguadalquivers-projects.vercel.app`
     - ⚠️ **No quotes** around the value
     - ⚠️ **No trailing slash** at the end
     - ⚠️ Use **https** (not http)
6. Click **Save** or **Add**
7. Railway will automatically redeploy

### Step 2: Fix Vercel Frontend - Check VITE_API_URL

The error shows the request goes to `/auth/login` instead of `/api/auth/login`, which means `VITE_API_URL` might be missing `/api`.

1. Go to Vercel: https://vercel.com/
2. Sign in → Click on your project
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL`
5. **Make sure the value is:**
   - `https://flowtrack-production.up.railway.app/api`
   - ⚠️ Must include `/api` at the end
   - ⚠️ No quotes around the value
6. If you need to update it:
   - Click **Edit**
   - Change value to: `https://flowtrack-production.up.railway.app/api`
   - Click **Save**
7. **Redeploy** your frontend:
   - Go to **Deployments** tab
   - Click **⋯** on latest deployment
   - Click **Redeploy**

### Step 3: Verify Both Environment Variables

**In Railway (Backend):**
```
CLIENT_URL = https://flowtrack-philipguadalquivers-projects.vercel.app
```
- No quotes
- No trailing slash
- Full URL with https

**In Vercel (Frontend):**
```
VITE_API_URL = https://flowtrack-production.up.railway.app/api
```
- No quotes
- Include `/api` at the end
- Full URL with https

### Step 4: Wait for Redeployment

- Railway redeploys automatically after changing variables
- Vercel needs manual redeploy after changing variables
- Wait 1-2 minutes for both to finish

### Step 5: Test

1. Open your Vercel frontend in browser
2. Open DevTools (F12) → **Network** tab
3. Try to login
4. Check the request:
   - ✅ URL should be: `https://flowtrack-production.up.railway.app/api/auth/login`
   - ✅ No CORS errors
   - ✅ Status should be 200 (success)

## How CORS Works in This Project

In `backend/src/server.js`, CORS is configured like this:

```javascript
const corsOptions = {
  origin: config.isDevelopment 
    ? true  // Allow all origins in development
    : config.clientUrl,  // Only allow configured origin in production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

This means:
- **In production:** Only allows requests from `CLIENT_URL`
- **If `CLIENT_URL` is wrong/missing:** CORS blocks the request
- **Frontend URL must match `CLIENT_URL` exactly:** `https://flowtrack-philipguadalquivers-projects.vercel.app`

## Troubleshooting

### Still seeing CORS errors?

1. **Check Railway logs:**
   - Go to Railway → Your service → **Deployments** → Latest deployment → **View Logs**
   - Check if `CLIENT_URL` is being read correctly
   - Look for any errors

2. **Verify CLIENT_URL format:**
   - Must be: `https://flowtrack-philipguadalquivers-projects.vercel.app`
   - No quotes
   - No trailing slash
   - Exact match with your Vercel URL

3. **Check Vercel URL:**
   - Make sure you're using the correct Vercel domain
   - If you have a custom domain, use that instead
   - You can find it in Vercel → Settings → Domains

4. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or clear browser cache

### Still seeing wrong URL (missing `/api`)?

1. **Check VITE_API_URL in Vercel:**
   - Must be: `https://flowtrack-production.up.railway.app/api`
   - Include `/api` at the end

2. **Redeploy Vercel:**
   - Environment variables only apply to new deployments
   - Old deployments don't have the new variable

3. **Check browser DevTools:**
   - Network tab → Check the request URL
   - Should be: `https://flowtrack-production.up.railway.app/api/auth/login`

## Summary

1. ✅ Set `CLIENT_URL` in Railway to: `https://flowtrack-philipguadalquivers-projects.vercel.app`
2. ✅ Set `VITE_API_URL` in Vercel to: `https://flowtrack-production.up.railway.app/api`
3. ✅ Redeploy both services
4. ✅ Test and verify

After fixing both, CORS errors should be resolved!
