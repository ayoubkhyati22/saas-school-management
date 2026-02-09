import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AvatarImage } from '@/components/ui/avatar-image'
import { studentService } from '../api/student.service'
import { formatDate } from '@/lib/utils'
import { Mail, Phone, MapPin, Calendar, Hash, School, User, Clock } from 'lucide-react'

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
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Student Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : student ? (
          <div className="space-y-6">
            {/* Header with Avatar and Basic Info */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <AvatarImage
                avatarPath={student.avatarUrl}
                alt={`${student.firstName} ${student.lastName}`}
                className="h-20 w-20 rounded-full object-cover border-2 border-primary/20"
                fallback={
                  <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold border-2 border-primary/20">
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </div>
                }
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {student.firstName} {student.lastName}
                </h2>
                <Badge variant={student.status === 'ACTIVE' ? 'default' : 'secondary'} className="mt-1">
                  {student.status}
                </Badge>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column */}
              <div className="space-y-4">
                
                {/* Contact Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="flex-1 break-all">{student.email}</span>
                      </div>
                      {student.phoneNumber && (
                        <div className="flex items-center gap-3 text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="flex-1">{student.phoneNumber}</span>
                        </div>
                      )}
                      {student.address && (
                        <div className="flex items-center gap-3 text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="flex-1">{student.address}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>Birth Date</span>
                        </div>
                        <span className="font-medium">{formatDate(student.birthDate)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <User className="h-4 w-4 flex-shrink-0" />
                          <span>Gender</span>
                        </div>
                        <span className="font-medium">{student.gender}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Right Column */}
              <div className="space-y-4">
                
                {/* Academic Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <School className="h-4 w-4 text-primary" />
                      Academic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Hash className="h-4 w-4 flex-shrink-0" />
                          <span>Registration Number</span>
                        </div>
                        <span className="font-medium">{student.registrationNumber}</span>
                      </div>
                      {student.classRoom && (
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <School className="h-4 w-4 flex-shrink-0" />
                            <span>Classroom</span>
                          </div>
                          <span className="font-medium">{student.classRoom.name}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>Enrollment Date</span>
                        </div>
                        <span className="font-medium">{formatDate(student.enrollmentDate)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* System Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      System Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="text-muted-foreground">Created At</span>
                        <span className="font-medium">{formatDate(student.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="font-medium">{formatDate(student.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

            </div>
          </div>
        ) : (
          <div className="text-center py-8">Student not found</div>
        )}
      </DialogContent>
    </Dialog>
  )
}