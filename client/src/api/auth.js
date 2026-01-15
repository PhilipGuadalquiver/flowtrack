import api from './axios'

export const authAPI = {
  // Login
  login: async (email, password) => {
    console.log('🔐 Login Request:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Email:', email)
    console.log('Password:', '***hidden***')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  // Register (if needed)
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
}
