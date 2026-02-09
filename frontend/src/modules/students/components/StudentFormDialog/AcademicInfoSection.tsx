import { School, Hash, Calendar, UserCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface AcademicInfoSectionProps {
  register: UseFormRegister<any>
  errors: any
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  isEdit: boolean
  classrooms: any[]
}

export default function AcademicInfoSection({ register, errors, setValue, watch, isEdit, classrooms }: AcademicInfoSectionProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
        <School className="h-4 w-4" />
        Academic Information
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="registrationNumber" className="flex items-center gap-2">
            <Hash className="h-3.5 w-3.5 text-muted-foreground" />
            Registration Number *
          </Label>
          <Input
            id="registrationNumber"
            {...register('registrationNumber')}
            disabled={isEdit}
            placeholder="STU-2024-001"
            className="bg-white dark:bg-gray-900"
          />
          {errors.registrationNumber && (
            <p className="text-sm text-red-600 font-medium">{errors.registrationNumber.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="enrollmentDate" className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            Enrollment Date *
          </Label>
          <Input
            id="enrollmentDate"
            type="date"
            {...register('enrollmentDate')}
            disabled={isEdit}
            className="bg-white dark:bg-gray-900"
          />
          {errors.enrollmentDate && (
            <p className="text-sm text-red-600 font-medium">{errors.enrollmentDate.message as string}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="classRoomId" className="flex items-center gap-2">
            <School className="h-3.5 w-3.5 text-muted-foreground" />
            Classroom (Optional)
          </Label>
          <Select
            onValueChange={(value) => setValue('classRoomId', value === 'none' ? '' : value)}
            value={watch('classRoomId') || 'none'}
          >
            <SelectTrigger className="bg-white dark:bg-gray-900">
              <SelectValue placeholder="Select classroom" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Classroom</SelectItem>
              {classrooms?.map((classroom: any) => (
                <SelectItem key={classroom.id} value={classroom.id}>
                  {classroom.name} - {classroom.level} {classroom.section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isEdit && (
          <div className="space-y-2">
            <Label htmlFor="status" className="flex items-center gap-2">
              <UserCircle className="h-3.5 w-3.5 text-muted-foreground" />
              Status
            </Label>
            <Select
              onValueChange={(value) => setValue('status', value as any)}
              value={watch('status')}
            >
              <SelectTrigger className="bg-white dark:bg-gray-900">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="GRADUATED">Graduated</SelectItem>
                <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  )
}