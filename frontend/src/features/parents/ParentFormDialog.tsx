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
import { parentService } from '@/api/parent.service'
import { queryClient } from '@/lib/queryClient'
import type { Parent } from '@/types'

const parentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  occupation: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
})

type ParentFormData = z.infer<typeof parentSchema>

interface ParentFormDialogProps {
  open: boolean
  onClose: () => void
  parent?: Parent | null
}

export default function ParentFormDialog({ open, onClose, parent }: ParentFormDialogProps) {
  const isEdit = !!parent

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
  })

  useEffect(() => {
    if (parent) {
      reset({
        userId: parent.user.id,
        occupation: parent.occupation || '',
        address: parent.address || '',
        emergencyContact: parent.emergencyContact || '',
      })
    } else {
      reset({
        userId: '',
        occupation: '',
        address: '',
        emergencyContact: '',
      })
    }
  }, [parent, reset])

  const createMutation = useMutation({
    mutationFn: parentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] })
      toast.success('Parent created successfully')
      onClose()
      reset()
    },
    onError: () => {
      toast.error('Failed to create parent')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ParentFormData> }) =>
      parentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] })
      toast.success('Parent updated successfully')
      onClose()
      reset()
    },
    onError: () => {
      toast.error('Failed to update parent')
    },
  })

  const onSubmit = (data: ParentFormData) => {
    if (isEdit && parent) {
      updateMutation.mutate({ id: parent.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Parent' : 'Create New Parent'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update parent information' : 'Add a new parent/guardian to the system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input id="userId" {...register('userId')} />
            {errors.userId && (
              <p className="text-sm text-destructive">{errors.userId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation (Optional)</Label>
            <Input id="occupation" {...register('occupation')} />
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
