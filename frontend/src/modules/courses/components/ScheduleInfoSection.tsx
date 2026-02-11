import { Clock, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface ScheduleInfoSectionProps {
  register: UseFormRegister<any>
  errors: any
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
}

export default function ScheduleInfoSection({ register, errors, setValue, watch }: ScheduleInfoSectionProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
        <Clock className="h-4 w-4" />
        Schedule Information
      </h3>

      <div className="space-y-2">
        <Label htmlFor="schedule" className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          Schedule (Optional)
        </Label>
        <Textarea
          id="schedule"
          {...register('schedule')}
          rows={3}
          placeholder="e.g., Mon, Wed, Fri 10:00-11:00"
          className="bg-white dark:bg-gray-900"
        />
        {errors.schedule && (
          <p className="text-sm text-red-600 font-medium">{errors.schedule.message as string}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Enter the class schedule (days and times)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="semester" className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          Semester (Optional)
        </Label>
        <Input
          id="semester"
          {...register('semester')}
          placeholder="e.g., Fall 2024, Spring 2025"
          className="bg-white dark:bg-gray-900"
        />
        {errors.semester && (
          <p className="text-sm text-red-600 font-medium">{errors.semester.message as string}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Enter the semester or academic period
        </p>
      </div>
    </div>
  )
}
