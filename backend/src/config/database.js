import { PrismaClient } from '@prisma/client'
import config from './env.js'

const prisma = new PrismaClient({
  log: config.isDevelopment 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error'],
})

// Test database connection
export const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection error:', error)
    process.exit(1)
  }
}

export default prisma
