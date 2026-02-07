import apiClient from './client'
import type { ApiResponse, PageResponse, Course, CourseMaterial } from '@/types'

export interface CreateCourseRequest {
  classRoomId: string
  teacherId: string
  subject: string
  subjectCode: string
  description?: string
  schedule?: string
  semester?: string
}

export const courseService = {
  getAll: async (page = 0, size = 10, schoolId?: string) => {
    const response = await apiClient.get<PageResponse<Course>>('/courses', {
      params: { page, size, schoolId },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Course>>(`/courses/${id}`)
    return response.data.data
  },

  create: async (data: CreateCourseRequest) => {
    const response = await apiClient.post<ApiResponse<Course>>('/courses', data)
    return response.data.data
  },

  update: async (id: string, data: Partial<CreateCourseRequest>) => {
    const response = await apiClient.put<ApiResponse<Course>>(`/courses/${id}`, data)
    return response.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/courses/${id}`)
  },

  getMaterials: async (courseId: string) => {
    const response = await apiClient.get<ApiResponse<CourseMaterial[]>>(`/courses/${courseId}/materials`)
    return response.data.data
  },

  uploadMaterial: async (courseId: string, data: FormData) => {
    const response = await apiClient.post<ApiResponse<CourseMaterial>>(
      `/courses/${courseId}/materials`,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return response.data.data
  },
}
