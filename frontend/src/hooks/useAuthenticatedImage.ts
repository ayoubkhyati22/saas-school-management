import { useEffect, useState } from 'react'
import apiClient from '@/api/client'

export function useAuthenticatedImage(avatarPath: string | null | undefined) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!avatarPath) {
      setImageUrl(null)
      return
    }

    let objectUrl: string | null = null

    const fetchImage = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await apiClient.get(`/documents/download`, {
          params: { path: avatarPath },
          responseType: 'blob',
        })

        objectUrl = URL.createObjectURL(response.data)
        setImageUrl(objectUrl)
      } catch (err) {
        setError(err as Error)
        setImageUrl(null)
      } finally {
        setLoading(false)
      }
    }

    fetchImage()

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [avatarPath])

  return { imageUrl, loading, error }
}
