import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { timetableService } from '../api/timetable.service'
import { Calendar, Clock, School, BookOpen, User } from 'lucide-react'
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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

export default function TimetableStatistics() {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['timetable-statistics'],
    queryFn: () => timetableService.getStatistics(),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
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
        <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium">No statistics available</p>
        <p className="text-sm text-muted-foreground">Add timetable entries to see statistics</p>
      </div>
    )
  }

  const dayData = Object.entries(statistics.slotsByDayOfWeek || {})
    .map(([name, value]) => ({
      name,
      slots: Number(value),
    }))
    .sort((a, b) => {
      const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
      return dayOrder.indexOf(a.name) - dayOrder.indexOf(b.name)
    })

  const classroomData = Object.entries(statistics.slotsByClassRoom || {})
    .map(([name, value]) => ({
      name,
      slots: Number(value),
    }))
    .sort((a, b) => b.slots - a.slots)
    .slice(0, 10)

  const teacherData = Object.entries(statistics.slotsByTeacher || {})
    .map(([name, value]) => ({
      name,
      slots: Number(value),
    }))
    .sort((a, b) => b.slots - a.slots)
    .slice(0, 10)

  const courseData = Object.entries(statistics.slotsByCourse || {})
    .map(([name, value]) => ({
      name,
      value: Number(value),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Slots</p>
                <h3 className="text-3xl font-bold mt-2">{statistics.totalSlots}</h3>
                <p className="text-xs text-muted-foreground mt-1">All timetable entries</p>
              </div>
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Calendar className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Active Slots</p>
                <h3 className="text-3xl font-bold mt-2 text-green-600">
                  {statistics.activeSlots}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {statistics.totalSlots > 0
                    ? ((statistics.activeSlots / statistics.totalSlots) * 100).toFixed(1)
                    : 0}% of total
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Clock className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Inactive Slots</p>
                <h3 className="text-3xl font-bold mt-2 text-red-600">
                  {statistics.inactiveSlots}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {statistics.totalSlots > 0
                    ? ((statistics.inactiveSlots / statistics.totalSlots) * 100).toFixed(1)
                    : 0}% of total
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <Calendar className="h-7 w-7 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Slots by Day */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Slots by Day of Week
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {dayData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="slots" fill="#3b82f6" radius={[8, 8, 0, 0]} label={{ position: 'top' }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No day data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Slots by Course (Pie Chart) */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Top Courses (Top 6)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {courseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={courseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {courseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No course data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Slots by Classroom */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5 text-primary" />
              Slots by Classroom
              {classroomData.length >= 10 && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Top 10 shown)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {classroomData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={classroomData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="slots" fill="#10b981" radius={[8, 8, 0, 0]} label={{ position: 'top' }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <School className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No classroom data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Slots by Teacher */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Slots by Teacher
              {teacherData.length >= 10 && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Top 10 shown)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {teacherData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teacherData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="slots" fill="#8b5cf6" radius={[8, 8, 0, 0]} label={{ position: 'top' }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No teacher data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
