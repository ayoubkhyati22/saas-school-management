import apiClient from './client'
import type { ApiResponse, PageResponse, Teacher } from '@/types'

export interface CreateTeacherRequest {
  userId: string
  speciality: string
  hireDate: string
  employeeNumber: string
  status: string
  salary: number
  address?: string
  emergencyContact?: string
}

export const teacherService = {
  getAll: async (page = 0, size = 10, schoolId?: string) => {
    const response = await apiClient.get<PageResponse<Teacher>>('/teachers', {
      params: { page, size, schoolId },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Teacher>>(`/teachers/${id}`)
    return response.data.data
  },

  create: async (data: CreateTeacherRequest) => {
    const response = await apiClient.post<ApiResponse<Teacher>>('/teachers', data)
    return response.data.data
  },

  update: async (id: string, data: Partial<CreateTeacherRequest>) => {
    const response = await apiClient.put<ApiResponse<Teacher>>(`/teachers/${id}`, data)
    return response.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/teachers/${id}`)
  },
}
