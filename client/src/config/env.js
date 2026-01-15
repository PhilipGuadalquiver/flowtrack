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


export default config

