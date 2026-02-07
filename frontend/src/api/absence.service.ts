import apiClient from './client'
import type { ApiResponse, PageResponse, Absence } from '@/types'

export interface CreateAbsenceRequest {
  studentId: string
  courseId: string
  date: string
  reason?: string
  justified: boolean
}

export const absenceService = {
  getAll: async (page = 0, size = 10, schoolId?: string, studentId?: string) => {
    const response = await apiClient.get<PageResponse<Absence>>('/absences', {
      params: { page, size, schoolId, studentId },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Absence>>(`/absences/${id}`)
    return response.data.data
  },

  create: async (data: CreateAbsenceRequest) => {
    const response = await apiClient.post<ApiResponse<Absence>>('/absences', data)
    return response.data.data
  },

  justify: async (id: string, document: File) => {
    const formData = new FormData()
    formData.append('document', document)
    const response = await apiClient.post<ApiResponse<Absence>>(
      `/absences/${id}/justify`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return response.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/absences/${id}`)
  },
}
