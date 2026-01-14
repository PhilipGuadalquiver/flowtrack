# Environment Setup Guide

## Quick Setup

Run this command to automatically create all environment files:

```bash
npm run setup:env
```

This will create:
- `.env` - Default development environment
- `.env.development` - Development environment
- `.env.production` - Production environment (template)

## Manual Setup

### Option 1: Copy from template

```bash
# Copy the template
cp env.template .env

# Then edit .env with your settings
```

### Option 2: Create manually

Create a `.env` file in the `backend` folder with the following content:

```env
# Environment Configuration
NODE_ENV=development

# Database (MongoDB)
DATABASE_URL="mongodb+srv://guadalquiverphilip_db_user:tSiNiyoTiaHza1qZ@cluster1.oldbgde.mongodb.net/flowtrack?retryWrites=true&w=majority"

# JWT
JWT_SECRET="dev-secret-key-change-in-production"
JWT_EXPIRE="7d"

# Server
PORT=5000

# CORS
CLIENT_URL="http://localhost:5173"

# API
API_URL="http://localhost:5000"
```

## Environment Variables Explained

### Development (.env or .env.development)

- `NODE_ENV` - Set to "development" for dev mode
- `DATABASE_URL` - Your MongoDB connection string (already configured)
- `JWT_SECRET` - Secret key for JWT tokens (change in production)
- `JWT_EXPIRE` - Token expiration time (e.g., "7d" for 7 days)
- `PORT` - Server port (default: 5000)
- `CLIENT_URL` - Frontend URL for CORS
- `API_URL` - Backend API URL

### Production (.env.production)

Update these values for production:
- `DATABASE_URL` - Production MongoDB database
- `JWT_SECRET` - **Strong random secret** (use a password generator)
- `CLIENT_URL` - Your production frontend domain
- `API_URL` - Your production API domain

## Next Steps After Setup

1. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

2. **Push schema to MongoDB:**
   ```bash
   npm run prisma:push
   ```

3. **Seed database (optional):**
   ```bash
   npm run prisma:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Security Notes

⚠️ **Important:**
- Never commit `.env` files to version control
- Use different `JWT_SECRET` for production
- Update `DATABASE_URL` for production database
- The `.env` file is already in `.gitignore`
