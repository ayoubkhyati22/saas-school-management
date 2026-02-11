import apiClient from '@/api/client'
import type { ApiResponse, PageResponse } from '@/types'

export interface Course {
  id: string
  schoolId: string
  classRoomId: string
  classRoomName: string
  teacherId: string
  teacherName: string
  specialityId?: string
  specialityName?: string
  specialityCode?: string
  subject: string
  subjectCode?: string
  description?: string
  schedule?: string
  semester?: string
  documents?: string
  createdAt: string
  updatedAt: string
}

export interface CourseDetail {
  id: string
  schoolId: string
  schoolName?: string
  classRoomId: string
  classRoomName: string
  classRoomLevel?: string
  teacherId: string
  teacherName: string
  teacherEmail?: string
  specialityId?: string
  specialityName?: string
  specialityCode?: string
  subject: string
  subjectCode?: string
  description?: string
  schedule?: string
  semester?: string
  materialCount: number
  documents?: string
  createdAt: string
  updatedAt: string
}

export interface CourseMaterial {
  id: string
  courseId: string
  schoolId: string
  title: string
  filePath: string
  fileType: string
  fileSize: number
  uploadedBy: string
  uploadedByName?: string
  uploadedAt: string
  createdAt: string
}

export interface CreateCourseRequest {
  classRoomId: string
  teacherId: string
  specialityId?: string
  subject: string
  subjectCode?: string
  description?: string
  schedule?: string
  semester?: string
  documents?: string
}

export interface UpdateCourseRequest {
  teacherId?: string
  specialityId?: string
  subject?: string
  subjectCode?: string
  description?: string
  schedule?: string
  semester?: string
  documents?: string
}

export const courseService = {
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Course>>('/courses', {
      params: { page, size },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<CourseDetail>(`/courses/${id}`)
    return response.data
  },

  create: async (data: CreateCourseRequest) => {
    const response = await apiClient.post<CourseDetail>('/courses', data)
    return response.data
  },

  update: async (id: string, data: UpdateCourseRequest) => {
    const response = await apiClient.put<CourseDetail>(`/courses/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/courses/${id}`)
  },

  getByClassroom: async (classRoomId: string) => {
    const response = await apiClient.get<Course[]>(`/courses/classroom/${classRoomId}`)
    return response.data
  },

  getByTeacher: async (teacherId: string) => {
    const response = await apiClient.get<Course[]>(`/courses/teacher/${teacherId}`)
    return response.data
  },

  search: async (keyword: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Course>>('/courses/search', {
      params: { keyword, page, size },
    })
    return response.data
  },

  getBySemester: async (semester: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Course>>(`/courses/semester/${semester}`, {
      params: { page, size },
    })
    return response.data
  },

  // Course Materials
  uploadMaterial: async (courseId: string, file: File, title: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    
    const response = await apiClient.post<CourseMaterial>(
      `/courses/${courseId}/materials`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  getMaterialsByCourse: async (courseId: string) => {
    const response = await apiClient.get<CourseMaterial[]>(`/courses/${courseId}/materials`)
    return response.data
  },

  deleteMaterial: async (materialId: string) => {
    await apiClient.delete(`/courses/materials/${materialId}`)
  },
}
