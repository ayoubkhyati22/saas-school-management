import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { courseService } from '../api/course.service'
import { formatDate } from '@/lib/utils'
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Clock, 
  Hash, 
  FileText, 
  Upload,
  Download,
  Trash2,
  Paperclip
} from 'lucide-react'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CourseMaterialUploadDialog from './CourseMaterialUploadDialog'

interface CourseDetailDialogProps {
  open: boolean
  onClose: () => void
  courseId: string
}

export default function CourseDetailDialog({ open, onClose, courseId }: CourseDetailDialogProps) {
  const queryClient = useQueryClient()
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const { data: course, isLoading } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => courseService.getById(courseId),
    enabled: open && !!courseId,
  })

  const { data: materials, refetch: refetchMaterials } = useQuery({
    queryKey: ['course-materials', courseId],
    queryFn: () => courseService.getMaterialsByCourse(courseId),
    enabled: open && !!courseId,
  })

  const deleteMaterialMutation = useMutation({
    mutationFn: courseService.deleteMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-materials', courseId] })
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] })
      toast.success('Material deleted successfully', { position: 'bottom-right' })
    },
    onError: () => {
      toast.error('Failed to delete material', { position: 'bottom-right' })
    },
  })

  const handleDeleteMaterial = (materialId: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMaterialMutation.mutate(materialId)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-black dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">Course Details</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : course ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{course.subject}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {course.subjectCode && (
                      <Badge variant="outline" className="font-mono">
                        {course.subjectCode}
                      </Badge>
                    )}
                    {course.semester && (
                      <Badge variant="default">{course.semester}</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Left Column */}
                <div className="space-y-4">
                  
                  {/* Course Information */}
                  <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Course Information
                      </h3>
                      <div className="space-y-3">
                        {course.description && (
                          <div className="p-3 rounded-md bg-white dark:bg-gray-900">
                            <p className="text-sm text-muted-foreground mb-1">Description</p>
                            <p className="text-sm">{course.description}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Hash className="h-4 w-4 flex-shrink-0" />
                            <span>Subject Code</span>
                          </div>
                          <span className="font-medium">{course.subjectCode || 'N/A'}</span>
                        </div>
                        {course.specialityName && (
                          <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <div className="flex items-center gap-3 text-muted-foreground">
                              <BookOpen className="h-4 w-4 flex-shrink-0" />
                              <span>Speciality</span>
                            </div>
                            <span className="font-medium">{course.specialityName}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

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
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span>Schedule</span>
                          </div>
                          <span className="font-medium text-right">{course.schedule || 'Not set'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span>Semester</span>
                          </div>
                          <span className="font-medium">{course.semester || 'Not set'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  
                  {/* Teacher & Classroom */}
                  <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Assigned To
                      </h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded-md bg-white dark:bg-gray-900">
                          <p className="text-sm text-muted-foreground mb-1">Teacher</p>
                          <p className="font-medium">{course.teacherName}</p>
                          {course.teacherEmail && (
                            <p className="text-xs text-muted-foreground mt-1">{course.teacherEmail}</p>
                          )}
                        </div>
                        <div className="p-3 rounded-md bg-white dark:bg-gray-900">
                          <p className="text-sm text-muted-foreground mb-1">Classroom</p>
                          <p className="font-medium">{course.classRoomName}</p>
                          {course.classRoomLevel && (
                            <p className="text-xs text-muted-foreground mt-1">{course.classRoomLevel}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Information */}
                  <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        System Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <span className="text-muted-foreground">Materials</span>
                          <span className="font-medium">{course.materialCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <span className="text-muted-foreground">Created At</span>
                          <span className="font-medium">{formatDate(course.createdAt)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <span className="text-muted-foreground">Last Updated</span>
                          <span className="font-medium">{formatDate(course.updatedAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                </div>

              </div>

              {/* Course Materials Section */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-primary" />
                      Course Materials ({materials?.length || 0})
                    </h3>
                    <Button
                      size="sm"
                      onClick={() => setUploadDialogOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Material
                    </Button>
                  </div>
                  
                  {materials && materials.length > 0 ? (
                    <div className="space-y-2">
                      {materials.map((material) => (
                        <div
                          key={material.id}
                          className="flex items-center justify-between p-3 rounded-md bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{material.title}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {material.fileType}
                                </Badge>
                                <span>{formatFileSize(material.fileSize)}</span>
                                {material.uploadedByName && (
                                  <span>• by {material.uploadedByName}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteMaterial(material.id, material.title)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">No materials uploaded yet</p>
                      <p className="text-sm mt-1">Upload course materials to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          ) : (
            <div className="text-center py-8">Course not found</div>
          )}
        </DialogContent>
      </Dialog>

      <CourseMaterialUploadDialog
        open={uploadDialogOpen}
        onClose={() => {
          setUploadDialogOpen(false)
          refetchMaterials()
        }}
        courseId={courseId}
      />
    </>
  )
}
