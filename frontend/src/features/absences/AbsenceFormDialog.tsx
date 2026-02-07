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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { absenceService } from '@/api/absence.service'
import { queryClient } from '@/lib/queryClient'

const absenceSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  courseId: z.string().min(1, 'Course is required'),
  date: z.string().min(1, 'Date is required'),
  reason: z.string().optional(),
  justified: z.boolean(),
})

type AbsenceFormData = z.infer<typeof absenceSchema>

interface AbsenceFormDialogProps {
  open: boolean
  onClose: () => void
}

export default function AbsenceFormDialog({ open, onClose }: AbsenceFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AbsenceFormData>({
    resolver: zodResolver(absenceSchema),
    defaultValues: {
      studentId: '',
      courseId: '',
      date: new Date().toISOString().split('T')[0],
      reason: '',
      justified: false,
    },
  })

  const createMutation = useMutation({
    mutationFn: absenceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] })
      toast.success('Absence recorded successfully')
      onClose()
      reset()
    },
    onError: () => {
      toast.error('Failed to record absence')
    },
  })

  const onSubmit = (data: AbsenceFormData) => {
    createMutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Absence</DialogTitle>
          <DialogDescription>
            Record a student absence for a course
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input id="studentId" {...register('studentId')} />
            {errors.studentId && (
              <p className="text-sm text-destructive">{errors.studentId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseId">Course ID</Label>
            <Input id="courseId" {...register('courseId')} />
            {errors.courseId && (
              <p className="text-sm text-destructive">{errors.courseId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" {...register('date')} />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="justified">Status</Label>
            <Select
              onValueChange={(value) => setValue('justified', value === 'true')}
              defaultValue="false"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Unjustified</SelectItem>
                <SelectItem value="true">Justified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea id="reason" {...register('reason')} rows={3} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
