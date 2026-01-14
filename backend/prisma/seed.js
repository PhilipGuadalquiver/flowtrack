import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data (MongoDB)
  await prisma.user.deleteMany({})
  await prisma.project.deleteMany({})
  await prisma.sprint.deleteMany({})
  await prisma.issue.deleteMany({})

  // Create users
  const hashedPassword = await bcrypt.hash('123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin123@sample.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    },
  })

  const projectManager = await prisma.user.create({
    data: {
      email: 'pm@example.com',
      name: 'Jane Smith',
      password: hashedPassword,
      role: 'project_manager',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    },
  })

  const developer = await prisma.user.create({
    data: {
      email: 'dev@example.com',
      name: 'Bob Johnson',
      password: hashedPassword,
      role: 'developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    },
  })

  console.log('✅ Users created:', { admin: admin.email, projectManager: projectManager.email, developer: developer.email })

  // Create project
  const project = await prisma.project.create({
    data: {
      name: 'E-Commerce Platform',
      key: 'ECOM',
      description: 'Building a modern e-commerce platform with React',
      status: 'active',
      creatorId: admin.id,
      members: {
        create: [
          { userId: admin.id, role: 'admin' },
          { userId: projectManager.id, role: 'project_manager' },
          { userId: developer.id, role: 'developer' },
        ],
      },
    },
  })

  console.log('✅ Project created:', project.name)

  // Create sprint
  const sprint = await prisma.sprint.create({
    data: {
      projectId: project.id,
      name: 'Sprint 1 - Authentication & Setup',
      goal: 'Complete authentication system and setup CI/CD',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-29'),
      status: 'active',
    },
  })

  console.log('✅ Sprint created:', sprint.name)

  // Create issues
  const issues = await Promise.all([
    prisma.issue.create({
      data: {
        projectId: project.id,
        key: 'ECOM-1',
        type: 'story',
        title: 'Implement user authentication',
        description: 'Add login and registration functionality with JWT tokens',
        status: 'in_progress',
        priority: 'high',
        assigneeId: developer.id,
        reporterId: projectManager.id,
        storyPoints: 5,
        sprintId: sprint.id,
        labels: ['backend', 'auth'],
        dueDate: new Date('2024-02-01'),
      },
    }),
    prisma.issue.create({
      data: {
        projectId: project.id,
        key: 'ECOM-2',
        type: 'bug',
        title: 'Cart not updating on item removal',
        description: 'When removing items from cart, the total price does not update correctly',
        status: 'to_do',
        priority: 'high',
        assigneeId: developer.id,
        reporterId: admin.id,
        storyPoints: 3,
        labels: ['frontend', 'bug'],
        dueDate: new Date('2024-01-25'),
      },
    }),
    prisma.issue.create({
      data: {
        projectId: project.id,
        key: 'ECOM-3',
        type: 'task',
        title: 'Setup CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        status: 'done',
        priority: 'medium',
        assigneeId: admin.id,
        reporterId: projectManager.id,
        storyPoints: 8,
        sprintId: sprint.id,
        labels: ['devops', 'ci-cd'],
        dueDate: new Date('2024-01-20'),
      },
    }),
  ])

  console.log('✅ Issues created:', issues.length)
  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
