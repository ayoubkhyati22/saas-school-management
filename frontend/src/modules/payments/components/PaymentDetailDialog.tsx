import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { paymentService } from '../api/payment.service'
import { formatDate } from '@/lib/utils'
import { 
  DollarSign, 
  User, 
  FileText, 
  Calendar, 
  CreditCard, 
  Hash, 
  Clock,
  CheckCircle,
  FileCheck
} from 'lucide-react'

interface PaymentDetailDialogProps {
  open: boolean
  onClose: () => void
  paymentId: string
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

export default function PaymentDetailDialog({ open, onClose, paymentId }: PaymentDetailDialogProps) {
  const { data: payment, isLoading } = useQuery({
    queryKey: ['payments', paymentId],
    queryFn: () => paymentService.getById(paymentId),
    enabled: open && !!paymentId,
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Payment Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : payment ? (
          <div className="space-y-6">
            {/* Header with Amount and Status */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center border-2 border-blue-200 dark:border-blue-800">
                <DollarSign className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ${payment.amount.toFixed(2)}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {getPaymentTypeLabel(payment.paymentType)}
                </p>
                <Badge variant={getStatusColor(payment.status)} className="mt-2">
                  {payment.status}
                </Badge>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column */}
              <div className="space-y-4">
                
                {/* Invoice Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Invoice Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Hash className="h-4 w-4 flex-shrink-0" />
                          <span>Invoice Number</span>
                        </div>
                        <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                          {payment.invoiceNumber}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <CreditCard className="h-4 w-4 flex-shrink-0" />
                          <span>Payment Type</span>
                        </div>
                        <span className="font-medium">
                          {getPaymentTypeLabel(payment.paymentType)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <DollarSign className="h-4 w-4 flex-shrink-0" />
                          <span>Amount</span>
                        </div>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          ${payment.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Student Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Student Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <User className="h-4 w-4 flex-shrink-0" />
                          <span>Name</span>
                        </div>
                        <span className="font-medium">{payment.studentName}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Right Column */}
              <div className="space-y-4">
                
                {/* Payment Dates */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Payment Dates
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>Due Date</span>
                        </div>
                        <span className="font-medium">{formatDate(payment.dueDate)}</span>
                      </div>
                      {payment.paidDate && (
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <CheckCircle className="h-4 w-4 flex-shrink-0" />
                            <span>Paid Date</span>
                          </div>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {formatDate(payment.paidDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method - Only show if paid */}
                {payment.status === 'PAID' && payment.paymentMethod && (
                  <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        Payment Method
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <CreditCard className="h-4 w-4 flex-shrink-0" />
                            <span>Method</span>
                          </div>
                          <span className="font-medium">{payment.paymentMethod}</span>
                        </div>
                        {payment.transactionId && (
                          <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <div className="flex items-center gap-3 text-muted-foreground">
                              <Hash className="h-4 w-4 flex-shrink-0" />
                              <span>Transaction ID</span>
                            </div>
                            <span className="font-mono text-xs font-medium">
                              {payment.transactionId}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* System Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      System Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="text-muted-foreground">Created At</span>
                        <span className="font-medium">{formatDate(payment.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="font-medium">{formatDate(payment.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

            </div>

            {/* Notes Section - Full Width */}
            {payment.notes && (
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-primary" />
                    Notes
                  </h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {payment.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-8">Payment not found</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
