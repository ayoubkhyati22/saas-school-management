import { useState } from 'react'
import { Image, Upload, X, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { AvatarImage } from '@/components/ui/avatar-image'
import type { UseFormRegister } from 'react-hook-form'

interface AdditionalInfoSectionProps {
  register: UseFormRegister<any>
  errors: any
  currentAvatarUrl?: string
  onAvatarChange?: (file: File | null) => void
}

export default function AdditionalInfoSection({ register, errors, currentAvatarUrl, onAvatarChange }: AdditionalInfoSectionProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
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

  const hasAvatar = avatarPreview || currentAvatarUrl

  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
        <FileText className="h-4 w-4" />
        Additional Information
      </h3>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Image className="h-3.5 w-3.5 text-muted-foreground" />
          Avatar (Optional)
        </Label>

        {hasAvatar ? (
          <div className="flex items-center gap-4">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="h-20 w-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
              />
            ) : (
              <AvatarImage
                avatarPath={currentAvatarUrl}
                alt="Current avatar"
                className="h-20 w-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                fallback={null}
              />
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveAvatar}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
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
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-md hover:bg-blue-50 text-blue-600"
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

      <div className="space-y-2">
        <Label htmlFor="administrativeDocuments" className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          Administrative Documents (Optional)
        </Label>
        <Textarea
          id="administrativeDocuments"
          {...register('administrativeDocuments')}
          rows={3}
          placeholder="Enter document notes or JSON data"
          className="bg-white dark:bg-gray-900"
        />
        {errors.administrativeDocuments && (
          <p className="text-sm text-red-600 font-medium">{errors.administrativeDocuments.message as string}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Optional notes about teacher documents, certifications, etc.
        </p>
      </div>
    </div>
  )
}
