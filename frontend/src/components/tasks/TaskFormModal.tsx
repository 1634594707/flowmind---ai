import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message } from 'antd';
import type { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { taskService, type Task, type CreateTaskDto } from '@/services/task.service';

const { TextArea } = Input;

interface Props {
  open: boolean;
  projectId: string;
  task?: Task | null;
  onClose: () => void;
  onSaved: (task: Task) => void;
}

const TaskFormModal = ({ open, projectId, task, onClose, onSaved }: Props) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (task) {
        form.setFieldsValue({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? dayjs(task.dueDate) : undefined,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 'todo', priority: 'medium' });
      }
    }
  }, [open, task, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const dto: CreateTaskDto = {
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        projectId,
        dueDate: values.dueDate ? (values.dueDate as dayjs.Dayjs).toISOString() : undefined,
      };

      let saved: Task;
      if (task) {
        saved = await taskService.update(task.id, dto);
        message.success('任务已更新');
      } else {
        saved = await taskService.create(dto);
        message.success('任务已创建');
      }

      onSaved(saved);
      onClose();
    } catch (error: unknown) {
      const maybeFormError = error as { errorFields?: unknown };
      if (maybeFormError?.errorFields) return;
      const err = error as AxiosError<{ message?: string }>;
      message.error(err.response?.data?.message || '操作失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={task ? '编辑任务' : '新建任务'}
      onCancel={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>取消</Button>
          <Button
            type="primary"
            className="bg-purple-600 hover:bg-purple-700"
            loading={saving}
            onClick={() => void handleOk()}
          >
            {task ? '保存' : '创建'}
          </Button>
        </div>
      }
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入任务标题' }]}
        >
          <Input placeholder="任务标题" />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <TextArea rows={3} placeholder="任务描述（可选）" />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="状态" name="status">
            <Select
              options={[
                { value: 'todo', label: '待办' },
                { value: 'in_progress', label: '进行中' },
                { value: 'done', label: '已完成' },
              ]}
            />
          </Form.Item>
          <Form.Item label="优先级" name="priority">
            <Select
              options={[
                { value: 'low', label: '低' },
                { value: 'medium', label: '中' },
                { value: 'high', label: '高' },
              ]}
            />
          </Form.Item>
        </div>
        <Form.Item label="截止日期" name="dueDate">
          <DatePicker className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskFormModal;
