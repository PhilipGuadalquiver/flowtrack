# Railway Environment Variables Setup

## Error You're Seeing

```
Missing required environment variables: DATABASE_URL, JWT_SECRET, CLIENT_URL
```

This means your app is running, but Railway doesn't have the required environment variables set.

## Solution: Add Environment Variables in Railway

### Step 1: Go to Railway Variables Tab

1. Open your Railway project: https://railway.app
2. Click on your service (the one that's running)
3. Click on the **Variables** tab (at the top, next to Deployments)

### Step 2: Add Each Environment Variable

Click **+ New Variable** and add each of these:

#### 1. DATABASE_URL
- **Variable:** `DATABASE_URL`
- **Value:** `mongodb+srv://guadalquiverphilip_db_user:tSiNiyoTiaHza1qZ@cluster1.oldbgde.mongodb.net/flowtrack_prod?retryWrites=true&w=majority`
- **Note:** No quotes needed

#### 2. JWT_SECRET
- **Variable:** `JWT_SECRET`
- **Value:** Generate a secure random string (at least 32 characters)
  - Example: `my-super-secret-jwt-key-for-production-2026`
  - **Important:** Use a strong, unique secret for production!
- **Note:** No quotes needed

#### 3. CLIENT_URL
- **Variable:** `CLIENT_URL`
- **Value:** Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
- **Note:** If you haven't deployed frontend yet, use a placeholder: `https://your-frontend.vercel.app`
- **Note:** No quotes needed

#### 4. NODE_ENV (Optional but Recommended)
- **Variable:** `NODE_ENV`
- **Value:** `production`
- **Note:** No quotes needed

#### 5. PORT (Optional - Railway provides this automatically)
- Railway usually sets PORT automatically, but you can set it to `5000` if needed

#### 6. JWT_EXPIRE (Optional)
- **Variable:** `JWT_EXPIRE`
- **Value:** `7d`
- **Note:** No quotes needed

#### 7. API_URL (Optional)
- **Variable:** `API_URL`
- **Value:** Your Railway backend URL (you'll get this after deployment)
- **Note:** This is optional, your app will use the PORT and construct the URL

### Step 3: Save and Redeploy

After adding all variables:
1. Railway will **automatically redeploy** your service
2. OR go to **Deployments** tab → Click **Redeploy**

### Quick Copy-Paste Format (for Railway Raw Editor)

If Railway has a "Raw Editor" option, you can paste this (remove quotes from values):

```
NODE_ENV=production
DATABASE_URL=mongodb+srv://guadalquiverphilip_db_user:tSiNiyoTiaHza1qZ@cluster1.oldbgde.mongodb.net/flowtrack_prod?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-production-key-change-this-to-random-string
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend.vercel.app
```

## Required vs Optional Variables

### Required (must have):
- ✅ `DATABASE_URL`
- ✅ `JWT_SECRET`
- ✅ `CLIENT_URL`

### Optional (nice to have):
- `NODE_ENV` (defaults to development if not set)
- `JWT_EXPIRE` (defaults to "7d")
- `PORT` (Railway provides this automatically)
- `API_URL` (will be constructed from Railway's URL)

## Important Notes

1. **No Quotes:** Railway doesn't need quotes around values
   - ✅ Correct: `DATABASE_URL=mongodb+srv://...`
   - ❌ Wrong: `DATABASE_URL="mongodb+srv://..."`

2. **JWT_SECRET:** Use a strong, random secret for production
   - Generate one using: https://randomkeygen.com/
   - Or use: `openssl rand -base64 32`

3. **CLIENT_URL:** Update this after you deploy your frontend to Vercel

4. **After Adding Variables:** Railway will automatically redeploy

## Expected Result

After adding all required variables and redeploying:
- ✅ No more "Missing required environment variables" error
- ✅ Your backend server starts successfully
- ✅ Database connection works
- ✅ API endpoints are accessible

## Troubleshooting

If you still see errors after adding variables:

1. **Check spelling:** Variable names are case-sensitive
   - ✅ `DATABASE_URL` (correct)
   - ❌ `DATABASE_URL` or `database_url` (wrong)

2. **Check for extra spaces:** Make sure there are no spaces around the `=`
   - ✅ `DATABASE_URL=mongodb+srv://...`
   - ❌ `DATABASE_URL = mongodb+srv://...`

3. **Verify values:** Make sure MongoDB URL is correct
4. **Check deployment logs:** Look at the latest deployment logs after adding variables
