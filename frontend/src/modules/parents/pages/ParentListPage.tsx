import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Search, Users, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { parentService, type Parent } from '../api/parent.service'
import { queryClient } from '@/lib/queryClient'
import ParentFormDialog from '../components/ParentFormDialog/ParentFormDialog'
import ParentDetailDialog from '../components/ParentDetailDialog'
import ParentTable from '../components/ParentTable'
import ParentCard from '../components/ParentCard'
import ParentPagination from '../components/ParentPagination'
import ParentStudentManager from '../components/ParentStudentManager/ParentStudentManager'

export default function ParentListPage() {
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingParent, setEditingParent] = useState<Parent | null>(null)
  const [viewingParentId, setViewingParentId] = useState<string | null>(null)
  const [managingStudents, setManagingStudents] = useState<{ id: string; name: string } | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [activeSearchKeyword, setActiveSearchKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null)
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['parents', page, activeSearchKeyword, isSearching],
    queryFn: () =>
      isSearching && activeSearchKeyword
        ? parentService.search(activeSearchKeyword, page, pageSize)
        : parentService.getAll(page, pageSize),
  })

  const deleteMutation = useMutation({
    mutationFn: parentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] })
      toast.success('Parent deleted successfully', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
    onError: () => {
      toast.error('Failed to delete parent', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
  })

  const totalParents = data?.totalElements || 0
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

  const handleManageStudents = (parent: Parent) => {
    setManagingStudents({
      id: parent.id,
      name: `${parent.firstName} ${parent.lastName}`
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Parents</h1>
          <p className="text-muted-foreground mt-1">
            Manage all parents · {totalParents} total
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="mr-2 size-4" />
            <span className="hidden sm:inline">Add Parent</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border border-gray-200 bg-gradient-to-br from-purple-50 to-white hover:border-purple-300 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-purple-600">Total Parents</p>
                <div className="text-3xl font-bold text-gray-900">{totalParents}</div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Users className="h-7 w-7 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-300 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-600">Active Parents</p>
                <div className="text-3xl font-bold text-gray-900">{totalParents}</div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <UserPlus className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-300 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-emerald-600">This Month</p>
                <div className="text-3xl font-bold text-gray-900">0</div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <Users className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
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
              className="border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-700 transition-all"
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

      {/* Parents List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isSearching
              ? `Search Results (${totalParents})`
              : 'All Parents'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : data?.content.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {isSearching
                  ? 'No parents found matching your search'
                  : 'No parents yet'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <ParentTable
                  parents={data?.content || []}
                  onView={setViewingParentId}
                  onEdit={setEditingParent}
                  onDelete={handleDelete}
                />
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {data?.content.map((parent: Parent) => (
                  <ParentCard
                    key={parent.id}
                    parent={parent}
                    onView={setViewingParentId}
                    onEdit={setEditingParent}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Pagination */}
              <ParentPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalParents}
                pageSize={pageSize}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      <ParentFormDialog
        open={isCreateOpen || !!editingParent}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingParent(null)
        }}
        parent={editingParent}
      />

      {viewingParentId && (
        <ParentDetailDialog
          open={!!viewingParentId}
          onClose={() => setViewingParentId(null)}
          parentId={viewingParentId}
        />
      )}

      {managingStudents && (
        <ParentStudentManager
          open={!!managingStudents}
          onClose={() => setManagingStudents(null)}
          parentId={managingStudents.id}
          parentName={managingStudents.name}
        />
      )}

      <ConfirmationDialog
        open={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={confirmDelete}
        title="Delete Parent"
        description="Are you sure you want to delete this parent? This will mark the parent as inactive and cannot be undone."
        itemName={deleteConfirmation?.name}
        confirmText="Delete Parent"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
