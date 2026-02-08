import { MapPin, Image } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { UseFormRegister } from 'react-hook-form'

interface AdditionalInfoSectionProps {
  register: UseFormRegister<any>
  errors: any
}

export default function AdditionalInfoSection({ register, errors }: AdditionalInfoSectionProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
        <MapPin className="h-4 w-4" />
        Additional Information
      </h3>

      <div className="space-y-2">
        <Label htmlFor="address" className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          Address (Optional)
        </Label>
        <Textarea
          id="address"
          {...register('address')}
          rows={2}
          className="bg-white dark:bg-gray-900"
        />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatarUrl" className="flex items-center gap-2">
          <Image className="h-3.5 w-3.5 text-muted-foreground" />
          Avatar URL (Optional)
        </Label>
        <Input
          id="avatarUrl"
          {...register('avatarUrl')}
          placeholder="https://..."
          className="bg-white dark:bg-gray-900"
        />
      </div>
    </div>
  )
}
