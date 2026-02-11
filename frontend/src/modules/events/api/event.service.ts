import apiClient from '@/api/client'
import type { ApiResponse, PageResponse } from '@/types'

export type EventType = 
  | 'MEETING'
  | 'EXAM'
  | 'HOLIDAY'
  | 'SPORTS_DAY'
  | 'PARENT_TEACHER_MEETING'
  | 'SCHOOL_TRIP'
  | 'CULTURAL_EVENT'
  | 'WORKSHOP'
  | 'SEMINAR'
  | 'OTHER'

export type TargetRole = 'ALL' | 'STUDENT' | 'TEACHER' | 'PARENT'

export interface Event {
  id: string
  schoolId: string
  title: string
  description?: string
  eventType: EventType
  eventDate: string
  location?: string
  targetRole: TargetRole
  createdBy: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CreateEventRequest {
  title: string
  description?: string
  eventType: EventType
  eventDate: string
  location?: string
  targetRole: TargetRole
  imageUrl?: string
}

export interface UpdateEventRequest {
  title?: string
  description?: string
  eventType?: EventType
  eventDate?: string
  location?: string
  targetRole?: TargetRole
  imageUrl?: string
}

export const eventService = {
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Event>>('/events', {
      params: { page, size },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Event>(`/events/${id}`)
    return response.data
  },

  create: async (data: CreateEventRequest) => {
    const response = await apiClient.post<Event>('/events', data)
    return response.data
  },

  update: async (id: string, data: UpdateEventRequest) => {
    const response = await apiClient.put<Event>(`/events/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/events/${id}`)
  },

  getUpcomingEvents: async () => {
    const response = await apiClient.get<Event[]>('/events/upcoming')
    return response.data
  },

  getByTargetRole: async (targetRole: TargetRole) => {
    const response = await apiClient.get<Event[]>(`/events/target-role/${targetRole}`)
    return response.data
  },

  getByDateRange: async (startDate: string, endDate: string) => {
    const response = await apiClient.get<Event[]>('/events/date-range', {
      params: { startDate, endDate },
    })
    return response.data
  },
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  MEETING: 'Meeting',
  EXAM: 'Exam',
  HOLIDAY: 'Holiday',
  SPORTS_DAY: 'Sports Day',
  PARENT_TEACHER_MEETING: 'Parent-Teacher Meeting',
  SCHOOL_TRIP: 'School Trip',
  CULTURAL_EVENT: 'Cultural Event',
  WORKSHOP: 'Workshop',
  SEMINAR: 'Seminar',
  OTHER: 'Other',
}

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  MEETING: 'blue',
  EXAM: 'red',
  HOLIDAY: 'green',
  SPORTS_DAY: 'orange',
  PARENT_TEACHER_MEETING: 'purple',
  SCHOOL_TRIP: 'cyan',
  CULTURAL_EVENT: 'pink',
  WORKSHOP: 'indigo',
  SEMINAR: 'yellow',
  OTHER: 'gray',
}

export const TARGET_ROLE_LABELS: Record<TargetRole, string> = {
  ALL: 'Everyone',
  STUDENT: 'Students',
  TEACHER: 'Teachers',
  PARENT: 'Parents',
}
