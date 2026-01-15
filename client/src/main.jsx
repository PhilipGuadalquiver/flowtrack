import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import App from './App'
import { useThemeStore, getThemeConfig } from './store/themeStore'
import './config/env' // Load and log environment configuration
import './index.css'
import './styles/global.css'

// Initialize dark mode on load
const { isDark } = useThemeStore.getState()
if (isDark) {
  document.body.style.background = '#141414'
  document.body.style.color = 'rgba(255, 255, 255, 0.85)'
} else {
  document.body.classList.add('light')
  document.body.style.background = '#fafafa'
  document.body.style.color = '#262626'
}

function Root() {
  const { isDark } = useThemeStore()
  const themeConfig = getThemeConfig(isDark)

  React.useEffect(() => {
    if (isDark) {
      document.body.classList.remove('light')
      document.body.style.background = '#141414'
      document.body.style.color = 'rgba(255, 255, 255, 0.85)'
    } else {
      document.body.classList.add('light')
      document.body.style.background = '#fafafa'
      document.body.style.color = '#262626'
    }
  }, [isDark])

  return (
    <ConfigProvider theme={themeConfig}>
      <App />
    </ConfigProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
