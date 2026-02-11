import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CheckCircle, Calendar, CreditCard, Hash, FileText } from 'lucide-react'
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
import { paymentService, type MarkAsPaidRequest } from '../api/payment.service'
import type { Payment } from '@/types'

const markAsPaidSchema = z.object({
  paidDate: z.string().min(1, 'Paid date is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
})

type MarkAsPaidFormData = z.infer<typeof markAsPaidSchema>

interface MarkAsPaidDialogProps {
  open: boolean
  onClose: () => void
  payment: Payment | null
}

const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CARD', label: 'Card' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'ONLINE', label: 'Online' },
  { value: 'CHECK', label: 'Check' },
  { value: 'MOBILE_MONEY', label: 'Mobile Money' },
]

export default function MarkAsPaidDialog({ open, onClose, payment }: MarkAsPaidDialogProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MarkAsPaidFormData>({
    resolver: zodResolver(markAsPaidSchema),
  })

  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().split('T')[0]
      reset({
        paidDate: today,
        paymentMethod: '',
        transactionId: '',
        notes: '',
      })
    }
  }, [open, reset])

  const markAsPaidMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MarkAsPaidRequest }) =>
      paymentService.markAsPaid(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['payment-statistics'] })
      toast.success('Payment marked as paid successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to mark payment as paid'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const onSubmit = async (data: MarkAsPaidFormData) => {
    if (!payment) return

    const markAsPaidData: MarkAsPaidRequest = {
      paidDate: data.paidDate,
      paymentMethod: data.paymentMethod,
      transactionId: data.transactionId,
      notes: data.notes,
    }
    markAsPaidMutation.mutate({ id: payment.id, data: markAsPaidData })
  }

  if (!payment) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black dark:text-white">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Mark Payment as Paid
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Record payment receipt for {payment.invoiceNumber}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Payment Summary */}
          <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Student:</span>
                <span className="font-medium">{payment.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  ${payment.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date:</span>
                <span className="font-medium">{new Date(payment.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Receipt Details */}
          <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
              <CreditCard className="h-4 w-4" />
              Payment Receipt Details
            </h3>

            <div className="space-y-2">
              <Label htmlFor="paidDate" className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Paid Date *
              </Label>
              <Input
                id="paidDate"
                type="date"
                {...register('paidDate')}
                className="bg-white dark:bg-gray-900"
              />
              {errors.paidDate && (
                <p className="text-sm text-red-600 font-medium">{errors.paidDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                Payment Method *
              </Label>
              <Select
                onValueChange={(value) => setValue('paymentMethod', value)}
                value={watch('paymentMethod') || ''}
              >
                <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem 
                      key={method.value} 
                      value={method.value}
                      className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
                    >
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.paymentMethod && (
                <p className="text-sm text-red-600 font-medium">{errors.paymentMethod.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionId" className="flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                Transaction ID (Optional)
              </Label>
              <Input
                id="transactionId"
                {...register('transactionId')}
                className="bg-white dark:bg-gray-900"
                placeholder="Enter transaction reference"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                {...register('notes')}
                rows={2}
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
              disabled={markAsPaidMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {markAsPaidMutation.isPending ? (
                <>Processing...</>
              ) : (
                <>Mark as Paid</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
