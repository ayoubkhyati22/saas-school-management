import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Search, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { courseService, type Course } from '../api/course.service'
import { queryClient } from '@/lib/queryClient'
import CourseFormDialog from '../components/CourseFormDialog'
import CourseDetailDialog from '../components/CourseDetailDialog'
import CourseTable from '../components/CourseTable'
import CourseCard from '../components/CourseCard'
import CoursePagination from '../components/CoursePagination'

export default function CourseListPage() {
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [viewingCourseId, setViewingCourseId] = useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [activeSearchKeyword, setActiveSearchKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null)
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['courses', page, activeSearchKeyword, isSearching],
    queryFn: () =>
      isSearching && activeSearchKeyword
        ? courseService.search(activeSearchKeyword, page, pageSize)
        : courseService.getAll(page, pageSize),
  })

  const deleteMutation = useMutation({
    mutationFn: courseService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Course deleted successfully', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
    onError: () => {
      toast.error('Failed to delete course', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
  })

  const totalCourses = data?.totalElements || 0
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Courses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all courses · {totalCourses} total
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="mr-2 size-4" />
            <span className="hidden sm:inline">Add Course</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by subject or code..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!searchKeyword.trim()}
              className="border-2 border-blue-200 hover:border-blue-400 hover:bg-emerald-50 text-blue-700 transition-all"
            >
              <Search className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Search</span>
            </Button>
            {isSearching && (
              <Button
                variant="outline"
                onClick={handleClearSearch}
                className="border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700"
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Course List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isSearching
              ? `Search Results (${totalCourses})`
              : 'All Courses'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : data?.content.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg font-medium text-muted-foreground">
                {isSearching
                  ? 'No courses found matching your search'
                  : 'No courses yet'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {isSearching
                  ? 'Try different search terms'
                  : 'Click "Add Course" to create your first course'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <CourseTable
                  courses={data?.content || []}
                  onView={setViewingCourseId}
                  onEdit={setEditingCourse}
                  onDelete={handleDelete}
                />
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {data?.content.map((course: Course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onView={setViewingCourseId}
                    onEdit={setEditingCourse}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Pagination */}
              <CoursePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalCourses}
                pageSize={pageSize}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      <CourseFormDialog
        open={isCreateOpen || !!editingCourse}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingCourse(null)
        }}
        course={editingCourse}
      />

      {viewingCourseId && (
        <CourseDetailDialog
          open={!!viewingCourseId}
          onClose={() => setViewingCourseId(null)}
          courseId={viewingCourseId}
        />
      )}

      <ConfirmationDialog
        open={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={confirmDelete}
        title="Delete Course"
        description="Are you sure you want to delete this course? This action cannot be undone and will also delete all associated materials."
        itemName={deleteConfirmation?.name}
        confirmText="Delete Course"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
