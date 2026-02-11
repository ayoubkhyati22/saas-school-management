import { Clock, MapPin, Image } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface EventDetailsSectionProps {
  register: UseFormRegister<any>
  errors: any
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
}

export default function EventDetailsSection({ register, errors, setValue, watch }: EventDetailsSectionProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
        <Clock className="h-4 w-4" />
        Event Details
      </h3>

      <div className="space-y-2">
        <Label htmlFor="eventDate" className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          Event Date & Time *
        </Label>
        <Input
          id="eventDate"
          type="datetime-local"
          {...register('eventDate')}
          className="bg-white dark:bg-gray-900"
        />
        {errors.eventDate && (
          <p className="text-sm text-red-600 font-medium">{errors.eventDate.message as string}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Select the date and time for the event
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          Location (Optional)
        </Label>
        <Input
          id="location"
          {...register('location')}
          placeholder="e.g., Main Auditorium, Sports Ground"
          className="bg-white dark:bg-gray-900"
        />
        {errors.location && (
          <p className="text-sm text-red-600 font-medium">{errors.location.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="flex items-center gap-2">
          <Image className="h-3.5 w-3.5 text-muted-foreground" />
          Image URL (Optional)
        </Label>
        <Input
          id="imageUrl"
          type="url"
          {...register('imageUrl')}
          placeholder="https://example.com/event-image.jpg"
          className="bg-white dark:bg-gray-900"
        />
        {errors.imageUrl && (
          <p className="text-sm text-red-600 font-medium">{errors.imageUrl.message as string}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Optional image URL for the event banner
        </p>
      </div>
    </div>
  )
}
