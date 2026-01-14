import { useState } from 'react'
import { Card, Typography, Button, Space } from 'antd'
import { 
  CrownOutlined, 
  TeamOutlined, 
  CodeOutlined, 
  EyeOutlined 
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import './RoleSelection.css'

const { Title, Text } = Typography

const roles = [
  {
    key: 'admin',
    label: 'Admin',
    icon: <CrownOutlined />,
    description: 'Full system access and management',
    color: '#ff4d4f',
  },
  {
    key: 'project_manager',
    label: 'Project Manager',
    icon: <TeamOutlined />,
    description: 'Manage projects, teams, and sprints',
    color: '#1890ff',
  },
  {
    key: 'developer',
    label: 'Developer',
    icon: <CodeOutlined />,
    description: 'Work on issues and tasks',
    color: '#52c41a',
  },
  {
    key: 'viewer',
    label: 'Viewer',
    icon: <EyeOutlined />,
    description: 'Read-only access to projects',
    color: '#8c8c8c',
  },
]

function RoleSelection() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, setSelectedRole } = useAuthStore()

  const handleRoleSelect = (roleKey) => {
    setLoading(true)
    setSelectedRole(roleKey)
    setTimeout(() => {
      setLoading(false)
      navigate('/')
    }, 300)
  }

  return (
    <div className="role-selection-container">
      <Card className="role-selection-card">
        <div className="role-selection-header">
          <Title level={2}>Select Your Role</Title>
        </div>
        <div className="role-grid">
          {roles.map((role) => (
            <Button
              key={role.key}
              className="role-card"
              onClick={() => handleRoleSelect(role.key)}
              loading={loading}
              style={{ 
                borderColor: role.color,
                '--role-color': role.color
              }}
              data-role-color={role.color}
            >
              <div className="role-input-box" style={{ borderColor: role.color }}></div>
              <div className="role-icon" style={{ color: role.color }}>
                {role.icon}
              </div>
              <div className="role-content">
                <div className="role-label">{role.label}</div>
                <div className="role-description">{role.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default RoleSelection
