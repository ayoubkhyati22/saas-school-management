import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Link } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { parentService } from '@/api/parent.service'
import { queryClient } from '@/lib/queryClient'
import ParentFormDialog from './ParentFormDialog'
import type { Parent } from '@/types'

export default function ParentListPage() {
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingParent, setEditingParent] = useState<Parent | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['parents', page],
    queryFn: () => parentService.getAll(page, 10),
  })

  const deleteMutation = useMutation({
    mutationFn: parentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] })
      toast.success('Parent deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete parent')
    },
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this parent?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Parents</h1>
          <p className="text-muted-foreground mt-1">Manage all parents and guardians</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Parent
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Parents</CardTitle>
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
                    <TableHead>Occupation</TableHead>
                    <TableHead>Children</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.content.map((parent) => (
                    <TableRow key={parent.id}>
                      <TableCell className="font-medium">
                        {parent.user.firstName} {parent.user.lastName}
                      </TableCell>
                      <TableCell>{parent.user.email}</TableCell>
                      <TableCell>{parent.user.email}</TableCell>
                      <TableCell>{parent.occupation || 'N/A'}</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingParent(parent)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(parent.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data && data.data.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page + 1} of {data.data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= data.data.totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ParentFormDialog
        open={isCreateOpen || !!editingParent}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingParent(null)
        }}
        parent={editingParent}
      />
    </div>
  )
}
