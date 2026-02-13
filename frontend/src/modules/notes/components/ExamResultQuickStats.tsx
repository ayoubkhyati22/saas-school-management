import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'
import type { ResultStatistics } from '../api/examResult.service'

interface ExamResultQuickStatsProps {
  statistics: ResultStatistics
}

export default function ExamResultQuickStats({ statistics }: ExamResultQuickStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card className="border border-gray-200 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-600">Pass Count</p>
              <div className="text-3xl font-bold text-gray-900">{statistics.passCount}</div>
              <p className="text-xs text-muted-foreground">
                {statistics.totalResults > 0 
                  ? `${((statistics.passCount / statistics.totalResults) * 100).toFixed(1)}% pass rate`
                  : '0% pass rate'
                }
              </p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-gradient-to-br from-red-50 to-white hover:border-red-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-600">Fail Count</p>
              <div className="text-3xl font-bold text-gray-900">{statistics.failCount}</div>
              <p className="text-xs text-muted-foreground">
                {statistics.totalResults > 0 
                  ? `${((statistics.failCount / statistics.totalResults) * 100).toFixed(1)}% fail rate`
                  : '0% fail rate'
                }
              </p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center">
              <XCircle className="h-7 w-7 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-gradient-to-br from-amber-50 to-white hover:border-amber-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-600">Absent</p>
              <div className="text-3xl font-bold text-gray-900">{statistics.absentCount}</div>
              <p className="text-xs text-muted-foreground">
                {statistics.totalResults > 0 
                  ? `${((statistics.absentCount / statistics.totalResults) * 100).toFixed(1)}% absent`
                  : '0% absent'
                }
              </p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center">
              <Clock className="h-7 w-7 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-600">Average</p>
              <div className="text-3xl font-bold text-gray-900">
                {statistics.averagePercentage?.toFixed(1) ?? '0'}%
              </div>
              <p className="text-xs text-muted-foreground">
                High: {statistics.highestMarks ?? 'N/A'} | Low: {statistics.lowestMarks ?? 'N/A'}
              </p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <TrendingUp className="h-7 w-7 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
