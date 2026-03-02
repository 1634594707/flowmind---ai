import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, Table, Tag, Select, message, Spin } from 'antd'
import type { AxiosError } from 'axios'
import type { ColumnsType } from 'antd/es/table'
import {
  DocumentTextIcon,
  PlusIcon,
  FolderIcon,
} from '@heroicons/react/24/outline'
import { documentService, type Document } from '../../services/document.service'
import { projectService, type Project } from '../../services/project.service'

const Documents = () => {
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState<string>('')

  const [documentsLoading, setDocumentsLoading] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])

  const projectName = useMemo(() => {
    return projects.find((p) => p.id === projectId)?.name || ''
  }, [projects, projectId])

  const loadProjects = useCallback(async () => {
    try {
      setProjectsLoading(true)
      const result = await projectService.getAll({ page: 1, limit: 100 })
      setProjects(result.items)
      if (!projectId && result.items.length) {
        setProjectId(result.items[0].id)
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>
      message.error(err.response?.data?.message || '加载项目失败')
    } finally {
      setProjectsLoading(false)
    }
  }, [projectId])

  const loadDocuments = useCallback(async () => {
    if (!projectId) {
      setDocuments([])
      return
    }
    try {
      setDocumentsLoading(true)
      const data = await documentService.getByProject(projectId)
      setDocuments(data)
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>
      message.error(err.response?.data?.message || '加载文档失败')
    } finally {
      setDocumentsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    void loadProjects()
  }, [loadProjects])

  useEffect(() => {
    void loadDocuments()
  }, [loadDocuments])

  const columns: ColumnsType<Document> = [
    {
      title: '文档名称',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div className="flex items-center cursor-pointer">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <DocumentTextIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{text}</div>
            <div className="text-sm text-gray-500">{record.version}</div>
          </div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color="blue">{type}</Tag>
      ),
    },
    {
      title: '所属项目',
      dataIndex: 'projectId',
      key: 'projectId',
      render: () => (
        <div className="flex items-center gap-2">
          <FolderIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">{projectName || '-'}</span>
        </div>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => (
        <span className="text-sm text-gray-500">{new Date(date).toLocaleString()}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <div className="flex gap-2">
          <button className="text-purple-600 hover:text-purple-900 text-sm font-medium cursor-pointer">
            查看
          </button>
          <button className="text-gray-600 hover:text-gray-900 text-sm font-medium cursor-pointer">
            下载
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">文档</h1>
          <p className="text-gray-600 mt-1">管理项目相关文档</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
          <PlusIcon className="w-5 h-5" />
          上传文档
        </button>
      </div>

      <Card className="rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">选择项目</div>
            <Select
              className="min-w-[260px]"
              value={projectId || undefined}
              loading={projectsLoading}
              onChange={(v) => setProjectId(v)}
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
              placeholder="请选择项目"
              showSearch
              optionFilterProp="label"
            />
          </div>

          <button
            className="text-purple-600 hover:text-purple-900 text-sm font-medium cursor-pointer"
            onClick={() => void loadDocuments()}
            disabled={documentsLoading || !projectId}
          >
            刷新
          </button>
        </div>
      </Card>

      <Card className="rounded-xl border border-gray-200 shadow-sm">
        {documentsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spin />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={documents}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 个文档`,
            }}
          />
        )}
      </Card>
    </div>
  )
}

export default Documents
