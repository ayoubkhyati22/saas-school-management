import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Trash2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { absenceService } from '@/api/absence.service'
import { queryClient } from '@/lib/queryClient'
import { formatDate } from '@/lib/utils'
import AbsenceFormDialog from './AbsenceFormDialog'
import type { Absence } from '@/types'

export default function AbsenceListPage() {
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['absences', page],
    queryFn: () => absenceService.getAll(page, 10),
  })

  const deleteMutation = useMutation({
    mutationFn: absenceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] })
      toast.success('Absence deleted successfully', { position: 'bottom-right' })
    },
    onError: () => {
      toast.error('Failed to delete absence', { position: 'bottom-right' })
    },
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this absence record?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Absences</h1>
          <p className="text-muted-foreground mt-1">Track student attendance and absences</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Record Absence
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Absences</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.content.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell className="font-medium">
                        {absence.student.user.firstName} {absence.student.user.lastName}
                      </TableCell>
                      <TableCell>{absence.course.subject}</TableCell>
                      <TableCell>{formatDate(absence.date)}</TableCell>
                      <TableCell>
                        <Badge variant={absence.justified ? 'success' : 'warning'}>
                          {absence.justified ? 'Justified' : 'Unjustified'}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{absence.reason || 'No reason provided'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!absence.justified && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Justify"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(absence.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data && data.data.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page + 1} of {data.data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= data.data.totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AbsenceFormDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  )
}
