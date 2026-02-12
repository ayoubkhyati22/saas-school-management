import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { timetableService } from '../api/timetable.service'
import { formatDate } from '@/lib/utils'
import { 
  Clock, MapPin, BookOpen, User, Calendar, 
  School, Hash, FileText, CheckCircle 
} from 'lucide-react'

interface TimetableDetailDialogProps {
  open: boolean
  onClose: () => void
  timetableId: string
}

const dayColors: Record<string, string> = {
  MONDAY: 'bg-blue-100 text-blue-700 border-blue-300',
  TUESDAY: 'bg-green-100 text-green-700 border-green-300',
  WEDNESDAY: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  THURSDAY: 'bg-purple-100 text-purple-700 border-purple-300',
  FRIDAY: 'bg-pink-100 text-pink-700 border-pink-300',
  SATURDAY: 'bg-orange-100 text-orange-700 border-orange-300',
  SUNDAY: 'bg-red-100 text-red-700 border-red-300',
}

export default function TimetableDetailDialog({ open, onClose, timetableId }: TimetableDetailDialogProps) {
  const { data: timetable, isLoading } = useQuery({
    queryKey: ['timetables', timetableId],
    queryFn: () => timetableService.getById(timetableId),
    enabled: open && !!timetableId,
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Timetable Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : timetable ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{timetable.courseName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={dayColors[timetable.dayOfWeek] || 'bg-gray-100 text-gray-700'}>
                    {timetable.dayOfWeek}
                  </Badge>
                  <Badge variant={timetable.active ? 'default' : 'secondary'}>
                    {timetable.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column */}
              <div className="space-y-4">
                
                {/* Schedule Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Schedule Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>Day of Week</span>
                        </div>
                        <Badge className={dayColors[timetable.dayOfWeek]}>
                          {timetable.dayOfWeek}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>Time</span>
                        </div>
                        <span className="font-medium font-mono">
                          {timetable.startTime} - {timetable.endTime}
                        </span>
                      </div>
                      {timetable.roomNumber && (
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span>Room Number</span>
                          </div>
                          <span className="font-medium">{timetable.roomNumber}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Course Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Course Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <BookOpen className="h-4 w-4 flex-shrink-0" />
                          <span>Course Name</span>
                        </div>
                        <span className="font-medium">{timetable.courseName}</span>
                      </div>
                      {timetable.courseCode && (
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Hash className="h-4 w-4 flex-shrink-0" />
                            <span>Course Code</span>
                          </div>
                          <span className="font-medium font-mono">{timetable.courseCode}</span>
                        </div>
                      )}
                      {timetable.courseDescription && (
                        <div className="text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3 text-muted-foreground mb-2">
                            <FileText className="h-4 w-4 flex-shrink-0" />
                            <span>Description</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 ml-7">
                            {timetable.courseDescription}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Right Column */}
              <div className="space-y-4">
                
                {/* Teacher Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Teacher Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <User className="h-4 w-4 flex-shrink-0" />
                          <span>Teacher Name</span>
                        </div>
                        <span className="font-medium">{timetable.teacherName}</span>
                      </div>
                      {timetable.teacherEmail && (
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Hash className="h-4 w-4 flex-shrink-0" />
                            <span>Email</span>
                          </div>
                          <span className="font-medium text-xs">{timetable.teacherEmail}</span>
                        </div>
                      )}
                      {timetable.teacherEmployeeNumber && (
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Hash className="h-4 w-4 flex-shrink-0" />
                            <span>Employee #</span>
                          </div>
                          <span className="font-medium font-mono">{timetable.teacherEmployeeNumber}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Classroom Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <School className="h-4 w-4 text-primary" />
                      Classroom Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <School className="h-4 w-4 flex-shrink-0" />
                          <span>Classroom</span>
                        </div>
                        <span className="font-medium">{timetable.classRoomName}</span>
                      </div>
                      {timetable.classRoomLevel && (
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Hash className="h-4 w-4 flex-shrink-0" />
                            <span>Level</span>
                          </div>
                          <span className="font-medium">{timetable.classRoomLevel}</span>
                        </div>
                      )}
                      {timetable.classRoomSection && (
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Hash className="h-4 w-4 flex-shrink-0" />
                            <span>Section</span>
                          </div>
                          <span className="font-medium">{timetable.classRoomSection}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Academic Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Academic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="text-muted-foreground">Academic Year</span>
                        <span className="font-medium">{timetable.academicYear}</span>
                      </div>
                      {timetable.semester && (
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <span className="text-muted-foreground">Semester</span>
                          <span className="font-medium">{timetable.semester}</span>
                        </div>
                      )}
                      {timetable.specialityName && (
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <span className="text-muted-foreground">Speciality</span>
                          <span className="font-medium">{timetable.specialityName}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <CheckCircle className="h-4 w-4 flex-shrink-0" />
                          <span>Status</span>
                        </div>
                        <Badge variant={timetable.active ? 'default' : 'secondary'}>
                          {timetable.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

            </div>

            {/* Notes Section */}
            {timetable.notes && (
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Notes
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {timetable.notes}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* System Information */}
            <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  System Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-muted-foreground">Created At</span>
                    <span className="font-medium">{formatDate(timetable.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">{formatDate(timetable.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8">Timetable not found</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
