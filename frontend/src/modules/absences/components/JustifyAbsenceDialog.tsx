import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CheckCircle, Upload, FileText, X } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { absenceService, type JustifyAbsenceRequest, type Absence } from '../api/absence.service'

const justifySchema = z.object({
  reason: z.string().max(1000).optional(),
})

type JustifyFormData = z.infer<typeof justifySchema>

interface JustifyAbsenceDialogProps {
  open: boolean
  onClose: () => void
  absence: Absence | null
}

export default function JustifyAbsenceDialog({ open, onClose, absence }: JustifyAbsenceDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JustifyFormData>({
    resolver: zodResolver(justifySchema),
  })

  const justifyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: JustifyAbsenceRequest }) =>
      absenceService.justify(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] })
      toast.success('Absence justified successfully', { position: 'bottom-right' })
      handleClose()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to justify absence'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must not exceed 10MB', { position: 'bottom-right' })
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

  const onSubmit = async (data: JustifyFormData) => {
    if (!absence) return

    if (!selectedFile) {
      toast.error('Please select a justification document', { position: 'bottom-right' })
      return
    }

    try {
      setUploading(true)
      
      // Upload the file first
      const filePath = await absenceService.uploadJustificationDocument(selectedFile)
      
      // Then justify the absence with the file path
      const justifyData: JustifyAbsenceRequest = {
        justificationDocument: filePath,
        reason: data.reason,
      }
      
      justifyMutation.mutate({ id: absence.id, data: justifyData })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to upload document'
      toast.error(errorMessage, { position: 'bottom-right' })
    } finally {
      setUploading(false)
    }
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
            <CheckCircle className="h-5 w-5" />
            Justify Absence
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Upload a justification document (medical certificate, note, etc.)
          </DialogDescription>
        </DialogHeader>

        {absence && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium">{absence.studentName}</p>
            <p className="text-xs text-muted-foreground">
              {absence.courseSubject} - {new Date(absence.date).toLocaleDateString()}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>Justification Document *</Label>
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
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <p className="text-xs text-muted-foreground mt-3">
                  Maximum file size: 10MB
                </p>
                <p className="text-xs text-muted-foreground">
                  Accepted: PDF, DOC, DOCX, JPG, PNG
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Additional Note (Optional)</Label>
            <Textarea
              id="reason"
              {...register('reason')}
              rows={3}
              placeholder="Add any additional information..."
              className="bg-white dark:bg-gray-900"
            />
            {errors.reason && (
              <p className="text-sm text-red-600 font-medium">{errors.reason.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedFile || uploading || justifyMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {uploading || justifyMutation.isPending ? (
                <>Uploading...</>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Justify Absence
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
