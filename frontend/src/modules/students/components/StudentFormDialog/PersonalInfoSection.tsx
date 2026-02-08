import { User, Mail, Phone, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface PersonalInfoSectionProps {
  register: UseFormRegister<any>
  errors: any
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  isEdit: boolean
}

export default function PersonalInfoSection({ register, errors, setValue, watch, isEdit }: PersonalInfoSectionProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
        <User className="h-4 w-4" />
        Personal Information
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            First Name *
          </Label>
          <Input id="firstName" {...register('firstName')} className="bg-white dark:bg-gray-900" />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Last Name *
          </Label>
          <Input id="lastName" {...register('lastName')} className="bg-white dark:bg-gray-900" />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message as string}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            disabled={isEdit}
            className="bg-white dark:bg-gray-900"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            Phone Number *
          </Label>
          <Input
            id="phoneNumber"
            {...register('phoneNumber')}
            placeholder="+1234567890"
            className="bg-white dark:bg-gray-900"
          />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">{errors.phoneNumber.message as string}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthDate" className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            Birth Date *
          </Label>
          <Input
            id="birthDate"
            type="date"
            {...register('birthDate')}
            className="bg-white dark:bg-gray-900"
          />
          {errors.birthDate && (
            <p className="text-sm text-destructive">{errors.birthDate.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Gender *
          </Label>
          <Select
            onValueChange={(value) => setValue('gender', value as any)}
            value={watch('gender')}
          >
            <SelectTrigger className="bg-white dark:bg-gray-900">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-destructive">{errors.gender.message as string}</p>
          )}
        </div>
      </div>
    </div>
  )
}
