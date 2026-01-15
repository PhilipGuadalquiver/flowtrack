# How to Seed Production Database on Railway

## Problem
You're getting "User not found" errors in production because the database hasn't been seeded with initial users.

## Solution: Seed the Production Database

### Option 1: Using Railway CLI (Recommended)

1. **Install Railway CLI** (if not already installed):
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Link to your project**:
   ```bash
   railway link
   ```
   Select your backend service.

4. **Run the seed command**:
   ```bash
   railway run npm run prisma:seed
   ```

### Option 2: Using Railway Dashboard

1. Go to [Railway Dashboard](https://railway.app)
2. Select your backend service
3. Go to **Deployments** tab
4. Click on the latest deployment
5. Click **View Logs**
6. Click **Shell** tab (or use the terminal icon)
7. Run:
   ```bash
   npm run prisma:seed
   ```

### Option 3: Add Seed to Build Process (Temporary)

⚠️ **Warning:** This will seed on every deployment. Remove after first seed!

1. In Railway, go to your backend service
2. Go to **Settings** → **Build**
3. Add to **Build Command**:
   ```bash
   npm install && npm run prisma:generate && npm run prisma:seed
   ```
4. Redeploy

**Remember to remove the seed command after first deployment!**

## Verify Seeding

After seeding, check the logs. You should see:
```
🌱 Seeding database...
✅ Users created: { admin: 'admin123@sample.com', ... }
✅ Project created: E-Commerce Platform
🎉 Seeding completed!
```

## Default Users Created

After seeding, these users will be available:

- **Admin**: `admin123@sample.com` / Password: `123`
- **Project Manager**: `pm@example.com` / Password: `123`
- **Developer**: `dev@example.com` / Password: `123`

## Important Notes

1. **The seed script deletes all existing data** before seeding
2. **Only run seed in production once** (or when you want to reset data)
3. **Change passwords after first login** in production
4. **The seed script uses password: `123`** - change this in production!

## Update Seed Script for Production

If you want different users/passwords for production:

1. Edit `backend/prisma/seed.js`
2. Update the user emails and passwords
3. Commit and push
4. Run seed again

## Troubleshooting

### "Command not found: prisma"
Make sure Prisma is installed:
```bash
npm install
npm run prisma:generate
```

### "Database connection error"
Check your `DATABASE_URL` environment variable in Railway:
- Go to **Variables** tab
- Verify `DATABASE_URL` is set correctly
- Make sure it points to your MongoDB Atlas cluster

### "Users still not found after seeding"
1. Check Railway logs to see if seed completed successfully
2. Verify the database name in `DATABASE_URL` matches what you expect
3. Check MongoDB Atlas to see if collections were created
4. Try running seed again

