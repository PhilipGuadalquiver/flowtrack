# FlowTrack Backend

Backend API for FlowTrack project management system.

## Tech Stack

- **Node.js** with **Express**
- **MongoDB** database
- **Prisma** ORM
- **JWT** Authentication
- **RESTful API**

## Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (MongoDB Atlas or local instance)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:

**For Development:**
```bash
cp .env.development .env
# Or manually create .env with development values
```

**For Production:**
```bash
cp .env.production .env
# Update with your production values
```

3. Update `.env` with your database credentials:
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
JWT_SECRET="your-super-secret-jwt-key"
CLIENT_URL="http://localhost:5173"  # For development
```

4. Generate Prisma Client:
```bash
npm run prisma:generate
```

5. Push schema to MongoDB:
```bash
npm run prisma:push
```

**Note:** MongoDB doesn't use migrations like PostgreSQL. Use `prisma db push` to sync your schema.

6. Seed the database (optional, development only):
```bash
npm run prisma:seed
```

## Running the Server

### Development Mode
```bash
npm run dev
# Or
npm run start:dev
```

### Production Mode
```bash
npm start
# Or
npm run start:prod
```

The server will run on `http://localhost:5000` (or your configured PORT)

## Scripts

- `npm run dev` - Start development server with watch mode
- `npm start` - Start production server
- `npm run start:dev` - Start in development mode
- `npm run start:prod` - Start in production mode
- `npm run prisma:push` - Push schema changes to MongoDB
- `npm run prisma:reset` - Reset database (development only)
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:seed` - Seed the database with sample data

## Environment Variables

### Development (.env.development)
- `NODE_ENV=development`
- `PORT=5000`
- `DATABASE_URL` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLIENT_URL` - Frontend URL for CORS

### Production (.env.production)
- `NODE_ENV=production`
- `PORT` - Your production port
- `DATABASE_URL` - Production MongoDB connection string
- `JWT_SECRET` - Strong secret key for JWT tokens
- `CLIENT_URL` - Production frontend URL
- `API_URL` - Production API URL

**Important:** Never commit `.env` files to version control. Update `.env.production` with your actual production values before deploying.

## Database Schema

The database includes the following models:
- **User** - System users with authentication
- **Project** - Projects in the system
- **ProjectMember** - Many-to-many relationship between users and projects
- **Issue** - Tasks, bugs, stories, and epics
- **Sprint** - Development sprints

## API Endpoints

- `GET /api/health` - Health check
- `GET /api` - API information

More endpoints will be added as development progresses.

## Deployment

Before deploying to production:

1. Set `NODE_ENV=production` in your production environment
2. Update all production environment variables in `.env.production`
3. Run `npm run prisma:push` to sync schema with MongoDB
4. Ensure your production MongoDB database is properly configured
5. Set up proper CORS origins in `CLIENT_URL`
6. Use a strong `JWT_SECRET` for production
