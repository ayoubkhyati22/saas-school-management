import { GraduationCap, Hash, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { UseFormRegister } from 'react-hook-form'

interface BasicInfoSectionProps {
  register: UseFormRegister<any>
  errors: any
  isEdit: boolean
}

export default function BasicInfoSection({ register, errors, isEdit }: BasicInfoSectionProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
        <GraduationCap className="h-4 w-4" />
        Basic Information
      </h3>

      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
          Classroom Name *
        </Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="e.g., Class 10-A, Grade 5 Blue"
          className="bg-white dark:bg-gray-900"
        />
        {errors.name && (
          <p className="text-sm text-red-600 font-medium">{errors.name.message as string}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="level" className="flex items-center gap-2">
            <Hash className="h-3.5 w-3.5 text-muted-foreground" />
            Level
          </Label>
          <Input
            id="level"
            {...register('level')}
            placeholder="e.g., Grade 1, Level 5"
            className="bg-white dark:bg-gray-900"
          />
          {errors.level && (
            <p className="text-sm text-red-600 font-medium">{errors.level.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="section" className="flex items-center gap-2">
            <Hash className="h-3.5 w-3.5 text-muted-foreground" />
            Section
          </Label>
          <Input
            id="section"
            {...register('section')}
            placeholder="e.g., A, B, Blue"
            className="bg-white dark:bg-gray-900"
          />
          {errors.section && (
            <p className="text-sm text-red-600 font-medium">{errors.section.message as string}</p>
          )}
        </div>
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
            placeholder="e.g., 2024-2025"
            className="bg-white dark:bg-gray-900"
          />
          {errors.academicYear && (
            <p className="text-sm text-red-600 font-medium">{errors.academicYear.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity" className="flex items-center gap-2">
            <Hash className="h-3.5 w-3.5 text-muted-foreground" />
            Capacity *
          </Label>
          <Input
            id="capacity"
            type="number"
            min="1"
            {...register('capacity', { valueAsNumber: true })}
            placeholder="e.g., 30"
            className="bg-white dark:bg-gray-900"
          />
          {errors.capacity && (
            <p className="text-sm text-red-600 font-medium">{errors.capacity.message as string}</p>
          )}
        </div>
      </div>
    </div>
  )
}
