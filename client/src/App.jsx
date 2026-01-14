import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import Login from './pages/auth/Login'
import RoleSelection from './pages/auth/RoleSelection'
import Projects from './pages/projects/Projects'
import ProjectDetail from './pages/projects/ProjectDetail'
import KanbanBoard from './pages/boards/KanbanBoard'
import SprintBoard from './pages/boards/SprintBoard'
import Issues from './pages/issues/Issues'
import Dashboard from './pages/dashboard/Dashboard'

function PrivateRoute({ children }) {
  const { user } = useAuthStore()
  return user ? children : <Navigate to="/login" />
}

function RoleProtectedRoute({ children }) {
  const { user, selectedRole, init } = useAuthStore()
  
  useEffect(() => {
    init()
  }, [init])
  
  if (!user) return <Navigate to="/login" />
  if (!selectedRole) return <Navigate to="/select-role" />
  return children
}

function App() {
  const { user, selectedRole, init } = useAuthStore()
  
  useEffect(() => {
    init()
  }, [init])

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login /> : (selectedRole ? <Navigate to="/" /> : <Navigate to="/select-role" />)} 
        />
        <Route 
          path="/select-role" 
          element={user ? (!selectedRole ? <RoleSelection /> : <Navigate to="/" />) : <Navigate to="/login" />} 
        />
        <Route
          path="/"
          element={
            <RoleProtectedRoute>
              <Layout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route path="projects/:projectId/board" element={<KanbanBoard />} />
          <Route path="projects/:projectId/sprint" element={<SprintBoard />} />
          <Route path="projects/:projectId/issues" element={<Issues />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
