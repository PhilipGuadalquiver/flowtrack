import { useEffect } from 'react'
import { Modal, Form, Input, Select, Button } from 'antd'
import { useProjectStore } from '../../store/projectStore'
import { useAuthStore } from '../../store/authStore'

const { TextArea } = Input

function ProjectModal({ visible, project, onClose }) {
  const [form] = Form.useForm()
  const { createProject, updateProject } = useProjectStore()
  const { user } = useAuthStore()

  useEffect(() => {
    if (project) {
      form.setFieldsValue(project)
    } else {
      form.resetFields()
    }
  }, [project, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (project) {
        updateProject(project.id, values)
      } else {
        createProject({
          ...values,
          members: [user.id],
          status: 'active',
        })
      }
      onClose()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <Modal
      title={project ? 'Edit Project' : 'Create Project'}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {project ? 'Update' : 'Create'}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Project Name"
          rules={[{ required: true, message: 'Please enter project name' }]}
        >
          <Input placeholder="Enter project name" />
        </Form.Item>
        <Form.Item
          name="key"
          label="Project Key"
          rules={[{ required: true, message: 'Please enter project key' }]}
        >
          <Input placeholder="e.g., ECOM" maxLength={10} />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <TextArea rows={4} placeholder="Enter project description" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="archived">Archived</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ProjectModal
