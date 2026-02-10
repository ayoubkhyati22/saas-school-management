import { Eye, Edit, Trash2, GraduationCap, Users, User, Calendar, Hash, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { ClassRoom } from '../api/classroom.service'

interface ClassRoomTableProps {
  classrooms: ClassRoom[]
  onView: (id: string) => void
  onEdit: (classroom: ClassRoom) => void
  onDelete: (id: string, name: string) => void
}

export default function ClassRoomTable({ classrooms, onView, onEdit, onDelete }: ClassRoomTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Classroom
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Level
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Section
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Academic Year
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Capacity
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Class Teacher
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
        {classrooms.map((classroom) => (
          <TableRow key={classroom.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">
                    <b>{classroom.name}</b>
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm font-medium">{classroom.level}</span>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{classroom.section}</Badge>
            </TableCell>
            <TableCell>
              <span className="text-sm">{classroom.academicYear}</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{classroom.capacity}</span>
              </div>
            </TableCell>
            <TableCell>
              {classroom.classTeacherName ? (
                <span className="text-sm">{classroom.classTeacherName}</span>
              ) : (
                <span className="text-muted-foreground text-sm">Not assigned</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1.5">
                {/* View */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(classroom.id)}
                  title="View Details"
                  className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 group/btn"
                >
                  <Eye className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Edit */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(classroom)}
                  title="Edit"
                  className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-all duration-200 group/btn"
                >
                  <Edit className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(classroom.id, classroom.name)}
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
