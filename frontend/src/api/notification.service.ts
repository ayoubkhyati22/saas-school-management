import apiClient from './client'
import type { ApiResponse, PageResponse, Notification } from '@/types'

export interface CreateNotificationRequest {
  userId: string
  title: string
  message: string
  notificationType: string
}

export const notificationService = {
  getAll: async (page = 0, size = 10, readStatus?: boolean) => {
    const response = await apiClient.get<PageResponse<Notification>>('/notifications', {
      params: { page, size, readStatus },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Notification>>(`/notifications/${id}`)
    return response.data.data
  },

  create: async (data: CreateNotificationRequest) => {
    const response = await apiClient.post<ApiResponse<Notification>>('/notifications', data)
    return response.data.data
  },

  markAsRead: async (id: string) => {
    const response = await apiClient.post<ApiResponse<Notification>>(`/notifications/${id}/read`)
    return response.data.data
  },

  markAllAsRead: async () => {
    await apiClient.post('/notifications/read-all')
  },

  delete: async (id: string) => {
    await apiClient.delete(`/notifications/${id}`)
  },
}
