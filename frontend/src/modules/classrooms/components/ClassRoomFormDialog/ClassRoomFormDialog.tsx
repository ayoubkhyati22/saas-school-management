import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { GraduationCap } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { classroomService, type CreateClassRoomRequest, type UpdateClassRoomRequest, type ClassRoom } from '../../api/classroom.service'
import BasicInfoSection from './BasicInfoSection'
import TeacherSection from './TeacherSection'

const classroomSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  level: z.string().max(50).optional(),
  section: z.string().max(50).optional(),
  academicYear: z.string().min(1, 'Academic year is required').max(20),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  classTeacherId: z.string().optional(),
})

type ClassRoomFormData = z.infer<typeof classroomSchema>

interface ClassRoomFormDialogProps {
  open: boolean
  onClose: () => void
  classroom?: ClassRoom | null
}

export default function ClassRoomFormDialog({ open, onClose, classroom }: ClassRoomFormDialogProps) {
  const isEdit = !!classroom
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClassRoomFormData>({
    resolver: zodResolver(classroomSchema),
  })

  // Fetch teachers for dropdown
  const { data: teachersData } = useQuery({
    queryKey: ['teachers-all'],
    queryFn: async () => {
      // This assumes you have a teacher service
      // Replace with your actual teacher service import
      const response = await fetch('/api/teachers?page=0&size=100')
      const data = await response.json()
      return data
    },
  })

  useEffect(() => {
    if (classroom && open) {
      reset({
        name: classroom.name || '',
        level: classroom.level || '',
        section: classroom.section || '',
        academicYear: classroom.academicYear || '',
        capacity: classroom.capacity || 30,
        classTeacherId: classroom.classTeacherId || '',
      })
    } else if (!classroom && open) {
      const currentYear = new Date().getFullYear()
      const nextYear = currentYear + 1
      reset({
        name: '',
        level: '',
        section: '',
        academicYear: `${currentYear}-${nextYear}`,
        capacity: 30,
        classTeacherId: '',
      })
    }
  }, [classroom, open, reset])

  const createMutation = useMutation({
    mutationFn: (data: CreateClassRoomRequest) => classroomService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
      toast.success('Classroom created successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create classroom'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassRoomRequest }) =>
      classroomService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
      toast.success('Classroom updated successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update classroom'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const onSubmit = async (data: ClassRoomFormData) => {
    if (isEdit && classroom) {
      const updateData: UpdateClassRoomRequest = {
        name: data.name,
        level: data.level,
        section: data.section,
        academicYear: data.academicYear,
        capacity: data.capacity,
        classTeacherId: data.classTeacherId || undefined,
      }
      updateMutation.mutate({ id: classroom.id, data: updateData })
    } else {
      const createData: CreateClassRoomRequest = {
        name: data.name,
        level: data.level || '',
        section: data.section || '',
        academicYear: data.academicYear,
        capacity: data.capacity,
        classTeacherId: data.classTeacherId || undefined,
      }
      createMutation.mutate(createData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black dark:text-white">
            <GraduationCap className="h-5 w-5" />
            {isEdit ? 'Edit Classroom' : 'Create New Classroom'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update classroom information' : 'Add a new classroom to the system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfoSection
            register={register}
            errors={errors}
            isEdit={isEdit}
          />

          <TeacherSection
            setValue={setValue}
            watch={watch}
            teachers={teachersData?.content || []}
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>Processing...</>
              ) : (
                <>{isEdit ? 'Update Classroom' : 'Create Classroom'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
