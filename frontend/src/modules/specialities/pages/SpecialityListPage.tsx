import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Search, BookOpen, CheckCircle, XCircle, Power } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { specialityService, type Speciality } from '../api/speciality.service'
import { queryClient } from '@/lib/queryClient'
import SpecialityFormDialog from '../components/SpecialityFormDialog/SpecialityFormDialog'
import SpecialityDetailDialog from '../components/SpecialityDetailDialog'
import SpecialityTable from '../components/SpecialityTable'
import SpecialityCard from '../components/SpecialityCard'
import SpecialityPagination from '../components/SpecialityPagination'

export default function SpecialityListPage() {
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingSpeciality, setEditingSpeciality] = useState<Speciality | null>(null)
  const [viewingSpecialityId, setViewingSpecialityId] = useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [activeSearchKeyword, setActiveSearchKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null)
  const [toggleConfirmation, setToggleConfirmation] = useState<{ id: string; name: string; currentStatus: boolean } | null>(null)
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['specialities', page, activeSearchKeyword, isSearching],
    queryFn: () =>
      isSearching && activeSearchKeyword
        ? specialityService.search(activeSearchKeyword, page, pageSize)
        : specialityService.getAll(page, pageSize),
  })

  const deleteMutation = useMutation({
    mutationFn: specialityService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialities'] })
      toast.success('Speciality deleted successfully', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete speciality'
      toast.error(errorMessage, { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, activate }: { id: string; activate: boolean }) =>
      activate ? specialityService.activate(id) : specialityService.deactivate(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['specialities'] })
      toast.success(
        `Speciality ${variables.activate ? 'activated' : 'deactivated'} successfully`,
        { position: 'bottom-right' }
      )
      setToggleConfirmation(null)
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update speciality status'
      toast.error(errorMessage, { position: 'bottom-right' })
      setToggleConfirmation(null)
    },
  })

  const totalSpecialities = data?.totalElements || 0
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number ?? 0

  // Count active/inactive
  const activeCount = data?.content.filter((s: Speciality) => s.active).length || 0
  const inactiveCount = totalSpecialities - activeCount

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirmation({ id, name })
  }

  const confirmDelete = () => {
    if (deleteConfirmation) {
      deleteMutation.mutate(deleteConfirmation.id)
    }
  }

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    const speciality = data?.content.find((s: Speciality) => s.id === id)
    if (speciality) {
      setToggleConfirmation({ id, name: speciality.name, currentStatus })
    }
  }

  const confirmToggleStatus = () => {
    if (toggleConfirmation) {
      toggleStatusMutation.mutate({
        id: toggleConfirmation.id,
        activate: !toggleConfirmation.currentStatus,
      })
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
          <h1 className="text-3xl font-bold">Specialities</h1>
          <p className="text-muted-foreground mt-1">
            Manage subject specialities · {totalSpecialities} total
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Plus className="mr-2 size-4" />
            <span className="hidden sm:inline">Add Speciality</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border border-gray-200 bg-gradient-to-br from-teal-50 to-white hover:border-teal-300 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-teal-600">Total Specialities</p>
                <div className="text-3xl font-bold text-gray-900">{totalSpecialities}</div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-teal-100 flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-300 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-emerald-600">Active</p>
                <div className="text-3xl font-bold text-gray-900">{activeCount}</div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:border-gray-300 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <div className="text-3xl font-bold text-gray-900">{inactiveCount}</div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                <XCircle className="h-7 w-7 text-gray-600" />
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
                placeholder="Search by name or code..."
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
              className="border-2 border-teal-200 hover:border-teal-400 hover:bg-teal-50 text-teal-700 transition-all"
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

      {/* Specialities List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isSearching
              ? `Search Results (${totalSpecialities})`
              : 'All Specialities'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : data?.content.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {isSearching
                  ? 'No specialities found matching your search'
                  : 'No specialities yet'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <SpecialityTable
                  specialities={data?.content || []}
                  onView={setViewingSpecialityId}
                  onEdit={setEditingSpeciality}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {data?.content.map((speciality: Speciality) => (
                  <SpecialityCard
                    key={speciality.id}
                    speciality={speciality}
                    onView={setViewingSpecialityId}
                    onEdit={setEditingSpeciality}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>

              {/* Pagination */}
              <SpecialityPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalSpecialities}
                pageSize={pageSize}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      <SpecialityFormDialog
        open={isCreateOpen || !!editingSpeciality}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingSpeciality(null)
        }}
        speciality={editingSpeciality}
      />

      {viewingSpecialityId && (
        <SpecialityDetailDialog
          open={!!viewingSpecialityId}
          onClose={() => setViewingSpecialityId(null)}
          specialityId={viewingSpecialityId}
        />
      )}

      <ConfirmationDialog
        open={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={confirmDelete}
        title="Delete Speciality"
        description="Are you sure you want to delete this speciality? This action cannot be undone."
        itemName={deleteConfirmation?.name}
        confirmText="Delete Speciality"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmationDialog
        open={!!toggleConfirmation}
        onClose={() => setToggleConfirmation(null)}
        onConfirm={confirmToggleStatus}
        title={toggleConfirmation?.currentStatus ? 'Deactivate Speciality' : 'Activate Speciality'}
        description={
          toggleConfirmation?.currentStatus
            ? 'Are you sure you want to deactivate this speciality? It will no longer be available for assignment.'
            : 'Are you sure you want to activate this speciality? It will be available for assignment.'
        }
        itemName={toggleConfirmation?.name}
        confirmText={toggleConfirmation?.currentStatus ? 'Deactivate' : 'Activate'}
        variant={toggleConfirmation?.currentStatus ? 'warning' : 'default'}
        isLoading={toggleStatusMutation.isPending}
      />
    </div>
  )
}
