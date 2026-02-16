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
import { schoolService } from '@/api/school.service'
import { queryClient } from '@/lib/queryClient'
import type { School } from '@/types'

const schoolSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  logoUrl: z.string().optional(),
})

type SchoolFormData = z.infer<typeof schoolSchema>

interface SchoolFormDialogProps {
  open: boolean
  onClose: () => void
  school?: School | null
}

export default function SchoolFormDialog({ open, onClose, school }: SchoolFormDialogProps) {
  const isEdit = !!school

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
  })

  useEffect(() => {
    if (school) {
      reset({
        name: school.name,
        email: school.email,
        phone: school.phone,
        address: school.address,
        logoUrl: school.logoUrl || '',
      })
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        address: '',
        logoUrl: '',
      })
    }
  }, [school, reset])

  const createMutation = useMutation({
    mutationFn: schoolService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] })
      toast.success('School created successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: () => {
      toast.error('Failed to create school', { position: 'bottom-right' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SchoolFormData }) =>
      schoolService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] })
      toast.success('School updated successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: () => {
      toast.error('Failed to update school', { position: 'bottom-right' })
    },
  })

  const onSubmit = (data: SchoolFormData) => {
    if (isEdit && school) {
      updateMutation.mutate({ id: school.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit School' : 'Create New School'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update school information' : 'Add a new school to the platform'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">School Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register('phone')} />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register('address')} />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
            <Input id="logoUrl" {...register('logoUrl')} />
            {errors.logoUrl && (
              <p className="text-sm text-destructive">{errors.logoUrl.message}</p>
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
