import { Eye, Edit, Trash2, Award, XCircle, User, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ExamResult, ResultStatus } from '../api/examResult.service'

interface ExamResultCardProps {
  result: ExamResult
  onView: (id: string) => void
  onEdit: (result: ExamResult) => void
  onDelete: (id: string, name: string) => void
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

const getGradeColor = (grade: string | null): string => {
  if (!grade) return 'text-gray-600'
  if (grade.startsWith('A')) return 'text-green-600'
  if (grade.startsWith('B')) return 'text-blue-600'
  if (grade.startsWith('C')) return 'text-yellow-600'
  if (grade.startsWith('D')) return 'text-orange-600'
  return 'text-red-600'
}

export default function ExamResultCard({ result, onView, onEdit, onDelete }: ExamResultCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-base">{result.studentName}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Hash className="h-3 w-3" />
              <span>{result.studentRegistrationNumber}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={getStatusVariant(result.status)}>{result.status}</Badge>
              {result.grade && (
                <Badge variant="outline" className={getGradeColor(result.grade)}>
                  Grade: {result.grade}
                </Badge>
              )}
              {result.rank && (
                <Badge variant="outline">
                  <Award className="h-3 w-3 mr-1" />
                  Rank: {result.rank}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm mb-3">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-muted-foreground">Exam:</span>
            <span className="font-medium">{result.examTitle}</span>
          </div>
          
          {result.absent ? (
            <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
              <span className="text-yellow-700 flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                Absent
              </span>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-muted-foreground">Marks:</span>
                <span className="font-bold text-lg">
                  {result.marksObtained ?? 'N/A'} / {result.maxMarks}
                </span>
              </div>
              
              {result.percentage !== null && (
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-blue-700">Percentage:</span>
                  <span className="font-bold text-blue-700">{result.percentage.toFixed(2)}%</span>
                </div>
              )}
            </>
          )}

          {result.remarks && (
            <div className="p-2 bg-amber-50 rounded">
              <span className="text-xs text-amber-700 font-medium">Remarks:</span>
              <p className="text-sm text-amber-900 mt-1">{result.remarks}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-3 border-t">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(result.id)}>
            <Eye className="h-4 w-4 mr-1" />View
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(result)}>
            <Edit className="h-4 w-4 mr-1" />Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(result.id, result.studentName)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
