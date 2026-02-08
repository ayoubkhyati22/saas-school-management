import { Card, CardContent } from '@/components/ui/card'
import type { StudentStatistics } from '../api/student.service'

interface StudentQuickStatsProps {
  statistics: StudentStatistics
}

export default function StudentQuickStats({ statistics }: StudentQuickStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{statistics.totalStudents}</div>
          <p className="text-xs text-muted-foreground">Total Students</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-green-600">{statistics.activeStudents}</div>
          <p className="text-xs text-muted-foreground">Active Students</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-blue-600">{statistics.maleStudents}</div>
          <p className="text-xs text-muted-foreground">Male Students</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-pink-600">{statistics.femaleStudents}</div>
          <p className="text-xs text-muted-foreground">Female Students</p>
        </CardContent>
      </Card>
    </div>
  )
}
