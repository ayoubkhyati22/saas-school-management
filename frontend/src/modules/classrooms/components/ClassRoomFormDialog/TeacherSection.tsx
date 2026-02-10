import { User } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface TeacherSectionProps {
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  teachers: any[]
}

export default function TeacherSection({ setValue, watch, teachers }: TeacherSectionProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
        <User className="h-4 w-4" />
        Class Teacher
      </h3>

      <div className="space-y-2">
        <Label htmlFor="classTeacherId" className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          Assign Teacher (Optional)
        </Label>
        <Select
          onValueChange={(value) => setValue('classTeacherId', value === 'none' ? '' : value)}
          value={watch('classTeacherId') || 'none'}
        >
          <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
            <SelectValue placeholder="Select a teacher" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
            <SelectItem 
              value="none" 
              className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
            >
              No Teacher Assigned
            </SelectItem>
            {teachers?.map((teacher: any) => (
              <SelectItem 
                key={teacher.id} 
                value={teacher.id}
                className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
              >
                {teacher.firstName} {teacher.lastName} - {teacher.speciality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          The class teacher will be responsible for this classroom
        </p>
      </div>
    </div>
  )
}
