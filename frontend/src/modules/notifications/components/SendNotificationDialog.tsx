import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Send } from 'lucide-react'
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
import { studentService } from '@/modules/students/api/student.service'
import { teacherService } from '@/api/teacher.service'

const notificationSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  title: z.string().min(1, 'Title is required').max(200),
  message: z.string().min(1, 'Message is required').max(2000),
  notificationType: z.nativeEnum(NotificationType),
})

type NotificationFormData = z.infer<typeof notificationSchema>

interface SendNotificationDialogProps {
  open: boolean
  onClose: () => void
}

export default function SendNotificationDialog({ open, onClose }: SendNotificationDialogProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
  })

  const { data: studentsData } = useQuery({
    queryKey: ['students-all'],
    queryFn: () => studentService.getAll(0, 100),
    enabled: open,
  })

  const { data: teachersData } = useQuery({
    queryKey: ['teachers-all'],
    queryFn: () => teacherService.getAll(0, 100),
    enabled: open,
  })

  useEffect(() => {
    if (open) {
      reset({
        userId: '',
        title: '',
        message: '',
        notificationType: NotificationType.INFO,
      })
    }
  }, [open, reset])

  const sendMutation = useMutation({
    mutationFn: notificationService.sendNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
      toast.success('Notification sent successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to send notification'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const onSubmit = async (data: NotificationFormData) => {
    sendMutation.mutate(data)
  }

  const allUsers = [
    ...(studentsData?.content.map(s => ({ id: s.id, name: `${s.firstName} ${s.lastName}`, type: 'Student' })) || []),
    ...(teachersData?.content.map(t => ({ id: t.id, name: `${t.user.firstName} ${t.user.lastName}`, type: 'Teacher' })) || []),
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black dark:text-white">
            <Send className="h-5 w-5" />
            Send Notification
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Send a notification to a specific user
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">Recipient *</Label>
            <Select
              onValueChange={(value) => setValue('userId', value)}
              value={watch('userId')}
            >
              <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                {allUsers.map((user) => (
                  <SelectItem
                    key={user.id}
                    value={user.id}
                    className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
                  >
                    {user.name} ({user.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.userId && (
              <p className="text-sm text-red-600 font-medium">{errors.userId.message}</p>
            )}
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
              disabled={sendMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {sendMutation.isPending ? 'Sending...' : 'Send Notification'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
