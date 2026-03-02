import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import './index.css'
import 'antd/dist/reset.css'

const theme = {
  token: {
    colorPrimary: '#7C3AED',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorInfo: '#3B82F6',
    borderRadius: 8,
    fontFamily: "'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  components: {
    Button: {
      controlHeight: 40,
      fontSize: 16,
      borderRadius: 8,
    },
    Input: {
      controlHeight: 44,
      fontSize: 16,
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
    },
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={theme} locale={zhCN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
