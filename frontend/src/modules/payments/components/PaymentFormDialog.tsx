import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { DollarSign, User, Calendar, CreditCard, FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { paymentService, type CreatePaymentRequest, type UpdatePaymentRequest } from '../api/payment.service'
import { studentService } from '@/modules/students/api/student.service'
import type { Payment } from '@/types'

const paymentSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  paymentType: z.enum(['TUITION', 'REGISTRATION', 'EXAM_FEE', 'LIBRARY_FEE', 'TRANSPORT_FEE', 'HOSTEL_FEE', 'SPORTS_FEE', 'LAB_FEE', 'OTHER']),
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().optional(),
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface PaymentFormDialogProps {
  open: boolean
  onClose: () => void
  payment?: Payment | null
}

const PAYMENT_TYPES = [
  { value: 'TUITION', label: 'Tuition' },
  { value: 'REGISTRATION', label: 'Registration' },
  { value: 'EXAM_FEE', label: 'Exam Fee' },
  { value: 'LIBRARY_FEE', label: 'Library Fee' },
  { value: 'TRANSPORT_FEE', label: 'Transport Fee' },
  { value: 'HOSTEL_FEE', label: 'Hostel Fee' },
  { value: 'SPORTS_FEE', label: 'Sports Fee' },
  { value: 'LAB_FEE', label: 'Lab Fee' },
  { value: 'OTHER', label: 'Other' },
]

export default function PaymentFormDialog({ open, onClose, payment }: PaymentFormDialogProps) {
  const isEdit = !!payment
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  })

  const { data: studentsData } = useQuery({
    queryKey: ['students-all'],
    queryFn: () => studentService.getAll(0, 1000),
  })

  useEffect(() => {
    if (payment && open) {
      reset({
        studentId: payment.studentId || '',
        amount: payment.amount || 0,
        paymentType: payment.paymentType as any,
        dueDate: payment.dueDate || '',
        notes: payment.notes || '',
      })
    } else if (!payment && open) {
      const today = new Date()
      const nextMonth = new Date(today.setMonth(today.getMonth() + 1))
      const dueDateStr = nextMonth.toISOString().split('T')[0]
      
      reset({
        studentId: '',
        amount: 0,
        paymentType: 'TUITION',
        dueDate: dueDateStr,
        notes: '',
      })
    }
  }, [payment, open, reset])

  const createMutation = useMutation({
    mutationFn: (data: CreatePaymentRequest) => paymentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['payment-statistics'] })
      toast.success('Payment created successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create payment'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaymentRequest }) =>
      paymentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['payment-statistics'] })
      toast.success('Payment updated successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update payment'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const onSubmit = async (data: PaymentFormData) => {
    if (isEdit && payment) {
      const updateData: UpdatePaymentRequest = {
        amount: data.amount,
        paymentType: data.paymentType,
        dueDate: data.dueDate,
        notes: data.notes,
      }
      updateMutation.mutate({ id: payment.id, data: updateData })
    } else {
      const createData: CreatePaymentRequest = {
        studentId: data.studentId,
        amount: data.amount,
        paymentType: data.paymentType,
        dueDate: data.dueDate,
        notes: data.notes,
      }
      createMutation.mutate(createData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black dark:text-white">
            <DollarSign className="h-5 w-5" />
            {isEdit ? 'Edit Payment' : 'Create New Payment'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update payment information' : 'Add a new payment to the system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Student Selection */}
          <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
              <User className="h-4 w-4" />
              Student Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="studentId" className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Student *
              </Label>
              <Select
                onValueChange={(value) => setValue('studentId', value)}
                value={watch('studentId') || ''}
                disabled={isEdit}
              >
                <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                  {studentsData?.content?.map((student: any) => (
                    <SelectItem 
                      key={student.id} 
                      value={student.id}
                      className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
                    >
                      {student.firstName} {student.lastName} - {student.registrationNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.studentId && (
                <p className="text-sm text-red-600 font-medium">{errors.studentId.message}</p>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
              <CreditCard className="h-4 w-4" />
              Payment Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  Amount *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  {...register('amount', { valueAsNumber: true })}
                  className="bg-white dark:bg-gray-900"
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="text-sm text-red-600 font-medium">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentType" className="flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                  Payment Type *
                </Label>
                <Select
                  onValueChange={(value) => setValue('paymentType', value as any)}
                  value={watch('paymentType')}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                    {PAYMENT_TYPES.map((type) => (
                      <SelectItem 
                        key={type.value} 
                        value={type.value}
                        className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.paymentType && (
                  <p className="text-sm text-red-600 font-medium">{errors.paymentType.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Due Date *
              </Label>
              <Input
                id="dueDate"
                type="date"
                {...register('dueDate')}
                className="bg-white dark:bg-gray-900"
              />
              {errors.dueDate && (
                <p className="text-sm text-red-600 font-medium">{errors.dueDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                {...register('notes')}
                rows={3}
                className="bg-white dark:bg-gray-900"
                placeholder="Add any additional notes..."
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-gray-300 hover:bg-gray-100 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>Processing...</>
              ) : (
                <>{isEdit ? 'Update Payment' : 'Create Payment'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
