import express from 'express'
import prisma from '../config/database.js'

const router = express.Router()

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    res.json(users)
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to fetch users'
      }
    })
  }
})

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
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

    res.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to fetch user'
      }
    })
  }
})

export default router
