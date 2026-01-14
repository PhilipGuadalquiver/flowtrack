import api from './axios'

export const commentsAPI = {
  // Get all comments for an issue
  getByIssue: async (issueId) => {
    const response = await api.get(`/issues/${issueId}/comments`)
    return response.data
  },

  // Create a comment
  create: async (issueId, commentData) => {
    const response = await api.post(`/issues/${issueId}/comments`, commentData)
    return response.data
  },

  // Delete a comment
  delete: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`)
    return response.data
  },
}
