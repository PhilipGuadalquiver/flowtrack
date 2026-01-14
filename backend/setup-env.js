#!/usr/bin/env node

/**
 * Environment Setup Script
 * This script helps you create .env files for development and production
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envTemplate = `# Environment Configuration
NODE_ENV=development

# Database (MongoDB)
DATABASE_URL="mongodb+srv://guadalquiverphilip_db_user:tSiNiyoTiaHza1qZ@cluster1.oldbgde.mongodb.net/flowtrack?retryWrites=true&w=majority"

# JWT
JWT_SECRET="dev-secret-key-change-in-production"
JWT_EXPIRE="7d"

# Server
PORT=5000

# CORS
CLIENT_URL="http://localhost:5173"

# API
API_URL="http://localhost:5000"
`

const envProductionTemplate = `# Production Environment Configuration
NODE_ENV=production

# Database (MongoDB) - Update with your production database
DATABASE_URL="mongodb+srv://guadalquiverphilip_db_user:tSiNiyoTiaHza1qZ@cluster1.oldbgde.mongodb.net/flowtrack_prod?retryWrites=true&w=majority"

# JWT - Use a strong random secret in production
JWT_SECRET="your-super-secret-production-key-change-this"
JWT_EXPIRE="7d"

# Server
PORT=5000

# CORS - Update with your production frontend URL
CLIENT_URL="https://your-frontend-domain.com"

# API - Update with your production API URL
API_URL="https://your-api-domain.com"
`

function createEnvFile() {
  const envPath = path.join(__dirname, '.env')
  const envDevPath = path.join(__dirname, '.env.development')
  const envProdPath = path.join(__dirname, '.env.production')

  // Create .env for development (default)
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envTemplate)
    console.log('✅ Created .env file for development')
  } else {
    console.log('⚠️  .env file already exists. Skipping...')
  }

  // Create .env.development
  if (!fs.existsSync(envDevPath)) {
    fs.writeFileSync(envDevPath, envTemplate)
    console.log('✅ Created .env.development file')
  } else {
    console.log('⚠️  .env.development file already exists. Skipping...')
  }

  // Create .env.production
  if (!fs.existsSync(envProdPath)) {
    fs.writeFileSync(envProdPath, envProductionTemplate)
    console.log('✅ Created .env.production file')
    console.log('⚠️  Remember to update production values in .env.production before deploying!')
  } else {
    console.log('⚠️  .env.production file already exists. Skipping...')
  }

  console.log('\n📝 Environment files created successfully!')
  console.log('🔧 Next steps:')
  console.log('   1. Review and update .env with your settings')
  console.log('   2. Run: npm run prisma:generate')
  console.log('   3. Run: npm run prisma:push')
  console.log('   4. Run: npm run dev')
}

try {
  createEnvFile()
} catch (error) {
  console.error('❌ Error creating environment files:', error.message)
  process.exit(1)
}
