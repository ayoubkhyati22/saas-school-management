import apiClient from '@/api/client'
import type { ApiResponse, PageResponse } from '@/types'

export interface Exam {
  id: string
  schoolId: string
  classRoomId: string
  classRoomName: string
  courseId: string
  courseName: string
  courseCode: string
  teacherId: string
  teacherName: string
  specialityId?: string
  specialityName?: string
  title: string
  description?: string
  examType: ExamType
  examDate: string
  startTime: string
  endTime: string
  durationMinutes: number
  roomNumber?: string
  maxMarks: number
  passingMarks: number
  semester?: string
  academicYear: string
  status: ExamStatus
  instructions?: string
  allowCalculators?: boolean
  allowBooks?: boolean
  notes?: string
  resultsPublished: boolean
  resultsPublishedAt?: string
  createdAt: string
  updatedAt: string
}

export enum ExamType {
  MIDTERM = 'MIDTERM',
  FINAL = 'FINAL',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT',
  PRACTICAL = 'PRACTICAL',
  ORAL = 'ORAL',
  PROJECT = 'PROJECT',
  MONTHLY_TEST = 'MONTHLY_TEST',
  UNIT_TEST = 'UNIT_TEST',
  SEMESTER_EXAM = 'SEMESTER_EXAM',
}

export enum ExamStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  POSTPONED = 'POSTPONED',
}

export interface CreateExamRequest {
  classRoomId: string
  courseId: string
  teacherId: string
  specialityId?: string
  title: string
  description?: string
  examType: ExamType
  examDate: string
  startTime: string
  endTime: string
  durationMinutes: number
  roomNumber?: string
  maxMarks: number
  passingMarks: number
  semester?: string
  academicYear: string
  instructions?: string
  allowCalculators?: boolean
  allowBooks?: boolean
  notes?: string
}

export interface UpdateExamRequest {
  teacherId?: string
  specialityId?: string
  title?: string
  description?: string
  examType?: ExamType
  examDate?: string
  startTime?: string
  endTime?: string
  durationMinutes?: number
  roomNumber?: string
  maxMarks?: number
  passingMarks?: number
  semester?: string
  academicYear?: string
  status?: ExamStatus
  instructions?: string
  allowCalculators?: boolean
  allowBooks?: boolean
  notes?: string
}

export interface ExamStatistics {
  totalExams: number
  scheduledExams: number
  completedExams: number
  inProgressExams: number
  cancelledExams: number
  postponedExams: number
  resultsPublishedExams: number
  resultsPendingExams: number
}

export const examService = {
  getAll: async (page = 0, size = 10, sortBy = 'examDate', sortDir = 'DESC') => {
    const response = await apiClient.get<PageResponse<Exam>>('/exams', {
      params: { page, size, sortBy, sortDir },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Exam>>(`/exams/${id}`)
    return response.data
  },

  create: async (data: CreateExamRequest) => {
    const response = await apiClient.post<ApiResponse<Exam>>('/exams', data)
    return response.data.data
  },

  update: async (id: string, data: UpdateExamRequest) => {
    const response = await apiClient.put<ApiResponse<Exam>>(`/exams/${id}`, data)
    return response.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/exams/${id}`)
  },

  search: async (keyword: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Exam>>('/exams/search', {
      params: { keyword, page, size },
    })
    return response.data
  },

  getStatistics: async () => {
    const response = await apiClient.get<ApiResponse<ExamStatistics>>('/exams/statistics')
    return response.data.data
  },
} 