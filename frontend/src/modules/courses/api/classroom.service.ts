import apiClient from '@/api/client'
import type { ApiResponse, PageResponse } from '@/types'

export interface Classroom {
  id: string
  schoolId: string
  name: string
  level: string
  section?: string
  capacity?: number
  studentCount: number
  description?: string
  createdAt: string
  updatedAt: string
}

export const classroomService = {
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Classroom>>('/classrooms', {
      params: { page, size },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Classroom>>(`/classrooms/${id}`)
    return response.data
  },
}
