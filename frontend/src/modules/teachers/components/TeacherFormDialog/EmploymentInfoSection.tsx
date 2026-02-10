import { Briefcase, Hash, Calendar, DollarSign, UserCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface EmploymentInfoSectionProps {
  register: UseFormRegister<any>
  errors: any
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  isEdit: boolean
  specialities: any[]
}

export default function EmploymentInfoSection({ register, errors, setValue, watch, isEdit, specialities }: EmploymentInfoSectionProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
        <Briefcase className="h-4 w-4" />
        Employment Information
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employeeNumber" className="flex items-center gap-2">
            <Hash className="h-3.5 w-3.5 text-muted-foreground" />
            Employee Number *
          </Label>
          <Input
            id="employeeNumber"
            {...register('employeeNumber')}
            disabled={isEdit}
            placeholder="EMP-2024-001"
            className="bg-white dark:bg-gray-900"
          />
          {errors.employeeNumber && (
            <p className="text-sm text-red-600 font-medium">{errors.employeeNumber.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="hireDate" className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            Hire Date *
          </Label>
          <Input
            id="hireDate"
            type="date"
            {...register('hireDate')}
            disabled={isEdit}
            className="bg-white dark:bg-gray-900"
          />
          {errors.hireDate && (
            <p className="text-sm text-red-600 font-medium">{errors.hireDate.message as string}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="specialityId" className="flex items-center gap-2">
            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
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

        <div className="space-y-2">
          <Label htmlFor="salary" className="flex items-center gap-2">
            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
            Salary *
          </Label>
          <Input
            id="salary"
            type="number"
            step="0.01"
            {...register('salary', { valueAsNumber: true })}
            placeholder="50000.00"
            className="bg-white dark:bg-gray-900"
          />
          {errors.salary && (
            <p className="text-sm text-red-600 font-medium">{errors.salary.message as string}</p>
          )}
        </div>
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
            <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
              <SelectItem 
                value="ACTIVE"
                className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
              >
                Active
              </SelectItem>
              <SelectItem 
                value="INACTIVE"
                className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
              >
                Inactive
              </SelectItem>
              <SelectItem 
                value="ON_LEAVE"
                className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
              >
                On Leave
              </SelectItem>
              <SelectItem 
                value="TERMINATED"
                className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
              >
                Terminated
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
