import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Calendar as CalendarIcon, Filter, FileCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { absenceService, type Absence } from '../api/absence.service'
import { queryClient } from '@/lib/queryClient'
import AbsenceFormDialog from '../components/AbsenceFormDialog'
import AbsenceDetailDialog from '../components/AbsenceDetailDialog'
import JustifyAbsenceDialog from '../components/JustifyAbsenceDialog'
import AbsenceTable from '../components/AbsenceTable'
import AbsenceCard from '../components/AbsenceCard'
import AbsencePagination from '../components/AbsencePagination'

export default function AbsenceListPage() {
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingAbsence, setEditingAbsence] = useState<Absence | null>(null)
  const [viewingAbsenceId, setViewingAbsenceId] = useState<string | null>(null)
  const [justifyingAbsence, setJustifyingAbsence] = useState<Absence | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'justified' | 'unjustified'>('all')
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; info: string } | null>(null)
  const pageSize = 10

  // TODO: Get current user role from auth context
  const canJustify = true // Example: user role is STUDENT, PARENT, or SCHOOL_ADMIN

  const { data, isLoading } = useQuery({
    queryKey: ['absences', page],
    queryFn: () => absenceService.getAll(page, pageSize),
  })

  const deleteMutation = useMutation({
    mutationFn: absenceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] })
      toast.success('Absence deleted successfully', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
    onError: () => {
      toast.error('Failed to delete absence', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
  })

  const totalAbsences = data?.totalElements || 0
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number ?? 0

  const handleDelete = (id: string, info: string) => {
    setDeleteConfirmation({ id, info })
  }

  const confirmDelete = () => {
    if (deleteConfirmation) {
      deleteMutation.mutate(deleteConfirmation.id)
    }
  }

  // Filter absences by status
  const filteredAbsences = filterStatus === 'all'
    ? data?.content || []
    : (data?.content || []).filter(absence => 
        filterStatus === 'justified' ? absence.justified : !absence.justified
      )

  // Calculate statistics
  const statistics = {
    total: filteredAbsences.length,
    justified: filteredAbsences.filter(a => a.justified).length,
    unjustified: filteredAbsences.filter(a => !a.justified).length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            Absences
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage student absences · {totalAbsences} total
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="mr-2 size-4" />
            <span className="hidden sm:inline">Mark Absence</span>
          </Button>
        </div>
      </div>

      {/* Quick Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-gray-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-300 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-600">Total</p>
                <div className="text-3xl font-bold text-gray-900">{statistics.total}</div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <CalendarIcon className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-gradient-to-br from-green-50 to-white hover:border-green-300 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-600">Justified</p>
                <div className="text-3xl font-bold text-gray-900">{statistics.justified}</div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">
                <FileCheck className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-gradient-to-br from-red-50 to-white hover:border-red-300 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-600">Unjustified</p>
                <div className="text-3xl font-bold text-gray-900">{statistics.unjustified}</div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center">
                <CalendarIcon className="h-7 w-7 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select
          value={filterStatus}
          onValueChange={(value: any) => setFilterStatus(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Absences</SelectItem>
            <SelectItem value="justified">Justified Only</SelectItem>
            <SelectItem value="unjustified">Unjustified Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Absences List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filterStatus === 'all' 
              ? 'All Absences' 
              : filterStatus === 'justified' 
                ? 'Justified Absences'
                : 'Unjustified Absences'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredAbsences.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg font-medium text-muted-foreground">
                No absences found
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {filterStatus === 'all'
                  ? 'Click "Mark Absence" to record a student absence'
                  : `No ${filterStatus} absences`}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <AbsenceTable
                  absences={filteredAbsences}
                  onView={setViewingAbsenceId}
                  onEdit={setEditingAbsence}
                  onDelete={handleDelete}
                  onJustify={setJustifyingAbsence}
                  canJustify={canJustify}
                />
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredAbsences.map((absence: Absence) => (
                  <AbsenceCard
                    key={absence.id}
                    absence={absence}
                    onView={setViewingAbsenceId}
                    onEdit={setEditingAbsence}
                    onDelete={handleDelete}
                    onJustify={setJustifyingAbsence}
                    canJustify={canJustify}
                  />
                ))}
              </div>

              {/* Pagination */}
              <AbsencePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalAbsences}
                pageSize={pageSize}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      <AbsenceFormDialog
        open={isCreateOpen || !!editingAbsence}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingAbsence(null)
        }}
        absence={editingAbsence}
      />

      {viewingAbsenceId && (
        <AbsenceDetailDialog
          open={!!viewingAbsenceId}
          onClose={() => setViewingAbsenceId(null)}
          absenceId={viewingAbsenceId}
        />
      )}

      <JustifyAbsenceDialog
        open={!!justifyingAbsence}
        onClose={() => setJustifyingAbsence(null)}
        absence={justifyingAbsence}
      />

      <ConfirmationDialog
        open={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={confirmDelete}
        title="Delete Absence"
        description="Are you sure you want to delete this absence record? This action cannot be undone."
        itemName={deleteConfirmation?.info}
        confirmText="Delete Absence"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
