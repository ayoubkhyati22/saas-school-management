import { Eye, Edit, Trash2, Users, GraduationCap, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { ClassRoom } from '../api/classroom.service'

interface ClassRoomCardProps {
  classroom: ClassRoom
  onView: (id: string) => void
  onEdit: (classroom: ClassRoom) => void
  onDelete: (id: string, name: string) => void
}

export default function ClassRoomCard({ classroom, onView, onEdit, onDelete }: ClassRoomCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-base font-bold">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">
                {classroom.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {classroom.level} - Section {classroom.section}
              </p>
              <Badge variant="secondary" className="mt-1">
                {classroom.academicYear}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Capacity:</span>
            </div>
            <span className="font-medium">{classroom.capacity}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Teacher:</span>
            </div>
            <span className="font-medium truncate ml-2">
              {classroom.classTeacherName || 'Not assigned'}
            </span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-xs text-muted-foreground">Created:</span>
            <span className="text-xs font-medium">{formatDate(classroom.createdAt)}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(classroom.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(classroom)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(classroom.id, classroom.name)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
