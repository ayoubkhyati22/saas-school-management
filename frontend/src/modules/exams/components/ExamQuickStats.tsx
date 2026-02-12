import { Card, CardContent } from '@/components/ui/card'
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react'
import type { ExamStatistics } from '../exam.service'

interface ExamQuickStatsProps {
  statistics: ExamStatistics
}

export default function ExamQuickStats({ statistics }: ExamQuickStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card className="border border-gray-200 bg-gradient-to-br from-indigo-50 to-white hover:border-indigo-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1"><p className="text-sm font-medium text-indigo-600">Total Exams</p><div className="text-3xl font-bold text-gray-900">{statistics.totalExams}</div></div>
            <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center"><FileText className="h-7 w-7 text-indigo-600" /></div>
          </div>
        </CardContent>
      </Card>
      <Card className="border border-gray-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1"><p className="text-sm font-medium text-blue-600">Scheduled</p><div className="text-3xl font-bold text-gray-900">{statistics.scheduledExams}</div></div>
            <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center"><Clock className="h-7 w-7 text-blue-600" /></div>
          </div>
        </CardContent>
      </Card>
      <Card className="border border-gray-200 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1"><p className="text-sm font-medium text-emerald-600">Completed</p><div className="text-3xl font-bold text-gray-900">{statistics.completedExams}</div></div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center"><CheckCircle className="h-7 w-7 text-emerald-600" /></div>
          </div>
        </CardContent>
      </Card>
      <Card className="border border-gray-200 bg-gradient-to-br from-amber-50 to-white hover:border-amber-300 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1"><p className="text-sm font-medium text-amber-600">In Progress</p><div className="text-3xl font-bold text-gray-900">{statistics.inProgressExams}</div></div>
            <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center"><XCircle className="h-7 w-7 text-amber-600" /></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
