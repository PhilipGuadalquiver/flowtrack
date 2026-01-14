import { create } from 'zustand'
import { projectsAPI } from '../api/projects'
import { issuesAPI } from '../api/issues'
import { usersAPI } from '../api/users'
import { commentsAPI } from '../api/comments'

export const useProjectStore = create((set, get) => ({
  projects: [],
  issues: [],
  users: [],
  comments: [],
  currentProject: null,
  loading: false,
  error: null,

  // Fetch all projects
  fetchProjects: async () => {
    set({ loading: true, error: null })
    try {
      const response = await projectsAPI.getAll()
      const projects = Array.isArray(response) ? response : (response.data || [])
      set({ projects, loading: false })
      return projects
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to fetch projects'
      set({ loading: false, error: errorMessage })
      return []
    }
  },

  // Fetch project by ID
  fetchProject: async (projectId) => {
    set({ loading: true, error: null })
    try {
      const response = await projectsAPI.getById(projectId)
      const project = response.data || response
      set({ currentProject: project, loading: false })
      return project
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to fetch project'
      set({ loading: false, error: errorMessage })
      return null
    }
  },

  // Set current project
  setCurrentProject: (projectId) => {
    const project = get().projects.find((p) => p.id === projectId)
    set({ currentProject: project })
  },

  // Create project
  createProject: async (projectData) => {
    set({ loading: true, error: null })
    try {
      const response = await projectsAPI.create(projectData)
      const project = response.data || response
      set((state) => ({
        projects: [...state.projects, project],
        loading: false,
      }))
      return project
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to create project'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },

  // Update project
  updateProject: async (projectId, updates) => {
    set({ loading: true, error: null })
    try {
      const response = await projectsAPI.update(projectId, updates)
      const updatedProject = response.data || response
      set((state) => ({
        projects: state.projects.map((p) => (p.id === projectId ? updatedProject : p)),
        currentProject: state.currentProject?.id === projectId ? updatedProject : state.currentProject,
        loading: false,
      }))
      return updatedProject
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to update project'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    set({ loading: true, error: null })
    try {
      await projectsAPI.delete(projectId)
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
        issues: state.issues.filter((i) => i.projectId !== projectId),
        currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
        loading: false,
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to delete project'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },

  // Fetch issues for a project
  fetchProjectIssues: async (projectId) => {
    set({ loading: true, error: null })
    try {
      const response = await issuesAPI.getByProject(projectId)
      const issues = Array.isArray(response) ? response : (response.data || [])
      set((state) => ({
        issues: [...state.issues.filter((i) => i.projectId !== projectId), ...issues],
        loading: false,
      }))
      return issues
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to fetch issues'
      set({ loading: false, error: errorMessage })
      return []
    }
  },

  // Get project issues from state
  getProjectIssues: (projectId) => {
    return get().issues.filter((issue) => issue.projectId === projectId)
  },

  // Create issue
  createIssue: async (projectId, issueData) => {
    set({ loading: true, error: null })
    try {
      const response = await issuesAPI.create(projectId, issueData)
      const issue = response.data || response
      set((state) => ({
        issues: [...state.issues, issue],
        loading: false,
      }))
      return issue
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to create issue'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },

  // Update issue
  updateIssue: async (issueId, updates) => {
    set({ loading: true, error: null })
    try {
      const response = await issuesAPI.update(issueId, updates)
      const updatedIssue = response.data || response
      set((state) => ({
        issues: state.issues.map((i) => (i.id === issueId ? updatedIssue : i)),
        loading: false,
      }))
      return updatedIssue
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to update issue'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },

  // Delete issue
  deleteIssue: async (issueId) => {
    set({ loading: true, error: null })
    try {
      await issuesAPI.delete(issueId)
      set((state) => ({
        issues: state.issues.filter((i) => i.id !== issueId),
        loading: false,
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to delete issue'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },

  // Move issue (update status)
  moveIssue: async (issueId, newStatus) => {
    try {
      return await get().updateIssue(issueId, { status: newStatus })
    } catch (error) {
      throw error
    }
  },

  // Fetch users
  fetchUsers: async () => {
    set({ loading: true, error: null })
    try {
      const response = await usersAPI.getAll()
      const users = Array.isArray(response) ? response : (response.data || [])
      set({ users, loading: false })
      return users
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to fetch users'
      set({ loading: false, error: errorMessage })
      return []
    }
  },

  // Add member to project
  addProjectMember: async (projectId, userId, role) => {
    set({ loading: true, error: null })
    try {
      const member = await projectsAPI.addMember(projectId, userId, role)
      // Refresh the project to get updated members list
      const updatedProject = await projectsAPI.getById(projectId)
      const project = updatedProject.data || updatedProject
      set((state) => ({
        projects: state.projects.map((p) => (p.id === projectId ? project : p)),
        currentProject: state.currentProject?.id === projectId ? project : state.currentProject,
        loading: false,
      }))
      return member
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to add member'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },

  // Remove member from project
  removeProjectMember: async (projectId, userId) => {
    set({ loading: true, error: null })
    try {
      await projectsAPI.removeMember(projectId, userId)
      // Refresh the project to get updated members list
      const updatedProject = await projectsAPI.getById(projectId)
      const project = updatedProject.data || updatedProject
      set((state) => ({
        projects: state.projects.map((p) => (p.id === projectId ? project : p)),
        currentProject: state.currentProject?.id === projectId ? project : state.currentProject,
        loading: false,
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to remove member'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },

  // Fetch comments for an issue
  fetchIssueComments: async (issueId) => {
    set({ loading: true, error: null })
    try {
      const response = await commentsAPI.getByIssue(issueId)
      const comments = Array.isArray(response) ? response : (response.data || [])
      set((state) => ({
        comments: [...state.comments.filter((c) => c.issueId !== issueId), ...comments],
        loading: false,
      }))
      return comments
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to fetch comments'
      set({ loading: false, error: errorMessage })
      return []
    }
  },

  // Get issue comments from state
  getIssueComments: (issueId) => {
    return get().comments.filter((comment) => comment.issueId === issueId)
  },

  // Create a comment
  createComment: async (issueId, content, userId) => {
    set({ loading: true, error: null })
    try {
      const response = await commentsAPI.create(issueId, { content, userId })
      const comment = response.data || response
      set((state) => ({
        comments: [...state.comments, comment],
        loading: false,
      }))
      return comment
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to create comment'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    set({ loading: true, error: null })
    try {
      await commentsAPI.delete(commentId)
      set((state) => ({
        comments: state.comments.filter((c) => c.id !== commentId),
        loading: false,
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to delete comment'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },
}))
