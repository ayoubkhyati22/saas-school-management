import { School, User, BookOpen, GraduationCap } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface EntitySectionProps {
  register: UseFormRegister<any>
  errors: any
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  isEdit: boolean
  classrooms: any[]
  teachers: any[]
  courses: any[]
  specialities: any[]
}

export default function EntitySection({ 
  register, 
  errors, 
  setValue, 
  watch, 
  isEdit, 
  classrooms,
  teachers,
  courses,
  specialities
}: EntitySectionProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
        <School className="h-4 w-4" />
        Entity Assignment
      </h3>

      <div className="space-y-2">
        <Label htmlFor="classRoomId" className="flex items-center gap-2">
          <School className="h-3.5 w-3.5 text-muted-foreground" />
          Classroom *
        </Label>
        <Select
          onValueChange={(value) => setValue('classRoomId', value)}
          value={watch('classRoomId')}
          disabled={isEdit}
        >
          <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
            <SelectValue placeholder="Select classroom" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
            {classrooms?.map((classroom: any) => (
              <SelectItem 
                key={classroom.id} 
                value={classroom.id}
                className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
              >
                {classroom.name} - {classroom.level} {classroom.section}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.classRoomId && (
          <p className="text-sm text-red-600 font-medium">{errors.classRoomId.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="teacherId" className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          Teacher *
        </Label>
        <Select
          onValueChange={(value) => setValue('teacherId', value)}
          value={watch('teacherId')}
        >
          <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
            <SelectValue placeholder="Select teacher" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
            {teachers?.map((teacher: any) => (
              <SelectItem 
                key={teacher.id} 
                value={teacher.id}
                className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
              >
                {teacher.firstName} {teacher.lastName} - {teacher.employeeNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.teacherId && (
          <p className="text-sm text-red-600 font-medium">{errors.teacherId.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="courseId" className="flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
          Course *
        </Label>
        <Select
          onValueChange={(value) => setValue('courseId', value)}
          value={watch('courseId')}
          disabled={isEdit}
        >
          <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
            {courses?.map((course: any) => (
              <SelectItem 
                key={course.id} 
                value={course.id}
                className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
              >
                {course.subject} {course.subjectCode ? `(${course.subjectCode})` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.courseId && (
          <p className="text-sm text-red-600 font-medium">{errors.courseId.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialityId" className="flex items-center gap-2">
          <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
          Speciality (Optional)
        </Label>
        <Select
          onValueChange={(value) => setValue('specialityId', value === 'none' ? '' : value)}
          value={watch('specialityId') || 'none'}
        >
          <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
            <SelectValue placeholder="Select speciality" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
            <SelectItem 
              value="none" 
              className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
            >
              No Speciality
            </SelectItem>
            {specialities?.map((speciality: any) => (
              <SelectItem 
                key={speciality.id} 
                value={speciality.id}
                className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
              >
                {speciality.name} ({speciality.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
