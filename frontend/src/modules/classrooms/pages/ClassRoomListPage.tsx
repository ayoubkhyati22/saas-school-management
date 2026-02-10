import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Search, GraduationCap, Users, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { classroomService, type ClassRoom } from '../api/classroom.service'
import { queryClient } from '@/lib/queryClient'
import ClassRoomFormDialog from '../components/ClassRoomFormDialog/ClassRoomFormDialog'
import ClassRoomDetailDialog from '../components/ClassRoomDetailDialog'
import ClassRoomTable from '../components/ClassRoomTable'
import ClassRoomCard from '../components/ClassRoomCard'
import ClassRoomPagination from '../components/ClassRoomPagination'

export default function ClassRoomListPage() {
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingClassRoom, setEditingClassRoom] = useState<ClassRoom | null>(null)
  const [viewingClassRoomId, setViewingClassRoomId] = useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [activeSearchKeyword, setActiveSearchKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null)
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['classrooms', page, activeSearchKeyword, isSearching, selectedYear],
    queryFn: () => {
      if (isSearching && activeSearchKeyword) {
        return classroomService.search(activeSearchKeyword, page, pageSize)
      } else if (selectedYear && selectedYear !== 'all') {
        return classroomService.getByAcademicYear(selectedYear, page, pageSize)
      } else {
        return classroomService.getAll(page, pageSize)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: classroomService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
      toast.success('Classroom deleted successfully', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete classroom'
      toast.error(errorMessage, { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
  })

  const totalClassRooms = data?.totalElements || 0
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
      setSelectedYear('all')
      setPage(0)
    }
  }

  const handleClearSearch = () => {
    setSearchKeyword('')
    setActiveSearchKeyword('')
    setIsSearching(false)
    setPage(0)
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    setIsSearching(false)
    setActiveSearchKeyword('')
    setSearchKeyword('')
    setPage(0)
  }

  // Generate academic year options
  const currentYear = new Date().getFullYear()
  const academicYears = [
    'all',
    `${currentYear - 1}-${currentYear}`,
    `${currentYear}-${currentYear + 1}`,
    `${currentYear + 1}-${currentYear + 2}`,
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Classrooms</h1>
          <p className="text-muted-foreground mt-1">
            Manage all classrooms · {totalClassRooms} total
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="mr-2 size-4" />
            <span className="hidden sm:inline">Add Classroom</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border border-gray-200 bg-gradient-to-br from-indigo-50 to-white hover:border-indigo-300 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-indigo-600">Total Classrooms</p>
                <div className="text-3xl font-bold text-gray-900">{totalClassRooms}</div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-300 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-600">Active Classes</p>
                <div className="text-3xl font-bold text-gray-900">{totalClassRooms}</div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-300 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-emerald-600">Current Year</p>
                <div className="text-2xl font-bold text-gray-900">
                  {`${currentYear}-${currentYear + 1}`}
                </div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <Calendar className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, level, or section..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Academic Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {academicYears.slice(1).map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              disabled={!searchKeyword.trim()}
              size="sm"
              className="border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-700 transition-all"
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
        </CardContent>
      </Card>

      {/* ClassRooms List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isSearching
              ? `Search Results (${totalClassRooms})`
              : selectedYear !== 'all'
              ? `Classrooms - ${selectedYear} (${totalClassRooms})`
              : 'All Classrooms'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : data?.content.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {isSearching
                  ? 'No classrooms found matching your search'
                  : 'No classrooms yet'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <ClassRoomTable
                  classrooms={data?.content || []}
                  onView={setViewingClassRoomId}
                  onEdit={setEditingClassRoom}
                  onDelete={handleDelete}
                />
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {data?.content.map((classroom: ClassRoom) => (
                  <ClassRoomCard
                    key={classroom.id}
                    classroom={classroom}
                    onView={setViewingClassRoomId}
                    onEdit={setEditingClassRoom}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Pagination */}
              <ClassRoomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalClassRooms}
                pageSize={pageSize}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      <ClassRoomFormDialog
        open={isCreateOpen || !!editingClassRoom}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingClassRoom(null)
        }}
        classroom={editingClassRoom}
      />

      {viewingClassRoomId && (
        <ClassRoomDetailDialog
          open={!!viewingClassRoomId}
          onClose={() => setViewingClassRoomId(null)}
          classroomId={viewingClassRoomId}
        />
      )}

      <ConfirmationDialog
        open={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={confirmDelete}
        title="Delete Classroom"
        description="Are you sure you want to delete this classroom? This action cannot be undone and will only work if there are no students enrolled."
        itemName={deleteConfirmation?.name}
        confirmText="Delete Classroom"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
