import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Users } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { notificationService, NotificationType } from '../notification.service'
import { classroomService } from '@/api/classroom.service'

const bulkNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  message: z.string().min(1, 'Message is required').max(2000),
  notificationType: z.nativeEnum(NotificationType),
  targetRole: z.enum(['STUDENT', 'TEACHER', 'PARENT', 'ALL']).optional(),
  classroomId: z.string().optional(),
})

type BulkNotificationFormData = z.infer<typeof bulkNotificationSchema>

interface SendBulkNotificationDialogProps {
  open: boolean
  onClose: () => void
}

export default function SendBulkNotificationDialog({ open, onClose }: SendBulkNotificationDialogProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BulkNotificationFormData>({
    resolver: zodResolver(bulkNotificationSchema),
  })

  const { data: classroomsData } = useQuery({
    queryKey: ['classrooms-all'],
    queryFn: () => classroomService.getAll(0, 100),
    enabled: open,
  })

  useEffect(() => {
    if (open) {
      reset({
        title: '',
        message: '',
        notificationType: NotificationType.ANNOUNCEMENT,
        targetRole: 'ALL',
        classroomId: '',
      })
    }
  }, [open, reset])

  const sendBulkMutation = useMutation({
    mutationFn: notificationService.sendBulkNotification,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
      toast.success(`Notification sent to ${data.length} users`, { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to send bulk notification'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const onSubmit = async (data: BulkNotificationFormData) => {
    const payload: any = {
      title: data.title,
      message: data.message,
      notificationType: data.notificationType,
    }

    if (data.targetRole && data.targetRole !== 'ALL') {
      payload.targetRole = data.targetRole
    }

    if (data.classroomId) {
      payload.classroomId = data.classroomId
    }

    sendBulkMutation.mutate(payload)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black dark:text-white">
            <Users className="h-5 w-5" />
            Send Bulk Notification
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Send a notification to multiple users by role or classroom
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Role</Label>
              <Select
                onValueChange={(value) => setValue('targetRole', value as any)}
                value={watch('targetRole')}
              >
                <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                  <SelectItem value="ALL" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800">
                    All Users
                  </SelectItem>
                  <SelectItem value="STUDENT" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800">
                    Students
                  </SelectItem>
                  <SelectItem value="TEACHER" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800">
                    Teachers
                  </SelectItem>
                  <SelectItem value="PARENT" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800">
                    Parents
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classroomId">Classroom (Optional)</Label>
              <Select
                onValueChange={(value) => setValue('classroomId', value === 'none' ? '' : value)}
                value={watch('classroomId') || 'none'}
              >
                <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select classroom" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                  <SelectItem value="none" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800">
                    All Classrooms
                  </SelectItem>
                  {classroomsData?.content.map((classroom) => (
                    <SelectItem
                      key={classroom.id}
                      value={classroom.id}
                      className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
                    >
                      {classroom.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationType">Type *</Label>
            <Select
              onValueChange={(value) => setValue('notificationType', value as NotificationType)}
              value={watch('notificationType')}
            >
              <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                {Object.values(NotificationType).map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.notificationType && (
              <p className="text-sm text-red-600 font-medium">{errors.notificationType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Notification title"
              className="bg-white dark:bg-gray-900"
            />
            {errors.title && (
              <p className="text-sm text-red-600 font-medium">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              {...register('message')}
              rows={4}
              placeholder="Notification message"
              className="bg-white dark:bg-gray-900"
            />
            {errors.message && (
              <p className="text-sm text-red-600 font-medium">{errors.message.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 hover:bg-gray-100 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={sendBulkMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {sendBulkMutation.isPending ? 'Sending...' : 'Send to All'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
