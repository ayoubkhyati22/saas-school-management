import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { BookOpen } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { courseService, type CreateCourseRequest, type UpdateCourseRequest, type Course } from '../api/course.service'
import { classroomService } from '@/api/classroom.service'
import { teacherService } from '@/api/teacher.service'
import BasicInfoSection from './BasicInfoSection'
import AssignmentSection from './AssignmentSection'
import ScheduleInfoSection from './ScheduleInfoSection'

const courseSchema = z.object({
  classRoomId: z.string().min(1, 'Classroom is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
  specialityId: z.string().optional(),
  subject: z.string().min(1, 'Subject is required').max(100),
  subjectCode: z.string().max(50).optional(),
  description: z.string().max(1000).optional(),
  schedule: z.string().max(500).optional(),
  semester: z.string().max(50).optional(),
})

type CourseFormData = z.infer<typeof courseSchema>

interface CourseFormDialogProps {
  open: boolean
  onClose: () => void
  course?: Course | null
}

export default function CourseFormDialog({ open, onClose, course }: CourseFormDialogProps) {
  const isEdit = !!course
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  })

  const { data: classroomsData } = useQuery({
    queryKey: ['classrooms-all'],
    queryFn: () => classroomService.getAll(0, 100),
  })

  const { data: teachersData } = useQuery({
    queryKey: ['teachers-all'],
    queryFn: () => teacherService.getAll(0, 100),
  })

  useEffect(() => {
    if (course && open) {
      reset({
        classRoomId: course.classRoomId || '',
        teacherId: course.teacherId || '',
        specialityId: course.specialityId || '',
        subject: course.subject || '',
        subjectCode: course.subjectCode || '',
        description: course.description || '',
        schedule: course.schedule || '',
        semester: course.semester || '',
      })
    } else if (!course && open) {
      reset({
        classRoomId: '',
        teacherId: '',
        specialityId: '',
        subject: '',
        subjectCode: '',
        description: '',
        schedule: '',
        semester: '',
      })
    }
  }, [course, open, reset])

  const createMutation = useMutation({
    mutationFn: (data: CreateCourseRequest) => courseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Course created successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create course'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseRequest }) =>
      courseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Course updated successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update course'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const onSubmit = async (data: CourseFormData) => {
    if (isEdit && course) {
      const updateData: UpdateCourseRequest = {
        teacherId: data.teacherId,
        specialityId: data.specialityId || undefined,
        subject: data.subject,
        subjectCode: data.subjectCode || undefined,
        description: data.description || undefined,
        schedule: data.schedule || undefined,
        semester: data.semester || undefined,
      }
      updateMutation.mutate({ id: course.id, data: updateData })
    } else {
      const createData: CreateCourseRequest = {
        classRoomId: data.classRoomId,
        teacherId: data.teacherId,
        specialityId: data.specialityId || undefined,
        subject: data.subject,
        subjectCode: data.subjectCode || undefined,
        description: data.description || undefined,
        schedule: data.schedule || undefined,
        semester: data.semester || undefined,
      }
      createMutation.mutate(createData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black dark:text-white">
            <BookOpen className="h-5 w-5" />
            {isEdit ? 'Edit Course' : 'Create New Course'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update course information' : 'Add a new course to the system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column */}
            <div className="space-y-6">
              <BasicInfoSection
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
              />

              <ScheduleInfoSection
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <AssignmentSection
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                isEdit={isEdit}
                classrooms={classroomsData?.content || []}
                teachers={teachersData?.content || []}
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
                <>{isEdit ? 'Update Course' : 'Create Course'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
