import { Card, CardContent } from '@/components/ui/card'
import { Users, UserCheck, UserX, UserMinus } from 'lucide-react'
import type { TeacherStatistics } from '../api/teacher.service'

interface TeacherQuickStatsProps {
  statistics: TeacherStatistics
}

export default function TeacherQuickStats({ statistics }: TeacherQuickStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card className="border border-gray-200 bg-gradient-to-br from-indigo-50 to-white hover:border-indigo-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-indigo-600">Total Teachers</p>
              <div className="text-3xl font-bold text-gray-900">{statistics.totalTeachers}</div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <Users className="h-7 w-7 text-indigo-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-600">Active Teachers</p>
              <div className="text-3xl font-bold text-gray-900">{statistics.activeTeachers}</div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <UserCheck className="h-7 w-7 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-gradient-to-br from-amber-50 to-white hover:border-amber-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-600">On Leave</p>
              <div className="text-3xl font-bold text-gray-900">{statistics.onLeaveTeachers}</div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center">
              <UserMinus className="h-7 w-7 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:border-gray-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <div className="text-3xl font-bold text-gray-900">{statistics.inactiveTeachers}</div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center">
              <UserX className="h-7 w-7 text-gray-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
