import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { timetableService, type CreateTimetableRequest, type UpdateTimetableRequest, type Timetable } from '../../api/timetable.service'
import { classroomService } from '../../../classrooms/api/classroom.service'
import { teacherService } from '../../../teachers/api/teacher.service'
import { courseService } from '../../../courses/api/course.service'
import { specialityService } from '../../../specialities/api/speciality.service'
import ScheduleSection from './ScheduleSection'
import EntitySection from './EntitySection'
import AdditionalInfoSection from './AdditionalInfoSection'

const timetableSchema = z.object({
  classRoomId: z.string().min(1, 'Classroom is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
  courseId: z.string().min(1, 'Course is required'),
  specialityId: z.string().optional(),
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  roomNumber: z.string().max(50).optional(),
  semester: z.string().max(50).optional(),
  academicYear: z.string().min(1, 'Academic year is required').max(20),
  notes: z.string().max(1000).optional(),
  active: z.boolean().optional(),
})

type TimetableFormData = z.infer<typeof timetableSchema>

interface TimetableFormDialogProps {
  open: boolean
  onClose: () => void
  timetable?: Timetable | null
}

export default function TimetableFormDialog({ open, onClose, timetable }: TimetableFormDialogProps) {
  const isEdit = !!timetable
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TimetableFormData>({
    resolver: zodResolver(timetableSchema),
  })

  const { data: classroomsData } = useQuery({
    queryKey: ['classrooms-all'],
    queryFn: () => classroomService.getAll(0, 100),
  })

  const { data: teachersData } = useQuery({
    queryKey: ['teachers-all'],
    queryFn: () => teacherService.getAll(0, 100),
  })

  const { data: coursesData } = useQuery({
    queryKey: ['courses-all'],
    queryFn: () => courseService.getAll(0, 100),
  })

  const { data: specialitiesData } = useQuery({
    queryKey: ['specialities-all'],
    queryFn: () => specialityService.getAllActive(),
  })

  useEffect(() => {
    if (timetable && open) {
      reset({
        classRoomId: timetable.classRoomId || '',
        teacherId: timetable.teacherId || '',
        courseId: timetable.courseId || '',
        specialityId: timetable.specialityId || '',
        dayOfWeek: timetable.dayOfWeek,
        startTime: timetable.startTime || '',
        endTime: timetable.endTime || '',
        roomNumber: timetable.roomNumber || '',
        semester: timetable.semester || '',
        academicYear: timetable.academicYear || '',
        notes: timetable.notes || '',
        active: timetable.active,
      })
    } else if (!timetable && open) {
      const currentYear = new Date().getFullYear()
      reset({
        classRoomId: '',
        teacherId: '',
        courseId: '',
        specialityId: '',
        dayOfWeek: 'MONDAY',
        startTime: '08:00',
        endTime: '09:30',
        roomNumber: '',
        semester: '',
        academicYear: `${currentYear}-${currentYear + 1}`,
        notes: '',
        active: true,
      })
    }
  }, [timetable, open, reset])

  const createMutation = useMutation({
    mutationFn: (data: CreateTimetableRequest) => timetableService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] })
      queryClient.invalidateQueries({ queryKey: ['timetable-statistics'] })
      toast.success('Timetable created successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create timetable'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTimetableRequest }) =>
      timetableService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] })
      queryClient.invalidateQueries({ queryKey: ['timetable-statistics'] })
      toast.success('Timetable updated successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update timetable'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const onSubmit = async (data: TimetableFormData) => {
    if (isEdit && timetable) {
      const updateData: UpdateTimetableRequest = {
        teacherId: data.teacherId,
        specialityId: data.specialityId || undefined,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        roomNumber: data.roomNumber,
        semester: data.semester,
        academicYear: data.academicYear,
        notes: data.notes,
        active: data.active,
      }
      updateMutation.mutate({ id: timetable.id, data: updateData })
    } else {
      const createData: CreateTimetableRequest = {
        classRoomId: data.classRoomId,
        teacherId: data.teacherId,
        courseId: data.courseId,
        specialityId: data.specialityId || undefined,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        roomNumber: data.roomNumber,
        semester: data.semester,
        academicYear: data.academicYear,
        notes: data.notes,
      }
      createMutation.mutate(createData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[950px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black dark:text-white">
            <Calendar className="h-5 w-5" />
            {isEdit ? 'Edit Timetable' : 'Create New Timetable'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update timetable entry information' : 'Add a new timetable entry to the schedule'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column */}
            <div className="space-y-6">
              <ScheduleSection
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                isEdit={isEdit}
              />

              <AdditionalInfoSection
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                isEdit={isEdit}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <EntitySection
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                isEdit={isEdit}
                classrooms={classroomsData?.content || []}
                teachers={teachersData?.content || []}
                courses={coursesData?.content || []}
                specialities={specialitiesData || []}
              />
            </div>

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
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>Processing...</>
              ) : (
                <>{isEdit ? 'Update Timetable' : 'Create Timetable'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
