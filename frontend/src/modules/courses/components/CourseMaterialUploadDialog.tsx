import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Upload, FileText, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { courseService } from '../api/course.service'

const uploadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
})

type UploadFormData = z.infer<typeof uploadSchema>

interface CourseMaterialUploadDialogProps {
  open: boolean
  onClose: () => void
  courseId: string
}

export default function CourseMaterialUploadDialog({
  open,
  onClose,
  courseId,
}: CourseMaterialUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  })

  const uploadMutation = useMutation({
    mutationFn: ({ file, title }: { file: File; title: string }) =>
      courseService.uploadMaterial(courseId, file, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-materials', courseId] })
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] })
      toast.success('Material uploaded successfully', { position: 'bottom-right' })
      handleClose()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to upload material'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must not exceed 50MB', { position: 'bottom-right' })
        return
      }
      setSelectedFile(file)
    }
  }

  const handleClose = () => {
    reset()
    setSelectedFile(null)
    onClose()
  }

  const onSubmit = (data: UploadFormData) => {
    if (!selectedFile) {
      toast.error('Please select a file', { position: 'bottom-right' })
      return
    }

    uploadMutation.mutate({
      file: selectedFile,
      title: data.title,
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black dark:text-white">
            <Upload className="h-5 w-5" />
            Upload Course Material
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Upload files like PDFs, documents, videos, or images for this course
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Material Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="e.g., Chapter 1 Notes, Homework Assignment"
              className="bg-white dark:bg-gray-900"
            />
            {errors.title && (
              <p className="text-sm text-red-600 font-medium">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>File *</Label>
            {selectedFile ? (
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4" />
                  Choose File
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-3">
                  Maximum file size: 50MB
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedFile || uploadMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {uploadMutation.isPending ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Material
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
