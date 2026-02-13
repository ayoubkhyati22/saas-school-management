import { X, User, FileText, Hash, Calendar, Award, TrendingUp, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { ExamResult, ResultStatus } from '../api/examResult.service'

interface ExamResultDetailDialogProps {
  open: boolean
  onClose: () => void
  result: ExamResult | null
}

const getStatusVariant = (status: ResultStatus): 'default' | 'success' | 'warning' | 'destructive' | 'secondary' => {
  switch (status) {
    case 'PASS': return 'success'
    case 'FAIL': return 'destructive'
    case 'ABSENT': return 'warning'
    case 'PENDING': return 'secondary'
    default: return 'secondary'
  }
}

const getStatusIcon = (status: ResultStatus) => {
  switch (status) {
    case 'PASS': return <CheckCircle className="h-5 w-5 text-green-600" />
    case 'FAIL': return <XCircle className="h-5 w-5 text-red-600" />
    case 'ABSENT': return <Clock className="h-5 w-5 text-yellow-600" />
    case 'PENDING': return <Clock className="h-5 w-5 text-gray-600" />
  }
}

const getGradeColor = (grade: string | null): string => {
  if (!grade) return 'text-gray-600'
  if (grade.startsWith('A')) return 'text-green-600'
  if (grade.startsWith('B')) return 'text-blue-600'
  if (grade.startsWith('C')) return 'text-yellow-600'
  if (grade.startsWith('D')) return 'text-orange-600'
  return 'text-red-600'
}

export default function ExamResultDetailDialog({ open, onClose, result }: ExamResultDetailDialogProps) {
  if (!result) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Exam Result Details</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Student & Exam Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Student Information</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-blue-700">Name</p>
                  <p className="font-semibold text-blue-900">{result.studentName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">Registration:</span>
                  <span className="font-medium text-blue-900">{result.studentRegistrationNumber}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Exam Information</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-purple-700">Exam Title</p>
                  <p className="font-semibold text-purple-900">{result.examTitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-purple-700">Max Marks:</span>
                  <span className="font-medium text-purple-900">{result.maxMarks}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Badge */}
          <div className="flex items-center justify-center gap-3 p-4 border-1 rounded-lg">
            {getStatusIcon(result.status)}
            <Badge variant={getStatusVariant(result.status)} className="text-lg px-4 py-2">
              {result.status}
            </Badge>
          </div>

          {/* Performance Metrics */}
          {!result.absent ? (
            <div className="grid md:grid-cols-3 gap-4">
              {/* Marks */}
              <div className="p-6 border-1 rounded-lg text-center">
                <p className="text-sm text-emerald-700 mb-2">Marks Obtained</p>
                <p className="text-4xl font-bold text-emerald-900">
                  {result.marksObtained ?? 'N/A'}
                  <span className="text-2xl text-emerald-700">/{result.maxMarks}</span>
                </p>
              </div>

              {/* Percentage */}
              <div className="p-6 border-1 rounded-lg text-center">
                <p className="text-sm text-blue-700 mb-2">Percentage</p>
                <p className="text-4xl font-bold text-blue-900">
                  {result.percentage !== null ? result.percentage.toFixed(2) : 'N/A'}
                  <span className="text-2xl text-blue-700">%</span>
                </p>
                <div className="mt-3 w-full h-3 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${Math.min(result.percentage ?? 0, 100)}%` }}
                  />
                </div>
              </div>

              {/* Grade */}
              <div className="p-6 border-1 rounded-lg text-center">
                <p className="text-sm text-amber-700 mb-2">Grade</p>
                <div className="flex items-center justify-center gap-2">
                  <Award className="h-8 w-8 text-amber-600" />
                  <p className={`text-5xl font-bold ${getGradeColor(result.grade)}`}>
                    {result.grade || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg text-center">
              <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
              <p className="text-xl font-semibold text-yellow-900">Student was Absent</p>
              <p className="text-sm text-yellow-700 mt-2">No marks or grades recorded</p>
            </div>
          )}

          {/* Rank */}
          {result.rank && (
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg">
              <div className="flex items-center justify-center gap-3">
                <Award className="h-6 w-6 text-yellow-600" />
                <span className="text-lg font-semibold text-gray-700">Class Rank:</span>
                <span className="text-2xl font-bold text-yellow-700">#{result.rank}</span>
              </div>
            </div>
          )}

          {/* Remarks */}
          {result.remarks && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-white">Remarks</h3>
                </div>
                <div className="p-4border-1 rounded-lg">
                  <p className="text-sm text-white whitespace-pre-wrap">{result.remarks}</p>
                </div>
              </div>
            </>
          )}

          {/* Metadata */}
          <Separator />
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">{new Date(result.createdAt).toLocaleString()}</span>
              </div>
              {result.updatedAt !== result.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-medium">{new Date(result.updatedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
            {result.gradedBy && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Graded By:</span>
                  <span className="font-medium">{result.gradedByName || result.gradedBy}</span>
                </div>
                {result.gradedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Graded At:</span>
                    <span className="font-medium">{new Date(result.gradedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
