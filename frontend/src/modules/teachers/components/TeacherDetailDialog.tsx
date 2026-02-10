import { useQuery } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AvatarImage } from '@/components/ui/avatar-image'
import { teacherService } from '../api/teacher.service'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Mail, Phone, Briefcase, Calendar, Hash, DollarSign, User, Clock } from 'lucide-react'

interface TeacherDetailDialogProps {
  open: boolean
  onClose: () => void
  teacherId: string
}

export default function TeacherDetailDialog({ open, onClose, teacherId }: TeacherDetailDialogProps) {
  const { data: teacher, isLoading } = useQuery({
    queryKey: ['teachers', teacherId],
    queryFn: () => teacherService.getById(teacherId),
    enabled: open && !!teacherId,
  })

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success'
      case 'ON_LEAVE': return 'warning'
      case 'TERMINATED': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Teacher Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : teacher ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b">
              <AvatarImage
                avatarPath={teacher.avatarUrl}
                alt={`${teacher.firstName} ${teacher.lastName}`}
                className="h-20 w-20 rounded-full object-cover border-2 border-primary/20"
                fallback={
                  <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold border-2 border-primary/20">
                    {teacher.firstName[0]}{teacher.lastName[0]}
                  </div>
                }
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{teacher.firstName} {teacher.lastName}</h2>
                <Badge variant={getStatusVariant(teacher.status)} className="mt-1">
                  {teacher.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="flex-1 break-all">{teacher.email}</span>
                      </div>
                      {teacher.phoneNumber && (
                        <div className="flex items-center gap-3 text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="flex-1">{teacher.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />Employment Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Hash className="h-4 w-4 flex-shrink-0" /><span>Employee Number</span>
                        </div>
                        <span className="font-medium">{teacher.employeeNumber}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar className="h-4 w-4 flex-shrink-0" /><span>Hire Date</span>
                        </div>
                        <span className="font-medium">{formatDate(teacher.hireDate)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <DollarSign className="h-4 w-4 flex-shrink-0" /><span>Salary</span>
                        </div>
                        <span className="font-medium">{formatCurrency(teacher.salary)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />Speciality
                    </h3>
                    <div className="space-y-3">
                      {teacher.specialityName ? (
                        <>
                          <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <span className="text-muted-foreground">Name</span>
                            <span className="font-medium">{teacher.specialityName}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <span className="text-muted-foreground">Code</span>
                            <span className="font-medium">{teacher.specialityCode}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground text-center py-4">No speciality assigned</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />System Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="text-muted-foreground">Created At</span>
                        <span className="font-medium">{formatDate(teacher.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="font-medium">{formatDate(teacher.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">Teacher not found</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
