import apiClient from '@/api/client'
import type { ApiResponse, PageResponse } from '@/types'

export interface ExamResult {
  id: string
  schoolId: string
  examId: string
  examTitle: string
  studentId: string
  studentName: string
  studentRegistrationNumber: string
  marksObtained: number | null
  maxMarks: number
  percentage: number | null
  grade: string | null
  status: ResultStatus
  remarks: string | null
  absent: boolean
  rank: number | null
  gradedBy: string | null
  gradedByName: string | null
  gradedAt: string | null
  createdAt: string
  updatedAt: string
}

export enum ResultStatus {
  PASS = 'PASS',
  FAIL = 'FAIL',
  ABSENT = 'ABSENT',
  PENDING = 'PENDING',
}

export interface CreateExamResultRequest {
  examId: string
  studentId: string
  marksObtained: number
  remarks?: string
  absent?: boolean
}

export interface UpdateExamResultRequest {
  marksObtained?: number
  remarks?: string
  absent?: boolean
}

export interface ResultStatistics {
  totalResults: number
  passCount: number
  failCount: number
  absentCount: number
  pendingCount: number
  averagePercentage: number
  highestMarks: number
  lowestMarks: number
}

export const examResultService = {
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<ExamResult>>('/exam-results', {
      params: { page, size },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<ExamResult>>(`/exam-results/${id}`)
    return response.data
  },

  create: async (data: CreateExamResultRequest) => {
    const response = await apiClient.post<ApiResponse<ExamResult>>('/exam-results', data)
    return response.data.data
  },

  update: async (id: string, data: UpdateExamResultRequest) => {
    const response = await apiClient.put<ApiResponse<ExamResult>>(`/exam-results/${id}`, data)
    return response.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/exam-results/${id}`)
  },

  getByExam: async (examId: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<ExamResult>>(`/exam-results/exam/${examId}`, {
      params: { page, size },
    })
    return response.data
  },

  getByStudent: async (studentId: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<ExamResult>>(`/exam-results/student/${studentId}`, {
      params: { page, size },
    })
    return response.data
  },

  getByStatus: async (status: ResultStatus, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<ExamResult>>(`/exam-results/status/${status}`, {
      params: { page, size },
    })
    return response.data
  },

  search: async (keyword: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<ExamResult>>('/exam-results/search', {
      params: { keyword, page, size },
    })
    return response.data
  },

  getStatisticsByExam: async (examId: string) => {
    const response = await apiClient.get<ApiResponse<ResultStatistics>>(`/exam-results/exam/${examId}/statistics`)
    return response.data.data
  },

  getStatistics: async () => {
    const response = await apiClient.get<ApiResponse<ResultStatistics>>('/exam-results/statistics')
    return response.data.data
  },

  exportToCSV: async (examId?: string) => {
    const url = examId ? `/exam-results/export?examId=${examId}` : '/exam-results/export'
    const response = await apiClient.get(url, {
      responseType: 'blob',
    })
    const blob = new Blob([response.data], { type: 'text/csv' })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `exam_results_${examId || 'all'}_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  },
}
