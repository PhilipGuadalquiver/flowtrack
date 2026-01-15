// Frontend Environment Configuration
// Vite exposes env variables via import.meta.env

const env = import.meta.env.MODE || 'development'
const isDevelopment = import.meta.env.DEV
const isProduction = import.meta.env.PROD

export const config = {
  // Environment
  env,
  isDevelopment,
  isProduction,
  
  // API URL
  apiUrl: import.meta.env.VITE_API_URL || (isProduction ? '/api' : 'http://localhost:5000/api'),
  
  // Get all Vite env variables (only those prefixed with VITE_)
  getEnvVars: () => {
    const envVars = {}
    // Vite only exposes variables prefixed with VITE_
    Object.keys(import.meta.env).forEach(key => {
      if (key.startsWith('VITE_')) {
        envVars[key] = import.meta.env[key]
      }
    })
    return envVars
  }
}

// Log environment configuration in development
if (isDevelopment) {
  console.log('🔧 Frontend Environment Configuration:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Environment:', env)
  console.log('Mode:', isDevelopment ? 'Development' : 'Production')
  console.log('API URL:', config.apiUrl)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📦 Environment Variables:')
  const envVars = config.getEnvVars()
  if (Object.keys(envVars).length > 0) {
    Object.entries(envVars).forEach(([key, value]) => {
      console.log(`  ${key}:`, value)
    })
  } else {
    console.log('  No VITE_ prefixed environment variables found')
    console.log('  Make sure your .env.development file has variables prefixed with VITE_')
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

export default config

