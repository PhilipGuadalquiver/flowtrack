import express from 'express'
import prisma from '../config/database.js'

const router = express.Router()

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        members: {
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
        },
        _count: {
          select: {
            issues: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    res.json(projects)
  } catch (error) {
    console.error('Get projects error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to fetch projects'
      }
    })
  }
})

// Get project by ID
router.get('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        members: {
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
        },
        issues: true,
        sprints: true
      }
    })

    if (!project) {
      return res.status(404).json({
        error: {
          message: 'Project not found'
        }
      })
    }

    res.json(project)
  } catch (error) {
    console.error('Get project error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to fetch project'
      }
    })
  }
})

// Create project
router.post('/', async (req, res) => {
  try {
    const { name, key, description, status } = req.body

    if (!name || !key) {
      return res.status(400).json({
        error: {
          message: 'Name and key are required'
        }
      })
    }

    // Get user ID from token (for now, use from request body)
    // TODO: Add authentication middleware
    const creatorId = req.user?.id || req.body.creatorId || req.body.members?.[0]

    if (!creatorId) {
      return res.status(401).json({
        error: {
          message: 'Unauthorized - creator ID required'
        }
      })
    }

    // Check if key already exists
    const existingProject = await prisma.project.findUnique({
      where: { key }
    })

    if (existingProject) {
      return res.status(400).json({
        error: {
          message: 'Project key already exists'
        }
      })
    }

    const project = await prisma.project.create({
      data: {
        name,
        key,
        description,
        status: status || 'active',
        creatorId
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    res.status(201).json(project)
  } catch (error) {
    console.error('Create project error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to create project'
      }
    })
  }
})

// Update project
router.put('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params
    const { name, description, status } = req.body

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(status && { status })
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    res.json(project)
  } catch (error) {
    console.error('Update project error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: {
          message: 'Project not found'
        }
      })
    }
    res.status(500).json({
      error: {
        message: 'Failed to update project'
      }
    })
  }
})

// Delete project
router.delete('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params

    await prisma.project.delete({
      where: { id: projectId }
    })

    res.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('Delete project error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: {
          message: 'Project not found'
        }
      })
    }
    res.status(500).json({
      error: {
        message: 'Failed to delete project'
      }
    })
  }
})

// Add member to project
router.post('/:projectId/members', async (req, res) => {
  try {
    const { projectId } = req.params
    const { userId, role } = req.body

    if (!userId || !role) {
      return res.status(400).json({
        error: {
          message: 'User ID and role are required'
        }
      })
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return res.status(404).json({
        error: {
          message: 'Project not found'
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

    // Check if member already exists
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      }
    })

    if (existingMember) {
      return res.status(400).json({
        error: {
          message: 'User is already a member of this project'
        }
      })
    }

    // Create project member
    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role: role || 'viewer'
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

    res.status(201).json(member)
  } catch (error) {
    console.error('Add member error:', error)
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: {
          message: 'User is already a member of this project'
        }
      })
    }
    res.status(500).json({
      error: {
        message: 'Failed to add member'
      }
    })
  }
})

// Remove member from project
router.delete('/:projectId/members/:userId', async (req, res) => {
  try {
    const { projectId, userId } = req.params

    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      }
    })

    res.json({
      success: true,
      message: 'Member removed successfully'
    })
  } catch (error) {
    console.error('Remove member error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: {
          message: 'Member not found'
        }
      })
    }
    res.status(500).json({
      error: {
        message: 'Failed to remove member'
      }
    })
  }
})

// Get all issues for a project
router.get('/:projectId/issues', async (req, res) => {
  try {
    const { projectId } = req.params

    const issues = await prisma.issue.findMany({
      where: { projectId },
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json(issues)
  } catch (error) {
    console.error('Get project issues error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to fetch issues'
      }
    })
  }
})

// Create issue for a project
router.post('/:projectId/issues', async (req, res) => {
  try {
    const { projectId } = req.params
    const issueData = req.body

    // TODO: Add authentication middleware to get reporterId
    // Accept both 'reporter' and 'reporterId' from frontend
    const reporterId = req.user?.id || issueData.reporterId || issueData.reporter

    if (!reporterId) {
      return res.status(401).json({
        error: {
          message: 'Unauthorized - reporter ID required'
        }
      })
    }

    // Generate issue key (e.g., ECOM-1, MOBILE-2)
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return res.status(404).json({
        error: {
          message: 'Project not found'
        }
      })
    }

    // Count existing issues to generate key
    const issueCount = await prisma.issue.count({
      where: { projectId }
    })

    const key = `${project.key}-${issueCount + 1}`

    // Remove fields that we're setting explicitly or that shouldn't be in the data
    const { 
      reporter, 
      reporterId: _, 
      projectId: __, 
      key: ___, 
      assignee,
      ...cleanIssueData 
    } = issueData

    // Map assignee to assigneeId if provided, handle empty strings
    let assigneeId = assignee || cleanIssueData.assigneeId || null
    if (assigneeId === '' || assigneeId === undefined) {
      assigneeId = null
    }
    
    // Remove assigneeId from cleanIssueData if it exists there
    delete cleanIssueData.assigneeId
    
    // Convert storyPoints to integer if it's a string
    if (cleanIssueData.storyPoints !== undefined && cleanIssueData.storyPoints !== null) {
      cleanIssueData.storyPoints = parseInt(cleanIssueData.storyPoints, 10) || null
    }
    
    // Ensure labels is an array
    if (!Array.isArray(cleanIssueData.labels)) {
      cleanIssueData.labels = cleanIssueData.labels ? [cleanIssueData.labels] : []
    }
    
    // Convert dueDate string to Date if provided
    if (cleanIssueData.dueDate && typeof cleanIssueData.dueDate === 'string') {
      cleanIssueData.dueDate = new Date(cleanIssueData.dueDate)
    }

    const issue = await prisma.issue.create({
      data: {
        projectId,
        key,
        ...cleanIssueData,
        assigneeId,
        reporterId
      },
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

    res.status(201).json(issue)
  } catch (error) {
    console.error('Create issue error:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    res.status(500).json({
      error: {
        message: error.message || 'Failed to create issue',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    })
  }
})

export default router
