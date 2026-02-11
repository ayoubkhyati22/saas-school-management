import { Eye, Edit, Trash2, Calendar, BookOpen, User, CheckCircle, XCircle, FileText, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Absence } from '../api/absence.service'

interface AbsenceTableProps {
  absences: Absence[]
  onView: (id: string) => void
  onEdit: (absence: Absence) => void
  onDelete: (id: string, info: string) => void
  onJustify: (absence: Absence) => void
  canJustify?: boolean
}

export default function AbsenceTable({ 
  absences, 
  onView, 
  onEdit, 
  onDelete, 
  onJustify,
  canJustify = false 
}: AbsenceTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Student
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reason
            </div>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reported By</TableHead>
          <TableHead className="text-right">
            <div className="flex items-center justify-end gap-2">
              <Settings className="h-4 w-4" />
              Actions
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {absences.map((absence) => (
          <TableRow key={absence.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  absence.justified ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <User className={`h-4 w-4 ${absence.justified ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <span className="font-medium">{absence.studentName}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formatDate(absence.date)}</span>
              </div>
            </TableCell>
            <TableCell>{absence.courseSubject}</TableCell>
            <TableCell>
              {absence.reason ? (
                <span className="text-sm line-clamp-2">{absence.reason}</span>
              ) : (
                <span className="text-muted-foreground text-sm">No reason provided</span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={absence.justified ? 'success' : 'destructive'}>
                {absence.justified ? (
                  <><CheckCircle className="h-3 w-3 mr-1" /> Justified</>
                ) : (
                  <><XCircle className="h-3 w-3 mr-1" /> Unjustified</>
                )}
              </Badge>
            </TableCell>
            <TableCell>
              {absence.reportedByName ? (
                <span className="text-sm">{absence.reportedByName}</span>
              ) : (
                <span className="text-muted-foreground text-sm">Unknown</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1.5">
                {/* View */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(absence.id)}
                  title="View Details"
                  className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 group/btn"
                >
                  <Eye className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Justify (if not already justified and user has permission) */}
                {!absence.justified && canJustify && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onJustify(absence)}
                    title="Justify Absence"
                    className="h-9 w-9 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all duration-200 group/btn"
                  >
                    <CheckCircle className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                  </Button>
                )}

                {/* Edit */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(absence)}
                  title="Edit"
                  className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-all duration-200 group/btn"
                >
                  <Edit className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(absence.id, `${absence.studentName} - ${formatDate(absence.date)}`)}
                  title="Delete"
                  className="h-9 w-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 group/btn"
                >
                  <Trash2 className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
