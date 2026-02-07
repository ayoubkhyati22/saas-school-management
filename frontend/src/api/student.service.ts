import apiClient from './client'
import type { ApiResponse, PageResponse, Student } from '@/types'

export interface CreateStudentRequest {
  userId: string
  classRoomId: string
  registrationNumber: string
  birthDate: string
  gender: string
  enrollmentDate: string
  status: string
  address?: string
  emergencyContact?: string
  medicalInfo?: string
}

export const studentService = {
  getAll: async (page = 0, size = 10, schoolId?: string) => {
    const response = await apiClient.get<PageResponse<Student>>('/students', {
      params: { page, size, schoolId },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Student>>(`/students/${id}`)
    return response.data.data
  },

  create: async (data: CreateStudentRequest) => {
    const response = await apiClient.post<ApiResponse<Student>>('/students', data)
    return response.data.data
  },

  update: async (id: string, data: Partial<CreateStudentRequest>) => {
    const response = await apiClient.put<ApiResponse<Student>>(`/students/${id}`, data)
    return response.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/students/${id}`)
  },
}
