import { Eye, Edit, Trash2, Award, User, Hash, CheckCircle, FileText, TrendingUp, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { ExamResult, ResultStatus } from '../api/examResult.service'

interface ExamResultTableProps {
  results: ExamResult[]
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
  if (grade.startsWith('A')) return 'text-green-600 bg-green-50'
  if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50'
  if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50'
  if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50'
  return 'text-red-600 bg-red-50'
}

export default function ExamResultTable({ results, onView, onEdit, onDelete }: ExamResultTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><div className="flex items-center gap-2"><User className="h-4 w-4" />Student</div></TableHead>
          <TableHead><div className="flex items-center gap-2"><FileText className="h-4 w-4" />Exam</div></TableHead>
          <TableHead><div className="flex items-center gap-2"><TrendingUp className="h-4 w-4" />Marks</div></TableHead>
          <TableHead><div className="flex items-center gap-2"><TrendingUp className="h-4 w-4" />Percentage</div></TableHead>
          <TableHead><div className="flex items-center gap-2"><Award className="h-4 w-4" />Grade</div></TableHead>
          <TableHead><div className="flex items-center gap-2"><Award className="h-4 w-4" />Rank</div></TableHead>
          <TableHead><div className="flex items-center gap-2"><CheckCircle className="h-4 w-4" />Status</div></TableHead>
          <TableHead className="text-right"><div className="flex items-center justify-end gap-2"><Settings className="h-4 w-4" />Actions</div></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((result) => (
          <TableRow key={result.id}>
            <TableCell className="font-medium">
              <div>
                <div className="font-semibold">{result.studentName}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {result.studentRegistrationNumber}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">{result.examTitle}</div>
            </TableCell>
            <TableCell>
              {result.absent ? (
                <span className="text-yellow-600 font-medium">Absent</span>
              ) : (
                <span className="font-bold">
                  {result.marksObtained ?? 'N/A'} / {result.maxMarks}
                </span>
              )}
            </TableCell>
            <TableCell>
              {result.percentage !== null && !result.absent ? (
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${result.percentage >= 75 ? 'bg-green-500' : result.percentage >= 50 ? 'bg-blue-500' : result.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(result.percentage, 100)}%` }}
                    />
                  </div>
                  <span className="font-medium">{result.percentage.toFixed(1)}%</span>
                </div>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              {result.grade ? (
                <span className={`font-bold text-lg px-2 py-1 rounded ${getGradeColor(result.grade)}`}>
                  {result.grade}
                </span>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              {result.rank ? (
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span className="font-semibold">#{result.rank}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(result.status)}>{result.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(result.id)}
                  className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  <Eye className="h-4.5 w-4.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(result)}
                  className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100"
                >
                  <Edit className="h-4.5 w-4.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(result.id, result.studentName)}
                  className="h-9 w-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
