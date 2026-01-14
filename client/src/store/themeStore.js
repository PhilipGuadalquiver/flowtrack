import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { theme } from 'antd'

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: true, // Default to dark mode
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: 'theme-storage',
    }
  )
)

export const getThemeConfig = (isDark) => {
  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
    },
  }
}
