import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Tag, Avatar, Space, Typography, Tooltip } from 'antd'
import { useProjectStore } from '../../store/projectStore'
import { issueTypes, priorities } from '../../data/mockData'
import './IssueCard.css'

const { Text } = Typography

function IssueCard({ issue, isDragging = false }) {
  const { users } = useProjectStore()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: issue.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging || isDragging ? 0.5 : 1,
  }

  // Backend returns assignee as an object (from Prisma include), so use it directly or fallback to assigneeId
  const assignee = issue.assignee || (issue.assigneeId ? users.find((u) => u.id === issue.assigneeId) : null)
  const typeConfig = issueTypes.find((t) => t.value === issue.type)
  const priorityConfig = priorities.find((p) => p.value === issue.priority)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`issue-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="issue-card-content">
        <div className="issue-header">
          <Text strong className="issue-key">{issue.key}</Text>
        </div>
        <div className="issue-title">{issue.title}</div>
        <div className="issue-tags">
          {typeConfig && (
            <Tag color={typeConfig.color} size="small" className="issue-type-tag">
              {typeConfig.label}
            </Tag>
          )}
        </div>
        <div className="issue-footer">
          <Space size={8}>
            {priorityConfig && (
              <Tag color={priorityConfig.color} size="small" className="issue-priority-tag">
                {priorityConfig.label}
              </Tag>
            )}
            {issue.storyPoints && (
              <Text className="issue-story-points">
                {issue.storyPoints} SP
              </Text>
            )}
          </Space>
          {assignee && (
            <Tooltip title={assignee.name}>
              <Avatar src={assignee.avatar} size={24} className="issue-assignee">
                {assignee.name[0]}
              </Avatar>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
}

export default IssueCard
