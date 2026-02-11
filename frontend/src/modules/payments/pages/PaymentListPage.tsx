import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, BarChart3, DollarSign, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { paymentService } from '../api/payment.service'
import { queryClient } from '@/lib/queryClient'
import type { Payment } from '@/types'
import PaymentFormDialog from '../components/PaymentFormDialog'
import PaymentDetailDialog from '../components/PaymentDetailDialog'
import PaymentStatistics from '../components/PaymentStatistics'
import PaymentQuickStats from '../components/PaymentQuickStats'
import PaymentTable from '../components/PaymentTable'
import PaymentCard from '../components/PaymentCard'
import PaymentPagination from '../components/PaymentPagination'
import MarkAsPaidDialog from '../components/MarkAsPaidDialog'

export default function PaymentListPage() {
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [viewingPaymentId, setViewingPaymentId] = useState<string | null>(null)
  const [markingAsPaidPayment, setMarkingAsPaidPayment] = useState<Payment | null>(null)
  const [activeTab, setActiveTab] = useState('list')
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; invoiceNumber: string } | null>(null)
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['payments', page],
    queryFn: () => paymentService.getAll(page, pageSize),
  })

  const { data: statistics } = useQuery({
    queryKey: ['payment-statistics'],
    queryFn: () => paymentService.getStatistics(),
  })

  const { data: overduePayments } = useQuery({
    queryKey: ['payments-overdue'],
    queryFn: () => paymentService.getOverdue(),
    enabled: activeTab === 'overdue',
  })

  const deleteMutation = useMutation({
    mutationFn: paymentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['payment-statistics'] })
      toast.success('Payment deleted successfully', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
    onError: () => {
      toast.error('Failed to delete payment', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
  })

  const totalPayments = data?.totalElements || 0
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number ?? 0

  const handleDelete = (id: string, invoiceNumber: string) => {
    setDeleteConfirmation({ id, invoiceNumber })
  }

  const confirmDelete = () => {
    if (deleteConfirmation) {
      deleteMutation.mutate(deleteConfirmation.id)
    }
  }

  const handleMarkAsPaid = (payment: Payment) => {
    setMarkingAsPaidPayment(payment)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground mt-1">
            Manage all payments · {totalPayments} total
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="mr-2 size-4" />
            <span className="hidden sm:inline">Add Payment</span>
          </Button>
        </div>
      </div>

      {statistics && activeTab === 'list' && <PaymentQuickStats statistics={statistics} />}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tabs Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <TabsList className="grid grid-cols-3 bg-gray-100 p-2 rounded-xl w-full sm:w-auto gap-2">
            {/* Payment List Tab */}
            <TabsTrigger
              value="list"
              className="flex items-center gap-2 rounded-lg transition-all
                hover:bg-blue-50
                hover:text-blue-600"
            >
              <DollarSign className="size-4" />
              <span className="hidden sm:inline">Payments</span>
              <span className="sm:hidden">List</span>
            </TabsTrigger>

            {/* Overdue Payments Tab */}
            <TabsTrigger
              value="overdue"
              className="flex items-center gap-2 rounded-lg transition-all
                hover:bg-red-50
                hover:text-red-600"
            >
              <AlertCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Overdue</span>
              <span className="sm:hidden">Overdue</span>
            </TabsTrigger>

            {/* Statistics Tab */}
            <TabsTrigger
              value="statistics"
              className="flex items-center gap-2 rounded-lg transition-all
                hover:bg-blue-50
                hover:text-blue-600"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Statistics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Payment List Content */}
        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Payments</CardTitle>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : data?.content.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No payments yet</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <PaymentTable
                      payments={data?.content || []}
                      onView={setViewingPaymentId}
                      onEdit={setEditingPayment}
                      onDelete={handleDelete}
                      onMarkAsPaid={handleMarkAsPaid}
                    />
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4">
                    {data?.content.map((payment: Payment) => (
                      <PaymentCard
                        key={payment.id}
                        payment={payment}
                        onView={setViewingPaymentId}
                        onEdit={setEditingPayment}
                        onDelete={handleDelete}
                        onMarkAsPaid={handleMarkAsPaid}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <PaymentPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalPayments}
                    pageSize={pageSize}
                    onPageChange={setPage}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overdue Payments Content */}
        <TabsContent value="overdue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Overdue Payments
              </CardTitle>
            </CardHeader>

            <CardContent>
              {!overduePayments ? (
                <div className="text-center py-8">Loading...</div>
              ) : overduePayments.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
                  <p className="text-lg font-medium">No overdue payments</p>
                  <p className="text-sm text-muted-foreground">All payments are up to date!</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <PaymentTable
                      payments={overduePayments}
                      onView={setViewingPaymentId}
                      onEdit={setEditingPayment}
                      onDelete={handleDelete}
                      onMarkAsPaid={handleMarkAsPaid}
                    />
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4">
                    {overduePayments.map((payment: Payment) => (
                      <PaymentCard
                        key={payment.id}
                        payment={payment}
                        onView={setViewingPaymentId}
                        onEdit={setEditingPayment}
                        onDelete={handleDelete}
                        onMarkAsPaid={handleMarkAsPaid}
                      />
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Content */}
        <TabsContent value="statistics">
          <PaymentStatistics />
        </TabsContent>
      </Tabs>

      <PaymentFormDialog
        open={isCreateOpen || !!editingPayment}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingPayment(null)
        }}
        payment={editingPayment}
      />

      {viewingPaymentId && (
        <PaymentDetailDialog
          open={!!viewingPaymentId}
          onClose={() => setViewingPaymentId(null)}
          paymentId={viewingPaymentId}
        />
      )}

      <MarkAsPaidDialog
        open={!!markingAsPaidPayment}
        onClose={() => setMarkingAsPaidPayment(null)}
        payment={markingAsPaidPayment}
      />

      <ConfirmationDialog
        open={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={confirmDelete}
        title="Delete Payment"
        description="Are you sure you want to delete this payment? This action cannot be undone."
        itemName={deleteConfirmation?.invoiceNumber}
        confirmText="Delete Payment"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
