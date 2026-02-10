import apiClient from '@/api/client'
import type { ApiResponse, PageResponse } from '@/types'

export interface Speciality {
  id: string
  schoolId: string
  name: string
  code: string
  description?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export const specialityService = {
  getAll: async (page = 0, size = 100) => {
    const response = await apiClient.get<PageResponse<Speciality>>('/specialities', {
      params: { page, size },
    })
    return response.data
  },

  getAllActive: async () => {
    const response = await apiClient.get<ApiResponse<Speciality[]>>('/specialities/active')
    return response.data.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Speciality>>(`/specialities/${id}`)
    return response.data.data
  },

  search: async (keyword: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Speciality>>('/specialities/search', {
      params: { keyword, page, size },
    })
    return response.data
  },
}
