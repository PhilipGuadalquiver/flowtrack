import { useParams } from 'react-router-dom'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useState, useEffect } from 'react'
import { Typography, Card, Button, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useProjectStore } from '../../store/projectStore'
import { statuses } from '../../data/mockData'
import KanbanColumn from '../../components/boards/KanbanColumn'
import IssueCard from '../../components/boards/IssueCard'
import IssueModal from '../../components/issues/IssueModal'
import './KanbanBoard.css'

const { Title } = Typography

function KanbanBoard() {
  const { projectId } = useParams()
  const { getProjectIssues, moveIssue, users, fetchProjectIssues } = useProjectStore()
  const [modalVisible, setModalVisible] = useState(false)
  const [activeId, setActiveId] = useState(null)

  const issues = getProjectIssues(projectId)

  useEffect(() => {
    if (projectId) {
      fetchProjectIssues(projectId)
    }
  }, [projectId, fetchProjectIssues])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const issueId = active.id
    let newStatus = null

    // Check if dropped on a status column
    if (over.id && over.id.startsWith('status-')) {
      newStatus = over.id.replace('status-', '')
    } 
    // Check if dropped on an issue card (get its current status)
    else {
      const droppedIssue = issues.find((issue) => issue.id === over.id)
      if (droppedIssue) {
        newStatus = droppedIssue.status
      }
    }

    if (newStatus) {
      const currentIssue = issues.find((issue) => issue.id === issueId)
      // Only move if status actually changed
      if (currentIssue && currentIssue.status !== newStatus) {
        moveIssue(issueId, newStatus)
      }
    }
  }

  const getIssuesByStatus = (status) => {
    return issues.filter((issue) => issue.status === status)
  }

  const activeIssue = issues.find((issue) => issue.id === activeId)

  return (
    <div className="kanban-board">
      <div className="board-header">
        <Title level={3}>Kanban Board</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Create Issue
        </Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-columns">
          {statuses.map((status) => {
            const statusIssues = getIssuesByStatus(status.value)
            return (
              <KanbanColumn
                key={status.value}
                status={status}
                issues={statusIssues}
              />
            )
          })}
        </div>
        <DragOverlay>
          {activeIssue ? <IssueCard issue={activeIssue} isDragging /> : null}
        </DragOverlay>
      </DndContext>
      <IssueModal
        visible={modalVisible}
        projectId={projectId}
        onClose={() => setModalVisible(false)}
      />
    </div>
  )
}

export default KanbanBoard
