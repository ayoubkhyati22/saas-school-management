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

export interface CreateSpecialityRequest {
  name: string
  code: string
  description?: string
}

export interface UpdateSpecialityRequest {
  name?: string
  code?: string
  description?: string
  active?: boolean
}

export const specialityService = {
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Speciality>>('/specialities', {
      params: { page, size },
    })
    return response.data
  },

  getAllActive: async () => {
    const response = await apiClient.get<Speciality[]>('/specialities/active')
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Speciality>(`/specialities/${id}`)
    return response.data
  },

  create: async (data: CreateSpecialityRequest) => {
    const response = await apiClient.post<Speciality>('/specialities', data)
    return response.data
  },

  update: async (id: string, data: UpdateSpecialityRequest) => {
    const response = await apiClient.put<Speciality>(`/specialities/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/specialities/${id}`)
  },

  search: async (keyword: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Speciality>>('/specialities/search', {
      params: { keyword, page, size },
    })
    return response.data
  },

  activate: async (id: string) => {
    await apiClient.post(`/specialities/${id}/activate`)
  },

  deactivate: async (id: string) => {
    await apiClient.post(`/specialities/${id}/deactivate`)
  },
}
