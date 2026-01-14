import api from './axios'

export const usersAPI = {
  // Get all users
  getAll: async () => {
    const response = await api.get('/users')
    return response.data
  },

  // Get user by ID
  getById: async (userId) => {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },
}
