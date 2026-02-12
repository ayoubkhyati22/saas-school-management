import { Eye, Edit, Trash2, Clock, MapPin, BookOpen, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Timetable } from '../api/timetable.service'

interface TimetableCardProps {
  timetable: Timetable
  onView: (id: string) => void
  onEdit: (timetable: Timetable) => void
  onDelete: (id: string, name: string) => void
}

const dayColors: Record<string, string> = {
  MONDAY: 'bg-blue-100 text-blue-700 border-blue-300',
  TUESDAY: 'bg-green-100 text-green-700 border-green-300',
  WEDNESDAY: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  THURSDAY: 'bg-purple-100 text-purple-700 border-purple-300',
  FRIDAY: 'bg-pink-100 text-pink-700 border-pink-300',
  SATURDAY: 'bg-orange-100 text-orange-700 border-orange-300',
  SUNDAY: 'bg-red-100 text-red-700 border-red-300',
}

export default function TimetableCard({ timetable, onView, onEdit, onDelete }: TimetableCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={dayColors[timetable.dayOfWeek] || 'bg-gray-100 text-gray-700'}>
                {timetable.dayOfWeek}
              </Badge>
              <Badge variant={timetable.active ? 'success' : 'secondary'}>
                {timetable.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg text-gray-900">{timetable.courseName}</h3>
            {timetable.courseCode && (
              <p className="text-xs text-muted-foreground">{timetable.courseCode}</p>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{timetable.startTime} - {timetable.endTime}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <User className="h-4 w-4 text-green-600" />
            <span>{timetable.teacherName}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <BookOpen className="h-4 w-4 text-purple-600" />
            <span>{timetable.classRoomName}</span>
          </div>

          {timetable.roomNumber && (
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-orange-600" />
              <span>Room {timetable.roomNumber}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(timetable.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(timetable)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(timetable.id, `${timetable.courseName} - ${timetable.dayOfWeek}`)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
