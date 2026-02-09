import { User, Mail, Phone, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
            <p className="text-sm text-red-600 font-medium">{errors.firstName.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Last Name *
          </Label>
          <Input id="lastName" {...register('lastName')} className="bg-white dark:bg-gray-900" />
          {errors.lastName && (
            <p className="text-sm text-red-600 font-medium">{errors.lastName.message as string}</p>
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
            <p className="text-sm text-red-600 font-medium">{errors.email.message as string}</p>
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
            <p className="text-sm text-red-600 font-medium">{errors.phoneNumber.message as string}</p>
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
            <p className="text-sm text-red-600 font-medium">{errors.birthDate.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Gender *
          </Label>
          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="MALE"
                {...register('gender')}
                className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Male</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="FEMALE"
                {...register('gender')}
                className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Female</span>
            </label>
          </div>
          {errors.gender && (
            <p className="text-sm text-red-600 font-medium">{errors.gender.message as string}</p>
          )}
        </div>
      </div>
    </div>
  )
}