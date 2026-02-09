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
import { classroomService } from '@/api/classroom.service'
import { queryClient } from '@/lib/queryClient'
import type { ClassRoom } from '@/types'

const classroomSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  level: z.string().min(1, 'Level is required'),
  section: z.string().min(1, 'Section is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  classTeacherId: z.string().min(1, 'Class teacher is required'),
})

type ClassroomFormData = z.infer<typeof classroomSchema>

interface ClassroomFormDialogProps {
  open: boolean
  onClose: () => void
  classroom?: ClassRoom | null
}

export default function ClassroomFormDialog({ open, onClose, classroom }: ClassroomFormDialogProps) {
  const isEdit = !!classroom

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassroomFormData>({
    resolver: zodResolver(classroomSchema),
  })

  useEffect(() => {
    if (classroom) {
      reset({
        name: classroom.name,
        level: classroom.level,
        section: classroom.section,
        academicYear: classroom.academicYear,
        capacity: classroom.capacity,
        classTeacherId: classroom.classTeacher.id,
      })
    } else {
      reset({
        name: '',
        level: '',
        section: '',
        academicYear: new Date().getFullYear().toString(),
        capacity: 30,
        classTeacherId: '',
      })
    }
  }, [classroom, reset])

  const createMutation = useMutation({
    mutationFn: classroomService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
      toast.success('Classroom created successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: () => {
      toast.error('Failed to create classroom', { position: 'bottom-right' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClassroomFormData> }) =>
      classroomService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
      toast.success('Classroom updated successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: () => {
      toast.error('Failed to update classroom', { position: 'bottom-right' })
    },
  })

  const onSubmit = (data: ClassroomFormData) => {
    if (isEdit && classroom) {
      updateMutation.mutate({ id: classroom.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Classroom' : 'Create New Classroom'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update classroom information' : 'Add a new classroom to the system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Classroom Name</Label>
              <Input id="name" {...register('name')} placeholder="e.g., Grade 5-A" />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Input id="level" {...register('level')} placeholder="e.g., Grade 5" />
              {errors.level && (
                <p className="text-sm text-destructive">{errors.level.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input id="section" {...register('section')} placeholder="e.g., A" />
              {errors.section && (
                <p className="text-sm text-destructive">{errors.section.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" type="number" {...register('capacity', { valueAsNumber: true })} />
              {errors.capacity && (
                <p className="text-sm text-destructive">{errors.capacity.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicYear">Academic Year</Label>
            <Input id="academicYear" {...register('academicYear')} placeholder="2024-2025" />
            {errors.academicYear && (
              <p className="text-sm text-destructive">{errors.academicYear.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="classTeacherId">Class Teacher ID</Label>
            <Input id="classTeacherId" {...register('classTeacherId')} />
            {errors.classTeacherId && (
              <p className="text-sm text-destructive">{errors.classTeacherId.message}</p>
            )}
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
