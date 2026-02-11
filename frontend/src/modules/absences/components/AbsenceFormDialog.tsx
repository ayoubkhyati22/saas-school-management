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
import { absenceService, type CreateAbsenceRequest, type UpdateAbsenceRequest, type Absence } from '../api/absence.service'
import { studentService } from '@/modules/students/api/student.service'
import { courseService } from '@/modules/courses/api/course.service'
import AbsenceBasicInfoSection from './AbsenceBasicInfoSection'

const absenceSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  courseId: z.string().min(1, 'Course is required'),
  date: z.string().min(1, 'Date is required'),
  reason: z.string().max(1000).optional(),
})

type AbsenceFormData = z.infer<typeof absenceSchema>

interface AbsenceFormDialogProps {
  open: boolean
  onClose: () => void
  absence?: Absence | null
}

export default function AbsenceFormDialog({ open, onClose, absence }: AbsenceFormDialogProps) {
  const isEdit = !!absence
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AbsenceFormData>({
    resolver: zodResolver(absenceSchema),
  })

  const { data: studentsData } = useQuery({
    queryKey: ['students-all'],
    queryFn: () => studentService.getAll(0, 100),
  })

  const { data: coursesData } = useQuery({
    queryKey: ['courses-all'],
    queryFn: () => courseService.getAll(0, 100),
  })

  useEffect(() => {
    if (absence && open) {
      reset({
        studentId: absence.studentId || '',
        courseId: absence.courseId || '',
        date: absence.date || '',
        reason: absence.reason || '',
      })
    } else if (!absence && open) {
      reset({
        studentId: '',
        courseId: '',
        date: new Date().toISOString().split('T')[0],
        reason: '',
      })
    }
  }, [absence, open, reset])

  const createMutation = useMutation({
    mutationFn: (data: CreateAbsenceRequest) => absenceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] })
      toast.success('Absence marked successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to mark absence'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAbsenceRequest }) =>
      absenceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] })
      toast.success('Absence updated successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update absence'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const onSubmit = async (data: AbsenceFormData) => {
    if (isEdit && absence) {
      const updateData: UpdateAbsenceRequest = {
        date: data.date,
        reason: data.reason || undefined,
      }
      updateMutation.mutate({ id: absence.id, data: updateData })
    } else {
      const createData: CreateAbsenceRequest = {
        studentId: data.studentId,
        courseId: data.courseId,
        date: data.date,
        reason: data.reason || undefined,
      }
      createMutation.mutate(createData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black dark:text-white">
            <Calendar className="h-5 w-5" />
            {isEdit ? 'Edit Absence' : 'Mark Student Absence'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update absence information' : 'Record a student absence'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AbsenceBasicInfoSection
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            isEdit={isEdit}
            students={studentsData?.content || []}
            courses={coursesData?.content || []}
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
                <>{isEdit ? 'Update Absence' : 'Mark Absence'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
