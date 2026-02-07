import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { studentService } from '@/api/student.service'
import { queryClient } from '@/lib/queryClient'
import { formatDate } from '@/lib/utils'

export default function StudentListPage() {
  const [page, setPage] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['students', page],
    queryFn: () => studentService.getAll(page, 10),
  })

  const deleteMutation = useMutation({
    mutationFn: studentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Student deleted successfully')
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">Manage all students</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Registration #</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrollment Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.content.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.user.firstName} {student.user.lastName}
                    </TableCell>
                    <TableCell>{student.registrationNumber}</TableCell>
                    <TableCell>{student.classRoom.name}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === 'ACTIVE' ? 'success' : 'secondary'}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(student.enrollmentDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
