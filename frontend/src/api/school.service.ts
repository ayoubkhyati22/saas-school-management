import apiClient from './client'
import type { ApiResponse, PageResponse, School } from '@/types'

export interface CreateSchoolRequest {
  name: string
  address: string
  email: string
  phone: string
  logoUrl?: string
}

export interface UpdateSchoolRequest {
  name?: string
  address?: string
  email?: string
  phone?: string
  logoUrl?: string
  active?: boolean
}

export const schoolService = {
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<School>>('/schools', {
      params: { page, size },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<School>>(`/schools/${id}`)
    return response.data
  },

  create: async (data: CreateSchoolRequest) => {
    const response = await apiClient.post<ApiResponse<School>>('/schools', data)
    return response.data
  },

  update: async (id: string, data: UpdateSchoolRequest) => {
    const response = await apiClient.put<ApiResponse<School>>(`/schools/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/schools/${id}`)
  },
}
