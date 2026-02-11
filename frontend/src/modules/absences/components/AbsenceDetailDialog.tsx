import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { absenceService } from '../api/absence.service'
import { formatDate } from '@/lib/utils'
import { 
  Calendar, 
  BookOpen, 
  User, 
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Paperclip
} from 'lucide-react'

interface AbsenceDetailDialogProps {
  open: boolean
  onClose: () => void
  absenceId: string
}

export default function AbsenceDetailDialog({ open, onClose, absenceId }: AbsenceDetailDialogProps) {
  const { data: absence, isLoading } = useQuery({
    queryKey: ['absences', absenceId],
    queryFn: () => absenceService.getById(absenceId),
    enabled: open && !!absenceId,
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Absence Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : absence ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className={`h-16 w-16 rounded-lg flex items-center justify-center ${
                absence.justified 
                  ? 'bg-gradient-to-br from-green-500 to-green-600' 
                  : 'bg-gradient-to-br from-red-500 to-red-600'
              }`}>
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{absence.studentName}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={absence.justified ? 'success' : 'destructive'}>
                    {absence.justified ? (
                      <><CheckCircle className="h-3 w-3 mr-1" /> Justified</>
                    ) : (
                      <><XCircle className="h-3 w-3 mr-1" /> Unjustified</>
                    )}
                  </Badge>
                  <Badge variant="outline">{formatDate(absence.date)}</Badge>
                </div>
              </div>
            </div>

            {/* Absence Details */}
            <div className="space-y-4">
              
              {/* Course Information */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Course Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-md bg-white dark:bg-gray-900">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Course</p>
                        <p className="font-medium text-lg">{absence.courseSubject}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reason */}
              {absence.reason && (
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Reason
                    </h3>
                    <div className="p-3 rounded-md bg-white dark:bg-gray-900">
                      <p className="text-sm whitespace-pre-wrap">{absence.reason}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Justification Document */}
              {absence.justified && absence.justificationDocument && (
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-primary" />
                      Justification Document
                    </h3>
                    <div className="p-3 rounded-md bg-white dark:bg-gray-900">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium">{absence.justificationDocument}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reporting Information */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Reporting Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm p-3 rounded-md bg-white dark:bg-gray-900">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <User className="h-4 w-4 flex-shrink-0" />
                        <span>Reported By</span>
                      </div>
                      <span className="font-medium">
                        {absence.reportedByName || 'Unknown'}
                      </span>
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
                      <span className="font-medium">{formatDate(absence.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="font-medium">{formatDate(absence.updatedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        ) : (
          <div className="text-center py-8">Absence not found</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
