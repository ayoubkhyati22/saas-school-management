// frontend/src/features/students/StudentFormDialog.tsx
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
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
import { studentService, type CreateStudentRequest, type UpdateStudentRequest } from '@/api/student.service'
import { classroomService } from '@/api/classroom.service'
import { queryClient } from '@/lib/queryClient'
import type { Student } from '@/types'
import { User, Mail, Phone, Calendar, Hash, School, MapPin, Image, UserCircle } from 'lucide-react'

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

  // Fetch classrooms for dropdown
  const { data: classroomsData } = useQuery({
    queryKey: ['classrooms-all'],
    queryFn: () => classroomService.getAll(0, 100),
  })

  useEffect(() => {
    if (student && open) {
      console.log('Loading student data for edit:', student)
      
      // Map the student data to form fields
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
      // Reset form for new student
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
      console.error('Create student error:', error)
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
      console.error('Update student error:', error)
    },
  })

  const onSubmit = (data: StudentFormData) => {
    console.log('Form submitted:', data)
    
    if (isEdit && student) {
      // For update, only send changed fields
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
      console.log('Updating student with data:', updateData)
      updateMutation.mutate({ id: student.id, data: updateData })
    } else {
      // For create, send all required fields
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
      console.log('Creating student with data:', createData)
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
          {/* Personal Information */}
          <div className="space-y-4 p-4 rounded-lg border border-border/50 bg-muted/20">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
              <User className="h-4 w-4" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  First Name *
                </Label>
                <Input id="firstName" {...register('firstName')} className="bg-background" />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Last Name *
                </Label>
                <Input id="lastName" {...register('lastName')} className="bg-background" />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Email *
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  {...register('email')} 
                  disabled={isEdit}
                  className="bg-background"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  Phone Number *
                </Label>
                <Input 
                  id="phoneNumber" 
                  {...register('phoneNumber')} 
                  placeholder="+1234567890"
                  className="bg-background"
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Birth Date *
                </Label>
                <Input 
                  id="birthDate" 
                  type="date" 
                  {...register('birthDate')}
                  className="bg-background"
                />
                {errors.birthDate && (
                  <p className="text-sm text-destructive">{errors.birthDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Gender *
                </Label>
                <Select
                  onValueChange={(value) => setValue('gender', value as any)}
                  value={watch('gender')}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-destructive">{errors.gender.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4 p-4 rounded-lg border border-border/50 bg-muted/20">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
              <School className="h-4 w-4" />
              Academic Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registrationNumber" className="flex items-center gap-2">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  Registration Number *
                </Label>
                <Input 
                  id="registrationNumber" 
                  {...register('registrationNumber')} 
                  disabled={isEdit}
                  placeholder="STU-2024-001"
                  className="bg-background"
                />
                {errors.registrationNumber && (
                  <p className="text-sm text-destructive">{errors.registrationNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="enrollmentDate" className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Enrollment Date *
                </Label>
                <Input 
                  id="enrollmentDate" 
                  type="date" 
                  {...register('enrollmentDate')} 
                  disabled={isEdit}
                  className="bg-background"
                />
                {errors.enrollmentDate && (
                  <p className="text-sm text-destructive">{errors.enrollmentDate.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="classRoomId" className="flex items-center gap-2">
                  <School className="h-3.5 w-3.5 text-muted-foreground" />
                  Classroom (Optional)
                </Label>
                <Select
                  onValueChange={(value) => setValue('classRoomId', value === 'none' ? '' : value)}
                  value={watch('classRoomId') || 'none'}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select classroom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Classroom</SelectItem>
                    {classroomsData?.content.map((classroom: any) => (
                      <SelectItem key={classroom.id} value={classroom.id}>
                        {classroom.name} - {classroom.level} {classroom.section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center gap-2">
                    <UserCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    Status
                  </Label>
                  <Select
                    onValueChange={(value) => setValue('status', value as any)}
                    value={watch('status')}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="GRADUATED">Graduated</SelectItem>
                      <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4 p-4 rounded-lg border border-border/50 bg-muted/20">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
              <MapPin className="h-4 w-4" />
              Additional Information
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Address (Optional)
              </Label>
              <Textarea 
                id="address" 
                {...register('address')} 
                rows={2}
                className="bg-background"
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl" className="flex items-center gap-2">
                <Image className="h-3.5 w-3.5 text-muted-foreground" />
                Avatar URL (Optional)
              </Label>
              <Input 
                id="avatarUrl" 
                {...register('avatarUrl')} 
                placeholder="https://..."
                className="bg-background"
              />
            </div>
          </div>

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