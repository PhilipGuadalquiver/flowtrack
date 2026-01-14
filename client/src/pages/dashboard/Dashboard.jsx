import { useEffect } from 'react'
import { Card, Row, Col, Statistic, List, Tag, Typography } from 'antd'
import {
  ProjectOutlined,
  IssuesCloseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '../../store/projectStore'
import { statuses } from '../../data/mockData'
import './Dashboard.css'

const { Title } = Typography

function Dashboard() {
  const navigate = useNavigate()
  const { projects, issues, fetchProjects, fetchProjectIssues } = useProjectStore()

  useEffect(() => {
    fetchProjects().then((projectList) => {
      // Fetch issues for each project
      projectList.forEach((project) => {
        fetchProjectIssues(project.id)
      })
    })
  }, [fetchProjects, fetchProjectIssues])

  const totalProjects = projects.length
  const totalIssues = issues.length
  const completedIssues = issues.filter((i) => i.status === 'done').length
  const inProgressIssues = issues.filter((i) => i.status === 'in_progress').length

  const recentIssues = issues
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)

  const getStatusColor = (status) => {
    const statusObj = statuses.find((s) => s.value === status)
    return statusObj?.color || '#8c8c8c'
  }

  return (
    <div className="dashboard">
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8, fontWeight: 700 }}>
          Dashboard
        </Title>
        <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 16, margin: 0 }} className="welcome-text">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>Total Projects</span>}
              value={totalProjects}
              prefix={<ProjectOutlined style={{ color: 'rgba(255,255,255,0.9)' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>Total Issues</span>}
              value={totalIssues}
              prefix={<IssuesCloseOutlined style={{ color: 'rgba(255,255,255,0.9)' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>In Progress</span>}
              value={inProgressIssues}
              prefix={<ClockCircleOutlined style={{ color: 'rgba(255,255,255,0.9)' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              border: 'none',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>Completed</span>}
              value={completedIssues}
              prefix={<CheckCircleOutlined style={{ color: 'rgba(255,255,255,0.9)' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ fontWeight: 600, fontSize: 18 }}>Recent Issues</span>} 
            className="recent-issues-card"
            style={{ height: '100%' }}
          >
            <List
              dataSource={recentIssues}
              renderItem={(issue) => (
                <List.Item
                  style={{ cursor: 'pointer', border: 'none', padding: '16px 0' }}
                  onClick={() =>
                    navigate(`/projects/${issue.projectId}/issues`)
                  }
                >
                  <List.Item.Meta
                    title={
                      <span style={{ fontWeight: 500, fontSize: 15 }}>
                        {issue.key}: {issue.title}
                      </span>
                    }
                    description={
                      <div style={{ marginTop: 8 }}>
                        <Tag 
                          color={getStatusColor(issue.status)}
                          style={{ borderRadius: 4, fontWeight: 500 }}
                        >
                          {statuses.find((s) => s.value === issue.status)?.label}
                        </Tag>
                        <span style={{ marginLeft: 8, color: 'var(--text-secondary)', fontSize: 13 }}>
                          {issue.type}
                        </span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ fontWeight: 600, fontSize: 18 }}>Active Projects</span>} 
            className="projects-card"
            style={{ height: '100%' }}
          >
            <List
              dataSource={projects}
              renderItem={(project) => (
                <List.Item
                  style={{ cursor: 'pointer', border: 'none', padding: '16px 0' }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <List.Item.Meta
                    title={
                      <span style={{ fontWeight: 500, fontSize: 15 }}>
                        {project.name}
                      </span>
                    }
                    description={
                      <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                        {project.description}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
