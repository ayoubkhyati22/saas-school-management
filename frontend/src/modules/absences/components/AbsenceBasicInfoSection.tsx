import { User, BookOpen, Calendar, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface AbsenceBasicInfoSectionProps {
  register: UseFormRegister<any>
  errors: any
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  isEdit: boolean
  students: any[]
  courses: any[]
}

export default function AbsenceBasicInfoSection({ 
  register, 
  errors, 
  setValue, 
  watch, 
  isEdit,
  students,
  courses 
}: AbsenceBasicInfoSectionProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
        <Calendar className="h-4 w-4" />
        Absence Information
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="studentId" className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Student *
          </Label>
          <Select
            onValueChange={(value) => setValue('studentId', value)}
            value={watch('studentId') || ''}
            disabled={isEdit}
          >
            <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 max-h-[300px]">
              {students?.map((student: any) => (
                <SelectItem 
                  key={student.id} 
                  value={student.id}
                  className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
                >
                  {student.firstName} {student.lastName}
                  <span className="text-xs text-muted-foreground ml-2">
                    ({student.registrationNumber})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.studentId && (
            <p className="text-sm text-red-600 font-medium">{errors.studentId.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="courseId" className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            Course *
          </Label>
          <Select
            onValueChange={(value) => setValue('courseId', value)}
            value={watch('courseId') || ''}
            disabled={isEdit}
          >
            <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 max-h-[300px]">
              {courses?.map((course: any) => (
                <SelectItem 
                  key={course.id} 
                  value={course.id}
                  className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
                >
                  {course.subject}
                  {course.subjectCode && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({course.subjectCode})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.courseId && (
            <p className="text-sm text-red-600 font-medium">{errors.courseId.message as string}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          Absence Date *
        </Label>
        <Input
          id="date"
          type="date"
          {...register('date')}
          max={new Date().toISOString().split('T')[0]}
          className="bg-white dark:bg-gray-900"
        />
        {errors.date && (
          <p className="text-sm text-red-600 font-medium">{errors.date.message as string}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Date cannot be in the future
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason" className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          Reason (Optional)
        </Label>
        <Textarea
          id="reason"
          {...register('reason')}
          rows={3}
          placeholder="Enter the reason for absence..."
          className="bg-white dark:bg-gray-900"
        />
        {errors.reason && (
          <p className="text-sm text-red-600 font-medium">{errors.reason.message as string}</p>
        )}
      </div>
    </div>
  )
}
