import api from './axios'

export const projectsAPI = {
  // Get all projects
  getAll: async () => {
    const response = await api.get('/projects')
    return response.data
  },

  // Get project by ID
  getById: async (projectId) => {
    const response = await api.get(`/projects/${projectId}`)
    return response.data
  },

  // Create project
  create: async (projectData) => {
    const response = await api.post('/projects', projectData)
    return response.data
  },

  // Update project
  update: async (projectId, projectData) => {
    const response = await api.put(`/projects/${projectId}`, projectData)
    return response.data
  },

  // Delete project
  delete: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`)
    return response.data
  },

  // Add member to project
  addMember: async (projectId, userId, role) => {
    const response = await api.post(`/projects/${projectId}/members`, { userId, role })
    return response.data
  },

  // Remove member from project
  removeMember: async (projectId, userId) => {
    const response = await api.delete(`/projects/${projectId}/members/${userId}`)
    return response.data
  },
}
