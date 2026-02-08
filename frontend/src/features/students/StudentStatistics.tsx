// frontend/src/features/students/StudentStatistics.tsx
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { studentService } from '@/api/student.service'
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  School,
  PieChart as PieChartIcon,
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
  indigo: '#6366f1',
}


export default function StudentStatistics() {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['student-statistics'],
    queryFn: () => studentService.getStatistics(),
  })
console.log('Student Statistics Data:', statistics)
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
        <p className="text-sm text-muted-foreground">Add students to see statistics</p>
      </div>
    )
  }

  // Prepare data for classroom chart
  const classData = Object.entries(statistics.studentsByClass || {})
    .map(([name, value]) => ({
      name,
      students: Number(value),
    }))
    .sort((a, b) => b.students - a.students)
    .slice(0, 10)

  const renderCustomLabel = ({ name, percent }: any) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <h3 className="text-3xl font-bold mt-2">{statistics.totalStudents}</h3>
                <p className="text-xs text-muted-foreground mt-1">All enrolled students</p>
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
                <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                <h3 className="text-3xl font-bold mt-2 text-green-600">
                  {statistics.activeStudents}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {statistics.totalStudents > 0
                    ? ((statistics.activeStudents / statistics.totalStudents) * 100).toFixed(1)
                    : 0}% of total
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <UserCheck className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Male Students</p>
                <h3 className="text-3xl font-bold mt-2 text-blue-600">
                  {statistics.maleStudents}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {statistics.totalStudents > 0
                    ? ((statistics.maleStudents / statistics.totalStudents) * 100).toFixed(1)
                    : 0}% of total
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-pink-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Female Students</p>
                <h3 className="text-3xl font-bold mt-2 text-pink-600">
                  {statistics.femaleStudents}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {statistics.totalStudents > 0
                    ? ((statistics.femaleStudents / statistics.totalStudents) * 100).toFixed(1)
                    : 0}% of total
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center">
                <Users className="h-7 w-7 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classroom Bar Chart */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5 text-primary" />
            Students by Classroom
            {classData.length >= 10 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (Top 10 shown)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {classData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={classData}
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
                    dataKey="students"
                    fill={COLORS.primary}
                    radius={[8, 8, 0, 0]}
                    label={{ position: 'top' }}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
                {classData.slice(0, 5).map((item) => (
                  <div
                    key={item.name}
                    className="text-center p-3 bg-muted rounded-lg hover:bg-primary/10 hover:border-primary border border-transparent transition-all"
                  >
                    <div className="text-xl font-bold text-primary">{item.students}</div>
                    <div className="text-xs text-muted-foreground truncate mt-1" title={item.name}>
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <School className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No classroom data available</p>
              <p className="text-sm mt-2">Students need to be assigned to classrooms</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Enrollment Rate</p>
                <div className="text-2xl font-bold mt-2">100%</div>
              </div>
              <Users className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {statistics.totalStudents} total students
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Rate</p>
                <div className="text-2xl font-bold mt-2 text-green-600">
                  {statistics.totalStudents > 0
                    ? ((statistics.activeStudents / statistics.totalStudents) * 100).toFixed(1)
                    : 0}%
                </div>
              </div>
              <UserCheck className="h-8 w-8 text-green-600 opacity-50" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {statistics.activeStudents} active students
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gender Ratio</p>
                <div className="text-2xl font-bold mt-2">
                  {statistics.maleStudents > 0
                    ? (statistics.femaleStudents / statistics.maleStudents).toFixed(2)
                    : 'N/A'}
                </div>
              </div>
              <Users className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Female to Male ratio</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Classrooms</p>
                <div className="text-2xl font-bold mt-2">
                  {Object.keys(statistics.studentsByClass || {}).length}
                </div>
              </div>
              <School className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Active classrooms</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}