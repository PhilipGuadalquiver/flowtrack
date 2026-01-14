import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  Typography,
  Input,
  Select,
  Card,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { useProjectStore } from '../../store/projectStore'
import { issueTypes, priorities, statuses } from '../../data/mockData'
import IssueModal from '../../components/issues/IssueModal'
import IssueDetailView from '../../components/issues/IssueDetailView'
import './Issues.css'

const { Title } = Typography
const { Search } = Input

function Issues() {
  const { projectId } = useParams()
  const {
    getProjectIssues,
    deleteIssue,
    users,
    projects,
  } = useProjectStore()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingIssue, setEditingIssue] = useState(null)
  const [detailViewVisible, setDetailViewVisible] = useState(false)
  const [viewingIssue, setViewingIssue] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    status: null,
    type: null,
    priority: null,
  })

  const project = projects.find((p) => p.id === projectId)
  const issues = getProjectIssues(projectId)

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      !filters.search ||
      issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      issue.key.toLowerCase().includes(filters.search.toLowerCase())
    const matchesStatus = !filters.status || issue.status === filters.status
    const matchesType = !filters.type || issue.type === filters.type
    const matchesPriority =
      !filters.priority || issue.priority === filters.priority
    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const getUserName = (assigneeOrId) => {
    // Backend returns assignee as an object (from Prisma include), so handle both cases
    if (!assigneeOrId) return 'Unassigned'
    if (typeof assigneeOrId === 'object' && assigneeOrId.name) {
      return assigneeOrId.name
    }
    const user = users.find((u) => u.id === assigneeOrId)
    return user?.name || 'Unassigned'
  }

  const getTypeConfig = (type) => {
    return issueTypes.find((t) => t.value === type) || issueTypes[0]
  }

  const getPriorityConfig = (priority) => {
    return priorities.find((p) => p.value === priority) || priorities[2]
  }

  const getStatusConfig = (status) => {
    return statuses.find((s) => s.value === status) || statuses[0]
  }

  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      width: 100,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => {
        const config = getTypeConfig(type)
        return <Tag color={config.color}>{config.label}</Tag>
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status)
        return <Tag color={config.color}>{config.label}</Tag>
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => {
        const config = getPriorityConfig(priority)
        return <Tag color={config.color}>{config.label}</Tag>
      },
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 120,
      render: (assignee) => getUserName(assignee),
    },
    {
      title: 'Story Points',
      dataIndex: 'storyPoints',
      key: 'storyPoints',
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setViewingIssue(record)
              setDetailViewVisible(true)
            }}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingIssue(record)
              setModalVisible(true)
            }}
          />
          <Popconfirm
            title="Delete issue"
            description="Are you sure you want to delete this issue?"
            onConfirm={() => deleteIssue(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleCreate = () => {
    setEditingIssue(null)
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setEditingIssue(null)
  }

  return (
    <div className="issues-page">
      <div className="page-header">
        <Title level={3} className="issues-title">
          Issues {project && `- ${project.name}`}
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          className="create-issue-btn"
        >
          Create Issue
        </Button>
      </div>
      <Card className="issues-card">
        <div className="filters-section">
          <Space wrap size="middle">
            <Search
              placeholder="Search issues"
              allowClear
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
              enterButton={<SearchOutlined />}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              onSearch={(value) =>
                setFilters({ ...filters, search: value })
              }
            />
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => setFilters({ ...filters, status: value })}
            >
              {statuses.map((status) => (
                <Select.Option key={status.value} value={status.value}>
                  {status.label}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="Type"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => setFilters({ ...filters, type: value })}
            >
              {issueTypes.map((type) => (
                <Select.Option key={type.value} value={type.value}>
                  {type.label}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="Priority"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => setFilters({ ...filters, priority: value })}
            >
              {priorities.map((priority) => (
                <Select.Option key={priority.value} value={priority.value}>
                  {priority.label}
                </Select.Option>
              ))}
            </Select>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={filteredIssues}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} issues`
          }}
          className="issues-table"
        />
      </Card>
      <IssueModal
        visible={modalVisible}
        issue={editingIssue}
        projectId={projectId}
        onClose={handleModalClose}
      />
      <IssueDetailView
        visible={detailViewVisible}
        issue={viewingIssue}
        projectId={projectId}
        onClose={() => {
          setDetailViewVisible(false)
          setViewingIssue(null)
        }}
      />
    </div>
  )
}

export default Issues
