import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { teacherService } from '../api/teacher.service'
import { Users, UserCheck, Briefcase } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
}

export default function TeacherStatistics() {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['teacher-statistics'],
    queryFn: () => teacherService.getStatistics(),
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
        <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium">No statistics available</p>
        <p className="text-sm text-muted-foreground">Add teachers to see statistics</p>
      </div>
    )
  }

  const specialityData = Object.entries(statistics.teachersBySpeciality || {})
    .map(([name, value]) => ({
      name,
      teachers: Number(value),
    }))
    .sort((a, b) => b.teachers - a.teachers)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                <h3 className="text-3xl font-bold mt-2">{statistics.totalTeachers}</h3>
                <p className="text-xs text-muted-foreground mt-1">All employed teachers</p>
              </div>
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Active Teachers</p>
                <h3 className="text-3xl font-bold mt-2 text-green-600">
                  {statistics.activeTeachers}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {statistics.totalTeachers > 0
                    ? ((statistics.activeTeachers / statistics.totalTeachers) * 100).toFixed(1)
                    : 0}% of total
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <UserCheck className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">On Leave</p>
                <h3 className="text-3xl font-bold mt-2 text-amber-600">
                  {statistics.onLeaveTeachers}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Temporary absence</p>
              </div>
              <div className="h-14 w-14 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <Users className="h-7 w-7 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-gray-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-600">
                  {statistics.inactiveTeachers}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Not currently teaching</p>
              </div>
              <div className="h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-900/20 flex items-center justify-center">
                <Users className="h-7 w-7 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Teachers by Speciality
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {specialityData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={specialityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="teachers"
                    fill={COLORS.primary}
                    radius={[8, 8, 0, 0]}
                    label={{ position: 'top' }}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
                {specialityData.slice(0, 5).map((item) => (
                  <div
                    key={item.name}
                    className="text-center p-3 bg-muted rounded-lg hover:bg-primary/10 hover:border-primary border border-transparent transition-all"
                  >
                    <div className="text-xl font-bold text-primary">{item.teachers}</div>
                    <div className="text-xs text-muted-foreground truncate mt-1" title={item.name}>
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No speciality data available</p>
              <p className="text-sm mt-2">Teachers need to be assigned specialities</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
