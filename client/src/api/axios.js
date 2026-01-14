import axios from 'axios'

// Get API URL based on environment
const getApiUrl = () => {
  // In production, use VITE_API_URL or default to relative path
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || '/api'
  }
  // In development, use VITE_API_URL or default to localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
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
