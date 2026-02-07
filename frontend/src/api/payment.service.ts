import apiClient from './client'
import type { ApiResponse, PageResponse, Payment } from '@/types'

export interface CreatePaymentRequest {
  studentId: string
  amount: number
  paymentType: string
  dueDate: string
  invoiceNumber: string
  notes?: string
}

export const paymentService = {
  getAll: async (page = 0, size = 10, schoolId?: string, studentId?: string, status?: string) => {
    const response = await apiClient.get<PageResponse<Payment>>('/payments', {
      params: { page, size, schoolId, studentId, status },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Payment>>(`/payments/${id}`)
    return response.data.data
  },

  create: async (data: CreatePaymentRequest) => {
    const response = await apiClient.post<ApiResponse<Payment>>('/payments', data)
    return response.data.data
  },

  update: async (id: string, data: Partial<CreatePaymentRequest>) => {
    const response = await apiClient.put<ApiResponse<Payment>>(`/payments/${id}`, data)
    return response.data.data
  },

  markAsPaid: async (id: string, paymentMethod: string) => {
    const response = await apiClient.post<ApiResponse<Payment>>(`/payments/${id}/mark-paid`, {
      paymentMethod,
    })
    return response.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/payments/${id}`)
  },
}
