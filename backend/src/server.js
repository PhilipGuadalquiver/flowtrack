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
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // In development, allow all origins
    if (config.isDevelopment) {
      return callback(null, true)
    }
    
    // In production, check against CLIENT_URL
    const allowedOrigins = config.clientUrl 
      ? config.clientUrl.split(',').map(url => url.trim()) // Support multiple origins (comma-separated)
      : []
    
    // Check if origin is allowed
    if (allowedOrigins.length === 0) {
      console.warn('⚠️ CLIENT_URL is not set. CORS may block requests.')
      return callback(null, true) // Allow if not set (fallback, but should be set)
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`⚠️ CORS blocked origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
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

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`📥 ${req.method} ${req.path}`)
    if (req.headers.authorization) {
      console.log('   🔑 Authorization header present')
    }
  }
  next()
})

// Start server
const startServer = async () => {
  await initializeServer()
  
  app.listen(config.port, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🚀 Server is running on port', config.port)
    console.log('📊 Environment:', config.env)
    console.log('🔗 API:', `${config.apiUrl}/api`)
    console.log('🌐 Client URL (CORS):', config.clientUrl || 'Not set')
    console.log('🔐 JWT Secret:', config.jwtSecret ? 'Configured' : '⚠️ NOT SET')
    console.log('🔐 JWT Expire:', config.jwtExpire)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})

export default app
