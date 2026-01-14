import dotenv from 'dotenv'

// Load environment variables
// Try to load .env file first, then .env.development or .env.production
dotenv.config() // Load default .env
const env = process.env.NODE_ENV || 'development'
dotenv.config({ path: `.env.${env}`, override: false }) // Load environment-specific .env, don't override existing

export const config = {
  // Environment
  env,
  isDevelopment: env === 'development',
  isProduction: env === 'production',
  isTest: env === 'test',

  // Server
  port: parseInt(process.env.PORT || '5000', 10),
  
  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  
  // CORS
  clientUrl: process.env.CLIENT_URL || (env === 'production' ? '' : 'http://localhost:3000'),
  
  // API
  apiUrl: process.env.API_URL || `http://localhost:${process.env.PORT || '5000'}`,
}

// Validate required environment variables
if (config.isProduction) {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'CLIENT_URL']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '))
    process.exit(1)
  }
}

export default config
