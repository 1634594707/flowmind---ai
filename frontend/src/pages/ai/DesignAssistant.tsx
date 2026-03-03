import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, Select, Input, Button, message } from 'antd'
import type { AxiosError } from 'axios'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { aiService } from '@/services/ai.service'
import { projectService, type Project } from '@/services/project.service'
import { documentService, type Document } from '@/services/document.service'
import { taskService } from '@/services/task.service'
import DocumentEditorModal from '@/components/documents/DocumentEditorModal'
import { PageHeader, LoadingBlock } from '@/components/ui'

const { TextArea } = Input

type Mode = 'architecture' | 'api-spec' | 'tech-stack' | 'database'

const DesignAssistant = () => {
  const [mode, setMode] = useState<Mode>('architecture')

  const [projectsLoading, setProjectsLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState<string>('')

  const [docsLoading, setDocsLoading] = useState(false)
  const [docs, setDocs] = useState<Document[]>([])
  const [sourceDocumentId, setSourceDocumentId] = useState<string>('')

  const [context, setContext] = useState('')
  const [documentTitle, setDocumentTitle] = useState('')

  const [generating, setGenerating] = useState(false)
  const [resultContent, setResultContent] = useState('')
  const [resultDocumentId, setResultDocumentId] = useState('')
  const [editorOpen, setEditorOpen] = useState(false)

  const projectName = useMemo(() => {
    return projects.find((p) => p.id === projectId)?.name || ''
  }, [projects, projectId])

  const modeLabel = useMemo(() => {
    const map: Record<Mode, string> = {
      architecture: '架构设计建议',
      'api-spec': 'API 接口定义',
      database: '数据库设计建议',
      'tech-stack': '技术选型推荐',
    }
    return map[mode]
  }, [mode])

  const handleDecomposeTasks = async () => {
    if (!canGenerate) {
      return
    }

    try {
      setGenerating(true)
      const payload = {
        projectId,
        sourceDocumentId: sourceDocumentId || undefined,
        context: context.trim() || undefined,
      }
      const tasks = await taskService.decompose(payload)
      message.success(`已创建 ${tasks.length} 条任务，可在任务管理中推进状态`)
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>
      message.error(err.response?.data?.message || '任务拆解失败')
    } finally {
      setGenerating(false)
    }
  }

  const markdownComponents = useMemo<Components>(() => {
    return {
      h1: ({ children }) => <h1 className="text-lg font-semibold my-2">{children}</h1>,
      h2: ({ children }) => <h2 className="text-base font-semibold my-2">{children}</h2>,
      h3: ({ children }) => <h3 className="text-sm font-semibold my-2">{children}</h3>,
      p: ({ children }) => <p className="my-1 whitespace-pre-wrap">{children}</p>,
      ul: ({ children }) => <ul className="list-disc pl-5 my-1">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal pl-5 my-1">{children}</ol>,
      li: ({ children }) => <li className="my-0.5">{children}</li>,
      code: ({ className, children }) => {
        const text = String(children ?? '')
        const isBlock = text.includes('\n')
        if (!isBlock) {
          return <code className="px-1 py-0.5 rounded bg-gray-200">{children}</code>
        }
        return (
          <pre className="my-2 overflow-auto rounded bg-gray-900 p-3 text-gray-100">
            <code className={className}>{children}</code>
          </pre>
        )
      },
    }
  }, [])

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

  const loadDocs = useCallback(async () => {
    if (!projectId) {
      setDocs([])
      setSourceDocumentId('')
      return
    }
    try {
      setDocsLoading(true)
      const list = await documentService.getByProject(projectId)
      setDocs(list)
      if (sourceDocumentId && !list.some((d) => d.id === sourceDocumentId)) {
        setSourceDocumentId('')
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>
      message.error(err.response?.data?.message || '加载文档失败')
    } finally {
      setDocsLoading(false)
    }
  }, [projectId, sourceDocumentId])

  useEffect(() => {
    void loadProjects()
  }, [loadProjects])

  useEffect(() => {
    void loadDocs()
  }, [loadDocs])

  const canGenerate = useMemo(() => {
    return !!projectId && (!!sourceDocumentId || context.trim().length > 0)
  }, [context, projectId, sourceDocumentId])

  const handleGenerate = async () => {
    if (!canGenerate) {
      return
    }

    try {
      setGenerating(true)
      setResultContent('')
      setResultDocumentId('')

      const payload = {
        projectId,
        sourceDocumentId: sourceDocumentId || undefined,
        context: context.trim() || undefined,
        documentTitle: documentTitle.trim() || undefined,
      }

      if (mode === 'architecture') {
        const result = await aiService.generateArchitecture(payload)
        setResultContent(result.content)
        setResultDocumentId(result.document.id)
      } else if (mode === 'api-spec') {
        const result = await aiService.generateApiSpec(payload)
        setResultContent(result.content)
        setResultDocumentId(result.document.id)
      } else if (mode === 'tech-stack') {
        const result = await aiService.generateTechStack(payload)
        setResultContent(result.content)
        setResultDocumentId(result.document.id)
      } else {
        const result = await aiService.generateDatabaseDesign(payload)
        setResultContent(result.content)
        setResultDocumentId(result.document.id)
      }

      message.success(`${modeLabel}已生成并保存为文档`)
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>
      message.error(err.response?.data?.message || '生成失败')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="设计助手" subtitle="基于 PRD/上下文生成架构建议、API 定义与数据库设计" />

      <Card className="rounded-xl border border-gray-200 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-sm text-gray-600 mb-2">选择项目</div>
            <Select
              className="w-full"
              value={projectId || undefined}
              loading={projectsLoading}
              onChange={(v) => setProjectId(v)}
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
              placeholder="请选择项目"
              showSearch
              optionFilterProp="label"
            />
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-2">能力</div>
            <Select
              className="w-full"
              value={mode}
              onChange={(v) => setMode(v as Mode)}
              options={[
                { value: 'architecture', label: '架构设计建议' },
                { value: 'api-spec', label: 'API 接口定义' },
                { value: 'tech-stack', label: '技术选型推荐' },
                { value: 'database', label: '数据库设计建议' },
              ]}
            />
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-2">文档标题（可选）</div>
            <Input value={documentTitle} onChange={(e) => setDocumentTitle(e.target.value)} placeholder={`${projectName || ''}${modeLabel}`} />
          </div>

          <div className="md:col-span-3">
            <div className="text-sm text-gray-600 mb-2">参考文档（可选）</div>
            <Select
              className="w-full"
              value={sourceDocumentId || undefined}
              loading={docsLoading}
              onChange={(v) => setSourceDocumentId(v)}
              options={docs.map((d) => ({ value: d.id, label: `${d.title} (${d.type})` }))}
              placeholder="选择一个 PRD/设计文档作为输入（也可以不选，直接填写上下文）"
              allowClear
              showSearch
              optionFilterProp="label"
            />
          </div>

          <div className="md:col-span-3">
            <div className="text-sm text-gray-600 mb-2">补充上下文（可选）</div>
            <TextArea
              rows={5}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="可以粘贴需求摘要、约束条件、技术栈等。至少需要填写上下文或选择参考文档。"
            />
          </div>

          <div className="md:col-span-3 flex items-center justify-end gap-2">
            <Button onClick={() => void loadDocs()} disabled={!projectId || docsLoading}>
              刷新文档
            </Button>
            <Button loading={generating} disabled={!canGenerate} onClick={() => void handleDecomposeTasks()}>
              拆解并创建任务
            </Button>
            <Button type="primary" className="bg-purple-600 hover:bg-purple-700" loading={generating} disabled={!canGenerate} onClick={() => void handleGenerate()}>
              生成并保存
            </Button>
          </div>
        </div>
      </Card>

      <Card className="rounded-xl border border-gray-200 shadow-sm">
        {generating ? (
          <LoadingBlock />
        ) : resultContent ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-gray-900 font-semibold">生成结果预览</div>
              <div className="flex items-center gap-2">
                <Button disabled={!resultDocumentId} onClick={() => setEditorOpen(true)}>
                  打开文档
                </Button>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-[520px] overflow-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {resultContent}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">生成后，这里会显示预览（同时已保存到文档模块）</div>
        )}
      </Card>

      <DocumentEditorModal
        open={editorOpen}
        documentId={resultDocumentId}
        onClose={() => setEditorOpen(false)}
        onSaved={(doc) => {
          setResultContent(doc.content)
        }}
      />
    </div>
  )
}

export default DesignAssistant
