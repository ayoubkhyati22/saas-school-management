import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { classroomService } from '../api/classroom.service'
import { formatDate } from '@/lib/utils'
import { GraduationCap, Users, User, Calendar, Hash, Clock, TrendingUp, Mail } from 'lucide-react'

interface ClassRoomDetailDialogProps {
  open: boolean
  onClose: () => void
  classroomId: string
}

export default function ClassRoomDetailDialog({ open, onClose, classroomId }: ClassRoomDetailDialogProps) {
  const { data: classroom, isLoading } = useQuery({
    queryKey: ['classrooms', classroomId],
    queryFn: () => classroomService.getById(classroomId),
    enabled: open && !!classroomId,
  })

  const { data: statistics } = useQuery({
    queryKey: ['classroom-statistics', classroomId],
    queryFn: () => classroomService.getStatistics(classroomId),
    enabled: open && !!classroomId,
  })

  const { data: students } = useQuery({
    queryKey: ['classroom-students', classroomId],
    queryFn: () => classroomService.getStudents(classroomId),
    enabled: open && !!classroomId,
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Classroom Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : classroom ? (
          <div className="space-y-6">
            {/* Header with Icon and Basic Info */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="h-20 w-20 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center border-2 border-indigo-200">
                <GraduationCap className="h-10 w-10" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{classroom.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{classroom.level}</Badge>
                  <Badge variant="secondary">Section {classroom.section}</Badge>
                  <Badge variant="default">{classroom.academicYear}</Badge>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            {statistics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                  <CardContent className="pt-4 pb-4">
                    <div className="text-center">
                      <Users className="h-6 w-6 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {statistics.totalStudents}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Total Students</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-700 bg-emerald-50 dark:bg-emerald-900/20">
                  <CardContent className="pt-4 pb-4">
                    <div className="text-center">
                      <TrendingUp className="h-6 w-6 mx-auto text-emerald-600 dark:text-emerald-400 mb-2" />
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {statistics.activeStudents}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Active</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/20">
                  <CardContent className="pt-4 pb-4">
                    <div className="text-center">
                      <Users className="h-6 w-6 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {statistics.capacity}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Capacity</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-700 bg-amber-50 dark:bg-amber-900/20">
                  <CardContent className="pt-4 pb-4">
                    <div className="text-center">
                      <TrendingUp className="h-6 w-6 mx-auto text-amber-600 dark:text-amber-400 mb-2" />
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {statistics.occupancyRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Occupancy</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column */}
              <div className="space-y-4">
                
                {/* Basic Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      Basic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Hash className="h-4 w-4 flex-shrink-0" />
                          <span>Level</span>
                        </div>
                        <span className="font-medium">{classroom.level}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Hash className="h-4 w-4 flex-shrink-0" />
                          <span>Section</span>
                        </div>
                        <span className="font-medium">{classroom.section}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>Academic Year</span>
                        </div>
                        <span className="font-medium">{classroom.academicYear}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span>Capacity</span>
                        </div>
                        <span className="font-medium">{classroom.capacity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Teacher Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Class Teacher
                    </h3>
                    {classroom.classTeacherName ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <User className="h-4 w-4 flex-shrink-0" />
                            <span>Name</span>
                          </div>
                          <span className="font-medium">{classroom.classTeacherName}</span>
                        </div>
                        {classroom.classTeacherEmail && (
                          <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <div className="flex items-center gap-3 text-muted-foreground">
                              <Mail className="h-4 w-4 flex-shrink-0" />
                              <span>Email</span>
                            </div>
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 font-medium"
                              onClick={() => window.location.href = `mailto:${classroom.classTeacherEmail}`}
                            >
                              {classroom.classTeacherEmail}
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No teacher assigned</p>
                      </div>
                    )}
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
                        <span className="font-medium">{formatDate(classroom.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="font-medium">{formatDate(classroom.updatedAt)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="text-muted-foreground">Current Students</span>
                        <span className="font-medium">{classroom.studentCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Right Column - Students List */}
              <div className="space-y-4">
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Students ({students?.length || 0})
                    </h3>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                      {students && students.length > 0 ? (
                        students.map((student: any) => (
                          <div
                            key={student.id}
                            className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 hover:border-primary transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                                {student.firstName?.[0]}
                                {student.lastName?.[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">
                                  {student.firstName} {student.lastName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {student.registrationNumber}
                                </div>
                              </div>
                              {student.status === 'ACTIVE' && (
                                <Badge variant="success" className="text-xs">
                                  Active
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No students enrolled</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        ) : (
          <div className="text-center py-8">Classroom not found</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
