import apiClient from './client'
import type { ApiResponse, PageResponse, Issue, IssueComment } from '@/types'

export interface CreateIssueRequest {
  title: string
  description: string
  issueType: string
  priority: string
}

export interface CreateCommentRequest {
  comment: string
}

export const issueService = {
  getAll: async (page = 0, size = 10, schoolId?: string, status?: string) => {
    const response = await apiClient.get<PageResponse<Issue>>('/issues', {
      params: { page, size, schoolId, status },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Issue>>(`/issues/${id}`)
    return response.data.data
  },

  create: async (data: CreateIssueRequest) => {
    const response = await apiClient.post<ApiResponse<Issue>>('/issues', data)
    return response.data.data
  },

  update: async (id: string, data: Partial<CreateIssueRequest>) => {
    const response = await apiClient.put<ApiResponse<Issue>>(`/issues/${id}`, data)
    return response.data.data
  },

  assign: async (id: string, userId: string) => {
    const response = await apiClient.post<ApiResponse<Issue>>(`/issues/${id}/assign`, { userId })
    return response.data.data
  },

  resolve: async (id: string) => {
    const response = await apiClient.post<ApiResponse<Issue>>(`/issues/${id}/resolve`)
    return response.data.data
  },

  addComment: async (id: string, data: CreateCommentRequest) => {
    const response = await apiClient.post<ApiResponse<IssueComment>>(`/issues/${id}/comments`, data)
    return response.data.data
  },

  getComments: async (id: string) => {
    const response = await apiClient.get<ApiResponse<IssueComment[]>>(`/issues/${id}/comments`)
    return response.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/issues/${id}`)
  },
}
