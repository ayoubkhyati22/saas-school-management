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
import { courseService } from '@/api/course.service'
import { queryClient } from '@/lib/queryClient'
import type { Course } from '@/types'

const courseSchema = z.object({
  classRoomId: z.string().min(1, 'Classroom is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
  subject: z.string().min(1, 'Subject is required'),
  subjectCode: z.string().min(1, 'Subject code is required'),
  description: z.string().optional(),
  schedule: z.string().optional(),
  semester: z.string().optional(),
})

type CourseFormData = z.infer<typeof courseSchema>

interface CourseFormDialogProps {
  open: boolean
  onClose: () => void
  course?: Course | null
}

export default function CourseFormDialog({ open, onClose, course }: CourseFormDialogProps) {
  const isEdit = !!course

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  })

  useEffect(() => {
    if (course) {
      reset({
        classRoomId: course.classRoom.id,
        teacherId: course.teacher.id,
        subject: course.subject,
        subjectCode: course.subjectCode,
        description: course.description || '',
        schedule: course.schedule || '',
        semester: course.semester || '',
      })
    } else {
      reset({
        classRoomId: '',
        teacherId: '',
        subject: '',
        subjectCode: '',
        description: '',
        schedule: '',
        semester: '',
      })
    }
  }, [course, reset])

  const createMutation = useMutation({
    mutationFn: courseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Course created successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: () => {
      toast.error('Failed to create course', { position: 'bottom-right' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CourseFormData> }) =>
      courseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Course updated successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: () => {
      toast.error('Failed to update course', { position: 'bottom-right' })
    },
  })

  const onSubmit = (data: CourseFormData) => {
    if (isEdit && course) {
      updateMutation.mutate({ id: course.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Course' : 'Create New Course'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update course information' : 'Add a new course to the system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" {...register('subject')} placeholder="e.g., Mathematics" />
              {errors.subject && (
                <p className="text-sm text-destructive">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subjectCode">Subject Code</Label>
              <Input id="subjectCode" {...register('subjectCode')} placeholder="e.g., MATH101" />
              {errors.subjectCode && (
                <p className="text-sm text-destructive">{errors.subjectCode.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classRoomId">Classroom ID</Label>
              <Input id="classRoomId" {...register('classRoomId')} />
              {errors.classRoomId && (
                <p className="text-sm text-destructive">{errors.classRoomId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacherId">Teacher ID</Label>
              <Input id="teacherId" {...register('teacherId')} />
              {errors.teacherId && (
                <p className="text-sm text-destructive">{errors.teacherId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester (Optional)</Label>
              <Input id="semester" {...register('semester')} placeholder="e.g., Fall 2024" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule (Optional)</Label>
              <Input id="schedule" {...register('schedule')} placeholder="e.g., Mon/Wed 9-10am" />
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
