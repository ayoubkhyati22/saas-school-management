import { Eye, Edit, Trash2, Calendar, Clock, BookOpen, User, Settings, CheckCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Exam, ExamStatus } from '../exam.service'

interface ExamTableProps {
  exams: Exam[]
  onView: (id: string) => void
  onEdit: (exam: Exam) => void
  onDelete: (id: string, name: string) => void
}

const getStatusVariant = (status: ExamStatus): 'default' | 'success' | 'warning' | 'destructive' | 'secondary' => {
  switch (status) {
    case 'COMPLETED': return 'success'
    case 'IN_PROGRESS': return 'default'
    case 'SCHEDULED': return 'secondary'
    case 'CANCELLED': return 'destructive'
    case 'POSTPONED': return 'warning'
    default: return 'secondary'
  }
}

export default function ExamTable({ exams, onView, onEdit, onDelete }: ExamTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><div className="flex items-center gap-2"><FileText className="h-4 w-4" />Exam Title</div></TableHead>
          <TableHead><div className="flex items-center gap-2"><Calendar className="h-4 w-4" />Date & Time</div></TableHead>
          <TableHead><div className="flex items-center gap-2"><BookOpen className="h-4 w-4" />Course</div></TableHead>
          <TableHead><div className="flex items-center gap-2"><User className="h-4 w-4" />Class</div></TableHead>
          <TableHead><div className="flex items-center gap-2"><Clock className="h-4 w-4" />Duration</div></TableHead>
          <TableHead><div className="flex items-center gap-2"><CheckCircle className="h-4 w-4" />Status</div></TableHead>
          <TableHead className="text-right"><div className="flex items-center justify-end gap-2"><Settings className="h-4 w-4" />Actions</div></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exams.map((exam) => (
          <TableRow key={exam.id}>
            <TableCell className="font-medium"><div><div className="font-semibold">{exam.title}</div><div className="text-xs text-muted-foreground">{exam.examType.replace('_', ' ')}</div></div></TableCell>
            <TableCell><div><div className="font-medium">{formatDate(exam.examDate)}</div><div className="text-xs text-muted-foreground">{exam.startTime} - {exam.endTime}</div></div></TableCell>
            <TableCell><div><div className="font-medium">{exam.courseName}</div><div className="text-xs text-muted-foreground">{exam.courseCode}</div></div></TableCell>
            <TableCell>{exam.classRoomName}</TableCell>
            <TableCell>{exam.durationMinutes} min</TableCell>
            <TableCell><Badge variant={getStatusVariant(exam.status)}>{exam.status}</Badge></TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1.5">
                <Button variant="ghost" size="icon" onClick={() => onView(exam.id)} className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"><Eye className="h-4.5 w-4.5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(exam)} className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100"><Edit className="h-4.5 w-4.5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(exam.id, exam.title)} className="h-9 w-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"><Trash2 className="h-4.5 w-4.5" /></Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
