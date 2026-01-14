import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../api/auth'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      selectedRole: null,
      token: null,
      loading: false,
      error: null,

      // Login with API
      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const response = await authAPI.login(email, password)
          // Response structure from backend: { success: true, data: { user, token } }
          // authAPI.login already returns response.data, so response is the body
          const { user, token } = response.data || response
          
          if (token) {
            localStorage.setItem('token', token)
          }
          
          set({ 
            user, 
            token, 
            selectedRole: null,
            loading: false,
            error: null
          })
          return { success: true, user }
        } catch (error) {
          const errorMessage = error.response?.data?.error?.message || error.message || 'Login failed'
          set({ 
            loading: false, 
            error: errorMessage,
            user: null,
            token: null
          })
          return { success: false, error: errorMessage }
        }
      },

      // Set selected role
      setSelectedRole: (role) => set({ selectedRole: role }),

      // Get current user from API
      getCurrentUser: async () => {
        set({ loading: true })
        try {
          const response = await authAPI.getCurrentUser()
          const user = response.data || response
          set({ user, loading: false })
          return user
        } catch (error) {
          set({ loading: false, user: null, token: null })
          localStorage.removeItem('token')
          return null
        }
      },

      // Logout
      logout: async () => {
        try {
          await authAPI.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          localStorage.removeItem('token')
          localStorage.removeItem('auth-storage')
          set({ user: null, selectedRole: null, token: null, error: null })
        }
      },

      // Initialize from token
      init: () => {
        const token = localStorage.getItem('token')
        if (token) {
          set({ token })
          // Optionally fetch user data
          get().getCurrentUser()
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        selectedRole: state.selectedRole,
      }),
    }
  )
)
