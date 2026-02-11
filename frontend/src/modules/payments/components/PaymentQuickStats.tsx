import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import type { PaymentStatistics } from '../api/payment.service'

interface PaymentQuickStatsProps {
  statistics: PaymentStatistics
}

export default function PaymentQuickStats({ statistics }: PaymentQuickStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      
      <Card className="border border-gray-200 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-600">Total Collected</p>
              <div className="text-3xl font-bold text-gray-900">
                ${statistics.totalCollected.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">{statistics.paidCount} payments</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-gradient-to-br from-amber-50 to-white hover:border-amber-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-600">Total Pending</p>
              <div className="text-3xl font-bold text-gray-900">
                ${statistics.totalPending.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">{statistics.pendingCount} payments</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center">
              <Clock className="h-7 w-7 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-gradient-to-br from-red-50 to-white hover:border-red-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-600">Total Overdue</p>
              <div className="text-3xl font-bold text-gray-900">
                ${statistics.totalOverdue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">{statistics.overdueCount} payments</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-600">Total Revenue</p>
              <div className="text-3xl font-bold text-gray-900">
                ${(statistics.totalCollected + statistics.totalPending + statistics.totalOverdue).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Expected total</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-7 w-7 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
