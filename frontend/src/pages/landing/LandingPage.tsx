import { useNavigate } from 'react-router-dom'
import {
  SparklesIcon,
  RocketLaunchIcon,
  CubeIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline'

const LandingPage = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI 需求分析',
      description: '通过对话式访谈，自动生成结构化 PRD 文档',
      color: 'purple',
    },
    {
      icon: RocketLaunchIcon,
      title: '智能项目向导',
      description: '快速创建项目，自动推荐最佳 SDLC 流程',
      color: 'blue',
    },
    {
      icon: CubeIcon,
      title: '设计助手',
      description: '架构设计建议、API 接口自动生成',
      color: 'orange',
    },
    {
      icon: CodeBracketIcon,
      title: '开发协作',
      description: '任务自动拆解、代码审查、Git 集成',
      color: 'green',
    },
    {
      icon: CheckCircleIcon,
      title: '测试管理',
      description: '测试用例自动生成、缺陷智能分析',
      color: 'red',
    },
    {
      icon: ChartBarIcon,
      title: 'DevOps 集成',
      description: 'CI/CD 流水线配置、一键部署',
      color: 'indigo',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Floating Navigation */}
      <nav className="fixed top-4 left-4 right-4 z-50 bg-white/80 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg"></div>
            <span className="text-xl font-bold text-purple-900">FlowMind</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors cursor-pointer">
              功能
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors cursor-pointer">
              定价
            </a>
            <a href="#docs" className="text-gray-700 hover:text-purple-600 transition-colors cursor-pointer">
              文档
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/login')}
              className="bg-transparent hover:bg-purple-50 text-purple-600 font-semibold px-6 py-2 rounded-lg border-2 border-purple-600 transition-all duration-200 cursor-pointer"
            >
              登录
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              免费试用
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              AI 驱动的项目管理
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              像 GPS 导航一样
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">
                做软件项目
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              FlowMind 通过 AI 智能助手，帮助团队提升 <strong className="text-purple-600">50%</strong> 开发效率，
              减少 <strong className="text-orange-500">30%</strong> 项目延期率
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={() => navigate('/register')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                免费开始 →
              </button>
              <button className="bg-transparent hover:bg-purple-50 text-purple-600 font-semibold px-8 py-4 rounded-lg text-lg border-2 border-purple-600 transition-all duration-200 cursor-pointer">
                观看演示
              </button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-purple-600">500+</span>
                <span>团队使用</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-purple-600">4.9/5</span>
                <span>用户评分</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-purple-600">10K+</span>
                <span>项目完成</span>
              </div>
            </div>
          </div>
          
          <div className="mt-16 relative">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-lg">Dashboard Preview</span>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              核心功能
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              从需求到部署，AI 全程辅助
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-purple-50/50 backdrop-blur-sm rounded-xl p-6 border border-purple-100 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
              >
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            准备好提升团队效率了吗？
          </h2>
          <p className="text-xl text-white/90 mb-8">
            立即开始免费试用，无需信用卡
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-white hover:bg-gray-100 text-purple-600 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
          >
            免费开始 →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg"></div>
                <span className="text-xl font-bold">FlowMind</span>
              </div>
              <p className="text-gray-400">
                AI 驱动的智能软件开发生命周期管理平台
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">产品</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">功能</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">定价</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">更新日志</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">资源</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">文档</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">博客</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">社区</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">公司</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">关于我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">联系我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">隐私政策</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 FlowMind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
