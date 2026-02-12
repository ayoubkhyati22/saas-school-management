import apiClient from '@/api/client'
import type { ApiResponse, PageResponse } from '@/types'

export interface Timetable {
  id: string
  schoolId: string
  classRoomId: string
  classRoomName: string
  classRoomLevel: string
  teacherId: string
  teacherName: string
  courseId: string
  courseName: string
  courseCode: string
  specialityId?: string
  specialityName?: string
  specialityCode?: string
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
  startTime: string
  endTime: string
  roomNumber?: string
  semester?: string
  academicYear: string
  notes?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface TimetableDetail {
  id: string
  schoolId: string
  schoolName: string
  classRoomId: string
  classRoomName: string
  classRoomLevel: string
  classRoomSection: string
  teacherId: string
  teacherName: string
  teacherEmail: string
  teacherEmployeeNumber: string
  courseId: string
  courseName: string
  courseCode: string
  courseDescription: string
  specialityId?: string
  specialityName?: string
  specialityCode?: string
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
  startTime: string
  endTime: string
  roomNumber?: string
  semester?: string
  academicYear: string
  notes?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTimetableRequest {
  classRoomId: string
  teacherId: string
  courseId: string
  specialityId?: string
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
  startTime: string
  endTime: string
  roomNumber?: string
  semester?: string
  academicYear: string
  notes?: string
}

export interface UpdateTimetableRequest {
  teacherId?: string
  specialityId?: string
  dayOfWeek?: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
  startTime?: string
  endTime?: string
  roomNumber?: string
  semester?: string
  academicYear?: string
  notes?: string
  active?: boolean
}

export interface TimetableStatistics {
  totalSlots: number
  activeSlots: number
  inactiveSlots: number
  slotsByDayOfWeek: Record<string, number>
  slotsByClassRoom: Record<string, number>
  slotsByTeacher: Record<string, number>
  slotsByCourse: Record<string, number>
}

export const timetableService = {
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Timetable>>('/timetables', {
      params: { page, size },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<TimetableDetail>(`/timetables/${id}`)
    return response.data
  },

  create: async (data: CreateTimetableRequest) => {
    const response = await apiClient.post<TimetableDetail>('/timetables', data)
    return response.data
  },

  update: async (id: string, data: UpdateTimetableRequest) => {
    const response = await apiClient.put<TimetableDetail>(`/timetables/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/timetables/${id}`)
  },

  getByClassroom: async (classRoomId: string) => {
    const response = await apiClient.get<Timetable[]>(`/timetables/classroom/${classRoomId}`)
    return response.data
  },

  getByTeacher: async (teacherId: string) => {
    const response = await apiClient.get<Timetable[]>(`/timetables/teacher/${teacherId}`)
    return response.data
  },

  getByCourse: async (courseId: string) => {
    const response = await apiClient.get<Timetable[]>(`/timetables/course/${courseId}`)
    return response.data
  },

  getBySpeciality: async (specialityId: string) => {
    const response = await apiClient.get<Timetable[]>(`/timetables/speciality/${specialityId}`)
    return response.data
  },

  getByDay: async (dayOfWeek: string) => {
    const response = await apiClient.get<Timetable[]>(`/timetables/day/${dayOfWeek}`)
    return response.data
  },

  getByAcademicYear: async (academicYear: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Timetable>>(`/timetables/academic-year/${academicYear}`, {
      params: { page, size },
    })
    return response.data
  },

  getBySemester: async (semester: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Timetable>>(`/timetables/semester/${semester}`, {
      params: { page, size },
    })
    return response.data
  },

  search: async (keyword: string, page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Timetable>>('/timetables/search', {
      params: { keyword, page, size },
    })
    return response.data
  },

  getStatistics: async () => {
    const response = await apiClient.get<TimetableStatistics>('/timetables/statistics')
    return response.data
  },

  activate: async (id: string) => {
    await apiClient.post(`/timetables/${id}/activate`)
  },

  deactivate: async (id: string) => {
    await apiClient.post(`/timetables/${id}/deactivate`)
  },

  exportByTeacher: async (teacherId: string, academicYear: string) => {
    const response = await apiClient.get(`/timetables/export/teacher/${teacherId}`, {
      params: { academicYear },
      responseType: 'blob',
    })
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `timetable_teacher_${teacherId}_${academicYear}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },

  exportByClassroom: async (classRoomId: string, academicYear: string) => {
    const response = await apiClient.get(`/timetables/export/classroom/${classRoomId}`, {
      params: { academicYear },
      responseType: 'blob',
    })
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `timetable_classroom_${classRoomId}_${academicYear}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },

  exportByCourse: async (courseId: string, academicYear: string) => {
    const response = await apiClient.get(`/timetables/export/course/${courseId}`, {
      params: { academicYear },
      responseType: 'blob',
    })
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `timetable_course_${courseId}_${academicYear}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },

  exportBySpeciality: async (specialityId: string, academicYear: string) => {
    const response = await apiClient.get(`/timetables/export/speciality/${specialityId}`, {
      params: { academicYear },
      responseType: 'blob',
    })
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `timetable_speciality_${specialityId}_${academicYear}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },
}
