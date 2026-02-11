import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { XCircle, CheckCircle, TrendingUp, Calendar } from 'lucide-react'
import type { AbsenceStatistics } from '../api/absence.service'

interface AbsenceStatisticsWidgetProps {
  statistics: AbsenceStatistics
}

export default function AbsenceStatisticsWidget({ statistics }: AbsenceStatisticsWidgetProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      
      <Card className="border border-gray-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-600">Total Absences</p>
              <div className="text-3xl font-bold text-gray-900">{statistics.totalAbsences}</div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Calendar className="h-7 w-7 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-gradient-to-br from-green-50 to-white hover:border-green-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-600">Justified</p>
              <div className="text-3xl font-bold text-gray-900">{statistics.justifiedAbsences}</div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-gradient-to-br from-red-50 to-white hover:border-red-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-600">Unjustified</p>
              <div className="text-3xl font-bold text-gray-900">{statistics.unjustifiedAbsences}</div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center">
              <XCircle className="h-7 w-7 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-gradient-to-br from-purple-50 to-white hover:border-purple-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-purple-600">Justification Rate</p>
              <div className="text-3xl font-bold text-gray-900">
                {statistics.justificationRate.toFixed(1)}%
              </div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-7 w-7 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
