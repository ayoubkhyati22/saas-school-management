// frontend/src/features/students/StudentDetailDialog.tsx
import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { studentService } from '@/api/student.service'
import { formatDate } from '@/lib/utils'
import { Mail, Phone, MapPin, Calendar, Hash, School, User } from 'lucide-react'

interface StudentDetailDialogProps {
  open: boolean
  onClose: () => void
  studentId: string
}

export default function StudentDetailDialog({ open, onClose, studentId }: StudentDetailDialogProps) {
  const { data: student, isLoading } = useQuery({
    queryKey: ['students', studentId],
    queryFn: () => studentService.getById(studentId),
    enabled: open && !!studentId,
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : student ? (
          <div className="space-y-6">
            {/* Header with Avatar */}
            <div className="flex items-center gap-4">
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt="student"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                  {student.firstName[0]}
                  {student.lastName[0]}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">
                  {student.firstName} {student.lastName}
                </h2>
                <Badge variant={student.status === 'ACTIVE' ? 'success' : 'secondary'}>
                  {student.status}
                </Badge>
              </div>
            </div>

            {/* Contact Information */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{student.email}</span>
                  </div>
                  {student.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{student.phoneNumber}</span>
                    </div>
                  )}
                  {student.address && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{student.address}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Academic Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Hash className="h-4 w-4" />
                      <span>Registration Number</span>
                    </div>
                    <span className="font-medium">{student.registrationNumber}</span>
                  </div>
                  {student.classRoom && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <School className="h-4 w-4" />
                        <span>Classroom</span>
                      </div>
                      <span className="font-medium">{student.classRoom.name}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Enrollment Date</span>
                    </div>
                    <span className="font-medium">{formatDate(student.enrollmentDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Birth Date</span>
                    </div>
                    <span className="font-medium">{formatDate(student.birthDate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Gender</span>
                    </div>
                    <span className="font-medium">{student.gender}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">System Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created At</span>
                    <span>{formatDate(student.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span>{formatDate(student.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8">Student not found</div>
        )}
      </DialogContent>
    </Dialog>
  )
}