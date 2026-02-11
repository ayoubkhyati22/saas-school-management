import apiClient from '@/api/client'
import type { ApiResponse, PageResponse, Payment } from '@/types'

export interface CreatePaymentRequest {
  studentId: string
  amount: number
  paymentType: 'TUITION' | 'REGISTRATION' | 'EXAM_FEE' | 'LIBRARY_FEE' | 'TRANSPORT_FEE' | 'HOSTEL_FEE' | 'SPORTS_FEE' | 'LAB_FEE' | 'OTHER'
  dueDate: string
  notes?: string
}

export interface UpdatePaymentRequest {
  amount?: number
  paymentType?: 'TUITION' | 'REGISTRATION' | 'EXAM_FEE' | 'LIBRARY_FEE' | 'TRANSPORT_FEE' | 'HOSTEL_FEE' | 'SPORTS_FEE' | 'LAB_FEE' | 'OTHER'
  dueDate?: string
  notes?: string
}

export interface MarkAsPaidRequest {
  paidDate: string
  paymentMethod: string
  transactionId?: string
  notes?: string
}

export interface PaymentStatistics {
  totalCollected: number
  totalPending: number
  totalOverdue: number
  paidCount: number
  pendingCount: number
  overdueCount: number
  collectedByType: Record<string, number>
}

export const paymentService = {
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<Payment>>('/payments', {
      params: { page, size },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Payment>(`/payments/${id}`)
    return response.data
  },

  getByStudent: async (studentId: string) => {
    const response = await apiClient.get<Payment[]>(`/payments/student/${studentId}`)
    return response.data
  },

  getOverdue: async () => {
    const response = await apiClient.get<Payment[]>('/payments/overdue')
    return response.data
  },

  getStatistics: async () => {
    const response = await apiClient.get<PaymentStatistics>('/payments/statistics')
    return response.data
  },

  create: async (data: CreatePaymentRequest) => {
    const response = await apiClient.post<Payment>('/payments', data)
    return response.data
  },

  update: async (id: string, data: UpdatePaymentRequest) => {
    const response = await apiClient.put<Payment>(`/payments/${id}`, data)
    return response.data
  },

  markAsPaid: async (id: string, data: MarkAsPaidRequest) => {
    const response = await apiClient.put<Payment>(`/payments/${id}/mark-paid`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/payments/${id}`)
  },
}
