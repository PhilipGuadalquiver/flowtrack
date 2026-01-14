import api from './axios'

export const issuesAPI = {
  // Get all issues for a project
  getByProject: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/issues`)
    return response.data
  },

  // Get issue by ID
  getById: async (issueId) => {
    const response = await api.get(`/issues/${issueId}`)
    return response.data
  },

  // Create issue
  create: async (projectId, issueData) => {
    const response = await api.post(`/projects/${projectId}/issues`, issueData)
    return response.data
  },

  // Update issue
  update: async (issueId, issueData) => {
    const response = await api.put(`/issues/${issueId}`, issueData)
    return response.data
  },

  // Delete issue
  delete: async (issueId) => {
    const response = await api.delete(`/issues/${issueId}`)
    return response.data
  },

  // Move issue (update status)
  moveIssue: async (issueId, status) => {
    const response = await api.patch(`/issues/${issueId}/status`, { status })
    return response.data
  },
}
