import { Card, CardContent } from '@/components/ui/card'
import { Users, UserCheck, Mars, Venus } from 'lucide-react'
import type { StudentStatistics } from '../api/student.service'

interface StudentQuickStatsProps {
  statistics: StudentStatistics
}

export default function StudentQuickStats({ statistics }: StudentQuickStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      
      <Card className="border border-gray-200 bg-gradient-to-br from-indigo-50 to-white hover:border-indigo-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-indigo-600">Total Students</p>
              <div className="text-3xl font-bold text-gray-900">{statistics.totalStudents}</div>
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
              <p className="text-sm font-medium text-emerald-600">Active Students</p>
              <div className="text-3xl font-bold text-gray-900">{statistics.activeStudents}</div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <UserCheck className="h-7 w-7 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-600">Male Students</p>
              <div className="text-3xl font-bold text-gray-900">{statistics.maleStudents}</div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Mars className="h-7 w-7 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-gradient-to-br from-pink-50 to-white hover:border-pink-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-pink-600">Female Students</p>
              <div className="text-3xl font-bold text-gray-900">{statistics.femaleStudents}</div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-pink-100 flex items-center justify-center">
              <Venus className="h-7 w-7 text-pink-600" />
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}