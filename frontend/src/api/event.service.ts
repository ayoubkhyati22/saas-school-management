import apiClient from './client'
import type { ApiResponse, PageResponse, Event } from '@/types'

export interface CreateEventRequest {
  title: string
  description: string
  eventType: string
  eventDate: string
  location?: string
  targetRole?: string
  imageUrl?: string
}

export const eventService = {
  getAll: async (page = 0, size = 10, schoolId?: string) => {
    const response = await apiClient.get<PageResponse<Event>>('/events', {
      params: { page, size, schoolId },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Event>>(`/events/${id}`)
    return response.data.data
  },

  create: async (data: CreateEventRequest) => {
    const response = await apiClient.post<ApiResponse<Event>>('/events', data)
    return response.data.data
  },

  update: async (id: string, data: Partial<CreateEventRequest>) => {
    const response = await apiClient.put<ApiResponse<Event>>(`/events/${id}`, data)
    return response.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/events/${id}`)
  },
}
