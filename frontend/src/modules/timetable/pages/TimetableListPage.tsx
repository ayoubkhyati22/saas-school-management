import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Download, BarChart3, Calendar, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { timetableService, type Timetable } from '../api/timetable.service'
import { queryClient } from '@/lib/queryClient'
import TimetableFormDialog from '../components/TimetableFormDialog/TimetableFormDialog'
import TimetableDetailDialog from '../components/TimetableDetailDialog'
import TimetableStatistics from '../components/TimetableStatistics'
import TimetableTable from '../components/TimetableTable'
import TimetableCard from '../components/TimetableCard'
import { classroomService } from '@/api/classroom.service'
import { teacherService } from '@/api/teacher.service'

export default function TimetableListPage() {
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTimetable, setEditingTimetable] = useState<Timetable | null>(null)
  const [viewingTimetableId, setViewingTimetableId] = useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [activeSearchKeyword, setActiveSearchKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState('list')
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null)
  const [exportFilter, setExportFilter] = useState<'teacher' | 'classroom' | null>(null)
  const [exportEntityId, setExportEntityId] = useState('')
  const [exportAcademicYear, setExportAcademicYear] = useState('')
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['timetables', page, activeSearchKeyword, isSearching],
    queryFn: () =>
      isSearching && activeSearchKeyword
        ? timetableService.search(activeSearchKeyword, page, pageSize)
        : timetableService.getAll(page, pageSize),
  })

  const { data: classroomsData } = useQuery({
    queryKey: ['classrooms-all'],
    queryFn: () => classroomService.getAll(0, 100),
  })

  const { data: teachersData } = useQuery({
    queryKey: ['teachers-all'],
    queryFn: () => teacherService.getAll(0, 100),
  })

  const deleteMutation = useMutation({
    mutationFn: timetableService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] })
      queryClient.invalidateQueries({ queryKey: ['timetable-statistics'] })
      toast.success('Timetable deleted successfully', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
    onError: () => {
      toast.error('Failed to delete timetable', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
  })

  const totalTimetables = data?.totalElements || 0
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
    if (!exportFilter || !exportEntityId || !exportAcademicYear) {
      toast.error('Please select filter type, entity, and academic year', { position: 'bottom-right' })
      return
    }

    try {
      if (exportFilter === 'teacher') {
        await timetableService.exportByTeacher(exportEntityId, exportAcademicYear)
      } else if (exportFilter === 'classroom') {
        await timetableService.exportByClassroom(exportEntityId, exportAcademicYear)
      }
      toast.success('Timetable exported successfully', { position: 'bottom-right' })
    } catch (error) {
      toast.error('Failed to export timetable', { position: 'bottom-right' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Timetable</h1>
          <p className="text-muted-foreground mt-1">
            Manage schedule · {totalTimetables} total entries
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="mr-2 size-4" />
            <span className="hidden sm:inline">Add Entry</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tabs Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <TabsList className="grid grid-cols-3 bg-gray-100 p-2 rounded-xl w-full sm:w-auto gap-2">
            <TabsTrigger
              value="list"
              className="flex items-center gap-2 rounded-lg transition-all hover:bg-blue-50 hover:text-blue-600"
            >
              <Calendar className="size-4" />
              <span className="hidden sm:inline">Timetable</span>
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

            <TabsTrigger
              value="export"
              className="flex items-center gap-2 rounded-lg transition-all hover:bg-blue-50 hover:text-blue-600"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </TabsTrigger>
          </TabsList>

          {/* Search Bar - Only visible on list tab */}
          {activeTab === 'list' && (
            <div className="flex gap-2 flex-1 w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by course, teacher, classroom..."
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

        {/* Timetable List Content */}
        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {isSearching
                  ? `Search Results (${totalTimetables})`
                  : 'All Timetable Entries'}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : data?.content.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {isSearching
                      ? 'No timetable entries found matching your search'
                      : 'No timetable entries yet'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <TimetableTable
                      timetables={data?.content || []}
                      onView={setViewingTimetableId}
                      onEdit={setEditingTimetable}
                      onDelete={handleDelete}
                    />
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4">
                    {data?.content.map((timetable: Timetable) => (
                      <TimetableCard
                        key={timetable.id}
                        timetable={timetable}
                        onView={setViewingTimetableId}
                        onEdit={setEditingTimetable}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground">
                        Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalTimetables)} of {totalTimetables} entries
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(currentPage - 1)}
                          disabled={currentPage === 0}
                        >
                          Previous
                        </Button>
                        <div className="text-sm">
                          Page {currentPage + 1} of {totalPages}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(currentPage + 1)}
                          disabled={currentPage >= totalPages - 1}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Content */}
        <TabsContent value="statistics">
          <TimetableStatistics />
        </TabsContent>

        {/* Export Content */}
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Timetable to Excel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Export By</label>
                  <Select
                    onValueChange={(value) => {
                      setExportFilter(value as 'teacher' | 'classroom')
                      setExportEntityId('')
                    }}
                    value={exportFilter || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select filter type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="classroom">Classroom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {exportFilter && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {exportFilter === 'teacher' ? 'Select Teacher' : 'Select Classroom'}
                    </label>
                    <Select
                      onValueChange={(value) => setExportEntityId(value)}
                      value={exportEntityId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${exportFilter}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {exportFilter === 'teacher'
                          ? teachersData?.content?.map((teacher: any) => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.firstName} {teacher.lastName}
                              </SelectItem>
                            ))
                          : classroomsData?.content?.map((classroom: any) => (
                              <SelectItem key={classroom.id} value={classroom.id}>
                                {classroom.name}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Academic Year</label>
                <Input
                  placeholder="e.g., 2024-2025"
                  value={exportAcademicYear}
                  onChange={(e) => setExportAcademicYear(e.target.value)}
                />
              </div>

              <Button
                onClick={handleExport}
                disabled={!exportFilter || !exportEntityId || !exportAcademicYear}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Export to Excel
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TimetableFormDialog
        open={isCreateOpen || !!editingTimetable}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingTimetable(null)
        }}
        timetable={editingTimetable}
      />

      {viewingTimetableId && (
        <TimetableDetailDialog
          open={!!viewingTimetableId}
          onClose={() => setViewingTimetableId(null)}
          timetableId={viewingTimetableId}
        />
      )}

      <ConfirmationDialog
        open={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={confirmDelete}
        title="Delete Timetable Entry"
        description="Are you sure you want to delete this timetable entry? This action cannot be undone."
        itemName={deleteConfirmation?.name}
        confirmText="Delete Entry"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
