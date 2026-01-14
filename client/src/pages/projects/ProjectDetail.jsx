import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Tabs, Button, Space, Typography, Card, Row, Col, Statistic, Avatar, Tag, List, Modal, Form, Select, message, Empty, Popconfirm } from 'antd'
import {
  ArrowLeftOutlined,
  IssuesCloseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  PlusOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons'
import { useProjectStore } from '../../store/projectStore'
import { statuses, issueTypes } from '../../data/mockData'
import KanbanBoard from '../boards/KanbanBoard'
import Issues from '../issues/Issues'
import './ProjectDetail.css'

const { Title } = Typography

function ProjectDetail() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { 
    projects, 
    getProjectIssues, 
    users, 
    fetchUsers, 
    addProjectMember, 
    removeProjectMember,
    fetchProjects,
  } = useProjectStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false)
  const [addMemberForm] = Form.useForm()

  const project = projects.find((p) => p.id === projectId)
  const issues = project ? getProjectIssues(projectId) : []

  useEffect(() => {
    if (projectId) {
      fetchProjects()
      fetchUsers()
    }
  }, [projectId, fetchProjects, fetchUsers])

  useEffect(() => {
    // Set initial tab based on URL if coming from a direct link
    if (location.pathname.includes('/board')) {
      setActiveTab('board')
    } else if (location.pathname.includes('/issues')) {
      setActiveTab('issues')
    } else {
      setActiveTab('overview')
    }
  }, [location.pathname, projectId])

  if (!project) {
    return <div>Project not found</div>
  }

  // Get existing member user IDs
  const existingMemberUserIds = (project.members || []).map((member) => member.user?.id || member.userId).filter(Boolean)
  
  // Filter out users who are already members
  const availableUsers = users.filter((user) => !existingMemberUserIds.includes(user.id))

  const handleAddMember = async () => {
    try {
      const values = await addMemberForm.validateFields()
      await addProjectMember(projectId, values.userId, values.role)
      message.success('Member added successfully')
      setAddMemberModalVisible(false)
      addMemberForm.resetFields()
      // Refresh projects to get updated member list
      fetchProjects()
    } catch (error) {
      if (error.response?.data?.error?.message) {
        message.error(error.response.data.error.message)
      } else {
        message.error('Failed to add member')
      }
    }
  }

  const handleRemoveMember = async (userId) => {
    try {
      await removeProjectMember(projectId, userId)
      message.success('Member removed successfully')
      // Refresh projects to get updated member list
      fetchProjects()
    } catch (error) {
      if (error.response?.data?.error?.message) {
        message.error(error.response.data.error.message)
      } else {
        message.error('Failed to remove member')
      }
    }
  }

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
    },
    {
      key: 'members',
      label: 'Members',
    },
    {
      key: 'board',
      label: 'Kanban Board',
    },
    {
      key: 'issues',
      label: 'Issues',
    },
  ]

  const handleTabChange = (key) => {
    setActiveTab(key)
    // Keep URL at /projects/projectId, don't change it
    navigate(`/projects/${projectId}`, { replace: true })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="project-overview">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={6}>
                <Card className="overview-stat-card">
                  <Statistic
                    title="Total Issues"
                    value={issues.length}
                    prefix={<IssuesCloseOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="overview-stat-card">
                  <Statistic
                    title="In Progress"
                    value={issues.filter((i) => i.status === 'in_progress').length}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="overview-stat-card">
                  <Statistic
                    title="Completed"
                    value={issues.filter((i) => i.status === 'done').length}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="overview-stat-card">
                  <Statistic
                    title="To Do"
                    value={issues.filter((i) => i.status === 'to_do').length}
                    prefix={<IssuesCloseOutlined />}
                    valueStyle={{ color: '#8c8c8c' }}
                  />
                </Card>
              </Col>
            </Row>
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              <Col xs={24} lg={12}>
                <Card title={<span className="overview-card-title">Team Members</span>} className="overview-card">
                  <List
                    dataSource={project?.members || []}
                    renderItem={(member) => {
                      const user = member.user || users.find((u) => u.id === (member.userId || member.user?.id))
                      if (!user) return null
                      return (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar src={user.avatar}>{user.name?.[0]}</Avatar>}
                            title={user.name}
                            description={user.email}
                          />
                          <Tag color="blue">{member.role}</Tag>
                        </List.Item>
                      )
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title={<span className="overview-card-title">Recent Issues</span>} className="overview-card">
                  <List
                    dataSource={issues.slice(0, 5)}
                    renderItem={(issue) => {
                      const typeConfig = issueTypes.find((t) => t.value === issue.type)
                      const statusConfig = statuses.find((s) => s.value === issue.status)
                      return (
                        <List.Item
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setActiveTab('issues')
                            navigate(`/projects/${projectId}`, { replace: true })
                          }}
                        >
                          <List.Item.Meta
                            title={
                              <Space>
                                <span>{issue.key}</span>
                                <Tag color={typeConfig?.color} size="small">
                                  {typeConfig?.label}
                                </Tag>
                              </Space>
                            }
                            description={
                              <div>
                                <div>{issue.title}</div>
                                <Tag color={statusConfig?.color} size="small" style={{ marginTop: 4 }}>
                                  {statusConfig?.label}
                                </Tag>
                              </div>
                            }
                          />
                        </List.Item>
                      )
                    }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        )
      case 'board':
        return <KanbanBoard />
      case 'issues':
        return <Issues />
      case 'members':
        return (
          <div className="project-overview" style={{ padding: 32 }}>
            <Card
              title={
                <Space>
                  <TeamOutlined />
                  <span>Project Members</span>
                </Space>
              }
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setAddMemberModalVisible(true)}
                >
                  Add Member
                </Button>
              }
            >
              {project.members && project.members.length > 0 ? (
                <List
                  dataSource={project.members}
                  renderItem={(member) => {
                    const user = member.user || users.find((u) => u.id === (member.userId || member.user?.id))
                    if (!user) return null
                    return (
                      <List.Item
                        actions={[
                          <Popconfirm
                            key="remove"
                            title="Remove member"
                            description={`Are you sure you want to remove ${user.name} from this project?`}
                            onConfirm={() => handleRemoveMember(user.id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              type="link"
                              danger
                              icon={<UserDeleteOutlined />}
                            >
                              Remove
                            </Button>
                          </Popconfirm>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar src={user.avatar}>{user.name?.[0]}</Avatar>}
                          title={user.name}
                          description={user.email}
                        />
                        <Tag color={member.role === 'admin' ? 'red' : member.role === 'project_manager' ? 'orange' : member.role === 'developer' ? 'blue' : 'default'}>
                          {member.role}
                        </Tag>
                      </List.Item>
                    )
                  }}
                />
              ) : (
                <Empty description="No members yet" />
              )}
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="project-detail">
      <div className="project-header">
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/projects')}
          >
            Back
          </Button>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              {project.name} ({project.key})
            </Title>
            <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>
              {project.description}
            </p>
          </div>
        </Space>
      </div>
      <div className="project-tabs-wrapper">
        <Tabs
          activeKey={activeTab}
          items={tabItems}
          onChange={handleTabChange}
        />
        <div className="project-content">
          {renderTabContent()}
        </div>
      </div>
      <Modal
        title="Add Member"
        open={addMemberModalVisible}
        onCancel={() => {
          setAddMemberModalVisible(false)
          addMemberForm.resetFields()
        }}
        onOk={handleAddMember}
        okText="Add"
        cancelText="Cancel"
      >
        <Form form={addMemberForm} layout="vertical">
          <Form.Item
            name="userId"
            label="User"
            rules={[{ required: true, message: 'Please select a user' }]}
          >
            <Select
              placeholder="Select a user"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={availableUsers.map((user) => ({
                value: user.id,
                label: `${user.name} (${user.email})`,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
            initialValue="viewer"
          >
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="project_manager">Project Manager</Select.Option>
              <Select.Option value="developer">Developer</Select.Option>
              <Select.Option value="viewer">Viewer</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProjectDetail
