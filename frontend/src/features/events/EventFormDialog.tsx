import { useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { eventService } from '@/api/event.service'
import { queryClient } from '@/lib/queryClient'
import type { Event } from '@/types'

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  eventType: z.string().min(1, 'Event type is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  location: z.string().optional(),
  targetRole: z.string().optional(),
  imageUrl: z.string().optional(),
})

type EventFormData = z.infer<typeof eventSchema>

interface EventFormDialogProps {
  open: boolean
  onClose: () => void
  event?: Event | null
}

export default function EventFormDialog({ open, onClose, event }: EventFormDialogProps) {
  const isEdit = !!event

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  })

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        eventDate: event.eventDate.split('T')[0],
        location: event.location || '',
        targetRole: event.targetRole || '',
        imageUrl: event.imageUrl || '',
      })
    } else {
      reset({
        title: '',
        description: '',
        eventType: 'SCHOOL_WIDE',
        eventDate: new Date().toISOString().split('T')[0],
        location: '',
        targetRole: '',
        imageUrl: '',
      })
    }
  }, [event, reset])

  const createMutation = useMutation({
    mutationFn: eventService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Event created successfully')
      onClose()
      reset()
    },
    onError: () => {
      toast.error('Failed to create event')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EventFormData> }) =>
      eventService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Event updated successfully')
      onClose()
      reset()
    },
    onError: () => {
      toast.error('Failed to update event')
    },
  })

  const onSubmit = (data: EventFormData) => {
    if (isEdit && event) {
      updateMutation.mutate({ id: event.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update event information' : 'Add a new event to the calendar'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" {...register('title')} placeholder="e.g., Annual Sports Day" />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Select
                onValueChange={(value) => setValue('eventType', value)}
                defaultValue="SCHOOL_WIDE"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHOOL_WIDE">School Wide</SelectItem>
                  <SelectItem value="CLASS">Class Event</SelectItem>
                  <SelectItem value="EXAM">Exam</SelectItem>
                  <SelectItem value="HOLIDAY">Holiday</SelectItem>
                  <SelectItem value="MEETING">Meeting</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.eventType && (
                <p className="text-sm text-destructive">{errors.eventType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date</Label>
              <Input id="eventDate" type="date" {...register('eventDate')} />
              {errors.eventDate && (
                <p className="text-sm text-destructive">{errors.eventDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input id="location" {...register('location')} placeholder="e.g., Main Auditorium" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Role (Optional)</Label>
              <Input id="targetRole" {...register('targetRole')} placeholder="e.g., ALL, STUDENT" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} rows={3} />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input id="imageUrl" {...register('imageUrl')} placeholder="https://..." />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
