import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Input, message } from 'antd'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.password) {
      message.error('请填写所有必填项')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      message.error('两次密码输入不一致')
      return
    }

    setLoading(true)
    
    // TODO: 实际注册逻辑
    setTimeout(() => {
      setLoading(false)
      message.success('注册成功！')
      navigate('/app/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg"></div>
            <span className="text-2xl font-bold text-purple-900">FlowMind</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            创建账户
          </h1>
          <p className="text-gray-600">
            开始你的 FlowMind 之旅
          </p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3"
                placeholder="张三"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <Input.Password
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3"
                placeholder="至少 8 个字符"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确认密码
              </label>
              <Input.Password
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3"
                placeholder="再次输入密码"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
            >
              {loading ? '注册中...' : '创建账户'}
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            已有账户？
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium ml-1">
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
