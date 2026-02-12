import { Eye, Edit, Trash2, Clock, MapPin, BookOpen, User, Calendar, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { Timetable } from '../api/timetable.service'

interface TimetableTableProps {
  timetables: Timetable[]
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

export default function TimetableTable({ timetables, onView, onEdit, onDelete }: TimetableTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Day
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Teacher
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Classroom
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Room
            </div>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">
            <div className="flex items-center justify-end gap-2">
              <Settings className="h-4 w-4" />
              Actions
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timetables.map((timetable) => (
          <TableRow key={timetable.id}>
            <TableCell>
              <Badge className={dayColors[timetable.dayOfWeek] || 'bg-gray-100 text-gray-700'}>
                {timetable.dayOfWeek}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm">
                  {timetable.startTime} - {timetable.endTime}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{timetable.courseName}</div>
                {timetable.courseCode && (
                  <div className="text-xs text-muted-foreground">{timetable.courseCode}</div>
                )}
              </div>
            </TableCell>
            <TableCell>{timetable.teacherName}</TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{timetable.classRoomName}</div>
                {timetable.classRoomLevel && (
                  <div className="text-xs text-muted-foreground">{timetable.classRoomLevel}</div>
                )}
              </div>
            </TableCell>
            <TableCell>
              {timetable.roomNumber || (
                <span className="text-muted-foreground text-sm">-</span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={timetable.active ? 'success' : 'secondary'}>
                {timetable.active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1.5">
                {/* View */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(timetable.id)}
                  title="View Details"
                  className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 group/btn"
                >
                  <Eye className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Edit */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(timetable)}
                  title="Edit"
                  className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-all duration-200 group/btn"
                >
                  <Edit className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(timetable.id, `${timetable.courseName} - ${timetable.dayOfWeek}`)}
                  title="Delete"
                  className="h-9 w-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 group/btn"
                >
                  <Trash2 className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
