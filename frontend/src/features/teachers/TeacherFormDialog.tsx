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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { teacherService } from '@/api/teacher.service'
import { queryClient } from '@/lib/queryClient'
import type { Teacher } from '@/types'

const teacherSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  speciality: z.string().min(1, 'Speciality is required'),
  employeeNumber: z.string().min(1, 'Employee number is required'),
  hireDate: z.string().min(1, 'Hire date is required'),
  salary: z.number().min(0, 'Salary must be positive'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE']),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
})

type TeacherFormData = z.infer<typeof teacherSchema>

interface TeacherFormDialogProps {
  open: boolean
  onClose: () => void
  teacher?: Teacher | null
}

export default function TeacherFormDialog({ open, onClose, teacher }: TeacherFormDialogProps) {
  const isEdit = !!teacher

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
  })

  useEffect(() => {
    if (teacher) {
      reset({
        userId: teacher.user.id,
        speciality: teacher.speciality,
        employeeNumber: teacher.employeeNumber,
        hireDate: teacher.hireDate.split('T')[0],
        salary: teacher.salary,
        status: teacher.status as any,
        address: teacher.address || '',
        emergencyContact: teacher.emergencyContact || '',
      })
    } else {
      reset({
        userId: '',
        speciality: '',
        employeeNumber: '',
        hireDate: new Date().toISOString().split('T')[0],
        salary: 0,
        status: 'ACTIVE',
        address: '',
        emergencyContact: '',
      })
    }
  }, [teacher, reset])

  const createMutation = useMutation({
    mutationFn: teacherService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      toast.success('Teacher created successfully')
      onClose()
      reset()
    },
    onError: () => {
      toast.error('Failed to create teacher')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TeacherFormData> }) =>
      teacherService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      toast.success('Teacher updated successfully')
      onClose()
      reset()
    },
    onError: () => {
      toast.error('Failed to update teacher')
    },
  })

  const onSubmit = (data: TeacherFormData) => {
    if (isEdit && teacher) {
      updateMutation.mutate({ id: teacher.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Teacher' : 'Create New Teacher'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update teacher information' : 'Add a new teacher to the system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input id="userId" {...register('userId')} />
              {errors.userId && (
                <p className="text-sm text-destructive">{errors.userId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeNumber">Employee Number</Label>
              <Input id="employeeNumber" {...register('employeeNumber')} />
              {errors.employeeNumber && (
                <p className="text-sm text-destructive">{errors.employeeNumber.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="speciality">Speciality</Label>
              <Input id="speciality" {...register('speciality')} />
              {errors.speciality && (
                <p className="text-sm text-destructive">{errors.speciality.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date</Label>
              <Input id="hireDate" type="date" {...register('hireDate')} />
              {errors.hireDate && (
                <p className="text-sm text-destructive">{errors.hireDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input id="salary" type="number" {...register('salary', { valueAsNumber: true })} />
              {errors.salary && (
                <p className="text-sm text-destructive">{errors.salary.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => setValue('status', value as any)}
                defaultValue="ACTIVE"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input id="address" {...register('address')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact (Optional)</Label>
            <Input id="emergencyContact" {...register('emergencyContact')} />
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
