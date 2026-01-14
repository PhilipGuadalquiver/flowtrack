import { useState, useEffect } from 'react'
import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  Popconfirm,
  Typography,
  Input,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '../../store/projectStore'
import ProjectModal from '../../components/projects/ProjectModal'
import './Projects.css'

const { Title } = Typography
const { Search } = Input

function Projects() {
  const navigate = useNavigate()
  const { projects, deleteProject, fetchProjects } = useProjectStore()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchText.toLowerCase()) ||
      project.key.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      width: 100,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => navigate(`/projects/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Members',
      dataIndex: 'members',
      key: 'members',
      render: (members) => `${members?.length || 0} members`,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProject(record)
              setModalVisible(true)
            }}
          />
          <Popconfirm
            title="Delete project"
            description="Are you sure you want to delete this project?"
            onConfirm={() => deleteProject(record.id)}
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
    setEditingProject(null)
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setEditingProject(null)
  }

  return (
    <div className="projects-page">
      <div className="page-header">
        <Title level={2}>Projects</Title>
        <Space>
          <Search
            placeholder="Search projects"
            allowClear
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            New Project
          </Button>
        </Space>
      </div>
      <Card>
        <Table
          columns={columns}
          dataSource={filteredProjects}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
      <ProjectModal
        visible={modalVisible}
        project={editingProject}
        onClose={handleModalClose}
      />
    </div>
  )
}

export default Projects
