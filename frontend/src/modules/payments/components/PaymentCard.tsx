import { Eye, DollarSign, Edit, Trash2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Payment } from '@/types'

interface PaymentCardProps {
  payment: Payment
  onView: (id: string) => void
  onEdit: (payment: Payment) => void
  onDelete: (id: string, invoiceNumber: string) => void
  onMarkAsPaid: (payment: Payment) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAID':
      return 'success'
    case 'PENDING':
      return 'warning'
    case 'OVERDUE':
      return 'destructive'
    case 'CANCELLED':
      return 'secondary'
    case 'REFUNDED':
      return 'secondary'
    default:
      return 'default'
  }
}

const getPaymentTypeLabel = (type: string) => {
  return type.replace(/_/g, ' ')
}

export default function PaymentCard({ payment, onView, onEdit, onDelete, onMarkAsPaid }: PaymentCardProps) {
  const isPending = payment.status === 'PENDING'

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-base">{payment.studentName}</h3>
              <p className="text-xs text-muted-foreground">{payment.invoiceNumber}</p>
              <Badge variant={getStatusColor(payment.status)} className="mt-1">
                {payment.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-bold text-green-600">${payment.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium">{getPaymentTypeLabel(payment.paymentType)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Due Date:</span>
            <span className="font-medium">{formatDate(payment.dueDate)}</span>
          </div>
          {payment.paidDate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paid Date:</span>
              <span className="font-medium">{formatDate(payment.paidDate)}</span>
            </div>
          )}
          {payment.paymentMethod && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method:</span>
              <span className="font-medium">{payment.paymentMethod}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(payment.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
          </Button>
          {isPending && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-green-600 hover:text-green-700"
              onClick={() => onMarkAsPaid(payment)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(payment)}
          >
            <Edit className="h-4 w-4 mr-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(payment.id, payment.invoiceNumber)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
