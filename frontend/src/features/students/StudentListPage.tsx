import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { studentService } from '@/api/student.service'
import { queryClient } from '@/lib/queryClient'
import { formatDate } from '@/lib/utils'

export default function StudentListPage() {
  const [page, setPage] = useState(0)
  const pageSize = 5

  const { data, isLoading } = useQuery({
    queryKey: ['students', page],
    queryFn: () => studentService.getAll(page, pageSize),
  })

  const deleteMutation = useMutation({
    mutationFn: studentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Student deleted successfully')
    },
  })

  const totalStudents = data?.totalElements || 0
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number ?? 0

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage all students · {totalStudents} total
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Add Student</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
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
                      <TableHead>Registration #</TableHead>
                      <TableHead>Birth Date</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrollment Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.content.map((student: any) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {student.imageUrl ? (
                              <img
                                src={student.imageUrl}
                                alt="student"
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm">
                                {student.firstName?.[0]}
                                {student.lastName?.[0]}
                              </div>
                            )}
                            <span>
                              {student.firstName} {student.lastName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{student.registrationNumber}</TableCell>
                        <TableCell>{student.birthDate}</TableCell>
                        <TableCell>{student.classRoomName}</TableCell>
                        <TableCell>
                          <Badge variant={student.status === 'ACTIVE' ? 'success' : 'secondary'}>
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(student.enrollmentDate)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.location.href = `mailto:${student.email}`}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.location.href = `tel:${student.phone}`}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(student.id)}
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
                {data?.content.map((student: any) => (
                  <Card key={student.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      {/* Header with Avatar and Actions */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {student.imageUrl ? (
                            <img
                              src={student.imageUrl}
                              alt="student"
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-400 text-white flex items-center justify-center text-base font-medium">
                              {student.firstName?.[0]}
                              {student.lastName?.[0]}
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-base">
                              {student.firstName} {student.lastName}
                            </h3>
                            <Badge 
                              variant={student.status === 'ACTIVE' ? 'success' : 'secondary'}
                              className="mt-1"
                            >
                              {student.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Student Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Registration #:</span>
                          <span className="font-medium">{student.registrationNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Birth Date:</span>
                          <span className="font-medium">{student.birthDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Class:</span>
                          <span className="font-medium">{student.classRoomName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Enrollment:</span>
                          <span className="font-medium">{formatDate(student.enrollmentDate)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => window.location.href = `mailto:${student.email}`}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => window.location.href = `tel:${student.phone}`}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
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
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalStudents)} of {totalStudents} students
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
    </div>
  )
}