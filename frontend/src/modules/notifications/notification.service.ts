import apiClient from '@/api/client'
import type { ApiResponse, PageResponse } from '@/types'

export interface Notification {
  id: string
  schoolId: string
  userId: string
  title: string
  message: string
  notificationType: NotificationType
  readStatus: boolean
  sentAt: string
  readAt?: string
  createdAt: string
  updatedAt: string
}

export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  REMINDER = 'REMINDER',
  ASSIGNMENT = 'ASSIGNMENT',
  GRADE = 'GRADE',
  ATTENDANCE = 'ATTENDANCE',
  PAYMENT = 'PAYMENT',
  EVENT = 'EVENT',
}

export interface CreateNotificationRequest {
  userId: string
  title: string
  message: string
  notificationType: NotificationType
}

export interface SendBulkNotificationRequest {
  title: string
  message: string
  notificationType: NotificationType
  targetRole?: 'STUDENT' | 'TEACHER' | 'PARENT'
  classroomId?: string
}

export const notificationService = {
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Notification>>('/notifications', {
      params: { page, size },
    })
    return response.data
  },

  getUnread: async () => {
    const response = await apiClient.get<ApiResponse<Notification[]>>('/notifications/unread')
    return response.data
  },

  getUnreadCount: async () => {
    const response = await apiClient.get<ApiResponse<number>>('/notifications/unread/count')
    return response.data
  },

  sendNotification: async (data: CreateNotificationRequest) => {
    const response = await apiClient.post<ApiResponse<Notification>>('/notifications/send', data)
    return response.data
  },

  sendBulkNotification: async (data: SendBulkNotificationRequest) => {
    const response = await apiClient.post<ApiResponse<Notification[]>>('/notifications/send-bulk', data)
    return response.data
  },

  markAsRead: async (id: string) => {
    const response = await apiClient.put<ApiResponse<Notification>>(`/notifications/${id}/mark-read`)
    return response.data
  },

  markAllAsRead: async () => {
    const response = await apiClient.put<ApiResponse<number>>('/notifications/mark-all-read')
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/notifications/${id}`)
  },
}
