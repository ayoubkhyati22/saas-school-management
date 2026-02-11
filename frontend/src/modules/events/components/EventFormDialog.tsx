import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { eventService, type CreateEventRequest, type UpdateEventRequest, type Event, type EventType, type TargetRole } from '../api/event.service'
import BasicEventInfoSection from './BasicEventInfoSection'
import EventDetailsSection from './EventDetailsSection'

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  eventType: z.enum([
    'MEETING',
    'EXAM',
    'HOLIDAY',
    'SPORTS_DAY',
    'PARENT_TEACHER_MEETING',
    'SCHOOL_TRIP',
    'CULTURAL_EVENT',
    'WORKSHOP',
    'SEMINAR',
    'OTHER',
  ] as const),
  eventDate: z.string().min(1, 'Event date is required'),
  location: z.string().max(200).optional(),
  targetRole: z.enum(['ALL', 'STUDENT', 'TEACHER', 'PARENT'] as const),
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
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      targetRole: 'ALL',
      eventType: 'OTHER',
    },
  })

  useEffect(() => {
    if (event && open) {
      reset({
        title: event.title || '',
        description: event.description || '',
        eventType: event.eventType as EventType,
        eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : '',
        location: event.location || '',
        targetRole: event.targetRole as TargetRole,
        imageUrl: event.imageUrl || '',
      })
    } else if (!event && open) {
      reset({
        title: '',
        description: '',
        eventType: 'OTHER',
        eventDate: '',
        location: '',
        targetRole: 'ALL',
        imageUrl: '',
      })
    }
  }, [event, open, reset])

  const createMutation = useMutation({
    mutationFn: (data: CreateEventRequest) => eventService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Event created successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create event'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventRequest }) =>
      eventService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Event updated successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update event'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const onSubmit = async (data: EventFormData) => {
    // Convert local datetime to ISO format
    const eventDate = new Date(data.eventDate).toISOString()

    if (isEdit && event) {
      const updateData: UpdateEventRequest = {
        title: data.title,
        description: data.description || undefined,
        eventType: data.eventType,
        eventDate: eventDate,
        location: data.location || undefined,
        targetRole: data.targetRole,
        imageUrl: data.imageUrl || undefined,
      }
      updateMutation.mutate({ id: event.id, data: updateData })
    } else {
      const createData: CreateEventRequest = {
        title: data.title,
        description: data.description || undefined,
        eventType: data.eventType,
        eventDate: eventDate,
        location: data.location || undefined,
        targetRole: data.targetRole,
        imageUrl: data.imageUrl || undefined,
      }
      createMutation.mutate(createData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black dark:text-white">
            <Calendar className="h-5 w-5" />
            {isEdit ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update event information' : 'Add a new event to the calendar'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <BasicEventInfoSection
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />

          <EventDetailsSection
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />

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
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>Processing...</>
              ) : (
                <>{isEdit ? 'Update Event' : 'Create Event'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
