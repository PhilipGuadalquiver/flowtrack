import { useEffect } from 'react'
import { Modal, Form, Input, Select, Button, DatePicker, message } from 'antd'
import { useProjectStore } from '../../store/projectStore'
import { useAuthStore } from '../../store/authStore'
import { issueTypes, priorities, statuses } from '../../data/mockData'
import dayjs from 'dayjs'

const { TextArea } = Input

function IssueModal({ visible, issue, projectId, onClose }) {
  const [form] = Form.useForm()
  const { createIssue, updateIssue, users, fetchUsers } = useProjectStore()
  const { user } = useAuthStore()

  // Fetch users when modal opens
  useEffect(() => {
    if (visible) {
      fetchUsers()
    }
  }, [visible, fetchUsers])

  useEffect(() => {
    if (issue) {
      // Backend returns assignee as an object, so extract the ID
      const assigneeId = issue.assignee?.id || issue.assigneeId || issue.assignee
      form.setFieldsValue({
        ...issue,
        assignee: assigneeId,
        dueDate: issue.dueDate ? dayjs(issue.dueDate) : null,
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        projectId,
        reporter: user.id,
        status: 'to_do',
        priority: 'medium',
        type: 'task',
      })
    }
  }, [issue, projectId, user, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const issueData = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
      }
      
      // Remove projectId and key from issueData for creation (backend generates key)
      if (!issue) {
        delete issueData.projectId
        delete issueData.key
      } else {
        // For updates, keep the key if it exists
        issueData.key = issue.key
      }
      
      if (issue) {
        await updateIssue(issue.id, issueData)
        message.success('Issue updated successfully')
      } else {
        await createIssue(projectId, issueData)
        message.success('Issue created successfully')
      }
      onClose()
    } catch (error) {
      console.error('Error saving issue:', error)
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to save issue'
      message.error(errorMessage)
    }
  }

  return (
    <Modal
      title={issue ? 'Edit Issue' : 'Create Issue'}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {issue ? 'Update' : 'Create'}
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="projectId" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="Issue Type"
          rules={[{ required: true }]}
        >
          <Select>
            {issueTypes.map((type) => (
              <Select.Option key={type.value} value={type.value}>
                {type.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter issue title' }]}
        >
          <Input placeholder="Enter issue title" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <TextArea rows={4} placeholder="Enter issue description" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true }]}
        >
          <Select>
            {statuses.map((status) => (
              <Select.Option key={status.value} value={status.value}>
                {status.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true }]}
        >
          <Select>
            {priorities.map((priority) => (
              <Select.Option key={priority.value} value={priority.value}>
                {priority.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="assignee" label="Assignee">
          <Select allowClear placeholder="Select assignee">
            {users.map((u) => (
              <Select.Option key={u.id} value={u.id}>
                {u.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="reporter" label="Reporter" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="storyPoints" label="Story Points">
          <Input type="number" placeholder="Enter story points" />
        </Form.Item>
        <Form.Item name="dueDate" label="Due Date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="labels" label="Labels">
          <Select
            mode="tags"
            placeholder="Enter labels"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default IssueModal
