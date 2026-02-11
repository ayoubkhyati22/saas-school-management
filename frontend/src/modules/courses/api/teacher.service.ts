import apiClient from '@/api/client'
import type { ApiResponse, PageResponse } from '@/types'

export interface Teacher {
  id: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
  schoolId: string
  employeeId: string
  phoneNumber: string
  specialization?: string
  qualifications?: string
  experience?: number
  joiningDate: string
  salary?: number
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE'
  createdAt: string
  updatedAt: string
}

export const teacherService = {
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Teacher>>('/teachers', {
      params: { page, size },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Teacher>>(`/teachers/${id}`)
    return response.data
  },
}
