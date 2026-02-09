import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Edit, Trash2, MessageSquare, CheckCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { issueService } from '@/api/issue.service'
import { queryClient } from '@/lib/queryClient'
import { formatDate } from '@/lib/utils'
import IssueFormDialog from './IssueFormDialog'
import type { Issue } from '@/types'

export default function IssueListPage() {
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['issues', page],
    queryFn: () => issueService.getAll(page, 10),
  })

  const deleteMutation = useMutation({
    mutationFn: issueService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      toast.success('Issue deleted successfully', { position: 'bottom-right' })
    },
    onError: () => {
      toast.error('Failed to delete issue', { position: 'bottom-right' })
    },
  })

  const resolveMutation = useMutation({
    mutationFn: issueService.resolve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      toast.success('Issue marked as resolved', { position: 'bottom-right' })
    },
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this issue?')) {
      deleteMutation.mutate(id)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'destructive'
      case 'MEDIUM':
        return 'warning'
      case 'LOW':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'success'
      case 'IN_PROGRESS':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Issues</h1>
          <p className="text-muted-foreground mt-1">Track and resolve support issues</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Issue
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Issues</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.content.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">{issue.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{issue.issueType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(issue.priority) as any}>
                          {issue.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(issue.status) as any}>
                          {issue.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {issue.assignedTo || 'Unassigned'}
                      </TableCell>
                      <TableCell>{formatDate(issue.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Comments">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          {issue.status !== 'RESOLVED' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => resolveMutation.mutate(issue.id)}
                              title="Resolve"
                            >
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingIssue(issue)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(issue.id)}
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

      <IssueFormDialog
        open={isCreateOpen || !!editingIssue}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingIssue(null)
        }}
        issue={editingIssue}
      />
    </div>
  )
}
