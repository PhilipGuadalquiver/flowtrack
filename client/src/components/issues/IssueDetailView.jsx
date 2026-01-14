import { useEffect } from 'react'
import { Modal, Form, Input, Button, Descriptions, Tag, Space, Avatar, List, Typography, message, Popconfirm } from 'antd'
import { DeleteOutlined, CommentOutlined } from '@ant-design/icons'
import { useProjectStore } from '../../store/projectStore'
import { useAuthStore } from '../../store/authStore'
import { issueTypes, priorities, statuses } from '../../data/mockData'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Text, Title } = Typography

function IssueDetailView({ visible, issue, projectId, onClose }) {
  const [commentForm] = Form.useForm()
  const { projects, users, getIssueComments, fetchIssueComments, createComment, deleteComment } = useProjectStore()
  const { user } = useAuthStore()

  const project = projects.find((p) => p.id === projectId)
  const comments = issue ? getIssueComments(issue.id) : []

  useEffect(() => {
    if (issue && visible) {
      fetchIssueComments(issue.id)
      commentForm.resetFields()
    }
  }, [issue, visible, commentForm, fetchIssueComments])

  const handleAddComment = async () => {
    try {
      const values = await commentForm.validateFields()
      await createComment(issue.id, values.content, user.id)
      message.success('Comment added successfully')
      commentForm.resetFields()
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId)
      message.success('Comment deleted successfully')
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  if (!issue) return null

  const assignee = users.find((u) => u.id === issue.assigneeId)
  const reporter = users.find((u) => u.id === issue.reporterId)
  const typeConfig = issueTypes.find((t) => t.value === issue.type)
  const priorityConfig = priorities.find((p) => p.value === issue.priority)
  const statusConfig = statuses.find((s) => s.value === issue.status)

  return (
    <Modal
      title={
        <Space>
          <Text strong>{issue.key}</Text>
          <Text type="secondary">- {issue.title}</Text>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 20 }}
    >
      <Descriptions column={2} bordered style={{ marginBottom: 24 }}>
        <Descriptions.Item label="Type">
          {typeConfig && <Tag color={typeConfig.color}>{typeConfig.label}</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          {statusConfig && <Tag color={statusConfig.color}>{statusConfig.label}</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Priority">
          {priorityConfig && <Tag color={priorityConfig.color}>{priorityConfig.label}</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Story Points">
          {issue.storyPoints || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Assignee">
          {assignee ? (
            <Space>
              <Avatar src={assignee.avatar} size="small">{assignee.name[0]}</Avatar>
              <Text>{assignee.name}</Text>
            </Space>
          ) : (
            'Unassigned'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Reporter">
          {reporter ? (
            <Space>
              <Avatar src={reporter.avatar} size="small">{reporter.name[0]}</Avatar>
              <Text>{reporter.name}</Text>
            </Space>
          ) : (
            'N/A'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Due Date" span={2}>
          {issue.dueDate ? dayjs(issue.dueDate).format('YYYY-MM-DD') : 'No due date'}
        </Descriptions.Item>
        <Descriptions.Item label="Description" span={2}>
          {issue.description || 'No description'}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {dayjs(issue.createdAt).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {dayjs(issue.updatedAt).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 32, borderTop: '1px solid var(--border-color)', paddingTop: 24 }}>
        <Title level={4} style={{ marginBottom: 24 }}>
          <CommentOutlined /> Comments ({comments.length})
        </Title>
        
        <List
          dataSource={comments}
          renderItem={(comment) => (
            <List.Item
              actions={[
                <Popconfirm
                  title="Delete comment"
                  description="Are you sure you want to delete this comment?"
                  onConfirm={() => handleDeleteComment(comment.id)}
                  okText="Yes"
                  cancelText="No"
                  key="delete"
                >
                  <Button type="link" danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={comment.user?.avatar}>{comment.user?.name?.[0]}</Avatar>}
                title={
                  <Space>
                    <Text strong>{comment.user?.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')}
                    </Text>
                  </Space>
                }
                description={<Text>{comment.content}</Text>}
              />
            </List.Item>
          )}
          locale={{ emptyText: 'No comments yet' }}
          style={{ marginBottom: 16 }}
        />

        <Form form={commentForm} layout="vertical">
          <Form.Item
            name="content"
            rules={[{ required: true, message: 'Please enter a comment' }]}
          >
            <TextArea rows={3} placeholder="Add a comment..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleAddComment}>
              Add Comment
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default IssueDetailView
