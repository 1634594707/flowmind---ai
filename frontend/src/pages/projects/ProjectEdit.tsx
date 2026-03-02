import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Form, Input, Button, Select, InputNumber, DatePicker, message, Spin } from 'antd'
import dayjs from 'dayjs'
import { projectService, type Project, type CreateProjectDto, type UpdateProjectDto } from '../../services/project.service'

const ProjectEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    void loadProject(id)
  }, [id])

  const loadProject = async (projectId: string) => {
    try {
      setLoading(true)
      const data = await projectService.getById(projectId)
      setProject(data)
      form.setFieldsValue({
        name: data.name,
        description: data.description,
        status: data.status,
        progress: data.progress,
        startDate: data.startDate ? dayjs(data.startDate) : null,
        deadline: data.deadline ? dayjs(data.deadline) : null,
        tags: data.tags || [],
      })
    } catch (error: any) {
      console.error('Load project error:', error)
      message.error(error.response?.data?.message || '加载项目失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)

      const payload: UpdateProjectDto = {
        name: values.name,
        description: values.description,
        status: values.status,
        progress: values.progress,
        startDate: values.startDate ? values.startDate.toISOString() : undefined,
        deadline: values.deadline ? values.deadline.toISOString() : undefined,
        tags: values.tags,
      }

      if (id) {
        const updated = await projectService.update(id, payload)
        setProject(updated)
        message.success('项目更新成功')
        navigate(`/app/projects/${id}`)
      } else {
        const createPayload: CreateProjectDto = {
          name: values.name,
          description: values.description,
          status: values.status,
          startDate: values.startDate ? values.startDate.toISOString() : undefined,
          deadline: values.deadline ? values.deadline.toISOString() : undefined,
          tags: values.tags,
        }
        const created = await projectService.create(createPayload)
        message.success('项目创建成功')
        navigate(`/app/projects/${created.id}`)
      }
    } catch (error: any) {
      if (error?.errorFields) {
        return
      }
      console.error('Update project error:', error)
      message.error(error.response?.data?.message || '保存失败，请稍后重试')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spin />
      </div>
    )
  }

  if (!project) {
    if (!id) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">新建项目</h1>
              <p className="text-gray-600 mt-1">创建一个新的项目</p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => navigate('/app/projects')}>取消</Button>
              <Button type="primary" className="bg-purple-600 hover:bg-purple-700" loading={saving} onClick={handleSave}>
                创建
              </Button>
            </div>
          </div>

          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Form form={form} layout="vertical" initialValues={{ status: 'planning', progress: 0, tags: [] }}>
              <div className="grid gap-6 md:grid-cols-2">
                <Form.Item label="项目名称" name="name" rules={[{ required: true, message: '请输入项目名称' }]}>
                  <Input placeholder="请输入项目名称" />
                </Form.Item>

                <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
                  <Select
                    options={[
                      { value: 'planning', label: '计划中' },
                      { value: 'active', label: '进行中' },
                      { value: 'completed', label: '已完成' },
                      { value: 'archived', label: '已归档' },
                    ]}
                  />
                </Form.Item>

                <Form.Item label="进度" name="progress">
                  <InputNumber min={0} max={100} className="w-full" />
                </Form.Item>

                <Form.Item label="开始日期" name="startDate">
                  <DatePicker className="w-full" />
                </Form.Item>

                <Form.Item label="截止日期" name="deadline">
                  <DatePicker className="w-full" />
                </Form.Item>

                <Form.Item label="标签" name="tags" className="md:col-span-2">
                  <Select mode="tags" placeholder="输入标签后回车" />
                </Form.Item>

                <Form.Item label="描述" name="description" className="md:col-span-2">
                  <Input.TextArea rows={4} placeholder="请输入项目描述" />
                </Form.Item>
              </div>
            </Form>
          </Card>
        </div>
      )
    }

    return (
      <div className="py-12">
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <div className="text-gray-600">项目不存在或已被删除</div>
          <div className="mt-4">
            <Button onClick={() => navigate('/app/projects')}>返回项目列表</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">编辑项目</h1>
          <p className="text-gray-600 mt-1">{project.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate(`/app/projects/${project.id}`)}>取消</Button>
          <Button type="primary" className="bg-purple-600 hover:bg-purple-700" loading={saving} onClick={handleSave}>
            保存
          </Button>
        </div>
      </div>

      <Card className="rounded-xl border border-gray-200 shadow-sm">
        <Form form={form} layout="vertical">
          <div className="grid gap-6 md:grid-cols-2">
            <Form.Item label="项目名称" name="name" rules={[{ required: true, message: '请输入项目名称' }]}>
              <Input placeholder="请输入项目名称" />
            </Form.Item>

            <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
              <Select
                options={[
                  { value: 'planning', label: '计划中' },
                  { value: 'active', label: '进行中' },
                  { value: 'completed', label: '已完成' },
                  { value: 'archived', label: '已归档' },
                ]}
              />
            </Form.Item>

            <Form.Item label="进度" name="progress">
              <InputNumber min={0} max={100} className="w-full" />
            </Form.Item>

            <Form.Item label="开始日期" name="startDate">
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item label="截止日期" name="deadline">
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item label="标签" name="tags" className="md:col-span-2">
              <Select mode="tags" placeholder="输入标签后回车" />
            </Form.Item>

            <Form.Item label="描述" name="description" className="md:col-span-2">
              <Input.TextArea rows={4} placeholder="请输入项目描述" />
            </Form.Item>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default ProjectEdit
