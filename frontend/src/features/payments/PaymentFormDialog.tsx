import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { paymentService } from '@/api/payment.service'
import { queryClient } from '@/lib/queryClient'
import type { Payment } from '@/types'

const paymentSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  paymentType: z.string().min(1, 'Payment type is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  notes: z.string().optional(),
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface PaymentFormDialogProps {
  open: boolean
  onClose: () => void
  payment?: Payment | null
}

export default function PaymentFormDialog({ open, onClose, payment }: PaymentFormDialogProps) {
  const isEdit = !!payment

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  })

  useEffect(() => {
    if (payment) {
      reset({
        studentId: payment.student.id,
        amount: payment.amount,
        paymentType: payment.paymentType,
        dueDate: payment.dueDate.split('T')[0],
        invoiceNumber: payment.invoiceNumber,
        notes: payment.notes || '',
      })
    } else {
      reset({
        studentId: '',
        amount: 0,
        paymentType: 'TUITION',
        dueDate: new Date().toISOString().split('T')[0],
        invoiceNumber: '',
        notes: '',
      })
    }
  }, [payment, reset])

  const createMutation = useMutation({
    mutationFn: paymentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      toast.success('Payment created successfully')
      onClose()
      reset()
    },
    onError: () => {
      toast.error('Failed to create payment')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentFormData> }) =>
      paymentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      toast.success('Payment updated successfully')
      onClose()
      reset()
    },
    onError: () => {
      toast.error('Failed to update payment')
    },
  })

  const onSubmit = (data: PaymentFormData) => {
    if (isEdit && payment) {
      updateMutation.mutate({ id: payment.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Payment' : 'Create New Payment'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update payment information' : 'Create a new payment record'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input id="studentId" {...register('studentId')} />
            {errors.studentId && (
              <p className="text-sm text-destructive">{errors.studentId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input id="invoiceNumber" {...register('invoiceNumber')} placeholder="INV-001" />
              {errors.invoiceNumber && (
                <p className="text-sm text-destructive">{errors.invoiceNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select
                onValueChange={(value) => setValue('paymentType', value)}
                defaultValue="TUITION"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TUITION">Tuition</SelectItem>
                  <SelectItem value="EXAM_FEE">Exam Fee</SelectItem>
                  <SelectItem value="TRANSPORT">Transport</SelectItem>
                  <SelectItem value="CAFETERIA">Cafeteria</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentType && (
                <p className="text-sm text-destructive">{errors.paymentType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" {...register('dueDate')} />
              {errors.dueDate && (
                <p className="text-sm text-destructive">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" {...register('notes')} rows={3} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
