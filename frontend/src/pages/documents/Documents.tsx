import { Card, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  DocumentTextIcon,
  PlusIcon,
  FolderIcon,
} from '@heroicons/react/24/outline'

interface DocumentType {
  id: string
  name: string
  type: string
  project: string
  updatedAt: string
  size: string
}

const Documents = () => {
  const documents: DocumentType[] = [
    {
      id: '1',
      name: '需求分析文档.docx',
      type: 'Word',
      project: 'FlowMind 平台',
      updatedAt: '2026-03-01',
      size: '2.4 MB',
    },
    {
      id: '2',
      name: 'API 设计规范.pdf',
      type: 'PDF',
      project: 'FlowMind 平台',
      updatedAt: '2026-02-28',
      size: '1.8 MB',
    },
  ]

  const columns: ColumnsType<DocumentType> = [
    {
      title: '文档名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center cursor-pointer">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <DocumentTextIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{text}</div>
            <div className="text-sm text-gray-500">{record.size}</div>
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
      dataIndex: 'project',
      key: 'project',
      render: (project) => (
        <div className="flex items-center gap-2">
          <FolderIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">{project}</span>
        </div>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => (
        <span className="text-sm text-gray-500">{date}</span>
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
      </Card>
    </div>
  )
}

export default Documents
