import apiClient from './client'
import type { ApiResponse, PageResponse, Document } from '@/types'

export const documentService = {
  getAll: async (page = 0, size = 10, schoolId?: string, entityType?: string, entityId?: string) => {
    const response = await apiClient.get<PageResponse<Document>>('/documents', {
      params: { page, size, schoolId, entityType, entityId },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Document>>(`/documents/${id}`)
    return response.data.data
  },

  upload: async (file: File, entityType: string, entityId: string, description?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('entityType', entityType)
    formData.append('entityId', entityId)
    if (description) formData.append('description', description)

    const response = await apiClient.post<ApiResponse<Document>>('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  download: async (id: string) => {
    const response = await apiClient.get(`/documents/${id}/download`, {
      responseType: 'blob',
    })
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/documents/${id}`)
  },
}
