import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { paymentService } from '../api/payment.service'
import {
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899',
  cyan: '#06b6d4',
}

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#f97316']

export default function PaymentStatistics() {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['payment-statistics'],
    queryFn: () => paymentService.getStatistics(),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <DollarSign className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium">No statistics available</p>
        <p className="text-sm text-muted-foreground">Add payments to see statistics</p>
      </div>
    )
  }

  const collectionRate = statistics.paidCount + statistics.pendingCount + statistics.overdueCount > 0
    ? (statistics.paidCount / (statistics.paidCount + statistics.pendingCount + statistics.overdueCount) * 100).toFixed(1)
    : '0'

  const typeData = Object.entries(statistics.collectedByType || {})
    .map(([name, value]) => ({
      name: name.replace(/_/g, ' '),
      amount: Number(value),
    }))
    .sort((a, b) => b.amount - a.amount)

  const statusData = [
    { name: 'Paid', value: statistics.paidCount, color: COLORS.success },
    { name: 'Pending', value: statistics.pendingCount, color: COLORS.warning },
    { name: 'Overdue', value: statistics.overdueCount, color: COLORS.danger },
  ].filter(item => item.value > 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
                <h3 className="text-3xl font-bold mt-2 text-green-600">
                  ${statistics.totalCollected.toFixed(2)}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {statistics.paidCount} payments
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Pending</p>
                <h3 className="text-3xl font-bold mt-2 text-yellow-600">
                  ${statistics.totalPending.toFixed(2)}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {statistics.pendingCount} payments
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                <Clock className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Overdue</p>
                <h3 className="text-3xl font-bold mt-2 text-red-600">
                  ${statistics.totalOverdue.toFixed(2)}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {statistics.overdueCount} payments
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertCircle className="h-7 w-7 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
                <h3 className="text-3xl font-bold mt-2 text-blue-600">
                  {collectionRate}%
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Of total payments
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        
        {/* Payment Status Distribution */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Payment Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {statusData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {statusData.map((item) => (
                    <div
                      key={item.name}
                      className="text-center p-3 bg-muted rounded-lg hover:bg-primary/10 hover:border-primary border border-transparent transition-all"
                    >
                      <div className="text-xl font-bold" style={{ color: item.color }}>
                        {item.value}
                      </div>
                      <div className="text-xs text-muted-foreground truncate mt-1">
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No payment data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Payment Type */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue by Payment Type
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {typeData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={typeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                    <Legend />
                    <Bar
                      dataKey="amount"
                      fill={COLORS.primary}
                      radius={[8, 8, 0, 0]}
                      label={{ position: 'top', formatter: (value: number) => `$${value.toFixed(0)}` }}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {typeData.slice(0, 6).map((item, index) => (
                    <div
                      key={item.name}
                      className="text-center p-3 bg-muted rounded-lg hover:bg-primary/10 hover:border-primary border border-transparent transition-all"
                    >
                      <div className="text-lg font-bold text-primary">
                        ${item.amount.toFixed(0)}
                      </div>
                      <div className="text-xs text-muted-foreground truncate mt-1" title={item.name}>
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No revenue data available</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <div className="text-2xl font-bold mt-2">
                  ${(statistics.totalCollected + statistics.totalPending + statistics.totalOverdue).toFixed(2)}
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Expected total revenue
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Payment</p>
                <div className="text-2xl font-bold mt-2">
                  ${(statistics.paidCount > 0 ? statistics.totalCollected / statistics.paidCount : 0).toFixed(2)}
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Average payment amount
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <div className="text-2xl font-bold mt-2">
                  ${(statistics.totalPending + statistics.totalOverdue).toFixed(2)}
                </div>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600 opacity-50" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Pending + Overdue
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Payments</p>
                <div className="text-2xl font-bold mt-2">
                  {statistics.paidCount + statistics.pendingCount + statistics.overdueCount}
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              All payment records
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
