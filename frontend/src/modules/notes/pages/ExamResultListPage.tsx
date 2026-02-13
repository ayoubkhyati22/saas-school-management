import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Search, Download, BarChart3, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { examResultService, type ExamResult } from '../api/examResult.service'
import { examService } from '@/modules/exams/exam.service'
import { studentService } from '@/modules/students/api/student.service'
import { queryClient } from '@/lib/queryClient'
import ExamResultQuickStats from '../components/ExamResultQuickStats'
import ExamResultTable from '../components/ExamResultTable'
import ExamResultCard from '../components/ExamResultCard'
import ExamResultPagination from '../components/ExamResultPagination'
import ExamResultFormDialog from '../components/ExamResultFormDialog'
import ExamResultDetailDialog from '../components/ExamResultDetailDialog'

export default function ExamResultListPage() {
  const [page, setPage] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [activeSearchKeyword, setActiveSearchKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState('list')
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  
  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add')
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  
  const pageSize = 10

  // Fetch exam results
  const { data, isLoading } = useQuery({
    queryKey: ['exam-results', page, activeSearchKeyword, isSearching],
    queryFn: () =>
      isSearching && activeSearchKeyword
        ? examResultService.search(activeSearchKeyword, page, pageSize)
        : examResultService.getAll(page, pageSize),
  })

  // Fetch statistics
  const { data: statistics } = useQuery({
    queryKey: ['exam-result-statistics'],
    queryFn: () => examResultService.getStatistics(),
  })

  // Fetch exams for dropdown (all exams, unpaginated)
  const { data: examsData } = useQuery({
    queryKey: ['exams-for-results'],
    queryFn: async () => {
      const response = await examService.getAll(0, 1000) // Get first 1000 exams
      return response.content.map(exam => ({
        id: exam.id,
        title: exam.title,
        maxMarks: exam.maxMarks,
        passingMarks: exam.passingMarks,
      }))
    },
  })

  // Fetch students for dropdown (all students, unpaginated)
  const { data: studentsData } = useQuery({
    queryKey: ['students-for-results'],
    queryFn: async () => {
      const response = await studentService.getAll(0, 1000) // Get first 1000 students
      return response.content.map(student => ({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        registrationNumber: student.registrationNumber,
      }))
    },
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: examResultService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-results'] })
      queryClient.invalidateQueries({ queryKey: ['exam-result-statistics'] })
      toast.success('Exam result created successfully', { position: 'bottom-right' })
      setFormDialogOpen(false)
      setSelectedResult(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create exam result', { position: 'bottom-right' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => examResultService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-results'] })
      queryClient.invalidateQueries({ queryKey: ['exam-result-statistics'] })
      toast.success('Exam result updated successfully', { position: 'bottom-right' })
      setFormDialogOpen(false)
      setSelectedResult(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update exam result', { position: 'bottom-right' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: examResultService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-results'] })
      queryClient.invalidateQueries({ queryKey: ['exam-result-statistics'] })
      toast.success('Exam result deleted successfully', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete exam result', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
  })

  const totalResults = data?.totalElements || 0
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number ?? 0

  const handleAdd = () => {
    setFormMode('add')
    setSelectedResult(null)
    setFormDialogOpen(true)
  }

  const handleEdit = (result: ExamResult) => {
    setFormMode('edit')
    setSelectedResult(result)
    setFormDialogOpen(true)
  }

  const handleView = (id: string) => {
    const result = data?.content.find((r: ExamResult) => r.id === id)
    if (result) {
      setSelectedResult(result)
      setDetailDialogOpen(true)
    }
  }

  const handleDelete = (id: string, name: string) => setDeleteConfirmation({ id, name })
  
  const confirmDelete = () => {
    if (deleteConfirmation) deleteMutation.mutate(deleteConfirmation.id)
  }

  const handleSave = async (formData: any) => {
    if (formMode === 'add') {
      await createMutation.mutateAsync(formData)
    } else if (selectedResult) {
      await updateMutation.mutateAsync({ id: selectedResult.id, data: formData })
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
      await examResultService.exportToCSV()
      toast.success('Exam results exported successfully', { position: 'bottom-right' })
    } catch (error) {
      toast.error('Failed to export exam results', { position: 'bottom-right' })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Exam Results</h1>
          <p className="text-muted-foreground mt-1">Manage all exam results · {totalResults} total</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
          </Button>
          <Button size="sm" onClick={handleAdd} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="mr-2 size-4" />
            <span className="hidden sm:inline">Add Result</span>
          </Button>
        </div>
      </div>

      {statistics && activeTab === 'list' && <ExamResultQuickStats statistics={statistics} />}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <TabsList className="grid grid-cols-2 bg-gray-100 p-2 rounded-xl w-full sm:w-auto gap-2">
            <TabsTrigger value="list" className="flex items-center gap-2 rounded-lg">
              <FileText className="size-4" />
              <span className="hidden sm:inline">Result List</span>
              <span className="sm:hidden">List</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2 rounded-lg">
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
                  placeholder="Search results..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={!searchKeyword.trim()} size="sm">
                <Search className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Search</span>
              </Button>
              {isSearching && (
                <Button variant="outline" size="sm" onClick={handleClearSearch}>
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
                {isSearching ? `Search Results (${totalResults})` : 'All Exam Results'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : data?.content.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {isSearching ? 'No results found matching your search' : 'No exam results yet'}
                  </p>
                  {!isSearching && (
                    <Button onClick={handleAdd} className="mt-4" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Result
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="hidden md:block">
                    <ExamResultTable
                      results={data?.content || []}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                  <div className="md:hidden space-y-4">
                    {data?.content.map((result: ExamResult) => (
                      <ExamResultCard
                        key={result.id}
                        result={result}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                  <ExamResultPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalResults}
                    pageSize={pageSize}
                    onPageChange={setPage}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <div className="text-center py-12">
            <p>Statistics charts coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ExamResultFormDialog
        open={formDialogOpen}
        onClose={() => {
          setFormDialogOpen(false)
          setSelectedResult(null)
        }}
        onSave={handleSave}
        result={selectedResult}
        mode={formMode}
        exams={examsData || []}
        students={studentsData || []}
      />

      <ExamResultDetailDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false)
          setSelectedResult(null)
        }}
        result={selectedResult}
      />

      <ConfirmationDialog
        open={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={confirmDelete}
        title="Delete Exam Result"
        description="Are you sure you want to delete this exam result? This action cannot be undone."
        itemName={deleteConfirmation?.name}
        confirmText="Delete Result"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
