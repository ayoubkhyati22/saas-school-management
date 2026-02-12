import { MapPin, Calendar, FileText, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface AdditionalInfoSectionProps {
  register: UseFormRegister<any>
  errors: any
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  isEdit: boolean
}

export default function AdditionalInfoSection({ 
  register, 
  errors, 
  setValue, 
  watch, 
  isEdit 
}: AdditionalInfoSectionProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
        <FileText className="h-4 w-4" />
        Additional Information
      </h3>

      <div className="space-y-2">
        <Label htmlFor="roomNumber" className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          Room Number (Optional)
        </Label>
        <Input
          id="roomNumber"
          {...register('roomNumber')}
          placeholder="e.g., A101, Lab 3"
          className="bg-white dark:bg-gray-900"
        />
        {errors.roomNumber && (
          <p className="text-sm text-red-600 font-medium">{errors.roomNumber.message as string}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="academicYear" className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            Academic Year *
          </Label>
          <Input
            id="academicYear"
            {...register('academicYear')}
            placeholder="2024-2025"
            className="bg-white dark:bg-gray-900"
          />
          {errors.academicYear && (
            <p className="text-sm text-red-600 font-medium">{errors.academicYear.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="semester" className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            Semester (Optional)
          </Label>
          <Input
            id="semester"
            {...register('semester')}
            placeholder="Fall 2024"
            className="bg-white dark:bg-gray-900"
          />
          {errors.semester && (
            <p className="text-sm text-red-600 font-medium">{errors.semester.message as string}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          {...register('notes')}
          rows={3}
          placeholder="Additional notes about this timetable entry..."
          className="bg-white dark:bg-gray-900"
        />
        {errors.notes && (
          <p className="text-sm text-red-600 font-medium">{errors.notes.message as string}</p>
        )}
      </div>

      {isEdit && (
        <div className="flex items-center justify-between p-3 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="active" className="cursor-pointer">
              Active Status
            </Label>
          </div>
          <Switch
            id="active"
            checked={watch('active')}
            onCheckedChange={(checked) => setValue('active', checked)}
          />
        </div>
      )}
    </div>
  )
}
