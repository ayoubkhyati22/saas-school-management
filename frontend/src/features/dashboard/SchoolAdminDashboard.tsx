import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  GraduationCap,
  BookOpen,
  School,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  UserPlus,
  FileText,
  Calendar,
  Activity,
  Clock,
  Check,
  HardDrive,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import apiClient from '@/api/client'
import type { ApiResponse } from '@/types'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatDistanceToNow, parseISO, format } from 'date-fns'

// Types
interface SchoolAdminDashboardDTO {
  totalStudents: number
  totalTeachers: number
  totalClasses: number
  totalCourses: number
  activeStudents: number
  inactiveStudents: number
  pendingPaymentsCount: number
  pendingPaymentsAmount: number
  overduePaymentsCount: number
  overduePaymentsAmount: number
  attendanceRate: number
  storageUsed: number
  storageLimit: number
}

interface EnrollmentTrendDTO {
  month: string
  count: number
}

interface PaymentCollectionDTO {
  month: string
  amount: number
  type: string
}

interface AttendanceChartDTO {
  date: string
  presentCount: number
  absentCount: number
}

interface RecentActivityDTO {
  type: string
  description: string
  timestamp: string
}

interface SubscriptionInfoDTO {
  planName: string
  startDate: string
  endDate: string
  daysRemaining: number
  status: string
  features: string[]
}

// API Functions
const dashboardApi = {
  getOverview: async () => {
    const { data } = await apiClient.get<ApiResponse<SchoolAdminDashboardDTO>>(
      '/dashboard/school-admin/overview'
    )
    return data.data
  },
  getEnrollmentTrend: async (months: number = 6) => {
    const { data } = await apiClient.get<ApiResponse<EnrollmentTrendDTO[]>>(
      `/dashboard/school-admin/enrollment-trend?months=${months}`
    )
    return data.data
  },
  getPaymentCollection: async (months: number = 12) => {
    const { data } = await apiClient.get<ApiResponse<PaymentCollectionDTO[]>>(
      `/dashboard/school-admin/payment-collection?months=${months}`
    )
    return data.data
  },
  getAttendanceChart: async (days: number = 30) => {
    const { data } = await apiClient.get<ApiResponse<AttendanceChartDTO[]>>(
      `/dashboard/school-admin/attendance?days=${days}`
    )
    return data.data
  },
  getRecentActivities: async (limit: number = 10) => {
    const { data } = await apiClient.get<ApiResponse<RecentActivityDTO[]>>(
      `/dashboard/school-admin/recent-activities?limit=${limit}`
    )
    return data.data
  },
  getSubscriptionInfo: async () => {
    const { data } = await apiClient.get<ApiResponse<SubscriptionInfoDTO>>(
      '/dashboard/school-admin/subscription-info'
    )
    return data.data
  },
}

export default function SchoolAdminDashboard() {
  // Fetch all data
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['schoolAdminOverview'],
    queryFn: dashboardApi.getOverview,
    refetchInterval: 30000,
  })

  const { data: enrollmentTrend, isLoading: enrollmentLoading } = useQuery({
    queryKey: ['enrollmentTrend'],
    queryFn: () => dashboardApi.getEnrollmentTrend(6),
  })

  const { data: paymentCollection, isLoading: paymentLoading } = useQuery({
    queryKey: ['paymentCollection'],
    queryFn: () => dashboardApi.getPaymentCollection(12),
  })

  const { data: attendanceChart, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendanceChart'],
    queryFn: () => dashboardApi.getAttendanceChart(30),
  })

  const { data: recentActivities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: () => dashboardApi.getRecentActivities(10),
    refetchInterval: 60000,
  })

  const { data: subscriptionInfo, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['subscriptionInfo'],
    queryFn: dashboardApi.getSubscriptionInfo,
  })

  // KPI Cards
  const kpiCards = [
    {
      title: 'Total Students',
      value: overview?.totalStudents || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      subtitle: `${overview?.activeStudents || 0} active, ${
        overview?.inactiveStudents || 0
      } inactive`,
    },
    {
      title: 'Teachers',
      value: overview?.totalTeachers || 0,
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Classes',
      value: overview?.totalClasses || 0,
      icon: School,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Courses',
      value: overview?.totalCourses || 0,
      icon: BookOpen,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
    },
    {
      title: 'Attendance Rate',
      value: `${overview?.attendanceRate?.toFixed(1) || 0}%`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
      subtitle: 'Last 30 days',
    },
    {
      title: 'Pending Payments',
      value: `$${(overview?.pendingPaymentsAmount || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      subtitle: `${overview?.pendingPaymentsCount || 0} payments`,
    },
    {
      title: 'Overdue Payments',
      value: `$${(overview?.overduePaymentsAmount || 0).toLocaleString()}`,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      subtitle: `${overview?.overduePaymentsCount || 0} payments`,
    },
    {
      title: 'Active Students',
      value: overview?.activeStudents || 0,
      icon: CheckCircle,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100 dark:bg-teal-900/20',
      subtitle: 'Currently enrolled',
    },
  ]

  // Activity icon helper
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'NEW_STUDENT':
        return UserPlus
      case 'PAYMENT_RECEIVED':
        return DollarSign
      case 'ISSUE_REPORTED':
        return AlertCircle
      case 'DOCUMENT_UPLOADED':
        return FileText
      case 'EVENT_CREATED':
        return Calendar
      default:
        return Activity
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'NEW_STUDENT':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      case 'PAYMENT_RECEIVED':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'ISSUE_REPORTED':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'DOCUMENT_UPLOADED':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
      case 'EVENT_CREATED':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  if (overviewLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">School Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Loading dashboard data...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">School Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening in your school today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="enrollment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        {/* Enrollment Chart */}
        <TabsContent value="enrollment">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Trend</CardTitle>
              <p className="text-sm text-muted-foreground">
                Monthly student enrollments over the last 6 months
              </p>
            </CardHeader>
            <CardContent>
              {enrollmentLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-pulse text-muted-foreground">
                    Loading chart...
                  </div>
                </div>
              ) : enrollmentTrend && enrollmentTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={enrollmentTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Students Enrolled"
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No enrollment data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Chart */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Collection</CardTitle>
              <p className="text-sm text-muted-foreground">
                Monthly payment collection over the last 12 months
              </p>
            </CardHeader>
            <CardContent>
              {paymentLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-pulse text-muted-foreground">
                    Loading chart...
                  </div>
                </div>
              ) : paymentCollection && paymentCollection.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={paymentCollection}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis
                      className="text-xs"
                      tickFormatter={(value) =>
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0,
                        }).format(value)
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                      formatter={(value: number) =>
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(value)
                      }
                    />
                    <Legend />
                    <Bar
                      dataKey="amount"
                      fill="hsl(var(--primary))"
                      name="Amount Collected"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No payment data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Chart */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <p className="text-sm text-muted-foreground">
                Daily attendance for the last 30 days
              </p>
            </CardHeader>
            <CardContent>
              {attendanceLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-pulse text-muted-foreground">
                    Loading chart...
                  </div>
                </div>
              ) : attendanceChart && attendanceChart.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={attendanceChart.map((item) => ({
                      ...item,
                      dateFormatted: format(parseISO(item.date), 'MMM dd'),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="dateFormatted" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="presentCount"
                      stackId="1"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.6}
                      name="Present"
                    />
                    <Area
                      type="monotone"
                      dataKey="absentCount"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                      name="Absent"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No attendance data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Section - Activities, Subscription, Storage */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest updates from your school
            </p>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-4 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-muted rounded" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivities && recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type)
                  const colorClass = getActivityColor(activity.type)
                  const timeAgo = formatDistanceToNow(parseISO(activity.timestamp), {
                    addSuffix: true,
                  })

                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">{timeAgo}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent activities
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Subscription</CardTitle>
              {subscriptionInfo && (
                <Badge
                  variant={
                    subscriptionInfo.status === 'ACTIVE'
                      ? 'default'
                      : subscriptionInfo.status === 'EXPIRED'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {subscriptionInfo.status}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscriptionLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-4 w-2/3 bg-muted rounded" />
              </div>
            ) : subscriptionInfo ? (
              <>
                <div>
                  <h3 className="font-semibold text-lg">
                    {subscriptionInfo.planName}
                  </h3>
                </div>

                {subscriptionInfo.startDate && subscriptionInfo.endDate && (
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Period:</span>
                      <span className="ml-2">
                        {format(parseISO(subscriptionInfo.startDate), 'MMM dd, yyyy')} -{' '}
                        {format(parseISO(subscriptionInfo.endDate), 'MMM dd, yyyy')}
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Days Remaining:</span>
                      <span
                        className={`ml-2 font-semibold ${
                          subscriptionInfo.daysRemaining > 30
                            ? 'text-green-600'
                            : subscriptionInfo.daysRemaining > 7
                            ? 'text-orange-600'
                            : 'text-red-600'
                        }`}
                      >
                        {subscriptionInfo.daysRemaining} days
                      </span>
                    </div>
                  </div>
                )}

                {subscriptionInfo.features && subscriptionInfo.features.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Features:</h4>
                    <div className="space-y-1">
                      {subscriptionInfo.features.slice(0, 5).map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Check className="h-4 w-4 mr-2 text-green-600" />
                          <span>{feature.replace(/_/g, ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {subscriptionInfo.daysRemaining <= 30 &&
                  subscriptionInfo.status === 'ACTIVE' && (
                    <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        Your subscription is expiring soon. Please renew to continue.
                      </p>
                    </div>
                  )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No subscription information
              </div>
            )}
          </CardContent>
        </Card>

        {/* Storage Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {overview && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Used</span>
                    <span className="font-medium">
                      {overview.storageUsed.toFixed(2)} GB of{' '}
                      {overview.storageLimit.toFixed(2)} GB
                    </span>
                  </div>
                  <Progress
                    value={(overview.storageUsed / overview.storageLimit) * 100}
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Used</p>
                    <p className="text-2xl font-bold">
                      {overview.storageUsed.toFixed(2)} GB
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Remaining</p>
                    <p className="text-2xl font-bold">
                      {(overview.storageLimit - overview.storageUsed).toFixed(2)} GB
                    </p>
                  </div>
                </div>

                {(overview.storageUsed / overview.storageLimit) * 100 >= 80 && (
                  <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      {(overview.storageUsed / overview.storageLimit) * 100 >= 90
                        ? 'Storage is almost full. Please upgrade or delete unused files.'
                        : 'Storage usage is high. Consider upgrading your plan.'}
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
