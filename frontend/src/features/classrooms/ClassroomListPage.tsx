import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { classroomService } from '@/api/classroom.service'
import { queryClient } from '@/lib/queryClient'
import ClassroomFormDialog from './ClassroomFormDialog'
import type { ClassRoom } from '@/types'

export default function ClassroomListPage() {
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingClassroom, setEditingClassroom] = useState<ClassRoom | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['classrooms', page],
    queryFn: () => classroomService.getAll(page, 10),
  })

  const deleteMutation = useMutation({
    mutationFn: classroomService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
      toast.success('Classroom deleted successfully', { position: 'bottom-right' })
    },
    onError: () => {
      toast.error('Failed to delete classroom', { position: 'bottom-right' })
    },
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this classroom?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Classrooms</h1>
          <p className="text-muted-foreground mt-1">Manage all classrooms and classes</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Classroom
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Classrooms</CardTitle>
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
                    <TableHead>Level</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Class Teacher</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.content.map((classroom) => (
                    <TableRow key={classroom.id}>
                      <TableCell className="font-medium">{classroom.name}</TableCell>
                      <TableCell>{classroom.level}</TableCell>
                      <TableCell>{classroom.section}</TableCell>
                      <TableCell>{classroom.academicYear}</TableCell>
                      <TableCell>{classroom.capacity}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          0
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {classroom.classTeacher?.user.firstName} {classroom.classTeacher?.user.lastName}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingClassroom(classroom)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(classroom.id)}
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

      <ClassroomFormDialog
        open={isCreateOpen || !!editingClassroom}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingClassroom(null)
        }}
        classroom={editingClassroom}
      />
    </div>
  )
}
