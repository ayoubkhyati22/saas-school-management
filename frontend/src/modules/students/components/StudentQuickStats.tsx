import { Card, CardContent } from '@/components/ui/card'
import { Users, UserCheck, Mars, Venus } from 'lucide-react'
import type { StudentStatistics } from '../api/student.service'

interface StudentQuickStatsProps {
  statistics: StudentStatistics
}

export default function StudentQuickStats({ statistics }: StudentQuickStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      
      <Card>
        <CardContent className="pt-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total Students</p>
            <div className="text-2xl font-bold">{statistics.totalStudents}</div>
          </div>
          <Users className="h-6 w-6 text-muted-foreground" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Active Students</p>
            <div className="text-2xl font-bold text-green-600">
              {statistics.activeStudents}
            </div>
          </div>
          <UserCheck className="h-6 w-6 text-green-600" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Male Students</p>
            <div className="text-2xl font-bold text-blue-600">
              {statistics.maleStudents}
            </div>
          </div>
          <Mars className="h-6 w-6 text-blue-600" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Female Students</p>
            <div className="text-2xl font-bold text-pink-600">
              {statistics.femaleStudents}
            </div>
          </div>
          <Venus className="h-6 w-6 text-pink-600" />
        </CardContent>
      </Card>

    </div>
  )
}
