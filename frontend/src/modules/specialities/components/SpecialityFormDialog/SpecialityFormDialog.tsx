import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { BookOpen, Code, FileText, Power } from 'lucide-react'
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
import { specialityService, type CreateSpecialityRequest, type UpdateSpecialityRequest, type Speciality } from '../../api/speciality.service'

const specialitySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  code: z.string().min(1, 'Code is required').max(20),
  description: z.string().max(1000).optional(),
  active: z.boolean().optional(),
})

type SpecialityFormData = z.infer<typeof specialitySchema>

interface SpecialityFormDialogProps {
  open: boolean
  onClose: () => void
  speciality?: Speciality | null
}

export default function SpecialityFormDialog({ open, onClose, speciality }: SpecialityFormDialogProps) {
  const isEdit = !!speciality
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SpecialityFormData>({
    resolver: zodResolver(specialitySchema),
  })

  useEffect(() => {
    if (speciality && open) {
      reset({
        name: speciality.name || '',
        code: speciality.code || '',
        description: speciality.description || '',
        active: speciality.active ?? true,
      })
    } else if (!speciality && open) {
      reset({
        name: '',
        code: '',
        description: '',
        active: true,
      })
    }
  }, [speciality, open, reset])

  const createMutation = useMutation({
    mutationFn: (data: CreateSpecialityRequest) => specialityService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialities'] })
      toast.success('Speciality created successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create speciality'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSpecialityRequest }) =>
      specialityService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialities'] })
      toast.success('Speciality updated successfully', { position: 'bottom-right' })
      onClose()
      reset()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update speciality'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const onSubmit = async (data: SpecialityFormData) => {
    if (isEdit && speciality) {
      const updateData: UpdateSpecialityRequest = {
        name: data.name,
        code: data.code,
        description: data.description,
        active: data.active,
      }
      updateMutation.mutate({ id: speciality.id, data: updateData })
    } else {
      const createData: CreateSpecialityRequest = {
        name: data.name,
        code: data.code,
        description: data.description,
      }
      createMutation.mutate(createData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black dark:text-white">
            <BookOpen className="h-5 w-5" />
            {isEdit ? 'Edit Speciality' : 'Create New Speciality'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update speciality information' : 'Add a new speciality to the system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
              <BookOpen className="h-4 w-4" />
              Basic Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                Speciality Name *
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., Mathematics, Physics, Computer Science"
                className="bg-white dark:bg-gray-900"
              />
              {errors.name && (
                <p className="text-sm text-red-600 font-medium">{errors.name.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code" className="flex items-center gap-2">
                <Code className="h-3.5 w-3.5 text-muted-foreground" />
                Speciality Code *
              </Label>
              <Input
                id="code"
                {...register('code')}
                placeholder="e.g., MATH, PHY, CS"
                className="bg-white dark:bg-gray-900 font-mono"
                disabled={isEdit}
              />
              {errors.code && (
                <p className="text-sm text-red-600 font-medium">{errors.code.message as string}</p>
              )}
              {isEdit && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Code cannot be changed after creation
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
              <FileText className="h-4 w-4" />
              Description
            </h3>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                rows={4}
                placeholder="Enter a brief description of this speciality..."
                className="bg-white dark:bg-gray-900"
              />
              {errors.description && (
                <p className="text-sm text-red-600 font-medium">{errors.description.message as string}</p>
              )}
            </div>
          </div>

          {/* Status (only for edit) */}
          {isEdit && (
            <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
                <Power className="h-4 w-4" />
                Status
              </h3>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  {...register('active')}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="active" className="cursor-pointer">
                  Active (available for assignment)
                </Label>
              </div>
            </div>
          )}

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
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>Processing...</>
              ) : (
                <>{isEdit ? 'Update Speciality' : 'Create Speciality'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
