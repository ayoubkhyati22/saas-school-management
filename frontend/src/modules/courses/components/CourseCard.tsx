import { Eye, Edit, Trash2, BookOpen, Users, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Course } from '../api/course.service'

interface CourseCardProps {
  course: Course
  onView: (id: string) => void
  onEdit: (course: Course) => void
  onDelete: (id: string, name: string) => void
}

export default function CourseCard({ course, onView, onEdit, onDelete }: CourseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{course.subject}</h3>
              {course.subjectCode && (
                <p className="text-sm text-muted-foreground font-mono">{course.subjectCode}</p>
              )}
            </div>
          </div>
          {course.semester && (
            <Badge variant="outline" className="text-xs">
              {course.semester}
            </Badge>
          )}
        </div>

        {course.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {course.description}
          </p>
        )}

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Teacher:</span>
            <span className="font-medium">{course.teacherName}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Class:</span>
            <span className="font-medium">{course.classRoomName}</span>
          </div>
          {course.schedule && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Schedule:</span>
              <span className="font-medium text-xs">{course.schedule}</span>
            </div>
          )}
          {course.specialityName && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Speciality:</span>
              <span className="font-medium">{course.specialityName}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(course.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(course)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(course.id, course.subject)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
