import { Card, Tag, Avatar, Space, Typography, Tooltip } from 'antd'
import { useProjectStore } from '../../store/projectStore'
import { issueTypes, priorities } from '../../data/mockData'
import './IssueCard.css'

const { Text } = Typography

function IssueCardView({ issue }) {
  const { users } = useProjectStore()

  // Backend returns assignee as an object (from Prisma include), so use it directly or fallback to assigneeId
  const assignee = issue.assignee || (issue.assigneeId ? users.find((u) => u.id === issue.assigneeId) : null)
  const typeConfig = issueTypes.find((t) => t.value === issue.type)
  const priorityConfig = priorities.find((p) => p.value === issue.priority)

  return (
    <div className="issue-card-view">
      <Card size="small" className="issue-card-content">
        <div className="issue-header">
          <Text strong style={{ fontSize: 13 }}>{issue.key}</Text>
          <Tag color={typeConfig?.color} size="small" style={{ borderRadius: 4, fontWeight: 500 }}>
            {typeConfig?.label}
          </Tag>
        </div>
        <div className="issue-title">{issue.title}</div>
        <div className="issue-footer">
          <Space>
            {priorityConfig && (
              <Tag color={priorityConfig.color} size="small" style={{ borderRadius: 4, fontWeight: 500 }}>
                {priorityConfig.label}
              </Tag>
            )}
            {issue.storyPoints && (
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                {issue.storyPoints} SP
              </Text>
            )}
          </Space>
          {assignee && (
            <Tooltip title={assignee.name}>
              <Avatar src={assignee.avatar} size="small" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {assignee.name[0]}
              </Avatar>
            </Tooltip>
          )}
        </div>
      </Card>
    </div>
  )
}

export default IssueCardView
