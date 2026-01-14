import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card, Typography, Badge } from 'antd'
import { 
  IssuesCloseOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  EyeOutlined 
} from '@ant-design/icons'
import IssueCard from './IssueCard'
import './KanbanColumn.css'

const { Title } = Typography

function KanbanColumn({ status, issues }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `status-${status.value}`,
  })

  const issueIds = issues.map((issue) => issue.id)

  const getStatusIcon = () => {
    switch (status.value) {
      case 'to_do':
        return <IssuesCloseOutlined style={{ color: 'rgba(255, 255, 255, 0.65)' }} />
      case 'in_progress':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />
      case 'in_review':
        return <EyeOutlined style={{ color: '#faad14' }} />
      case 'done':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />
      default:
        return <IssuesCloseOutlined style={{ color: 'rgba(255, 255, 255, 0.65)' }} />
    }
  }

  return (
    <div className="kanban-column">
      <Card className={`column-card ${isOver ? 'drag-over' : ''}`} ref={setNodeRef}>
        <div className="column-header">
          <Title level={5} style={{ margin: 0 }}>
            {getStatusIcon()}
            {status.label}
          </Title>
          <Badge count={issues.length} showZero />
        </div>
        <SortableContext
          items={issueIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="column-content">
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
            {issues.length === 0 && (
              <div className="empty-column">No issues</div>
            )}
          </div>
        </SortableContext>
      </Card>
    </div>
  )
}

export default KanbanColumn
