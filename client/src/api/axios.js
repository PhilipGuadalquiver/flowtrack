import axios from 'axios'

// Get API URL based on environment
const getApiUrl = () => {
  let apiUrl = import.meta.env.VITE_API_URL
  
  // In production
  if (import.meta.env.PROD) {
    // If VITE_API_URL is not set, use relative path
    if (!apiUrl) {
      return '/api'
    }
    
    // Ensure VITE_API_URL ends with /api
    // If it doesn't have /api, add it
    if (apiUrl && !apiUrl.endsWith('/api')) {
      // Remove trailing slash if present
      apiUrl = apiUrl.replace(/\/$/, '')
      // Add /api if not present
      if (!apiUrl.endsWith('/api')) {
        apiUrl = `${apiUrl}/api`
      }
    }
    
    return apiUrl
  }
  
  // In development
  if (!apiUrl) {
    return 'http://localhost:5000/api'
  }
  
  // Ensure development URL also ends with /api
  if (apiUrl && !apiUrl.endsWith('/api')) {
    apiUrl = apiUrl.replace(/\/$/, '')
    if (!apiUrl.endsWith('/api')) {
      apiUrl = `${apiUrl}/api`
    }
  }
  
  return apiUrl
}

const API_URL = getApiUrl()

// Log API URL configuration
console.log('🔗 API Configuration:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Base URL:', API_URL)
console.log('Environment:', import.meta.env.MODE)
console.log('VITE_API_URL (raw):', import.meta.env.VITE_API_URL || 'Not set')
console.log('VITE_API_URL (processed):', API_URL)

// Warn if production URL doesn't look right
if (import.meta.env.PROD) {
  if (!API_URL.includes('/api')) {
    console.warn('⚠️ WARNING: Base URL does not include /api!')
    console.warn('⚠️ Make sure VITE_API_URL in Vercel ends with /api')
    console.warn('⚠️ Example: https://your-backend.railway.app/api')
  }
  if (API_URL.startsWith('http') && !API_URL.includes('railway') && !API_URL.includes('render') && !API_URL.includes('fly')) {
    console.warn('⚠️ WARNING: Production URL might be incorrect!')
    console.warn('⚠️ Make sure VITE_API_URL points to your backend (Railway/Render/etc)')
  }
}
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token to requests and log
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request details
    const fullUrl = `${config.baseURL}${config.url}`
    console.log('📤 API Request:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Method:', config.method?.toUpperCase())
    console.log('Full URL:', fullUrl)
    console.log('Base URL:', config.baseURL)
    console.log('Endpoint:', config.url)
    if (config.data) {
      console.log('Request Data:', config.data)
    }
    if (config.params) {
      console.log('Query Params:', config.params)
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log('✅ API Response Success:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('URL:', `${response.config.baseURL}${response.config.url}`)
    console.log('Status:', response.status)
    console.log('Response Data:', response.data)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    return response
  },
  (error) => {
    // Log error responses
    console.error('❌ API Response Error:')
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    if (error.config) {
      console.error('URL:', `${error.config.baseURL}${error.config.url}`)
      console.error('Method:', error.config.method?.toUpperCase())
    }
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Status Text:', error.response.statusText)
      console.error('Response Data:', error.response.data)
    } else if (error.request) {
      console.error('No response received')
      console.error('Request:', error.request)
    } else {
      console.error('Error Message:', error.message)
    }
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
