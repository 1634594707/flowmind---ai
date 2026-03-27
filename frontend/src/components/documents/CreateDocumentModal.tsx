import { useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import type { AxiosError } from 'axios';
import { documentService, type Document } from '@/services/document.service';

const { TextArea } = Input;

interface Props {
  open: boolean;
  projectId: string;
  onClose: () => void;
  onCreated: (doc: Document) => void;
}

const CreateDocumentModal = ({ open, projectId, onClose, onCreated }: Props) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const doc = await documentService.create({
        title: values.title,
        type: values.type,
        content: values.content || '',
        version: values.version || '1.0',
        projectId,
      });
      message.success('文档已创建');
      form.resetFields();
      onCreated(doc);
      onClose();
    } catch (error: unknown) {
      const maybeFormError = error as { errorFields?: unknown };
      if (maybeFormError?.errorFields) return;
      const err = error as AxiosError<{ message?: string }>;
      message.error(err.response?.data?.message || '创建失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title="新建文档"
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => {
              form.resetFields();
              onClose();
            }}
          >
            取消
          </Button>
          <Button
            type="primary"
            className="bg-purple-600 hover:bg-purple-700"
            loading={saving}
            onClick={() => void handleOk()}
          >
            创建
          </Button>
        </div>
      }
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入文档标题' }]}
        >
          <Input placeholder="文档标题" />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="类型" name="type" initialValue="general" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'prd', label: 'PRD' },
                { value: 'design', label: '设计文档' },
                { value: 'api', label: 'API 文档' },
                { value: 'test', label: '测试文档' },
                { value: 'general', label: '通用文档' },
              ]}
            />
          </Form.Item>
          <Form.Item label="版本" name="version" initialValue="1.0">
            <Input placeholder="1.0" />
          </Form.Item>
        </div>
        <Form.Item label="内容（Markdown）" name="content">
          <TextArea rows={8} placeholder="支持 Markdown 格式，也可以留空后续编辑" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateDocumentModal;
