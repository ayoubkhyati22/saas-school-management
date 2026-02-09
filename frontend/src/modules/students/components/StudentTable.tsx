import { Eye, Mail, Phone, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AvatarImage } from '@/components/ui/avatar-image'
import { formatDate } from '@/lib/utils'
import type { Student } from '@/types'

interface StudentTableProps {
  students: Student[]
  onView: (id: string) => void
  onEdit: (student: Student) => void
  onDelete: (id: string, name: string) => void
}

export default function StudentTable({ students, onView, onEdit, onDelete }: StudentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Registration #</TableHead>
          <TableHead>Birth Date</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Enrollment</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <AvatarImage
                  avatarPath={student.avatarUrl}
                  alt={`${student.firstName} ${student.lastName}`}
                  className="h-10 w-10 rounded-full object-cover"
                  fallback={
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {student.firstName?.[0]}
                      {student.lastName?.[0]}
                    </div>
                  }
                />
                <div>
                  <div className="font-medium">
                    <b>{student.firstName} {student.lastName}</b>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-gray-500">{student.email}</span>
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="font-mono text-sm font-semibold text-indigo-600 px-3 py-1 rounded-md">
                {student.registrationNumber}
              </span>
            </TableCell>
            <TableCell>{formatDate(student.birthDate)}</TableCell>
            <TableCell>
              {student.classRoomName || (
                <span className="text-muted-foreground">Not assigned</span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={student.status === 'ACTIVE' ? 'success' : 'warning'}>
                {student.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(student.enrollmentDate)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(student.id)}
                  title="View Details"
                  className="h-9 w-9 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 group/btn"
                >
                  <Eye className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.location.href = `mailto:${student.email}`}
                  title="Send Email"
                  className="h-9 w-9 rounded-lg hover:bg-purple-100 hover:text-purple-700 transition-all duration-200 group/btn"
                >
                  <Mail className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>
                {student.phoneNumber && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.location.href = `tel:${student.phoneNumber}`}
                    title="Call"
                    className="h-9 w-9 rounded-lg hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200 group/btn"
                  >
                    <Phone className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(student)}
                  title="Edit"
                  className="h-9 w-9 rounded-lg hover:bg-amber-100 hover:text-amber-700 transition-all duration-200 group/btn"
                >
                  <Edit className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(student.id, `${student.firstName} ${student.lastName}`)}
                  title="Delete"
                  className="h-9 w-9 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all duration-200 group/btn"
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
