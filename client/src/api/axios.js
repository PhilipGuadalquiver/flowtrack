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

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
