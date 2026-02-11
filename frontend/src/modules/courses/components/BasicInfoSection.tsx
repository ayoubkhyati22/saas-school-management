import { BookOpen, Hash, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface BasicInfoSectionProps {
  register: UseFormRegister<any>
  errors: any
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
}

export default function BasicInfoSection({ register, errors, setValue, watch }: BasicInfoSectionProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
        <BookOpen className="h-4 w-4" />
        Basic Information
      </h3>

      <div className="space-y-2">
        <Label htmlFor="subject" className="flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
          Subject Name *
        </Label>
        <Input
          id="subject"
          {...register('subject')}
          placeholder="e.g., Mathematics, Physics, English"
          className="bg-white dark:bg-gray-900"
        />
        {errors.subject && (
          <p className="text-sm text-red-600 font-medium">{errors.subject.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subjectCode" className="flex items-center gap-2">
          <Hash className="h-3.5 w-3.5 text-muted-foreground" />
          Subject Code (Optional)
        </Label>
        <Input
          id="subjectCode"
          {...register('subjectCode')}
          placeholder="e.g., MATH101, PHYS201"
          className="bg-white dark:bg-gray-900"
        />
        {errors.subjectCode && (
          <p className="text-sm text-red-600 font-medium">{errors.subjectCode.message as string}</p>
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
          placeholder="Course description and objectives..."
          className="bg-white dark:bg-gray-900"
        />
        {errors.description && (
          <p className="text-sm text-red-600 font-medium">{errors.description.message as string}</p>
        )}
      </div>
    </div>
  )
}
