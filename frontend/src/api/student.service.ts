// frontend/src/api/student.service.ts
import apiClient from './client'
import type { ApiResponse, PageResponse, Student } from '@/types'

export interface CreateStudentRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  classRoomId?: string | null
  registrationNumber: string
  birthDate: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  enrollmentDate: string
  address?: string
  avatarUrl?: string
  administrativeDocuments?: string
}

export interface UpdateStudentRequest {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  classRoomId?: string | null
  birthDate?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  status?: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'WITHDRAWN'
  address?: string
  avatarUrl?: string
  administrativeDocuments?: string
}

export interface StudentStatistics {
  totalStudents: number
  activeStudents: number
  inactiveStudents: number
  maleStudents: number
  femaleStudents: number
  studentsByClass: Record<string, number>
  studentsByGender: Record<string, number>
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
    return response.data
  },

  create: async (data: CreateStudentRequest) => {
    // Clean up the data before sending
    const requestData = {
      ...data,
      classRoomId: data.classRoomId || undefined, // Convert empty string to undefined
      address: data.address || undefined,
      avatarUrl: data.avatarUrl || undefined,
      administrativeDocuments: data.administrativeDocuments || undefined,
    }
    const response = await apiClient.post<ApiResponse<Student>>('/students', requestData)
    return response.data.data
  },

  update: async (id: string, data: UpdateStudentRequest) => {
    // Clean up the data before sending
    const requestData: any = {}
    if (data.firstName) requestData.firstName = data.firstName
    if (data.lastName) requestData.lastName = data.lastName
    if (data.phoneNumber) requestData.phoneNumber = data.phoneNumber
    if (data.classRoomId !== undefined) requestData.classRoomId = data.classRoomId || null
    if (data.birthDate) requestData.birthDate = data.birthDate
    if (data.gender) requestData.gender = data.gender
    if (data.status) requestData.status = data.status
    if (data.address !== undefined) requestData.address = data.address
    if (data.avatarUrl !== undefined) requestData.avatarUrl = data.avatarUrl
    if (data.administrativeDocuments !== undefined) requestData.administrativeDocuments = data.administrativeDocuments

    const response = await apiClient.put<ApiResponse<Student>>(`/students/${id}`, requestData)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/students/${id}`)
  },

  getByClassroom: async (classRoomId: string) => {
    const response = await apiClient.get<ApiResponse<Student[]>>(`/students/classroom/${classRoomId}`)
    return response.data
  },

  search: async (keyword: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Student>>('/students/search', {
      params: { keyword, page, size },
    })
    return response.data
  },

  getStatistics: async () => {
    const response = await apiClient.get<ApiResponse<StudentStatistics>>('/students/statistics')
    return response.data
  },
}