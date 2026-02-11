import { Eye, Edit, Trash2, BookOpen, Users, Calendar, Clock, Hash, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Course } from '../api/course.service'

interface CourseTableProps {
  courses: Course[]
  onView: (id: string) => void
  onEdit: (course: Course) => void
  onDelete: (id: string, name: string) => void
}

export default function CourseTable({ courses, onView, onEdit, onDelete }: CourseTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Code
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
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
              <Clock className="h-4 w-4" />
              Schedule
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Semester
            </div>
          </TableHead>
          <TableHead className="text-right">
            <div className="flex items-center justify-end gap-2">
              <Settings className="h-4 w-4" />
              Actions
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.id}>
            <TableCell className="font-medium">
              <div>
                <div className="font-semibold text-base">{course.subject}</div>
                {course.specialityName && (
                  <div className="text-xs text-muted-foreground">
                    {course.specialityName}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              {course.subjectCode ? (
                <span className="font-mono text-sm font-semibold text-indigo-600 px-2 py-1 bg-indigo-50 rounded">
                  {course.subjectCode}
                </span>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">{course.teacherName}</span>
              </div>
            </TableCell>
            <TableCell>{course.classRoomName}</TableCell>
            <TableCell>
              {course.schedule ? (
                <span className="text-sm">{course.schedule}</span>
              ) : (
                <span className="text-muted-foreground">Not set</span>
              )}
            </TableCell>
            <TableCell>
              {course.semester ? (
                <Badge variant="outline">{course.semester}</Badge>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1.5">
                {/* View */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(course.id)}
                  title="View Details"
                  className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 group/btn"
                >
                  <Eye className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Edit */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(course)}
                  title="Edit"
                  className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-all duration-200 group/btn"
                >
                  <Edit className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(course.id, course.subject)}
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
