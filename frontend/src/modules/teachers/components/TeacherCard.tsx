import { Eye, Mail, Edit, Trash2, Phone, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AvatarImage } from '@/components/ui/avatar-image'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Teacher } from '../api/teacher.service'

interface TeacherCardProps {
  teacher: Teacher
  onView: (id: string) => void
  onEdit: (teacher: Teacher) => void
  onDelete: (id: string, name: string) => void
}

export default function TeacherCard({ teacher, onView, onEdit, onDelete }: TeacherCardProps) {
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
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <AvatarImage
              avatarPath={teacher.avatarUrl}
              alt={`${teacher.firstName} ${teacher.lastName}`}
              className="h-12 w-12 rounded-full object-cover"
              fallback={
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base font-medium">
                  {teacher.firstName?.[0]}
                  {teacher.lastName?.[0]}
                </div>
              }
            />
            <div>
              <h3 className="font-semibold text-base">
                {teacher.firstName} {teacher.lastName}
              </h3>
              <p className="text-xs text-muted-foreground">{teacher.email}</p>
              <Badge
                variant={getStatusVariant(teacher.status)}
                className="mt-1"
              >
                {teacher.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Employee #:</span>
            <span className="font-medium">{teacher.employeeNumber}</span>
          </div>
          {teacher.specialityName && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Speciality:</span>
              <span className="font-medium">{teacher.specialityName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hire Date:</span>
            <span className="font-medium">{formatDate(teacher.hireDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Salary:</span>
            <span className="font-medium">{formatCurrency(teacher.salary)}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(teacher.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.location.href = `mailto:${teacher.email}`}
          >
            <Mail className="h-4 w-4 mr-1" />
          </Button>
          {teacher.phoneNumber && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = `tel:${teacher.phoneNumber}`}
            >
              <Phone className="h-4 w-4 mr-1" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(teacher)}
          >
            <Edit className="h-4 w-4 mr-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(teacher.id, `${teacher.firstName} ${teacher.lastName}`)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
