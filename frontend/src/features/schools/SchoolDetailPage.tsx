import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { schoolService } from '@/api/school.service'
import { formatDate } from '@/lib/utils'

export default function SchoolDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: school, isLoading } = useQuery({
    queryKey: ['schools', id],
    queryFn: () => schoolService.getById(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!school) {
    return <div className="text-center py-8">School not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/schools')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{school.name}</h1>
          <p className="text-muted-foreground mt-1">School Details</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{school.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{school.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{school.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={school.active ? 'success' : 'destructive'}>
                {school.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timestamps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Registration Date</p>
              <p className="font-medium">{formatDate(school.registrationDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{formatDate(school.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Updated At</p>
              <p className="font-medium">{formatDate(school.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
