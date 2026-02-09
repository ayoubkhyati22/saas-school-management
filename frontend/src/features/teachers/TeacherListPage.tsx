import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { teacherService } from '@/api/teacher.service'
import { queryClient } from '@/lib/queryClient'
import { formatDate } from '@/lib/utils'
import TeacherFormDialog from './TeacherFormDialog'
import type { Teacher } from '@/types'

export default function TeacherListPage() {
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const pageSize = 5

  const { data, isLoading } = useQuery({
    queryKey: ['teachers', page],
    queryFn: () => teacherService.getAll(page, pageSize),
  })

  console.log('TeacherListPage - Fetched data:', data)

  const deleteMutation = useMutation({
    mutationFn: teacherService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      toast.success('Teacher deleted successfully', { position: 'bottom-right' })
    },
    onError: () => {
      toast.error('Failed to delete teacher', { position: 'bottom-right' })
    },
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      deleteMutation.mutate(id)
    }
  }

  const totalTeachers = data?.totalElements || 0
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number ?? 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-muted-foreground mt-1">
            Manage all teachers · {totalTeachers} total
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Add Teacher</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Speciality</TableHead>
                      <TableHead>Employee #</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Hire Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.content.map((teacher: any) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {teacher.imageUrl ? (
                              <img
                                src={teacher.imageUrl}
                                alt="teacher"
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm">
                                {teacher.firstName?.[0]}
                                {teacher.lastName?.[0]}
                              </div>
                            )}
                            <span>
                              {teacher.firstName} {teacher.lastName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{teacher.speciality}</TableCell>
                        <TableCell>{teacher.employeeNumber}</TableCell>
                        <TableCell>
                          <Badge variant={teacher.status === 'ACTIVE' ? 'success' : 'secondary'}>
                            {teacher.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(teacher.hireDate)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.location.href = `mailto:${teacher.email}`}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.location.href = `tel:${teacher.phone}`}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingTeacher(teacher)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(teacher.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {data?.content.map((teacher: any) => (
                  <Card key={teacher.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      {/* Header with Avatar and Actions */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {teacher.imageUrl ? (
                            <img
                              src={teacher.imageUrl}
                              alt="teacher"
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-400 text-white flex items-center justify-center text-base font-medium">
                              {teacher.firstName?.[0]}
                              {teacher.lastName?.[0]}
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-base">
                              {teacher.firstName} {teacher.lastName}
                            </h3>
                            <Badge 
                              variant={teacher.status === 'ACTIVE' ? 'success' : 'secondary'}
                              className="mt-1"
                            >
                              {teacher.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Teacher Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-medium truncate ml-2">{teacher.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Speciality:</span>
                          <span className="font-medium">{teacher.speciality}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Employee #:</span>
                          <span className="font-medium">{teacher.employeeNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hire Date:</span>
                          <span className="font-medium">{formatDate(teacher.hireDate)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => window.location.href = `mailto:${teacher.email}`}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => window.location.href = `tel:${teacher.phone}`}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setEditingTeacher(teacher)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(teacher.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalTeachers)} of {totalTeachers} teachers
                </div>
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  <div className="text-sm whitespace-nowrap">
                    Page {currentPage + 1} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={currentPage >= totalPages - 1}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4 sm:ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <TeacherFormDialog
        open={isCreateOpen || !!editingTeacher}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingTeacher(null)
        }}
        teacher={editingTeacher}
      />
    </div>
  )
}