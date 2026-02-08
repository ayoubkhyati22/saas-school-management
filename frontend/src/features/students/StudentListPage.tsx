// frontend/src/features/students/StudentListPage.tsx
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { 
  Plus, Edit, Trash2, Mail, Phone, ChevronLeft, ChevronRight, 
  Eye, Search, Filter, Download, Upload, BarChart3, Users 
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { studentService } from '@/api/student.service'
import { queryClient } from '@/lib/queryClient'
import { formatDate } from '@/lib/utils'
import StudentFormDialog from './StudentFormDialog'
import StudentDetailDialog from './StudentDetailDialog'
import StudentStatistics from './StudentStatistics'
import type { Student } from '@/types'

export default function StudentListPage() {
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState('list')
  const pageSize = 10

  // Fetch students with search
  const { data, isLoading } = useQuery({
    queryKey: ['students', page, searchKeyword, isSearching],
    queryFn: () => 
      isSearching && searchKeyword
        ? studentService.search(searchKeyword, page, pageSize)
        : studentService.getAll(page, pageSize),
  })

  // Fetch statistics
  const { data: statistics } = useQuery({
    queryKey: ['student-statistics'],
    queryFn: () => studentService.getStatistics(),
  })

  const deleteMutation = useMutation({
    mutationFn: studentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['student-statistics'] })
      toast.success('Student deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete student')
    },
  })

  const totalStudents = data?.totalElements || 0
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number ?? 0

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This will mark the student as withdrawn.`)) {
      deleteMutation.mutate(id)
    }
  }

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      setIsSearching(true)
      setPage(0)
    }
  }

  const handleClearSearch = () => {
    setSearchKeyword('')
    setIsSearching(false)
    setPage(0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage all students · {totalStudents} total
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Upload className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Import</span>
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Student</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {statistics && activeTab === 'list' && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{statistics.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{statistics.activeStudents}</div>
              <p className="text-xs text-muted-foreground">Active Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{statistics.maleStudents}</div>
              <p className="text-xs text-muted-foreground">Male Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-pink-600">{statistics.femaleStudents}</div>
              <p className="text-xs text-muted-foreground">Female Students</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Student List
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or registration number..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} disabled={!searchKeyword.trim()}>
                  Search
                </Button>
                {isSearching && (
                  <Button variant="outline" onClick={handleClearSearch}>
                    Clear
                  </Button>
                )}
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Student List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isSearching ? `Search Results (${totalStudents})` : 'All Students'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : data?.content.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {isSearching ? 'No students found matching your search' : 'No students yet'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Registration #</TableHead>
                          <TableHead>Birth Date</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Enrollment</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.content.map((student: any) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                {student.avatarUrl ? (
                                  <img
                                    src={student.avatarUrl}
                                    alt="student"
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                                    {student.firstName?.[0]}
                                    {student.lastName?.[0]}
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium">
                                    {student.firstName} {student.lastName}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {student.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{student.registrationNumber}</TableCell>
                            <TableCell>{formatDate(student.birthDate)}</TableCell>
                            <TableCell>
                              {student.classRoomName || (
                                <span className="text-muted-foreground">Not assigned</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={student.status === 'ACTIVE' ? 'success' : 'warning'}>
                                {student.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(student.enrollmentDate)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setViewingStudentId(student.id)}
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => window.location.href = `mailto:${student.email}`}
                                  title="Send Email"
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                                {student.phoneNumber && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => window.location.href = `tel:${student.phoneNumber}`}
                                    title="Call"
                                  >
                                    <Phone className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingStudent(student)}
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                                  title="Delete"
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
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {student.avatarUrl ? (
                                <img
                                  src={student.avatarUrl}
                                  alt="student"
                                  className="h-12 w-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base font-medium">
                                  {student.firstName?.[0]}
                                  {student.lastName?.[0]}
                                </div>
                              )}
                              <div>
                                <h3 className="font-semibold text-base">
                                  {student.firstName} {student.lastName}
                                </h3>
                                <p className="text-xs text-muted-foreground">{student.email}</p>
                                <Badge 
                                  variant={student.status === 'ACTIVE' ? 'success' : 'secondary'}
                                  className="mt-1"
                                >
                                  {student.status}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Registration #:</span>
                              <span className="font-medium">{student.registrationNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Birth Date:</span>
                              <span className="font-medium">{formatDate(student.birthDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Class:</span>
                              <span className="font-medium">
                                {student.classRoomName || 'Not assigned'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Enrollment:</span>
                              <span className="font-medium">{formatDate(student.enrollmentDate)}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4 pt-3 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => setViewingStudentId(student.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                            </Button>
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
                              onClick={() => setEditingStudent(student)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
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
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <StudentStatistics />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <StudentFormDialog
        open={isCreateOpen || !!editingStudent}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingStudent(null)
        }}
        student={editingStudent}
      />

      {viewingStudentId && (
        <StudentDetailDialog
          open={!!viewingStudentId}
          onClose={() => setViewingStudentId(null)}
          studentId={viewingStudentId}
        />
      )}
    </div>
  )
}