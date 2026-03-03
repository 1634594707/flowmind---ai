import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '@/pages/landing/LandingPage'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Dashboard from '@/pages/dashboard/Dashboard'
import ProjectList from '@/pages/projects/ProjectList'
import ProjectDetail from '@/pages/projects/ProjectDetail'
import ProjectEdit from '@/pages/projects/ProjectEdit'
import ProjectTasks from '@/pages/tasks/ProjectTasks'
import Documents from '@/pages/documents/Documents'
import RequirementAnalysis from '@/pages/ai/RequirementAnalysis'
import DesignAssistant from '@/pages/ai/DesignAssistant'
import Settings from '@/pages/settings/Settings'
import MainLayout from '@/components/layout/MainLayout'

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route path="/app" element={<MainLayout />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/new" element={<ProjectEdit />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="projects/:id/tasks" element={<ProjectTasks />} />
        <Route path="projects/:id/edit" element={<ProjectEdit />} />
        <Route path="ai/requirement" element={<RequirementAnalysis />} />
        <Route path="ai/design" element={<DesignAssistant />} />
        <Route path="documents" element={<Documents />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter
