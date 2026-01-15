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
    
    // Log database info (without exposing credentials)
    const dbUrl = process.env.DATABASE_URL || ''
    if (dbUrl) {
      try {
        // Extract database name from connection string
        const dbMatch = dbUrl.match(/\/([^?]+)/)
        const dbName = dbMatch ? dbMatch[1] : 'unknown'
        console.log('📊 Database name:', dbName)
        
        // Check if users exist
        const userCount = await prisma.user.count()
        console.log('👥 Users in database:', userCount)
        
        if (userCount === 0) {
          console.warn('⚠️ WARNING: No users found in database!')
          console.warn('⚠️ You may need to seed the database with: npm run prisma:seed')
        }
      } catch (err) {
        console.warn('⚠️ Could not check database info:', err.message)
      }
    }
  } catch (error) {
    console.error('❌ Database connection error:', error)
    process.exit(1)
  }
}

export default prisma
