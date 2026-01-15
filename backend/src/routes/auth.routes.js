import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/database.js'
import config from '../config/env.js'

const router = express.Router()

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login Request Received:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Email:', req.body.email)
    console.log('Password provided:', !!req.body.password)
    console.log('Request origin:', req.headers.origin)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    const { email, password } = req.body

    if (!email || !password) {
      console.log('❌ Missing email or password')
      return res.status(400).json({
        error: {
          message: 'Email and password are required'
        }
      })
    }

    // Find user by email (case-insensitive search for MongoDB)
    // Try exact match first
    let user = await prisma.user.findUnique({
      where: { email }
    })
    
    // If not found, try case-insensitive search (MongoDB)
    if (!user) {
      const allUsers = await prisma.user.findMany({
        where: {
          email: {
            equals: email,
            mode: 'insensitive'
          }
        }
      })
      user = allUsers[0] || null
    }
    
    // Log all users for debugging (in development only)
    if (!user && config.isDevelopment) {
      const allUsers = await prisma.user.findMany({
        select: { email: true, name: true }
      })
      console.log('📋 All users in database:', allUsers.map(u => u.email).join(', ') || 'None')
    }

    if (!user) {
      console.log('❌ User not found for email:', email)
      return res.status(401).json({
        error: {
          message: 'Invalid email or password'
        }
      })
    }

    console.log('✅ User found:', user.email, 'ID:', user.id)

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', email)
      return res.status(401).json({
        error: {
          message: 'Invalid email or password'
        }
      })
    }

    console.log('✅ Password verified successfully')

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpire }
    )

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user

    console.log('✅ Login successful, token generated')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    })
  } catch (error) {
    console.error('❌ Login error:', error)
    console.error('Error stack:', error.stack)
    res.status(500).json({
      error: {
        message: 'Internal server error'
      }
    })
  }
})

// Get current user
router.get('/me', async (req, res) => {
  try {
    console.log('🔍 Get Current User Request:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing')
    
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      console.log('❌ No token provided')
      return res.status(401).json({
        error: {
          message: 'Unauthorized'
        }
      })
    }

    console.log('Token provided:', token.substring(0, 20) + '...')
    console.log('JWT Secret configured:', !!config.jwtSecret)

    const decoded = jwt.verify(token, config.jwtSecret)
    console.log('✅ Token verified, user ID:', decoded.userId)
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      console.log('❌ User not found in database')
      return res.status(404).json({
        error: {
          message: 'User not found'
        }
      })
    }

    console.log('✅ User found:', user.email)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('❌ Get current user error:', error.message)
    console.error('Error name:', error.name)
    if (error.name === 'JsonWebTokenError') {
      console.error('❌ JWT Error: Invalid token signature')
    } else if (error.name === 'TokenExpiredError') {
      console.error('❌ JWT Error: Token expired')
    }
    res.status(401).json({
      error: {
        message: 'Invalid or expired token'
      }
    })
  }
})

// Logout (client-side, but we can have this endpoint for consistency)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  })
})

export default router
