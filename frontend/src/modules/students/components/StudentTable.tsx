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
                    {student.firstName} {student.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {student.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>{student.registrationNumber}</TableCell>
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
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(student.id)}
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.location.href = `mailto:${student.email}`}
                  title="Send Email"
                >
                  <Mail className="h-4 w-4" />
                </Button>
                {student.phoneNumber && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.location.href = `tel:${student.phoneNumber}`}
                    title="Call"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(student)}
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(student.id, `${student.firstName} ${student.lastName}`)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
