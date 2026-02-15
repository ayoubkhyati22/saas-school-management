import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { schoolService } from '@/api/school.service'
import { queryClient } from '@/lib/queryClient'
import SchoolFormDialog from './SchoolFormDialog'
import { useNavigate } from 'react-router-dom'
import type { School } from '@/types'

export default function SchoolListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingSchool, setEditingSchool] = useState<School | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['schools', page],
    queryFn: () => schoolService.getAll(page, 10),
  })

  const deleteMutation = useMutation({
    mutationFn: schoolService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] })
      toast.success('School deleted successfully', { position: 'bottom-right' })
    },
    onError: () => {
      toast.error('Failed to delete school', { position: 'bottom-right' })
    },
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this school?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schools</h1>
          <p className="text-muted-foreground mt-1">
            Manage all schools in the platform
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add School
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Schools</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.content.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell>{school.email}</TableCell>
                      <TableCell>{school.phone}</TableCell>
                      <TableCell className="max-w-xs truncate">{school.address}</TableCell>
                      <TableCell>
                        <Badge variant={school.active ? 'success' : 'destructive'}>
                          {school.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/schools/${school.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingSchool(school)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(school.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page + 1} of {data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= data.totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <SchoolFormDialog
        open={isCreateOpen || !!editingSchool}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingSchool(null)
        }}
        school={editingSchool}
      />
    </div>
  )
}
