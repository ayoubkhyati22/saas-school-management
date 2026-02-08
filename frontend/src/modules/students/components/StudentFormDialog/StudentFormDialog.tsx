import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
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
import { studentService, type CreateStudentRequest, type UpdateStudentRequest } from '../../api/student.service'
import { classroomService } from '@/api/classroom.service'
import { queryClient } from '@/lib/queryClient'
import type { Student } from '@/types'
import PersonalInfoSection from './PersonalInfoSection'
import AcademicInfoSection from './AcademicInfoSection'
import AdditionalInfoSection from './AdditionalInfoSection'

const studentSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  classRoomId: z.string().optional(),
  registrationNumber: z.string().min(1, 'Registration number is required').max(50),
  birthDate: z.string().min(1, 'Birth date is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  enrollmentDate: z.string().min(1, 'Enrollment date is required'),
  address: z.string().max(500).optional(),
  avatarUrl: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED', 'WITHDRAWN']).optional(),
})

type StudentFormData = z.infer<typeof studentSchema>

interface StudentFormDialogProps {
  open: boolean
  onClose: () => void
  student?: Student | null
}

export default function StudentFormDialog({ open, onClose, student }: StudentFormDialogProps) {
  const isEdit = !!student

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  })

  const { data: classroomsData } = useQuery({
    queryKey: ['classrooms-all'],
    queryFn: () => classroomService.getAll(0, 100),
  })

  useEffect(() => {
    if (student && open) {
      reset({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        phoneNumber: student.phoneNumber || '',
        classRoomId: student.classRoomId || student.classRoom?.id || '',
        registrationNumber: student.registrationNumber || '',
        birthDate: student.birthDate || '',
        gender: student.gender as 'MALE' | 'FEMALE' | 'OTHER',
        enrollmentDate: student.enrollmentDate || '',
        address: student.address || '',
        avatarUrl: student.avatarUrl || '',
        status: student.status as 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'WITHDRAWN',
      })
    } else if (!student && open) {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        classRoomId: '',
        registrationNumber: '',
        birthDate: '',
        gender: 'MALE',
        enrollmentDate: new Date().toISOString().split('T')[0],
        address: '',
        avatarUrl: '',
        status: 'ACTIVE',
      })
    }
  }, [student, open, reset])

  const createMutation = useMutation({
    mutationFn: (data: CreateStudentRequest) => studentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['student-statistics'] })
      toast.success('Student created successfully')
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create student'
      toast.error(errorMessage)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentRequest }) =>
      studentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['student-statistics'] })
      toast.success('Student updated successfully')
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update student'
      toast.error(errorMessage)
    },
  })

  const onSubmit = (data: StudentFormData) => {
    if (isEdit && student) {
      const updateData: UpdateStudentRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        classRoomId: data.classRoomId || null,
        birthDate: data.birthDate,
        gender: data.gender,
        address: data.address,
        avatarUrl: data.avatarUrl,
        status: data.status,
      }
      updateMutation.mutate({ id: student.id, data: updateData })
    } else {
      const createData: CreateStudentRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        classRoomId: data.classRoomId || undefined,
        registrationNumber: data.registrationNumber,
        birthDate: data.birthDate,
        gender: data.gender,
        enrollmentDate: data.enrollmentDate,
        address: data.address,
        avatarUrl: data.avatarUrl,
      }
      createMutation.mutate(createData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            {isEdit ? 'Edit Student' : 'Create New Student'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update student information' : 'Add a new student to the system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoSection
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            isEdit={isEdit}
          />

          <AcademicInfoSection
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            isEdit={isEdit}
            classrooms={classroomsData?.content || []}
          />

          <AdditionalInfoSection
            register={register}
            errors={errors}
          />

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>Processing...</>
              ) : (
                <>{isEdit ? 'Update Student' : 'Create Student'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
