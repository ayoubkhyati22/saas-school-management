import apiClient from './client'
import type { ApiResponse, PageResponse, Parent } from '@/types'

export interface CreateParentRequest {
  userId: string
  occupation?: string
  address?: string
  emergencyContact?: string
}

export const parentService = {
  getAll: async (page = 0, size = 10, schoolId?: string) => {
    const response = await apiClient.get<PageResponse<Parent>>('/parents', {
      params: { page, size, schoolId },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Parent>>(`/parents/${id}`)
    return response.data.data
  },

  create: async (data: CreateParentRequest) => {
    const response = await apiClient.post<ApiResponse<Parent>>('/parents', data)
    return response.data.data
  },

  update: async (id: string, data: Partial<CreateParentRequest>) => {
    const response = await apiClient.put<ApiResponse<Parent>>(`/parents/${id}`, data)
    return response.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/parents/${id}`)
  },

  linkStudent: async (parentId: string, studentId: string, relationshipType: string, isPrimaryContact: boolean) => {
    const response = await apiClient.post<ApiResponse<any>>(`/parents/${parentId}/students`, {
      studentId,
      relationshipType,
      isPrimaryContact,
    })
    return response.data.data
  },
}
