import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Download, Upload, BarChart3, Users, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { studentService } from '../api/student.service'
import { queryClient } from '@/lib/queryClient'
import type { Student } from '@/types'
import StudentFormDialog from '../components/StudentFormDialog/StudentFormDialog'
import StudentDetailDialog from '../components/StudentDetailDialog'
import StudentStatistics from '../components/StudentStatistics'
import StudentQuickStats from '../components/StudentQuickStats'
import StudentTable from '../components/StudentTable'
import StudentCard from '../components/StudentCard'
import StudentPagination from '../components/StudentPagination'

export default function StudentListPage() {
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [activeSearchKeyword, setActiveSearchKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState('list')
  const [isExporting, setIsExporting] = useState(false)
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['students', page, activeSearchKeyword, isSearching],
    queryFn: () =>
      isSearching && activeSearchKeyword
        ? studentService.search(activeSearchKeyword, page, pageSize)
        : studentService.getAll(page, pageSize),
  })

  const { data: statistics } = useQuery({
    queryKey: ['student-statistics'],
    queryFn: () => studentService.getStatistics(),
  })

  const deleteMutation = useMutation({
    mutationFn: studentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['student-statistics'] })
      toast.success('Student deleted successfully', { position: 'bottom-right' })
    },
    onError: () => {
      toast.error('Failed to delete student', { position: 'bottom-right' })
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
      setActiveSearchKeyword(searchKeyword.trim())
      setIsSearching(true)
      setPage(0)
    }
  }

  const handleClearSearch = () => {
    setSearchKeyword('')
    setActiveSearchKeyword('')
    setIsSearching(false)
    setPage(0)
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      await studentService.exportToCSV()
      toast.success('Students exported successfully', { position: 'bottom-right' })
    } catch (error) {
      toast.error('Failed to export students', { position: 'bottom-right' })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage all students · {totalStudents} total
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="bg-green-600 hover:bg-green-700 text-white border-green-600"
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">
              {isExporting ? 'Exporting...' : 'Export'}
            </span>
          </Button>

          <Button variant="outline" size="sm" disabled>
            <Upload className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Import</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="mr-2 size-4" />
            <span className="hidden sm:inline">Add Student</span>
          </Button>
        </div>
      </div>

      {statistics && activeTab === 'list' && <StudentQuickStats statistics={statistics} />}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tabs Header with Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <TabsList className="grid grid-cols-2 bg-gray-100 p-2 rounded-xl w-full sm:w-auto gap-2">
            {/* Student List Tab */}
            <TabsTrigger
              value="list"
              className="flex items-center gap-2 rounded-lg transition-all
                hover:bg-blue-50
                hover:text-blue-600"
            >
              <Users className="size-4 " />
              <span className="hidden sm:inline">Student List</span>
              <span className="sm:hidden">List</span>
            </TabsTrigger>

            {/* Statistics Tab */}
            <TabsTrigger
              value="statistics"
              className="flex items-center gap-2 rounded-lg transition-all
                hover:bg-blue-50
                hover:text-blue-600"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Statistics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>

          {/* Search Bar - Only visible on list tab */}
          {activeTab === 'list' && (
            <div className="flex gap-2 flex-1 w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or registration..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!searchKeyword.trim()}
                size="sm"
                className="border-2 border-blue-200 hover:border-blue-400 hover:bg-emerald-50 text-blue-700 transition-all"
              >
                <Search className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Search</span>
              </Button>
              {isSearching && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSearch}
                  className="border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700"
                >
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Student List Content */}
        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {isSearching
                  ? `Search Results (${totalStudents})`
                  : 'All Students'}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : data?.content.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {isSearching
                      ? 'No students found matching your search'
                      : 'No students yet'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <StudentTable
                      students={data?.content || []}
                      onView={setViewingStudentId}
                      onEdit={setEditingStudent}
                      onDelete={handleDelete}
                    />
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4">
                    {data?.content.map((student: Student) => (
                      <StudentCard
                        key={student.id}
                        student={student}
                        onView={setViewingStudentId}
                        onEdit={setEditingStudent}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <StudentPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalStudents}
                    pageSize={pageSize}
                    onPageChange={setPage}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Content */}
        <TabsContent value="statistics">
          <StudentStatistics />
        </TabsContent>
      </Tabs>

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