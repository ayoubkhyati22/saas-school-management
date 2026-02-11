import { Eye, Edit, Trash2, Calendar, BookOpen, User, CheckCircle, XCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Absence } from '../api/absence.service'

interface AbsenceCardProps {
  absence: Absence
  onView: (id: string) => void
  onEdit: (absence: Absence) => void
  onDelete: (id: string, info: string) => void
  onJustify: (absence: Absence) => void
  canJustify?: boolean
}

export default function AbsenceCard({ 
  absence, 
  onView, 
  onEdit, 
  onDelete, 
  onJustify,
  canJustify = false 
}: AbsenceCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
              absence.justified 
                ? 'bg-gradient-to-br from-green-500 to-green-600' 
                : 'bg-gradient-to-br from-red-500 to-red-600'
            }`}>
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{absence.studentName}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(absence.date)}
              </p>
            </div>
          </div>
          <Badge variant={absence.justified ? 'success' : 'destructive'}>
            {absence.justified ? (
              <><CheckCircle className="h-3 w-3 mr-1" /> Justified</>
            ) : (
              <><XCircle className="h-3 w-3 mr-1" /> Unjustified</>
            )}
          </Badge>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Course:</span>
            <span className="font-medium">{absence.courseSubject}</span>
          </div>
          {absence.reason && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <span className="text-muted-foreground">Reason: </span>
                <span className="font-medium">{absence.reason}</span>
              </div>
            </div>
          )}
          {absence.reportedByName && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Reported by:</span>
              <span className="font-medium">{absence.reportedByName}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(absence.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {!absence.justified && canJustify && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
              onClick={() => onJustify(absence)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Justify
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(absence)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(absence.id, `${absence.studentName} - ${formatDate(absence.date)}`)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
