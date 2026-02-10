import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { specialityService } from '../api/speciality.service'
import { formatDate } from '@/lib/utils'
import { BookOpen, Code, FileText, Power, Clock } from 'lucide-react'

interface SpecialityDetailDialogProps {
  open: boolean
  onClose: () => void
  specialityId: string
}

export default function SpecialityDetailDialog({ open, onClose, specialityId }: SpecialityDetailDialogProps) {
  const { data: speciality, isLoading } = useQuery({
    queryKey: ['specialities', specialityId],
    queryFn: () => specialityService.getById(specialityId),
    enabled: open && !!specialityId,
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Speciality Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : speciality ? (
          <div className="space-y-6">
            {/* Header with Icon and Basic Info */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="h-20 w-20 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center border-2 border-teal-200">
                <BookOpen className="h-10 w-10" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{speciality.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="font-mono">
                    {speciality.code}
                  </Badge>
                  <Badge variant={speciality.active ? 'success' : 'secondary'}>
                    {speciality.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column */}
              <div className="space-y-4">
                
                {/* Basic Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Basic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <BookOpen className="h-4 w-4 flex-shrink-0" />
                          <span>Name</span>
                        </div>
                        <span className="font-medium">{speciality.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Code className="h-4 w-4 flex-shrink-0" />
                          <span>Code</span>
                        </div>
                        <span className="font-medium font-mono bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 px-2 py-1 rounded">
                          {speciality.code}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Power className="h-4 w-4 flex-shrink-0" />
                          <span>Status</span>
                        </div>
                        <Badge variant={speciality.active ? 'success' : 'secondary'}>
                          {speciality.active ? 'Active' : 'Inactive'}
                        </Badge>
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
                        <span className="font-medium">{formatDate(speciality.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="font-medium">{formatDate(speciality.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Right Column */}
              <div className="space-y-4">
                
                {/* Description */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Description
                    </h3>
                    {speciality.description ? (
                      <div className="text-sm text-gray-700 dark:text-gray-300 p-3 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
                        {speciality.description}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No description provided</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Usage Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Usage Information
                    </h3>
                    <div className="text-center py-6">
                      <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                        0
                      </div>
                      <p className="text-sm text-muted-foreground">Teachers assigned</p>
                    </div>
                    <div className="text-xs text-muted-foreground text-center mt-4">
                      This speciality can be assigned to teachers
                    </div>
                  </CardContent>
                </Card>

              </div>

            </div>
          </div>
        ) : (
          <div className="text-center py-8">Speciality not found</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
