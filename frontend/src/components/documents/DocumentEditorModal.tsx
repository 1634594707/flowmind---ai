import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Modal, Tabs, Input, Button, message, Radio } from 'antd'
import type { TabsProps } from 'antd'
import type { AxiosError } from 'axios'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { documentService, type Document } from '@/services/document.service'
import { LoadingBlock } from '@/components/ui'

interface Props {
  open: boolean
  documentId: string
  onClose: () => void
  onSaved?: (doc: Document) => void
}

const { TextArea } = Input

const DocumentEditorModal = ({ open, documentId, onClose, onSaved }: Props) => {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [doc, setDoc] = useState<Document | null>(null)

  const [changeModalOpen, setChangeModalOpen] = useState(false)
  const [changeLevel, setChangeLevel] = useState<'MINOR' | 'MAJOR' | ''>('')
  const [changeReason, setChangeReason] = useState('')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

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

  useEffect(() => {
    if (!open || !documentId) {
      return
    }

    const run = async () => {
      try {
        setLoading(true)
        const data = await documentService.getById(documentId)
        setDoc(data)
        setTitle(data.title)
        setContent(data.content)
      } catch (error: unknown) {
        const err = error as AxiosError<{ message?: string }>
        message.error(err.response?.data?.message || '加载文档失败')
      } finally {
        setLoading(false)
      }
    }

    void run()
  }, [open, documentId])

  useEffect(() => {
    if (!open) {
      setChangeModalOpen(false)
      setChangeLevel('')
      setChangeReason('')
    }
  }, [open])

  const hasChanges = useMemo(() => {
    if (!doc) {
      return false
    }
    return title !== doc.title || content !== doc.content
  }, [doc, title, content])

  const doSave = async (extra?: { changeLevel?: 'MINOR' | 'MAJOR'; changeReason?: string }) => {
    if (!doc) {
      return
    }

    try {
      setSaving(true)
      const updated = await documentService.update(doc.id, {
        title: title.trim() || doc.title,
        content,
        ...(extra || {}),
      })
      setDoc(updated)
      setTitle(updated.title)
      setContent(updated.content)
      message.success('保存成功')
      onSaved?.(updated)
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>
      message.error(err.response?.data?.message || '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    if (!doc) {
      return
    }

    const isFrozenPrd = (doc.type || '').toLowerCase() === 'prd' && doc.status === 'FROZEN'
    if (isFrozenPrd && hasChanges) {
      setChangeModalOpen(true)
      return
    }

    await doSave()
  }

  const items = useMemo<TabsProps['items']>(() => {
    return [
      {
        key: 'edit',
        label: '编辑',
        children: (
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-2">标题</div>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="请输入文档标题" />
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">内容（Markdown）</div>
              <TextArea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                placeholder="请输入 Markdown 内容"
              />
            </div>
          </div>
        ),
      },
      {
        key: 'preview',
        label: '预览',
        children: (
          <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-[60vh] overflow-auto">
            {content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {content}
              </ReactMarkdown>
            ) : (
              <div className="text-gray-500">暂无内容</div>
            )}
          </div>
        ),
      },
    ]
  }, [content, markdownComponents, title])

  return (
    <>
      <Modal
        open={open}
        title={doc ? doc.title : '文档'}
        onCancel={onClose}
        width={980}
        footer={
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">{doc ? `版本：${doc.version}` : ''}</div>
            <div className="flex items-center gap-2">
              <Button onClick={onClose}>关闭</Button>
              <Button type="primary" className="bg-purple-600 hover:bg-purple-700" onClick={() => void handleSave()} loading={saving} disabled={!doc || !hasChanges}>
                保存
              </Button>
            </div>
          </div>
        }
        destroyOnClose
      >
        {loading ? (
          <LoadingBlock />
        ) : (
          <Tabs defaultActiveKey="edit" items={items} />
        )}
      </Modal>

      <Modal
        open={changeModalOpen}
        title="冻结 PRD 修改说明"
        onCancel={() => {
          setChangeModalOpen(false)
        }}
        okText="确认保存"
        cancelText="取消"
        confirmLoading={saving}
        onOk={() => {
          const run = async () => {
            if (!changeLevel) {
              message.error('请选择变更级别')
              return
            }
            if (!changeReason.trim()) {
              message.error('请填写变更原因')
              return
            }

            await doSave({
              changeLevel: changeLevel as 'MINOR' | 'MAJOR',
              changeReason: changeReason.trim(),
            })
            setChangeModalOpen(false)
            setChangeLevel('')
            setChangeReason('')
          }
          void run()
        }}
        destroyOnClose
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            当前 PRD 已冻结。保存修改前需要选择变更级别并填写原因。
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">变更级别</div>
            <Radio.Group value={changeLevel} onChange={(e) => setChangeLevel(e.target.value)}>
              <Radio value="MINOR">MINOR（小改，不影响范围）</Radio>
              <Radio value="MAJOR">MAJOR（影响范围，需先解冻）</Radio>
            </Radio.Group>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">变更原因</div>
            <TextArea
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              rows={4}
              placeholder="请描述本次修改原因（必填）"
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

export default DocumentEditorModal
