import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Users } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { parentService, type CreateParentRequest, type UpdateParentRequest, type Parent } from '../../api/parent.service'
import PersonalInfoSection from './PersonalInfoSection'
import AdditionalInfoSection from './AdditionalInfoSection'

const parentSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  occupation: z.string().max(100).optional(),
  address: z.string().max(500).optional(),
})

type ParentFormData = z.infer<typeof parentSchema>

interface ParentFormDialogProps {
  open: boolean
  onClose: () => void
  parent?: Parent | null
}

export default function ParentFormDialog({ open, onClose, parent }: ParentFormDialogProps) {
  const isEdit = !!parent
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
  })

  useEffect(() => {
    if (parent && open) {
      reset({
        firstName: parent.firstName || '',
        lastName: parent.lastName || '',
        email: parent.email || '',
        phoneNumber: parent.phoneNumber || '',
        occupation: parent.occupation || '',
        address: parent.address || '',
      })
    } else if (!parent && open) {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        occupation: '',
        address: '',
      })
    }
  }, [parent, open, reset])

  const createMutation = useMutation({
    mutationFn: (data: CreateParentRequest) => parentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] })
      toast.success('Parent created successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create parent'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateParentRequest }) =>
      parentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] })
      toast.success('Parent updated successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update parent'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const onSubmit = async (data: ParentFormData) => {
    if (isEdit && parent) {
      const updateData: UpdateParentRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        occupation: data.occupation,
        address: data.address,
      }
      updateMutation.mutate({ id: parent.id, data: updateData })
    } else {
      const createData: CreateParentRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        occupation: data.occupation,
        address: data.address,
      }
      createMutation.mutate(createData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black dark:text-white">
            <Users className="h-5 w-5" />
            {isEdit ? 'Edit Parent' : 'Create New Parent'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update parent information' : 'Add a new parent to the system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoSection
            register={register}
            errors={errors}
            isEdit={isEdit}
          />

          <AdditionalInfoSection
            register={register}
            errors={errors}
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
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>Processing...</>
              ) : (
                <>{isEdit ? 'Update Parent' : 'Create Parent'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
