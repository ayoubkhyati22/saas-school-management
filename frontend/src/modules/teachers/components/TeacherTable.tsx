import { Eye, Mail, Phone, Edit, Trash2, User, Hash, Calendar, Briefcase, CheckCircle, DollarSign, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AvatarImage } from '@/components/ui/avatar-image'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Teacher } from '../api/teacher.service'

interface TeacherTableProps {
  teachers: Teacher[]
  onView: (id: string) => void
  onEdit: (teacher: Teacher) => void
  onDelete: (id: string, name: string) => void
}

export default function TeacherTable({ teachers, onView, onEdit, onDelete }: TeacherTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'ON_LEAVE':
        return 'warning'
      case 'TERMINATED':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Teacher
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Employee #
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Speciality
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Hire Date
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Salary
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Status
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
        {teachers.map((teacher) => (
          <TableRow key={teacher.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <AvatarImage
                  avatarPath={teacher.avatarUrl}
                  alt={`${teacher.firstName} ${teacher.lastName}`}
                  className="h-10 w-10 rounded-full object-cover"
                  fallback={
                    <div className="h-10 w-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-semibold">
                      {teacher.firstName?.[0]}
                      {teacher.lastName?.[0]}
                    </div>
                  }
                />
                <div>
                  <div className="font-medium">
                    <b>{teacher.firstName} {teacher.lastName}</b>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-gray-500">{teacher.email}</span>
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="font-mono text-sm font-semibold text-indigo-600 px-3 py-1 rounded-md">
                {teacher.employeeNumber}
              </span>
            </TableCell>
            <TableCell>
              {teacher.specialityName ? (
                <div>
                  <div className="font-medium">{teacher.specialityName}</div>
                  <div className="text-xs text-muted-foreground">{teacher.specialityCode}</div>
                </div>
              ) : (
                <span className="text-muted-foreground">Not assigned</span>
              )}
            </TableCell>
            <TableCell>{formatDate(teacher.hireDate)}</TableCell>
            <TableCell>
              <span className="font-medium">{formatCurrency(teacher.salary)}</span>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(teacher.status)}>
                {teacher.status.replace('_', ' ')}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1.5">
                {/* View */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(teacher.id)}
                  title="View Details"
                  className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 group/btn"
                >
                  <Eye className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Email */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.location.href = `mailto:${teacher.email}`}
                  title="Send Email"
                  className="h-9 w-9 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700 transition-all duration-200 group/btn"
                >
                  <Mail className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Call */}
                {teacher.phoneNumber && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.location.href = `tel:${teacher.phoneNumber}`}
                    title="Call"
                    className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200 group/btn"
                  >
                    <Phone className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                  </Button>
                )}

                {/* Edit */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(teacher)}
                  title="Edit"
                  className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-all duration-200 group/btn"
                >
                  <Edit className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(teacher.id, `${teacher.firstName} ${teacher.lastName}`)}
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
