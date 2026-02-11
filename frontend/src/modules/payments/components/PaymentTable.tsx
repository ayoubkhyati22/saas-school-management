import { Eye, Edit, Trash2, CheckCircle, DollarSign, Calendar, FileText, User, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Payment } from '@/types'

interface PaymentTableProps {
  payments: Payment[]
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

export default function PaymentTable({ payments, onView, onEdit, onDelete, onMarkAsPaid }: PaymentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Invoice
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Student
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Amount
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Type
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Due Date
            </div>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Paid Date
            </div>
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-medium">
              <span className="font-mono text-sm font-semibold text-blue-600 px-3 py-1 rounded-md">
                {payment.invoiceNumber}
              </span>
            </TableCell>
            <TableCell>
              <div className="font-medium">
                <b>{payment.studentName}</b>
              </div>
            </TableCell>
            <TableCell>
              <span className="font-bold text-green-600">
                ${payment.amount.toFixed(2)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{getPaymentTypeLabel(payment.paymentType)}</span>
            </TableCell>
            <TableCell>{formatDate(payment.dueDate)}</TableCell>
            <TableCell>
              <Badge variant={getStatusColor(payment.status)}>
                {payment.status}
              </Badge>
            </TableCell>
            <TableCell>
              {payment.paidDate ? formatDate(payment.paidDate) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1.5">
                {/* View */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(payment.id)}
                  title="View Details"
                  className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 group/btn"
                >
                  <Eye className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Mark as Paid - only for PENDING status */}
                {payment.status === 'PENDING' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onMarkAsPaid(payment)}
                    title="Mark as Paid"
                    className="h-9 w-9 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all duration-200 group/btn"
                  >
                    <CheckCircle className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                  </Button>
                )}

                {/* Edit */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(payment)}
                  title="Edit"
                  className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-all duration-200 group/btn"
                >
                  <Edit className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(payment.id, payment.invoiceNumber)}
                  title="Delete"
                  className="h-9 w-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 group/btn"
                >
                  <Trash2 className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
