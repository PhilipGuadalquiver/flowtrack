# Vercel Deployment Guide for FlowTrack

This guide will help you deploy your FlowTrack application to Vercel.

## Architecture Options

You have two main options for deployment:

### Option 1: Frontend on Vercel + Backend on Separate Platform (Recommended)
- **Frontend**: Deploy React app to Vercel
- **Backend**: Deploy Express API to Railway, Render, or Fly.io
- **Database**: MongoDB Atlas (already configured)

### Option 2: Full-stack on Vercel (Serverless Functions)
- Convert Express routes to Vercel serverless functions
- More complex but keeps everything on one platform

This guide focuses on **Option 1** as it's simpler and recommended for Express servers.

---

## Step 1: Deploy Frontend to Vercel

### 1.1 Install Vercel CLI (Optional but Recommended)
```bash
npm i -g vercel
```

### 1.2 Create `vercel.json` Configuration
Create a `vercel.json` file in the **root** of your project:

```json
{
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "devCommand": "cd client && npm run dev",
  "installCommand": "cd client && npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 1.3 Set Up Frontend Environment Variables
Before deploying, you'll need to set these in Vercel:

1. Go to your project on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - `VITE_API_URL` = Your backend API URL (e.g., `https://your-backend.railway.app` or `https://your-backend.onrender.com`)

### 1.4 Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository: `PhilipGuadalquiver/flowtrack`
4. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables (see 1.3)
6. Click **Deploy**

### 1.5 Or Deploy via CLI
```bash
# Login to Vercel
vercel login

# Navigate to client directory
cd client

# Deploy
vercel

# Follow the prompts
```

---

## Step 2: Deploy Backend to Railway (Recommended)

Railway is great for Node.js/Express apps with MongoDB.

### 2.1 Set Up Railway
1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your repository: `PhilipGuadalquiver/flowtrack`
5. Select **Root Directory**: `backend`

### 2.2 Configure Environment Variables on Railway
In Railway dashboard, go to **Variables** tab and add:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
JWT_EXIRE=7d
CLIENT_URL=https://your-vercel-app.vercel.app
API_URL=https://your-railway-app.railway.app
```

### 2.3 Create `Procfile` for Railway
Create `backend/Procfile`:
```
web: node src/server.js
```

### 2.4 Update `package.json` Scripts (Optional)
Railway will automatically run `npm start`, which is already configured.

### 2.5 Deploy
Railway will automatically deploy when you push to GitHub.

---

## Step 3: Deploy Backend to Render (Alternative)

### 3.1 Set Up Render
1. Go to [render.com](https://render.com)
2. Sign up/login
3. Click **New** → **Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Name**: flowtrack-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install && npm run prisma:generate`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `backend`

### 3.2 Set Environment Variables on Render
Add all environment variables in the Render dashboard (same as Railway).

---

## Step 4: Update Frontend API URL

After your backend is deployed, update the frontend environment variable:

1. Go to Vercel dashboard
2. Navigate to your project → **Settings** → **Environment Variables**
3. Update `VITE_API_URL` with your backend URL
4. Redeploy the frontend

---

## Step 5: Prisma Setup for Production

Your backend needs to generate Prisma Client before starting. Add to `backend/package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma db push",
    "start": "node src/server.js",
    "postinstall": "prisma generate"
  }
}
```

This ensures Prisma Client is generated during deployment.

---

## Important Notes

1. **MongoDB Atlas**: Make sure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) or specifically from Railway/Render IPs.

2. **CORS**: Your backend CORS is already configured to accept your frontend URL.

3. **Environment Variables**: Never commit `.env` files. Always use platform environment variables.

4. **Database Migrations**: Run Prisma migrations manually or use `prisma db push` in your deployment script.

5. **Seed Data**: If you need to seed data, run it manually after first deployment:
   ```bash
   cd backend && npm run prisma:seed
   ```

---

## Troubleshooting

### Backend won't start
- Check that all environment variables are set
- Verify MongoDB connection string
- Check build logs for Prisma generation errors

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS settings on backend
- Verify backend is running (check health endpoint)

### Prisma errors
- Ensure `prisma generate` runs before `npm start`
- Check DATABASE_URL is correct
- Verify MongoDB cluster is accessible

---

## Quick Deployment Checklist

- [ ] Backend deployed to Railway/Render
- [ ] Backend environment variables configured
- [ ] Backend health check passes
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables configured
- [ ] `VITE_API_URL` points to backend
- [ ] CORS allows frontend domain
- [ ] MongoDB Atlas allows connections
- [ ] Test login functionality
- [ ] Test API endpoints

---

## Example URLs After Deployment

- **Frontend**: `https://flowtrack.vercel.app`
- **Backend**: `https://flowtrack-backend.railway.app`
- **API Health**: `https://flowtrack-backend.railway.app/api/health`

Good luck with your deployment! 🚀
