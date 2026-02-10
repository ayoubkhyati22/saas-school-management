import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Download, Upload, BarChart3, Users, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { teacherService, type Teacher } from '../api/teacher.service'
import { queryClient } from '@/lib/queryClient'
import TeacherFormDialog from '../components/TeacherFormDialog/TeacherFormDialog'
import TeacherDetailDialog from '../components/TeacherDetailDialog'
import TeacherStatistics from '../components/TeacherStatistics'
import TeacherQuickStats from '../components/TeacherQuickStats'
import TeacherTable from '../components/TeacherTable'
import TeacherCard from '../components/TeacherCard'
import TeacherPagination from '../components/TeacherPagination'

export default function TeacherListPage() {
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [viewingTeacherId, setViewingTeacherId] = useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [activeSearchKeyword, setActiveSearchKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState('list')
  const [isExporting, setIsExporting] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null)
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['teachers', page, activeSearchKeyword, isSearching],
    queryFn: () =>
      isSearching && activeSearchKeyword
        ? teacherService.search(activeSearchKeyword, page, pageSize)
        : teacherService.getAll(page, pageSize),
  })

  const { data: statistics } = useQuery({
    queryKey: ['teacher-statistics'],
    queryFn: () => teacherService.getStatistics(),
  })

  const deleteMutation = useMutation({
    mutationFn: teacherService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      queryClient.invalidateQueries({ queryKey: ['teacher-statistics'] })
      toast.success('Teacher deleted successfully', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
    onError: () => {
      toast.error('Failed to delete teacher', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
  })

  const totalTeachers = data?.totalElements || 0
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number ?? 0

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirmation({ id, name })
  }

  const confirmDelete = () => {
    if (deleteConfirmation) {
      deleteMutation.mutate(deleteConfirmation.id)
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
      await teacherService.exportToCSV()
      toast.success('Teachers exported successfully', { position: 'bottom-right' })
    } catch (error) {
      toast.error('Failed to export teachers', { position: 'bottom-right' })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-muted-foreground mt-1">
            Manage all teachers · {totalTeachers} total
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
            <span className="hidden sm:inline">Add Teacher</span>
          </Button>
        </div>
      </div>

      {statistics && activeTab === 'list' && <TeacherQuickStats statistics={statistics} />}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <TabsList className="grid grid-cols-2 bg-gray-100 p-2 rounded-xl w-full sm:w-auto gap-2">
            <TabsTrigger
              value="list"
              className="flex items-center gap-2 rounded-lg transition-all hover:bg-blue-50 hover:text-blue-600"
            >
              <Users className="size-4" />
              <span className="hidden sm:inline">Teacher List</span>
              <span className="sm:hidden">List</span>
            </TabsTrigger>

            <TabsTrigger
              value="statistics"
              className="flex items-center gap-2 rounded-lg transition-all hover:bg-blue-50 hover:text-blue-600"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Statistics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>

          {activeTab === 'list' && (
            <div className="flex gap-2 flex-1 w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, employee number..."
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

        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {isSearching ? `Search Results (${totalTeachers})` : 'All Teachers'}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : data?.content.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {isSearching ? 'No teachers found matching your search' : 'No teachers yet'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="hidden md:block">
                    <TeacherTable
                      teachers={data?.content || []}
                      onView={setViewingTeacherId}
                      onEdit={setEditingTeacher}
                      onDelete={handleDelete}
                    />
                  </div>

                  <div className="md:hidden space-y-4">
                    {data?.content.map((teacher: Teacher) => (
                      <TeacherCard
                        key={teacher.id}
                        teacher={teacher}
                        onView={setViewingTeacherId}
                        onEdit={setEditingTeacher}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>

                  <TeacherPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalTeachers}
                    pageSize={pageSize}
                    onPageChange={setPage}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <TeacherStatistics />
        </TabsContent>
      </Tabs>

      <TeacherFormDialog
        open={isCreateOpen || !!editingTeacher}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingTeacher(null)
        }}
        teacher={editingTeacher}
      />

      {viewingTeacherId && (
        <TeacherDetailDialog
          open={!!viewingTeacherId}
          onClose={() => setViewingTeacherId(null)}
          teacherId={viewingTeacherId}
        />
      )}

      <ConfirmationDialog
        open={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={confirmDelete}
        title="Delete Teacher"
        description="Are you sure you want to delete this teacher? This will mark the teacher as terminated and cannot be undone."
        itemName={deleteConfirmation?.name}
        confirmText="Delete Teacher"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
