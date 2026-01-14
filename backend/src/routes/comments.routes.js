import express from 'express'
import prisma from '../config/database.js'

const router = express.Router()

// Get all comments for an issue
router.get('/issues/:issueId/comments', async (req, res) => {
  try {
    const { issueId } = req.params

    const comments = await prisma.comment.findMany({
      where: { issueId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    res.json(comments)
  } catch (error) {
    console.error('Get comments error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to fetch comments'
      }
    })
  }
})

// Create a comment for an issue
router.post('/issues/:issueId/comments', async (req, res) => {
  try {
    const { issueId } = req.params
    const { content, userId } = req.body

    if (!content) {
      return res.status(400).json({
        error: {
          message: 'Content is required'
        }
      })
    }

    if (!userId) {
      return res.status(400).json({
        error: {
          message: 'User ID is required'
        }
      })
    }

    // Check if issue exists
    const issue = await prisma.issue.findUnique({
      where: { id: issueId }
    })

    if (!issue) {
      return res.status(404).json({
        error: {
          message: 'Issue not found'
        }
      })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found'
        }
      })
    }

    const comment = await prisma.comment.create({
      data: {
        issueId,
        userId,
        content
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    res.status(201).json(comment)
  } catch (error) {
    console.error('Create comment error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to create comment'
      }
    })
  }
})

// Delete a comment
router.delete('/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params

    await prisma.comment.delete({
      where: { id: commentId }
    })

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    })
  } catch (error) {
    console.error('Delete comment error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: {
          message: 'Comment not found'
        }
      })
    }
    res.status(500).json({
      error: {
        message: 'Failed to delete comment'
      }
    })
  }
})

export default router
