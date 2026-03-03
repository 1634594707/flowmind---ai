import api from './api'

export interface GithubRepo {
  id: number
  fullName: string
  htmlUrl: string
  private: boolean
}

export interface GithubProjectBinding {
  id: string
  projectId: string
  repoId: number
  fullName: string
  htmlUrl?: string
  defaultBranch?: string
  createdAt: string
  updatedAt: string
}

export const integrationsGithubService = {
  async getConnectUrl(projectId?: string): Promise<string> {
    const response = await api.get<{ code: number; data: { url: string } }>('/integrations/github/connect', {
      params: { projectId },
    })
    return response.data.data.url
  },

  async listRepos(): Promise<GithubRepo[]> {
    const response = await api.get<{ code: number; data: GithubRepo[] }>('/integrations/github/repos')
    return response.data.data
  },

  async getBinding(projectId: string): Promise<GithubProjectBinding | null> {
    const response = await api.get<{ code: number; data: GithubProjectBinding | null }>('/integrations/github/binding', {
      params: { projectId },
    })
    return response.data.data
  },

  async bindRepo(projectId: string, fullName: string): Promise<GithubProjectBinding> {
    const response = await api.post<{ code: number; message: string; data: GithubProjectBinding }>(
      '/integrations/github/bind',
      {
        projectId,
        fullName,
      },
    )
    return response.data.data
  },
}
