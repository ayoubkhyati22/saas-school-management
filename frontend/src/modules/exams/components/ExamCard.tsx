import { Eye, Edit, Trash2, Calendar, Clock, BookOpen, User, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Exam, ExamStatus } from '../exam.service'

interface ExamCardProps {
  exam: Exam
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

export default function ExamCard({ exam, onView, onEdit, onDelete }: ExamCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-base mb-1">{exam.title}</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant={getStatusVariant(exam.status)}>{exam.status}</Badge>
              <Badge variant="outline">{exam.examType.replace('_', ' ')}</Badge>
            </div>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="font-medium">{formatDate(exam.examDate)}</span></div>
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span>{exam.startTime} - {exam.endTime} ({exam.durationMinutes} min)</span></div>
          <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span>{exam.courseName} ({exam.courseCode})</span></div>
          <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span>{exam.classRoomName}</span></div>
          {exam.roomNumber && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span>Room: {exam.roomNumber}</span></div>}
          <div className="flex justify-between pt-2 border-t"><span className="text-muted-foreground">Max Marks:</span><span className="font-medium">{exam.maxMarks}</span></div>
        </div>
        <div className="flex gap-2 mt-4 pt-3 border-t">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(exam.id)}><Eye className="h-4 w-4 mr-1" />View</Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(exam)}><Edit className="h-4 w-4 mr-1" />Edit</Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(exam.id, exam.title)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  )
}
