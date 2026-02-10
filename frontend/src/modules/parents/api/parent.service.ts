import apiClient from '@/api/client'
import type { ApiResponse, PageResponse } from '@/types'

export interface Parent {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  schoolId: string
  occupation?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export interface ParentDetail {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  schoolId: string
  schoolName: string
  occupation?: string
  address?: string
  children: ParentStudent[]
  createdAt: string
  updatedAt: string
}

export interface ParentStudent {
  id: string
  parentId: string
  studentId: string
  studentFirstName: string
  studentLastName: string
  studentRegistrationNumber: string
  classRoomName?: string
  isPrimaryContact: boolean
  relationshipType: 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER'
}

export interface CreateParentRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  occupation?: string
  address?: string
  students?: LinkStudentRequest[]
}

export interface UpdateParentRequest {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  occupation?: string
  address?: string
}

export interface LinkStudentRequest {
  studentId: string
  isPrimaryContact: boolean
  relationshipType: 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER'
}

export const parentService = {
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Parent>>('/parents', {
      params: { page, size },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ParentDetail>(`/parents/${id}`)
    return response.data
  },

  create: async (data: CreateParentRequest) => {
    const response = await apiClient.post<ParentDetail>('/parents', data)
    return response.data
  },

  update: async (id: string, data: UpdateParentRequest) => {
    const response = await apiClient.put<ParentDetail>(`/parents/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/parents/${id}`)
  },

  search: async (keyword: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Parent>>('/parents/search', {
      params: { keyword, page, size },
    })
    return response.data
  },

  linkStudent: async (parentId: string, request: LinkStudentRequest) => {
    const response = await apiClient.post<ParentStudent>(
      `/parents/${parentId}/students`,
      request
    )
    return response.data
  },

  unlinkStudent: async (parentId: string, studentId: string) => {
    await apiClient.delete(`/parents/${parentId}/students/${studentId}`)
  },

  getChildren: async (parentId: string) => {
    const response = await apiClient.get<ParentStudent[]>(`/parents/${parentId}/students`)
    return response.data
  },

  getParentsByStudent: async (studentId: string) => {
    const response = await apiClient.get<Parent[]>(`/parents/student/${studentId}`)
    return response.data
  },
}
