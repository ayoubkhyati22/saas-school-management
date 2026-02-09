import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
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
import { documentService } from '@/api/document.service'
import { queryClient } from '@/lib/queryClient'

const uploadSchema = z.object({
  entityType: z.string().min(1, 'Entity type is required'),
  entityId: z.string().min(1, 'Entity ID is required'),
  description: z.string().optional(),
})

type UploadFormData = z.infer<typeof uploadSchema>

interface DocumentUploadDialogProps {
  open: boolean
  onClose: () => void
}

export default function DocumentUploadDialog({ open, onClose }: DocumentUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      entityType: 'STUDENT',
      entityId: '',
      description: '',
    },
  })

  const uploadMutation = useMutation({
    mutationFn: ({ file, ...data }: UploadFormData & { file: File }) =>
      documentService.upload(file, data.entityType, data.entityId, data.description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      toast.success('Document uploaded successfully', { position: 'bottom-right' })
      onClose()
      reset()
      setFile(null)
    },
    onError: () => {
      toast.error('Failed to upload document', { position: 'bottom-right' })
    },
  })

  const onSubmit = (data: UploadFormData) => {
    if (!file) {
      toast.error('Please select a file', { position: 'bottom-right' })
      return
    }
    uploadMutation.mutate({ ...data, file })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a new document or file to the system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {!file && (
              <p className="text-sm text-muted-foreground">No file selected</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entityType">Entity Type</Label>
              <Input id="entityType" {...register('entityType')} placeholder="e.g., STUDENT" />
              {errors.entityType && (
                <p className="text-sm text-destructive">{errors.entityType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="entityId">Entity ID</Label>
              <Input id="entityId" {...register('entityId')} />
              {errors.entityId && (
                <p className="text-sm text-destructive">{errors.entityId.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" {...register('description')} rows={3} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploadMutation.isPending || !file}>
              Upload
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
