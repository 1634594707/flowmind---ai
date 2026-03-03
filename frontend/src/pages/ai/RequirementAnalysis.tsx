import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Card, Input, Button, Select, message, Typography, Divider, List } from 'antd'
import type { AxiosError } from 'axios'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { aiService, type RequirementMessage, type RequirementSession } from '../../services/ai.service'
import { projectService, type Project } from '../../services/project.service'
import DocumentEditorModal from '@/components/documents/DocumentEditorModal'
import { LoadingBlock, PageHeader } from '@/components/ui'

const { TextArea } = Input
const { Text } = Typography

const RequirementAnalysis = () => {
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState<string>('')

  const [creatingSession, setCreatingSession] = useState(false)
  const [sessionTitle, setSessionTitle] = useState('')
  const [sessionSummary, setSessionSummary] = useState('')

  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [sessions, setSessions] = useState<RequirementSession[]>([])
  const [sessionPreviews, setSessionPreviews] = useState<Record<string, string>>({})

  const [sessionLoading, setSessionLoading] = useState(false)
  const [session, setSession] = useState<RequirementSession | null>(null)
  const [messages, setMessages] = useState<RequirementMessage[]>([])

  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const [generating, setGenerating] = useState(false)
  const [prdContent, setPrdContent] = useState('')
  const [prdDocumentId, setPrdDocumentId] = useState<string>('')

  const [prdEditorOpen, setPrdEditorOpen] = useState(false)

  const projectName = useMemo(() => {
    return projects.find((p) => p.id === projectId)?.name || ''
  }, [projects, projectId])

  const formatId = useCallback((id: string, left = 8, right = 6) => {
    if (!id) {
      return ''
    }
    if (id.length <= left + right + 3) {
      return id
    }
    return `${id.slice(0, left)}...${id.slice(-right)}`
  }, [])

  const formatShortId = useCallback(
    (id: string) => {
      const formatted = formatId(id)
      return formatted ? `#${formatted}` : ''
    },
    [formatId],
  )

  const buildPreview = useCallback((text: string) => {
    const normalized = text.replace(/\s+/g, ' ').trim()
    if (!normalized) {
      return ''
    }
    return normalized.length > 60 ? `${normalized.slice(0, 60)}...` : normalized
  }, [])

  const markdownComponents = useMemo<Components>(() => {
    return {
      h1: ({ children }: { children?: ReactNode }) => <h1 className="text-lg font-semibold my-2">{children}</h1>,
      h2: ({ children }: { children?: ReactNode }) => <h2 className="text-base font-semibold my-2">{children}</h2>,
      h3: ({ children }: { children?: ReactNode }) => <h3 className="text-sm font-semibold my-2">{children}</h3>,
      p: ({ children }: { children?: ReactNode }) => <p className="my-1 whitespace-pre-wrap">{children}</p>,
      ul: ({ children }: { children?: ReactNode }) => <ul className="list-disc pl-5 my-1">{children}</ul>,
      ol: ({ children }: { children?: ReactNode }) => <ol className="list-decimal pl-5 my-1">{children}</ol>,
      li: ({ children }: { children?: ReactNode }) => <li className="my-0.5">{children}</li>,
      code: ({ inline, className, children }: { inline?: boolean; className?: string; children?: ReactNode }) => {
        if (inline) {
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

  const formatTime = useCallback((iso: string) => {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) {
      return ''
    }
    return d.toLocaleString()
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

  const loadSessions = useCallback(async () => {
    if (!projectId) {
      setSessions([])
      return
    }

    try {
      setSessionsLoading(true)
      const data = await aiService.listRequirementSessions(projectId)
      setSessions(data)
      setSessionPreviews((prev) => {
        const next = { ...prev }
        for (const s of data) {
          if (!next[s.id]) {
            const base = s.lastMessage?.content ? s.lastMessage.content : s.summary ? s.summary : ''
            next[s.id] = base ? buildPreview(base) : ''
          }
        }
        return next
      })
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>
      message.error(err.response?.data?.message || '加载会话列表失败')
    } finally {
      setSessionsLoading(false)
    }
  }, [projectId, buildPreview])

  useEffect(() => {
    void loadProjects()
  }, [loadProjects])

  useEffect(() => {
    void loadSessions()
  }, [loadSessions])

  const canCreateSession = useMemo(() => {
    return !!projectId && sessionTitle.trim().length > 0
  }, [projectId, sessionTitle])

  const handleCreateSession = async () => {
    if (!canCreateSession) {
      return
    }
    try {
      setCreatingSession(true)
      const created = await aiService.createRequirementSession({
        projectId,
        title: sessionTitle.trim(),
        summary: sessionSummary.trim() || undefined,
      })
      setSession(created)
      setSessions((prev) => [created, ...prev])
      setMessages([])
      setPrdContent('')
      setPrdDocumentId('')
      message.success('会话创建成功')
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>
      message.error(err.response?.data?.message || '创建会话失败')
    } finally {
      setCreatingSession(false)
    }
  }

  const handleSend = async () => {
    if (!session || !input.trim()) {
      return
    }

    const content = input.trim()
    setInput('')

    try {
      setSending(true)
      const result = await aiService.chat(session.id, content)
      setMessages((prev) => [...prev, result.userMessage, result.assistantMessage])
      setSessions((prev) => prev.map((s) => (s.id === session.id ? { ...s, updatedAt: new Date().toISOString() } : s)))
      setSessionPreviews((prev) => ({
        ...prev,
        [session.id]: buildPreview(result.assistantMessage.content || result.userMessage.content),
      }))
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>
      message.error(err.response?.data?.message || '发送失败')
    } finally {
      setSending(false)
    }
  }

  const handleGeneratePrd = async () => {
    if (!session) {
      return
    }
    try {
      setGenerating(true)
      const result = await aiService.generatePrd(session.id, {
        documentTitle: `${session.title} - PRD`,
      })
      setPrdContent(result.content)
      setPrdDocumentId(result.document.id)
      message.success('PRD 已生成并保存为文档')
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>
      message.error(err.response?.data?.message || '生成 PRD 失败')
    } finally {
      setGenerating(false)
    }
  }

  const handleReloadSession = async () => {
    if (!session) {
      return
    }
    try {
      setSessionLoading(true)
      const data = await aiService.getRequirementSession(session.id)
      setSession(data)
      setMessages(data.messages || [])
      const last = data.messages?.length ? data.messages[data.messages.length - 1] : undefined
      if (last?.content) {
        setSessionPreviews((prev) => ({ ...prev, [data.id]: buildPreview(last.content) }))
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>
      message.error(err.response?.data?.message || '加载会话失败')
    } finally {
      setSessionLoading(false)
    }
  }

  const handleSelectSession = async (selected: RequirementSession) => {
    try {
      setSessionLoading(true)
      const data = await aiService.getRequirementSession(selected.id)
      setSession(data)
      setMessages(data.messages || [])
      setPrdContent('')
      setPrdDocumentId('')
      const last = data.messages?.length ? data.messages[data.messages.length - 1] : undefined
      if (last?.content) {
        setSessionPreviews((prev) => ({ ...prev, [data.id]: buildPreview(last.content) }))
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>
      message.error(err.response?.data?.message || '加载会话失败')
    } finally {
      setSessionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="AI 需求分析" subtitle="通过对话澄清需求，并一键生成 PRD" />

      <Card className="rounded-xl border border-gray-200 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
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

          <div className="md:col-span-2">
            <div className="text-sm text-gray-600 mb-2">会话标题</div>
            <Input value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)} placeholder="例如：电商购物车需求访谈" />
          </div>

          <div className="md:col-span-3">
            <div className="text-sm text-gray-600 mb-2">背景/目标（可选）</div>
            <TextArea
              rows={3}
              value={sessionSummary}
              onChange={(e) => setSessionSummary(e.target.value)}
              placeholder="例如：提升下单转化率，支持多规格商品、促销与库存校验"
            />
          </div>

          <div className="md:col-span-3 flex items-center justify-end gap-2">
            <Button onClick={() => void loadProjects()} disabled={projectsLoading}>
              刷新项目
            </Button>
            <Button onClick={() => void loadSessions()} disabled={sessionsLoading || !projectId}>
              刷新会话
            </Button>
            <Button
              type="primary"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!canCreateSession}
              loading={creatingSession}
              onClick={() => void handleCreateSession()}
            >
              创建会话
            </Button>
          </div>
        </div>
      </Card>

      <Card className="rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold text-gray-900">历史会话</div>
          <div className="text-sm text-gray-500">
            当前项目：
            {projectId ? (
              <Text copyable={{ text: projectId }}>{projectName ? projectName : formatId(projectId)}</Text>
            ) : (
              '未选择'
            )}
          </div>
        </div>

        {sessionsLoading ? (
          <LoadingBlock className="flex items-center justify-center py-6" />
        ) : sessions.length === 0 ? (
          <div className="text-gray-600">暂无历史会话。你可以先创建一个会话。</div>
        ) : (
          <List
            dataSource={sessions}
            renderItem={(item) => (
              <List.Item
                className={
                  session?.id === item.id
                    ? 'bg-purple-50 rounded-lg px-3 border-l-4 border-purple-600'
                    : 'px-3 border-l-4 border-transparent'
                }
                onClick={() => void handleSelectSession(item)}
                style={{ cursor: 'pointer' }}
              >
                <List.Item.Meta
                  title={<div className="text-gray-900 font-medium">{item.title}</div>}
                  description={
                    <div className="space-y-1">
                      <div className="text-gray-500 text-xs">
                        <Text copyable={{ text: item.id }}>{formatShortId(item.id)}</Text>
                      </div>
                      {sessionPreviews[item.id] ? <div className="text-gray-600 text-xs">{sessionPreviews[item.id]}</div> : null}
                      <div className="text-gray-400 text-xs">更新时间：{formatTime(item.updatedAt)}</div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      <Card className="rounded-xl border border-gray-200 shadow-sm">
        {!session ? (
          <div className="text-gray-600">请先创建一个会话开始访谈。</div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-900">{session.title}</div>
                <div className="text-sm text-gray-500">
                  Session ID: <Text copyable={{ text: session.id }}>{formatShortId(session.id)}</Text>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => void handleReloadSession()} loading={sessionLoading}>
                  同步消息
                </Button>
                <Button type="primary" className="bg-orange-500 hover:bg-orange-600" onClick={() => void handleGeneratePrd()} loading={generating}>
                  生成 PRD
                </Button>
              </div>
            </div>

            <Divider className="my-2" />

            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-gray-500">还没有消息，先从一句需求描述开始。</div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                    <div
                      className={
                        m.role === 'user'
                          ? 'inline-block max-w-[85%] bg-purple-600 text-white px-4 py-2 rounded-2xl'
                          : 'inline-block max-w-[85%] bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl'
                      }
                    >
                      <div className={m.role === 'user' ? '[&_*]:text-white' : ''}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={markdownComponents}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <TextArea
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入你的需求描述/补充信息，然后发送"
              />
              <Button type="primary" className="bg-purple-600 hover:bg-purple-700" loading={sending} onClick={() => void handleSend()}>
                发送
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Card className="rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold text-gray-900">PRD 输出</div>
          <div className="flex items-center gap-3">
            {prdDocumentId ? (
              <div className="text-sm text-gray-500">
                Document ID: <Text copyable={{ text: prdDocumentId }}>{formatShortId(prdDocumentId)}</Text>
              </div>
            ) : null}
            <Button
              onClick={() => setPrdEditorOpen(true)}
              disabled={!prdDocumentId}
            >
              编辑 PRD
            </Button>
          </div>
        </div>

        {generating ? (
          <LoadingBlock />
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-[520px] overflow-auto">
            {prdContent ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {prdContent}
              </ReactMarkdown>
            ) : (
              <div className="text-gray-500">点击“生成 PRD”后，这里会显示生成的 PRD（Markdown）</div>
            )}
          </div>
        )}
      </Card>

      <DocumentEditorModal
        open={prdEditorOpen}
        documentId={prdDocumentId}
        onClose={() => setPrdEditorOpen(false)}
        onSaved={(doc) => {
          setPrdContent(doc.content)
        }}
      />
    </div>
  )
}

export default RequirementAnalysis
