import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, Save, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ExamResult } from '../api/examResult.service'

interface ExamResultFormDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  result?: ExamResult | null
  mode: 'add' | 'edit'
  exams?: Array<{ id: string; title: string }>
  students?: Array<{ id: string; name: string; registrationNumber: string }>
}

export default function ExamResultFormDialog({
  open,
  onClose,
  onSave,
  result,
  mode,
  exams = [],
  students = [],
}: ExamResultFormDialogProps) {
  const [formData, setFormData] = useState({
    examId: '',
    studentId: '',
    marksObtained: '',
    remarks: '',
    absent: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (mode === 'edit' && result) {
      setFormData({
        examId: result.examId || '',
        studentId: result.studentId || '',
        marksObtained: result.marksObtained?.toString() || '',
        remarks: result.remarks || '',
        absent: result.absent || false,
      })
    } else if (mode === 'add') {
      setFormData({
        examId: '',
        studentId: '',
        marksObtained: '',
        remarks: '',
        absent: false,
      })
    }
    setErrors({})
  }, [mode, result, open])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (mode === 'add') {
      if (!formData.examId) newErrors.examId = 'Exam is required'
      if (!formData.studentId) newErrors.studentId = 'Student is required'
    }

    if (!formData.absent && !formData.marksObtained) {
      newErrors.marksObtained = 'Marks are required when not absent'
    }

    if (formData.marksObtained && parseFloat(formData.marksObtained) < 0) {
      newErrors.marksObtained = 'Marks cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsLoading(true)
    try {
      const submitData: any = {
        remarks: formData.remarks || null,
        absent: formData.absent,
      }

      if (mode === 'add') {
        submitData.examId = formData.examId
        submitData.studentId = formData.studentId
      }

      if (!formData.absent && formData.marksObtained) {
        submitData.marksObtained = parseFloat(formData.marksObtained)
      }

      await onSave(submitData)
      onClose()
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedStudent = students.find((s) => s.id === formData.studentId)
  const selectedExam = exams.find((e) => e.id === formData.examId)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto  dark:bg-gray-900 border-gray-200 dark:border-gray-700  dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{mode === 'add' ? 'Add Exam Result' : 'Edit Exam Result'}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4 ">
          {mode === 'add' && (
            <>
              {/* Exam Selection */}
              <div className="space-y-2">
                <Label htmlFor="examId">
                  Exam <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.examId}
                  onValueChange={(value) => setFormData({ ...formData, examId: value })}
                >
                  <SelectTrigger className={errors.examId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.examId && <p className="text-sm text-red-500">{errors.examId}</p>}
              </div>

              {/* Student Selection */}
              <div className="space-y-2">
                <Label htmlFor="studentId">
                  Student <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.studentId}
                  onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                >
                  <SelectTrigger className={errors.studentId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.registrationNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.studentId && <p className="text-sm text-red-500">{errors.studentId}</p>}
              </div>
            </>
          )}

          {mode === 'edit' && (
            <div className="p-4  rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Exam:</span>
                <span className="text-sm font-medium">{result?.examTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Student:</span>
                <span className="text-sm font-medium">
                  {result?.studentName} ({result?.studentRegistrationNumber})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Max Marks:</span>
                <span className="text-sm font-medium">{result?.maxMarks}</span>
              </div>
            </div>
          )}

          {/* Absent Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="absent"
              checked={formData.absent}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, absent: checked as boolean, marksObtained: checked ? '' : formData.marksObtained })
              }
            />
            <Label htmlFor="absent" className="text-sm font-medium leading-none cursor-pointer">
              Mark as Absent
            </Label>
          </div>

          {/* Marks Obtained */}
          {!formData.absent && (
            <div className="space-y-2">
              <Label htmlFor="marksObtained">
                Marks Obtained {mode === 'add' && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="marksObtained"
                type="number"
                step="0.01"
                placeholder="Enter marks"
                value={formData.marksObtained}
                onChange={(e) => setFormData({ ...formData, marksObtained: e.target.value })}
                className={errors.marksObtained ? 'border-red-500' : ''}
              />
              {errors.marksObtained && <p className="text-sm text-red-500">{errors.marksObtained}</p>}
              {mode === 'edit' && result?.maxMarks && (
                <p className="text-xs text-muted-foreground">Maximum marks: {result.maxMarks}</p>
              )}
            </div>
          )}

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Enter any remarks or comments..."
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">{formData.remarks.length}/1000</p>
          </div>

          {/* Auto-calculated fields preview (Edit mode) */}
          {mode === 'edit' && !formData.absent && formData.marksObtained && result?.maxMarks && (
            <div className="p-4 bg-blue-50 rounded-lg space-y-2">
              <p className="text-sm font-medium text-blue-900">Auto-calculated values:</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Percentage:</span>
                  <p className="font-semibold">
                    {((parseFloat(formData.marksObtained) / result.maxMarks) * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <span className="text-blue-700">Grade:</span>
                  <p className="font-semibold">{calculateGrade((parseFloat(formData.marksObtained) / result.maxMarks) * 100)}</p>
                </div>
                <div>
                  <span className="text-blue-700">Status:</span>
                  <p className="font-semibold">
                    {parseFloat(formData.marksObtained) >= (result.maxMarks * 0.4) ? 'PASS' : 'FAIL'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === 'add' ? 'Add Result' : 'Save Changes'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'A+'
  if (percentage >= 80) return 'A'
  if (percentage >= 70) return 'B+'
  if (percentage >= 60) return 'B'
  if (percentage >= 50) return 'C+'
  if (percentage >= 40) return 'C'
  if (percentage >= 30) return 'D'
  return 'F'
}
