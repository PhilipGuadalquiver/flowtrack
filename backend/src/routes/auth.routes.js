import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/database.js'
import config from '../config/env.js'

const router = express.Router()

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: {
          message: 'Email and password are required'
        }
      })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password'
        }
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password'
        }
      })
    }

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

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    })
  } catch (error) {
    console.log(error)
    console.error('Login error:', error)
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
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        error: {
          message: 'Unauthorized'
        }
      })
    }

    const decoded = jwt.verify(token, config.jwtSecret)
    
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
      return res.status(404).json({
        error: {
          message: 'User not found'
        }
      })
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Get current user error:', error)
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
