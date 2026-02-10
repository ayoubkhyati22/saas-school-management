import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UserCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { teacherService, type CreateTeacherRequest, type UpdateTeacherRequest, type Teacher } from '../../api/teacher.service'
import { specialityService } from '../../api/speciality.service'
import PersonalInfoSection from './PersonalInfoSection'
import EmploymentInfoSection from './EmploymentInfoSection'
import AdditionalInfoSection from './AdditionalInfoSection'

const teacherSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  specialityId: z.string().optional(),
  employeeNumber: z.string().min(1, 'Employee number is required').max(50),
  hireDate: z.string().min(1, 'Hire date is required'),
  salary: z.number().positive('Salary must be positive'),
  avatarUrl: z.string().optional(),
  administrativeDocuments: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED']).optional(),
})

type TeacherFormData = z.infer<typeof teacherSchema>

interface TeacherFormDialogProps {
  open: boolean
  onClose: () => void
  teacher?: Teacher | null
}

export default function TeacherFormDialog({ open, onClose, teacher }: TeacherFormDialogProps) {
  const isEdit = !!teacher
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
  })

  const { data: specialitiesData } = useQuery({
    queryKey: ['specialities-active'],
    queryFn: () => specialityService.getAllActive(),
  })

  useEffect(() => {
    if (teacher && open) {
      reset({
        firstName: teacher.firstName || '',
        lastName: teacher.lastName || '',
        email: teacher.email || '',
        phoneNumber: teacher.phoneNumber || '',
        specialityId: teacher.specialityId || '',
        employeeNumber: teacher.employeeNumber || '',
        hireDate: teacher.hireDate || '',
        salary: teacher.salary || 0,
        avatarUrl: teacher.avatarUrl || '',
        administrativeDocuments: teacher.administrativeDocuments || '',
        status: teacher.status as any,
      })
      setAvatarFile(null)
    } else if (!teacher && open) {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        specialityId: '',
        employeeNumber: '',
        hireDate: new Date().toISOString().split('T')[0],
        salary: 0,
        avatarUrl: '',
        administrativeDocuments: '',
        status: 'ACTIVE',
      })
      setAvatarFile(null)
    }
  }, [teacher, open, reset])

  const createMutation = useMutation({
    mutationFn: (data: CreateTeacherRequest) => teacherService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      queryClient.invalidateQueries({ queryKey: ['teacher-statistics'] })
      toast.success('Teacher created successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create teacher'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeacherRequest }) =>
      teacherService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      queryClient.invalidateQueries({ queryKey: ['teacher-statistics'] })
      toast.success('Teacher updated successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update teacher'
      toast.error(errorMessage)
    },
  })

  const onSubmit = async (data: TeacherFormData) => {
    if (isEdit && teacher) {
      const updateData: UpdateTeacherRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        specialityId: data.specialityId || undefined,
        salary: data.salary,
        avatarUrl: data.avatarUrl,
        administrativeDocuments: data.administrativeDocuments,
        status: data.status,
      }
      updateMutation.mutate({ id: teacher.id, data: updateData })
    } else {
      const createData: CreateTeacherRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        specialityId: data.specialityId || undefined,
        employeeNumber: data.employeeNumber,
        hireDate: data.hireDate,
        salary: data.salary,
        avatarUrl: data.avatarUrl,
        administrativeDocuments: data.administrativeDocuments,
      }
      createMutation.mutate(createData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[950px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black dark:text-white">
            <UserCircle className="h-5 w-5" />
            {isEdit ? 'Edit Teacher' : 'Create New Teacher'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update teacher information' : 'Add a new teacher to the system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <PersonalInfoSection register={register} errors={errors} isEdit={isEdit} />
              <AdditionalInfoSection
                register={register}
                errors={errors}
                currentAvatarUrl={teacher?.avatarUrl}
                onAvatarChange={setAvatarFile}
              />
            </div>
            <div className="space-y-6">
              <EmploymentInfoSection
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                isEdit={isEdit}
                specialities={specialitiesData || []}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 hover:bg-gray-100 text-gray-700">
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
              {createMutation.isPending || updateMutation.isPending ? <>Processing...</> : <>{isEdit ? 'Update Teacher' : 'Create Teacher'}</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
