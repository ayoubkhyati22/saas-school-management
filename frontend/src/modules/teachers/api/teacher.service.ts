import apiClient from '@/api/client'
import type { ApiResponse, PageResponse } from '@/types'

export interface Teacher {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  schoolId: string
  schoolName?: string
  specialityId?: string
  specialityName?: string
  specialityCode?: string
  hireDate: string
  employeeNumber: string
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED'
  salary: number
  avatarUrl?: string
  administrativeDocuments?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTeacherRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  specialityId?: string
  hireDate: string
  employeeNumber: string
  salary: number
  avatarUrl?: string
  administrativeDocuments?: string
}

export interface UpdateTeacherRequest {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  specialityId?: string
  status?: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED'
  salary?: number
  avatarUrl?: string
  administrativeDocuments?: string
}

export interface TeacherStatistics {
  totalTeachers: number
  activeTeachers: number
  inactiveTeachers: number
  onLeaveTeachers: number
  teachersBySpeciality: Record<string, number>
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

  create: async (data: CreateTeacherRequest) => {
    const response = await apiClient.post<ApiResponse<Teacher>>('/teachers', data)
    return response.data
  },

  update: async (id: string, data: UpdateTeacherRequest) => {
    const response = await apiClient.put<ApiResponse<Teacher>>(`/teachers/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/teachers/${id}`)
  },

  search: async (keyword: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Teacher>>('/teachers/search', {
      params: { keyword, page, size },
    })
    return response.data
  },

  getByStatus: async (status: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Teacher>>(`/teachers/status/${status}`, {
      params: { page, size },
    })
    return response.data
  },

  getStatistics: async () => {
    const response = await apiClient.get<ApiResponse<TeacherStatistics>>('/teachers/statistics')
    return response.data
  },

  exportToCSV: async () => {
    const response = await apiClient.get('/teachers/export', {
      responseType: 'blob',
    })
    const blob = new Blob([response.data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `teachers_export_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },

  uploadAvatar: async (id: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post<ApiResponse<Teacher>>(`/teachers/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}
