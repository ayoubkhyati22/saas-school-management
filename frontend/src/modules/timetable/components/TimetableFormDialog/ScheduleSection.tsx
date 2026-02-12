import { Calendar, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface ScheduleSectionProps {
  register: UseFormRegister<any>
  errors: any
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  isEdit: boolean
}

const daysOfWeek = [
  { value: 'MONDAY', label: 'Monday', color: 'text-blue-600' },
  { value: 'TUESDAY', label: 'Tuesday', color: 'text-green-600' },
  { value: 'WEDNESDAY', label: 'Wednesday', color: 'text-yellow-600' },
  { value: 'THURSDAY', label: 'Thursday', color: 'text-purple-600' },
  { value: 'FRIDAY', label: 'Friday', color: 'text-pink-600' },
  { value: 'SATURDAY', label: 'Saturday', color: 'text-orange-600' },
  { value: 'SUNDAY', label: 'Sunday', color: 'text-red-600' },
]

export default function ScheduleSection({ register, errors, setValue, watch, isEdit }: ScheduleSectionProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
        <Calendar className="h-4 w-4" />
        Schedule Information
      </h3>

      <div className="space-y-2">
        <Label htmlFor="dayOfWeek" className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          Day of Week *
        </Label>
        <Select
          onValueChange={(value) => setValue('dayOfWeek', value)}
          value={watch('dayOfWeek')}
        >
          <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
            {daysOfWeek.map((day) => (
              <SelectItem 
                key={day.value} 
                value={day.value}
                className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
              >
                <span className={day.color}>{day.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.dayOfWeek && (
          <p className="text-sm text-red-600 font-medium">{errors.dayOfWeek.message as string}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime" className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            Start Time *
          </Label>
          <Input
            id="startTime"
            type="time"
            {...register('startTime')}
            className="bg-white dark:bg-gray-900"
          />
          {errors.startTime && (
            <p className="text-sm text-red-600 font-medium">{errors.startTime.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime" className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            End Time *
          </Label>
          <Input
            id="endTime"
            type="time"
            {...register('endTime')}
            className="bg-white dark:bg-gray-900"
          />
          {errors.endTime && (
            <p className="text-sm text-red-600 font-medium">{errors.endTime.message as string}</p>
          )}
        </div>
      </div>
    </div>
  )
}
