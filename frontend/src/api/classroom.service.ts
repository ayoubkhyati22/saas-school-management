import apiClient from './client'
import type { ApiResponse, PageResponse, ClassRoom } from '@/types'

export interface CreateClassRoomRequest {
  name: string
  level: string
  section: string
  academicYear: string
  capacity: number
  classTeacherId: string
}

export const classroomService = {
  getAll: async (page = 0, size = 10, schoolId?: string) => {
    const response = await apiClient.get<PageResponse<ClassRoom>>('/classrooms', {
      params: { page, size, schoolId },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<ClassRoom>>(`/classrooms/${id}`)
    return response.data.data
  },

  create: async (data: CreateClassRoomRequest) => {
    const response = await apiClient.post<ApiResponse<ClassRoom>>('/classrooms', data)
    return response.data.data
  },

  update: async (id: string, data: Partial<CreateClassRoomRequest>) => {
    const response = await apiClient.put<ApiResponse<ClassRoom>>(`/classrooms/${id}`, data)
    return response.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/classrooms/${id}`)
  },
}
