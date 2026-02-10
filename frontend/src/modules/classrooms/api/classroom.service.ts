import apiClient from '@/api/client'
import type { ApiResponse, PageResponse } from '@/types'

export interface ClassRoom {
  id: string
  schoolId: string
  name: string
  level: string
  section: string
  academicYear: string
  capacity: number
  classTeacherId?: string
  classTeacherName?: string
  createdAt: string
  updatedAt: string
}

export interface ClassRoomDetail {
  id: string
  schoolId: string
  schoolName: string
  name: string
  level: string
  section: string
  academicYear: string
  capacity: number
  classTeacherId?: string
  classTeacherName?: string
  classTeacherEmail?: string
  studentCount: number
  createdAt: string
  updatedAt: string
}

export interface ClassRoomStatistics {
  totalStudents: number
  maleStudents: number
  femaleStudents: number
  activeStudents: number
  capacity: number
  occupancyRate: number
}

export interface CreateClassRoomRequest {
  name: string
  level: string
  section: string
  academicYear: string
  capacity: number
  classTeacherId?: string
}

export interface UpdateClassRoomRequest {
  name?: string
  level?: string
  section?: string
  academicYear?: string
  capacity?: number
  classTeacherId?: string
}

export interface AssignTeacherRequest {
  teacherId: string
}

export const classroomService = {
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<ClassRoom>>('/classrooms', {
      params: { page, size },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ClassRoomDetail>(`/classrooms/${id}`)
    return response.data
  },

  create: async (data: CreateClassRoomRequest) => {
    const response = await apiClient.post<ClassRoomDetail>('/classrooms', data)
    return response.data
  },

  update: async (id: string, data: UpdateClassRoomRequest) => {
    const response = await apiClient.put<ClassRoomDetail>(`/classrooms/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/classrooms/${id}`)
  },

  search: async (keyword: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<ClassRoom>>('/classrooms/search', {
      params: { keyword, page, size },
    })
    return response.data
  },

  getByAcademicYear: async (academicYear: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<ClassRoom>>(
      `/classrooms/academic-year/${academicYear}`,
      { params: { page, size } }
    )
    return response.data
  },

  assignTeacher: async (id: string, teacherId: string) => {
    const response = await apiClient.put<ClassRoomDetail>(
      `/classrooms/${id}/assign-teacher`,
      { teacherId }
    )
    return response.data
  },

  getStudents: async (id: string) => {
    const response = await apiClient.get<any[]>(`/classrooms/${id}/students`)
    return response.data
  },

  getStatistics: async (id: string) => {
    const response = await apiClient.get<ClassRoomStatistics>(`/classrooms/${id}/statistics`)
    return response.data
  },
}
