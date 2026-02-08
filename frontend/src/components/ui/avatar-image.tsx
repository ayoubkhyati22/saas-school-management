import { useAuthenticatedImage } from '@/hooks/useAuthenticatedImage'

interface AvatarImageProps {
  avatarPath: string | null | undefined
  alt: string
  className?: string
  fallback?: React.ReactNode
}

export function AvatarImage({ avatarPath, alt, className, fallback }: AvatarImageProps) {
  const { imageUrl, loading } = useAuthenticatedImage(avatarPath)

  if (loading) {
    return (
      <div className={className}>
        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 w-full h-full rounded-full" />
      </div>
    )
  }

  if (!imageUrl && fallback) {
    return <>{fallback}</>
  }

  if (!imageUrl) {
    return null
  }

  return <img src={imageUrl} alt={alt} className={className} />
}
