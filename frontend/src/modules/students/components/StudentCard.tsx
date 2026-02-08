import { Eye, Mail, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AvatarImage } from '@/components/ui/avatar-image'
import { formatDate } from '@/lib/utils'
import type { Student } from '@/types'

interface StudentCardProps {
  student: Student
  onView: (id: string) => void
  onEdit: (student: Student) => void
  onDelete: (id: string, name: string) => void
}

export default function StudentCard({ student, onView, onEdit, onDelete }: StudentCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <AvatarImage
              avatarPath={student.avatarUrl}
              alt={`${student.firstName} ${student.lastName}`}
              className="h-12 w-12 rounded-full object-cover"
              fallback={
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base font-medium">
                  {student.firstName?.[0]}
                  {student.lastName?.[0]}
                </div>
              }
            />
            <div>
              <h3 className="font-semibold text-base">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-xs text-muted-foreground">{student.email}</p>
              <Badge
                variant={student.status === 'ACTIVE' ? 'success' : 'secondary'}
                className="mt-1"
              >
                {student.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Registration #:</span>
            <span className="font-medium">{student.registrationNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Birth Date:</span>
            <span className="font-medium">{formatDate(student.birthDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Class:</span>
            <span className="font-medium">
              {student.classRoomName || 'Not assigned'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Enrollment:</span>
            <span className="font-medium">{formatDate(student.enrollmentDate)}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(student.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.location.href = `mailto:${student.email}`}
          >
            <Mail className="h-4 w-4 mr-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(student)}
          >
            <Edit className="h-4 w-4 mr-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(student.id, `${student.firstName} ${student.lastName}`)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
