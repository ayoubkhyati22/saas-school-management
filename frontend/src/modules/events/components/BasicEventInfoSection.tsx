import { Calendar, FileText, Tag, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { EVENT_TYPE_LABELS, TARGET_ROLE_LABELS } from '../api/event.service'

interface BasicEventInfoSectionProps {
  register: UseFormRegister<any>
  errors: any
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
}

export default function BasicEventInfoSection({ register, errors, setValue, watch }: BasicEventInfoSectionProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
        <Calendar className="h-4 w-4" />
        Basic Information
      </h3>

      <div className="space-y-2">
        <Label htmlFor="title" className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          Event Title *
        </Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="e.g., Annual Sports Day, Parent-Teacher Meeting"
          className="bg-white dark:bg-gray-900"
        />
        {errors.title && (
          <p className="text-sm text-red-600 font-medium">{errors.title.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          Description (Optional)
        </Label>
        <Textarea
          id="description"
          {...register('description')}
          rows={4}
          placeholder="Event description and details..."
          className="bg-white dark:bg-gray-900"
        />
        {errors.description && (
          <p className="text-sm text-red-600 font-medium">{errors.description.message as string}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eventType" className="flex items-center gap-2">
            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
            Event Type *
          </Label>
          <Select
            onValueChange={(value) => setValue('eventType', value)}
            value={watch('eventType') || 'OTHER'}
          >
            <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
              {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                <SelectItem 
                  key={value} 
                  value={value}
                  className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.eventType && (
            <p className="text-sm text-red-600 font-medium">{errors.eventType.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetRole" className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            Target Audience *
          </Label>
          <Select
            onValueChange={(value) => setValue('targetRole', value)}
            value={watch('targetRole') || 'ALL'}
          >
            <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select target audience" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
              {Object.entries(TARGET_ROLE_LABELS).map(([value, label]) => (
                <SelectItem 
                  key={value} 
                  value={value}
                  className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.targetRole && (
            <p className="text-sm text-red-600 font-medium">{errors.targetRole.message as string}</p>
          )}
        </div>
      </div>
    </div>
  )
}
