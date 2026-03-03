import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, Table, Tag, Select, message } from 'antd'
import type { AxiosError } from 'axios'
import type { ColumnsType } from 'antd/es/table'
import {
  DocumentTextIcon,
  PlusIcon,
  FolderIcon,
} from '@heroicons/react/24/outline'
import { documentService, type Document } from '../../services/document.service'
import { projectService, type Project } from '../../services/project.service'
import DocumentEditorModal from '@/components/documents/DocumentEditorModal'
import { LoadingBlock, PageHeader } from '@/components/ui'
import { exportDocumentAsPdf, exportDocumentAsWord } from '@/utils/documentExport'

const Documents = () => {
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState<string>('')

  const [documentsLoading, setDocumentsLoading] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])

  const [exportingId, setExportingId] = useState<string>('')

  const [editorOpen, setEditorOpen] = useState(false)
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('')

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
      title: 'PRD状态',
      key: 'prdStatus',
      render: (_, record) => {
        if ((record.type || '').toLowerCase() !== 'prd') {
          return <span className="text-sm text-gray-400">-</span>
        }

        const status = record.status || 'DRAFT'
        const color = status === 'FROZEN' ? 'green' : status === 'REVIEW' ? 'orange' : 'blue'

        return (
          <div className="flex items-center gap-2">
            <Tag color={color}>{status}</Tag>
            {record.isPrimary ? <Tag color="purple">主PRD</Tag> : null}
          </div>
        )
      },
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
      render: (_, record) => (
        <div className="flex gap-2">
          <button
            className="text-purple-600 hover:text-purple-900 text-sm font-medium cursor-pointer"
            onClick={() => {
              setSelectedDocumentId(record.id)
              setEditorOpen(true)
            }}
          >
            查看
          </button>
          <button
            className="text-gray-600 hover:text-gray-900 text-sm font-medium cursor-pointer"
            disabled={exportingId === record.id}
            onClick={() => {
              const run = async () => {
                try {
                  setExportingId(record.id)
                  const doc = await documentService.getById(record.id)
                  exportDocumentAsWord(doc.title, doc.content)
                } catch (error: unknown) {
                  const err = error as AxiosError<{ message?: string }>
                  message.error(err.response?.data?.message || '导出 Word 失败')
                } finally {
                  setExportingId('')
                }
              }
              void run()
            }}
          >
            下载 Word
          </button>
          <button
            className="text-gray-600 hover:text-gray-900 text-sm font-medium cursor-pointer"
            disabled={exportingId === record.id}
            onClick={() => {
              const run = async () => {
                try {
                  setExportingId(record.id)
                  const doc = await documentService.getById(record.id)
                  exportDocumentAsPdf(doc.title, doc.content)
                } catch (error: unknown) {
                  if (error instanceof Error && error.message === 'Popup blocked') {
                    message.error('浏览器拦截了弹窗，请允许弹窗后重试')
                    return
                  }
                  const err = error as AxiosError<{ message?: string }>
                  message.error(err.response?.data?.message || '导出 PDF 失败')
                } finally {
                  setExportingId('')
                }
              }
              void run()
            }}
          >
            下载 PDF
          </button>

          {(record.type || '').toLowerCase() === 'prd' ? (
            <>
              <button
                className="text-gray-600 hover:text-gray-900 text-sm font-medium cursor-pointer"
                disabled={!!record.isPrimary}
                onClick={() => {
                  const run = async () => {
                    try {
                      await documentService.setPrimary(record.id)
                      message.success('已设为主PRD')
                      await loadDocuments()
                    } catch (error: unknown) {
                      const err = error as AxiosError<{ message?: string }>
                      message.error(err.response?.data?.message || '设置主PRD失败')
                    }
                  }
                  void run()
                }}
              >
                设为主PRD
              </button>
              <button
                className="text-gray-600 hover:text-gray-900 text-sm font-medium cursor-pointer"
                disabled={(record.status || '') === 'FROZEN'}
                onClick={() => {
                  const run = async () => {
                    try {
                      await documentService.freeze(record.id)
                      message.success('PRD 已冻结')
                      await loadDocuments()
                    } catch (error: unknown) {
                      const err = error as AxiosError<{ message?: string }>
                      message.error(err.response?.data?.message || '冻结失败')
                    }
                  }
                  void run()
                }}
              >
                冻结
              </button>
              <button
                className="text-gray-600 hover:text-gray-900 text-sm font-medium cursor-pointer"
                disabled={(record.status || '') !== 'FROZEN'}
                onClick={() => {
                  const run = async () => {
                    try {
                      await documentService.unfreeze(record.id)
                      message.success('PRD 已解冻')
                      await loadDocuments()
                    } catch (error: unknown) {
                      const err = error as AxiosError<{ message?: string }>
                      message.error(err.response?.data?.message || '解冻失败')
                    }
                  }
                  void run()
                }}
              >
                解冻
              </button>
            </>
          ) : null}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="文档"
        subtitle="管理项目相关文档"
        right={
          <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
            <PlusIcon className="w-5 h-5" />
            上传文档
          </button>
        }
      />

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
          <LoadingBlock />
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

      <DocumentEditorModal
        open={editorOpen}
        documentId={selectedDocumentId}
        onClose={() => {
          setEditorOpen(false)
          setSelectedDocumentId('')
        }}
        onSaved={() => {
          void loadDocuments()
        }}
      />
    </div>
  )
}

export default Documents
