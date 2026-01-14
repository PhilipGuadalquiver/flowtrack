import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Tabs, Card, Button, Typography, Space, Tag, Empty } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useProjectStore } from '../../store/projectStore'
import { mockSprints } from '../../data/mockData'
import { statuses } from '../../data/mockData'
import IssueCardView from '../../components/boards/IssueCardView'
import IssueModal from '../../components/issues/IssueModal'
import './SprintBoard.css'

const { Title, Text } = Typography

function SprintBoard() {
  const { projectId } = useParams()
  const { getProjectIssues } = useProjectStore()
  const [modalVisible, setModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('backlog')

  const issues = getProjectIssues(projectId)
  const sprints = mockSprints.filter((s) => s.projectId === projectId)
  const activeSprint = sprints.find((s) => s.status === 'active')
  const backlogIssues = issues.filter((issue) => !issue.sprintId)
  const sprintIssues = activeSprint
    ? issues.filter((issue) => issue.sprintId === activeSprint.id)
    : []

  const getIssuesByStatus = (status, issueList) => {
    return issueList.filter((issue) => issue.status === status)
  }

  const tabItems = [
    {
      key: 'backlog',
      label: 'Backlog',
      children: (
        <div className="sprint-backlog">
          <div className="backlog-header">
            <Title level={4}>Backlog</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
            >
              Create Issue
            </Button>
          </div>
          <div className="backlog-issues">
            {backlogIssues.length > 0 ? (
              backlogIssues.map((issue) => (
                <IssueCardView key={issue.id} issue={issue} />
              ))
            ) : (
              <Empty description="No issues in backlog" />
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'active',
      label: activeSprint ? activeSprint.name : 'No Active Sprint',
      children: activeSprint ? (
        <div className="sprint-board">
          <div className="sprint-header">
            <div>
              <Title level={4}>{activeSprint.name}</Title>
              <Text type="secondary">{activeSprint.goal}</Text>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  {activeSprint.startDate} - {activeSprint.endDate}
                </Text>
              </div>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
            >
              Add Issue
            </Button>
          </div>
          <div className="sprint-columns">
            {statuses.map((status) => {
              const statusIssues = getIssuesByStatus(status.value, sprintIssues)
              return (
                <Card
                  key={status.value}
                  title={
                    <Space>
                      <span>{status.label}</span>
                      <Tag color={status.color}>{statusIssues.length}</Tag>
                    </Space>
                  }
                  className="sprint-column"
                >
                  <div className="sprint-column-content">
                    {statusIssues.map((issue) => (
                      <IssueCardView key={issue.id} issue={issue} />
                    ))}
                    {statusIssues.length === 0 && (
                      <Empty
                        description="No issues"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      ) : (
        <Empty description="No active sprint" />
      ),
    },
  ]

  return (
    <div className="sprint-board-page">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
      <IssueModal
        visible={modalVisible}
        projectId={projectId}
        onClose={() => setModalVisible(false)}
      />
    </div>
  )
}

export default SprintBoard
