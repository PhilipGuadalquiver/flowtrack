import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import config from './config/env.js'
import { connectDB } from './config/database.js'
import authRoutes from './routes/auth.routes.js'
import projectsRoutes from './routes/projects.routes.js'
import issuesRoutes from './routes/issues.routes.js'
import usersRoutes from './routes/users.routes.js'
import commentsRoutes from './routes/comments.routes.js'

const app = express()
const prisma = new PrismaClient()

// Initialize database connection
let dbConnected = false

const initializeServer = async () => {
  try {
    // Connect to database
    await connectDB()
    dbConnected = true
  } catch (error) {
    console.error('Failed to connect to database:', error)
    process.exit(1)
  }
}

// Middleware
// CORS configuration - Allow all origins in development, specific origins in production
const corsOptions = {
  origin: config.isDevelopment 
    ? true  // Allow all origins in development
    : config.clientUrl,  // Only allow configured origin in production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FlowTrack API is running',
    timestamp: new Date().toISOString()
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/issues', issuesRoutes)
app.use('/api/users', usersRoutes)
app.use('/api', commentsRoutes)

app.get('/api', (req, res) => {
  res.json({ 
    message: 'FlowTrack API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      projects: '/api/projects',
      issues: '/api/issues'
    }
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(config.isDevelopment && { stack: err.stack })
    }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

// Start server
const startServer = async () => {
  await initializeServer()
  
  app.listen(config.port, () => {
    console.log(`🚀 Server is running on port ${config.port}`)
    console.log(`📊 Environment: ${config.env}`)
    console.log(`🔗 API: ${config.apiUrl}/api`)
    if (config.isDevelopment) {
      console.log(`🌐 Client URL: ${config.clientUrl}`)
    }
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})

export default app
