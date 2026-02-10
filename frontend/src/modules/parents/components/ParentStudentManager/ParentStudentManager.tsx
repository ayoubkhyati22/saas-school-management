import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Heart, User } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { parentService, type LinkStudentRequest } from '../../api/parent.service'
import { studentService } from '@/modules/students/api/student.service'

interface ParentStudentManagerProps {
  open: boolean
  onClose: () => void
  parentId: string
  parentName: string
}

export default function ParentStudentManager({ open, onClose, parentId, parentName }: ParentStudentManagerProps) {
  const queryClient = useQueryClient()
  const [isAddingStudent, setIsAddingStudent] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')
  const [relationshipType, setRelationshipType] = useState<'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER'>('FATHER')
  const [isPrimaryContact, setIsPrimaryContact] = useState(false)
  const [unlinkConfirmation, setUnlinkConfirmation] = useState<{ studentId: string; studentName: string } | null>(null)

  const { data: children, isLoading } = useQuery({
    queryKey: ['parent-children', parentId],
    queryFn: () => parentService.getChildren(parentId),
    enabled: open && !!parentId,
  })

  const { data: studentsData } = useQuery({
    queryKey: ['students-all'],
    queryFn: () => studentService.getAll(0, 100),
  })

  const linkMutation = useMutation({
    mutationFn: (request: LinkStudentRequest) => parentService.linkStudent(parentId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent-children', parentId] })
      queryClient.invalidateQueries({ queryKey: ['parents'] })
      toast.success('Student linked successfully', { position: 'bottom-right' })
      setIsAddingStudent(false)
      setSelectedStudentId('')
      setRelationshipType('FATHER')
      setIsPrimaryContact(false)
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to link student'
      toast.error(errorMessage, { position: 'bottom-right' })
    },
  })

  const unlinkMutation = useMutation({
    mutationFn: (studentId: string) => parentService.unlinkStudent(parentId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent-children', parentId] })
      queryClient.invalidateQueries({ queryKey: ['parents'] })
      toast.success('Student unlinked successfully', { position: 'bottom-right' })
      setUnlinkConfirmation(null)
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to unlink student'
      toast.error(errorMessage, { position: 'bottom-right' })
      setUnlinkConfirmation(null)
    },
  })

  const handleLinkStudent = () => {
    if (!selectedStudentId) {
      toast.error('Please select a student', { position: 'bottom-right' })
      return
    }

    const request: LinkStudentRequest = {
      studentId: selectedStudentId,
      relationshipType,
      isPrimaryContact,
    }

    linkMutation.mutate(request)
  }

  const handleUnlinkStudent = (studentId: string, studentName: string) => {
    setUnlinkConfirmation({ studentId, studentName })
  }

  const confirmUnlink = () => {
    if (unlinkConfirmation) {
      unlinkMutation.mutate(unlinkConfirmation.studentId)
    }
  }

  const linkedStudentIds = children?.map(c => c.studentId) || []
  const availableStudents = studentsData?.content.filter(s => !linkedStudentIds.includes(s.id)) || []

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-black dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">
              Manage Children - {parentName}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Link or unlink students to this parent
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Add Student Section */}
            {isAddingStudent ? (
              <Card className="border-2 border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student">Select Student *</Label>
                    <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                      <SelectTrigger className="bg-white dark:bg-gray-900">
                        <SelectValue placeholder="Choose a student" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-900">
                        {availableStudents.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.firstName} {student.lastName} - {student.registrationNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship Type *</Label>
                    <Select value={relationshipType} onValueChange={(v: any) => setRelationshipType(v)}>
                      <SelectTrigger className="bg-white dark:bg-gray-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-900">
                        <SelectItem value="FATHER">Father</SelectItem>
                        <SelectItem value="MOTHER">Mother</SelectItem>
                        <SelectItem value="GUARDIAN">Guardian</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPrimary"
                      checked={isPrimaryContact}
                      onChange={(e) => setIsPrimaryContact(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isPrimary" className="cursor-pointer">
                      Set as primary contact
                    </Label>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleLinkStudent}
                      disabled={linkMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {linkMutation.isPending ? 'Linking...' : 'Link Student'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingStudent(false)
                        setSelectedStudentId('')
                        setRelationshipType('FATHER')
                        setIsPrimaryContact(false)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button
                onClick={() => setIsAddingStudent(true)}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={availableStudents.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Child
              </Button>
            )}

            {/* Children List */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Linked Children ({children?.length || 0})
              </h3>

              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : children && children.length > 0 ? (
                children.map((child) => (
                  <Card key={child.id} className="border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                            {child.studentFirstName?.[0]}
                            {child.studentLastName?.[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">
                              {child.studentFirstName} {child.studentLastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {child.studentRegistrationNumber}
                            </div>
                            {child.classRoomName && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Class: {child.classRoomName}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{child.relationshipType}</Badge>
                          {child.isPrimaryContact && (
                            <Badge variant="default">
                              <Heart className="h-3 w-3 mr-1" />
                              Primary
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUnlinkStudent(
                              child.studentId,
                              `${child.studentFirstName} ${child.studentLastName}`
                            )}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No children linked yet</p>
                  <p className="text-sm mt-1">Click "Add Child" to link a student</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={!!unlinkConfirmation}
        onClose={() => setUnlinkConfirmation(null)}
        onConfirm={confirmUnlink}
        title="Unlink Student"
        description="Are you sure you want to unlink this student from the parent? This action cannot be undone."
        itemName={unlinkConfirmation?.studentName}
        confirmText="Unlink Student"
        variant="danger"
        isLoading={unlinkMutation.isPending}
      />
    </>
  )
}
