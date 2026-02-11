import apiClient from '@/api/client'
import type { ApiResponse, PageResponse } from '@/types'

export interface Absence {
  id: string
  schoolId: string
  studentId: string
  studentName: string
  courseId: string
  courseSubject: string
  date: string
  reason?: string
  justified: boolean
  justificationDocument?: string
  reportedBy: string
  reportedByName?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAbsenceRequest {
  studentId: string
  courseId: string
  date: string
  reason?: string
}

export interface UpdateAbsenceRequest {
  date?: string
  reason?: string
}

export interface JustifyAbsenceRequest {
  justificationDocument: string
  reason?: string
}

export interface AbsenceStatistics {
  totalAbsences: number
  justifiedAbsences: number
  unjustifiedAbsences: number
  startDate: string
  endDate: string
  justificationRate: number
}

export const absenceService = {
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Absence>>('/absences', {
      params: { page, size },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Absence>(`/absences/${id}`)
    return response.data
  },

  create: async (data: CreateAbsenceRequest) => {
    const response = await apiClient.post<Absence>('/absences', data)
    return response.data
  },

  update: async (id: string, data: UpdateAbsenceRequest) => {
    const response = await apiClient.put<Absence>(`/absences/${id}`, data)
    return response.data
  },

  justify: async (id: string, data: JustifyAbsenceRequest) => {
    const response = await apiClient.put<Absence>(`/absences/${id}/justify`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/absences/${id}`)
  },

  getByStudent: async (studentId: string) => {
    const response = await apiClient.get<Absence[]>(`/absences/student/${studentId}`)
    return response.data
  },

  getByStudentAndCourse: async (studentId: string, courseId: string) => {
    const response = await apiClient.get<Absence[]>(
      `/absences/student/${studentId}/course/${courseId}`
    )
    return response.data
  },

  getStatistics: async (studentId: string, startDate: string, endDate: string) => {
    const response = await apiClient.get<AbsenceStatistics>(
      `/absences/statistics/student/${studentId}`,
      {
        params: { startDate, endDate },
      }
    )
    return response.data
  },

  getByDateRange: async (startDate: string, endDate: string) => {
    const response = await apiClient.get<Absence[]>('/absences/date-range', {
      params: { startDate, endDate },
    })
    return response.data
  },

  uploadJustificationDocument: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    // This endpoint should be implemented in your backend
    const response = await apiClient.post<{ filePath: string }>(
      '/absences/upload-justification',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.filePath
  },
}
