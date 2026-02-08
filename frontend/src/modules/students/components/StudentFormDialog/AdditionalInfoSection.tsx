import { useState } from 'react'
import { MapPin, Image, Upload, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { UseFormRegister } from 'react-hook-form'

interface AdditionalInfoSectionProps {
  register: UseFormRegister<any>
  errors: any
  currentAvatarUrl?: string
  onAvatarChange?: (file: File | null) => void
}

export default function AdditionalInfoSection({ register, errors, currentAvatarUrl, onAvatarChange }: AdditionalInfoSectionProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentAvatarUrl || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must not exceed 5MB')
        return
      }
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onAvatarChange?.(file)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatarPreview(null)
    setSelectedFile(null)
    onAvatarChange?.(null)
  }

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
        <Label className="flex items-center gap-2">
          <Image className="h-3.5 w-3.5 text-muted-foreground" />
          Avatar (Optional)
        </Label>

        {avatarPreview ? (
          <div className="flex items-center gap-4">
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className="h-20 w-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveAvatar}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-white dark:bg-gray-900"
              id="avatar-upload"
            />
            <Label
              htmlFor="avatar-upload"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Upload className="h-4 w-4" />
              <span className="text-sm">Choose File</span>
            </Label>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Maximum file size: 5MB. Accepted formats: JPG, PNG, GIF
        </p>
      </div>
    </div>
  )
}
