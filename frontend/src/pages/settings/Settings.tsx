import { useEffect, useState } from 'react'
import { Card, Form, Input, Button, Switch, Select, Modal, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { UserIcon, BellIcon, ShieldCheckIcon, PaintBrushIcon } from '@heroicons/react/24/outline'
import { authService } from '../../services/auth.service'

const Settings = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
      })
      setTwoFactorEnabled(!!user.twoFactorEnabled)
    }
  }, [form])

  const handleSave = async (values: any) => {
    setSaving(true)
    try {
      await authService.updateProfile({
        name: values.name,
        email: values.email,
      })
      message.success('保存成功')
    } catch (error: any) {
      console.error('Update profile error:', error)
      message.error(error.response?.data?.message || '保存失败，请稍后重试')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleTwoFactor = async (enabled: boolean) => {
    const prev = twoFactorEnabled
    setTwoFactorEnabled(enabled)
    try {
      const next = await authService.setTwoFactorEnabled(enabled)
      setTwoFactorEnabled(next)
      message.success(next ? '两步验证已启用' : '两步验证已关闭')
    } catch (error: any) {
      console.error('Update 2FA error:', error)
      setTwoFactorEnabled(prev)
      message.error(error.response?.data?.message || '操作失败，请稍后重试')
    }
  }

  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields()
      setChangingPassword(true)
      await authService.changePassword(values.currentPassword, values.newPassword)
      message.success('密码修改成功')
      setPasswordModalOpen(false)
      passwordForm.resetFields()
    } catch (error: any) {
      if (error?.errorFields) {
        return
      }
      console.error('Change password error:', error)
      message.error(error.response?.data?.message || '修改密码失败，请稍后重试')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      message.success('已退出登录')
      navigate('/login')
    } catch (error: any) {
      console.error('Logout error:', error)
      message.error(error.response?.data?.message || '退出失败，请稍后重试')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">设置</h1>
        <p className="text-gray-600 mt-1">管理你的账户和偏好设置</p>
      </div>

      <div className="grid gap-6">
        <Card 
          title={
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-gray-600" />
              <span>个人信息</span>
            </div>
          }
          className="rounded-xl border border-gray-200 shadow-sm"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item label="姓名" name="name">
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item label="邮箱" name="email">
              <Input type="email" placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item label="角色" name="role">
              <Input disabled />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                className="bg-purple-600 hover:bg-purple-700"
              >
                保存更改
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card 
          title={
            <div className="flex items-center gap-2">
              <BellIcon className="w-5 h-5 text-gray-600" />
              <span>通知设置</span>
            </div>
          }
          className="rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">邮件通知</div>
                <div className="text-sm text-gray-500">接收项目更新的邮件通知</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">桌面通知</div>
                <div className="text-sm text-gray-500">在浏览器中显示通知</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">任务提醒</div>
                <div className="text-sm text-gray-500">任务截止前提醒</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        <Card 
          title={
            <div className="flex items-center gap-2">
              <PaintBrushIcon className="w-5 h-5 text-gray-600" />
              <span>外观设置</span>
            </div>
          }
          className="rounded-xl border border-gray-200 shadow-sm"
        >
          <Form layout="vertical">
            <Form.Item label="主题模式">
              <Select defaultValue="light" className="w-full">
                <Select.Option value="light">浅色</Select.Option>
                <Select.Option value="dark">深色</Select.Option>
                <Select.Option value="auto">跟随系统</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="语言">
              <Select defaultValue="zh-CN" className="w-full">
                <Select.Option value="zh-CN">简体中文</Select.Option>
                <Select.Option value="en-US">English</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Card>

        <Card 
          title={
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-gray-600" />
              <span>安全设置</span>
            </div>
          }
          className="rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="space-y-4">
            <Button type="default" className="w-full" onClick={() => setPasswordModalOpen(true)}>
              修改密码
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">两步验证</div>
                <div className="text-sm text-gray-500">登录时增加额外验证步骤</div>
              </div>
              <Switch checked={twoFactorEnabled} onChange={handleToggleTwoFactor} />
            </div>
            <Button danger className="w-full" onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        title="修改密码"
        open={passwordModalOpen}
        onCancel={() => {
          setPasswordModalOpen(false)
          passwordForm.resetFields()
        }}
        onOk={handleChangePassword}
        confirmLoading={changingPassword}
        okText="确认修改"
        cancelText="取消"
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            label="当前密码"
            name="currentPassword"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[{ required: true, message: '请输入新密码' }, { min: 6, message: '密码至少 6 位' }]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Settings
