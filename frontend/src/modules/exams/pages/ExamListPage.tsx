import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Search, BarChart3, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { examService, type Exam } from '../exam.service'
import { queryClient } from '@/lib/queryClient'
import ExamQuickStats from '../components/ExamQuickStats'
import ExamTable from '../components/ExamTable'
import ExamCard from '../components/ExamCard'
import ExamPagination from '../components/ExamPagination'

export default function ExamListPage() {
  const [page, setPage] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [activeSearchKeyword, setActiveSearchKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState('list')
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null)
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['exams', page, activeSearchKeyword, isSearching],
    queryFn: () =>
      isSearching && activeSearchKeyword
        ? examService.search(activeSearchKeyword, page, pageSize)
        : examService.getAll(page, pageSize),
  })

  const { data: statistics } = useQuery({
    queryKey: ['exam-statistics'],
    queryFn: () => examService.getStatistics(),
  })

  const deleteMutation = useMutation({
    mutationFn: examService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] })
      queryClient.invalidateQueries({ queryKey: ['exam-statistics'] })
      toast.success('Exam deleted successfully', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
    onError: () => {
      toast.error('Failed to delete exam', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
  })

  const totalExams = data?.totalElements || 0
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number ?? 0

  const handleDelete = (id: string, name: string) => setDeleteConfirmation({ id, name })
  const confirmDelete = () => { 
    if (deleteConfirmation) deleteMutation.mutate(deleteConfirmation.id) 
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
          <h1 className="text-3xl font-bold">Exams</h1>
          <p className="text-muted-foreground mt-1">Manage all exams · {totalExams} total</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="mr-2 size-4" />
            <span className="hidden sm:inline">Add Exam</span>
          </Button>
        </div>
      </div>

      {statistics && activeTab === 'list' && <ExamQuickStats statistics={statistics} />}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <TabsList className="grid grid-cols-2 bg-gray-100 p-2 rounded-xl w-full sm:w-auto gap-2">
            <TabsTrigger value="list" className="flex items-center gap-2 rounded-lg">
              <FileText className="size-4" />
              <span className="hidden sm:inline">Exam List</span>
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
                  placeholder="Search exams..." 
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
                {isSearching ? `Search Results (${totalExams})` : 'All Exams'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : data?.content.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {isSearching ? 'No exams found matching your search' : 'No exams yet'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="hidden md:block">
                    <ExamTable 
                      exams={data?.content || []} 
                      onView={() => {}} 
                      onEdit={() => {}} 
                      onDelete={handleDelete} 
                    />
                  </div>
                  <div className="md:hidden space-y-4">
                    {data?.content.map((exam: Exam) => (
                      <ExamCard 
                        key={exam.id} 
                        exam={exam} 
                        onView={() => {}} 
                        onEdit={() => {}} 
                        onDelete={handleDelete} 
                      />
                    ))}
                  </div>
                  <ExamPagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    totalItems={totalExams} 
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
            <p>Statistics coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>

      <ConfirmationDialog 
        open={!!deleteConfirmation} 
        onClose={() => setDeleteConfirmation(null)} 
        onConfirm={confirmDelete} 
        title="Delete Exam" 
        description="Are you sure you want to delete this exam? This action cannot be undone." 
        itemName={deleteConfirmation?.name} 
        confirmText="Delete Exam" 
        variant="danger" 
        isLoading={deleteMutation.isPending} 
      />
    </div>
  )
}