import express from 'express'
import prisma from '../config/database.js'

const router = express.Router()

// Get issue by ID
router.get('/:issueId', async (req, res) => {
  try {
    const { issueId } = req.params

    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        sprint: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!issue) {
      return res.status(404).json({
        error: {
          message: 'Issue not found'
        }
      })
    }

    res.json(issue)
  } catch (error) {
    console.error('Get issue error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to fetch issue'
      }
    })
  }
})

// Update issue
router.put('/:issueId', async (req, res) => {
  try {
    const { issueId } = req.params
    const { assignee, reporter, projectId, key, reporterId, ...updateData } = req.body

    // Map assignee to assigneeId
    if (assignee !== undefined) {
      updateData.assigneeId = assignee || null
    }

    // Handle dueDate conversion if it's a string
    if (updateData.dueDate && typeof updateData.dueDate === 'string') {
      updateData.dueDate = new Date(updateData.dueDate)
    }

    // Convert empty string to null for optional fields
    if (updateData.assigneeId === '') {
      updateData.assigneeId = null
    }

    const issue = await prisma.issue.update({
      where: { id: issueId },
      data: updateData,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    res.json(issue)
  } catch (error) {
    console.error('Update issue error:', error)
    console.error('Error details:', error.message)
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: {
          message: 'Issue not found'
        }
      })
    }
    res.status(500).json({
      error: {
        message: error.message || 'Failed to update issue'
      }
    })
  }
})

// Update issue status
router.patch('/:issueId/status', async (req, res) => {
  try {
    const { issueId } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({
        error: {
          message: 'Status is required'
        }
      })
    }

    const issue = await prisma.issue.update({
      where: { id: issueId },
      data: { status },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    res.json(issue)
  } catch (error) {
    console.error('Update issue status error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: {
          message: 'Issue not found'
        }
      })
    }
    res.status(500).json({
      error: {
        message: 'Failed to update issue status'
      }
    })
  }
})

// Delete issue
router.delete('/:issueId', async (req, res) => {
  try {
    const { issueId } = req.params

    await prisma.issue.delete({
      where: { id: issueId }
    })

    res.json({
      success: true,
      message: 'Issue deleted successfully'
    })
  } catch (error) {
    console.error('Delete issue error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: {
          message: 'Issue not found'
        }
      })
    }
    res.status(500).json({
      error: {
        message: 'Failed to delete issue'
      }
    })
  }
})

export default router
