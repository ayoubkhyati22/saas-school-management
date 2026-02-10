import { Eye, Edit, Trash2, BookOpen, Code, Calendar, Power, PowerOff, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Speciality } from '../api/speciality.service'

interface SpecialityTableProps {
  specialities: Speciality[]
  onView: (id: string) => void
  onEdit: (speciality: Speciality) => void
  onDelete: (id: string, name: string) => void
  onToggleStatus: (id: string, currentStatus: boolean) => void
}

export default function SpecialityTable({ 
  specialities, 
  onView, 
  onEdit, 
  onDelete,
  onToggleStatus 
}: SpecialityTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Speciality Name
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Code
            </div>
          </TableHead>
          <TableHead>Description</TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Power className="h-4 w-4" />
              Status
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Created At
            </div>
          </TableHead>
          <TableHead className="text-right">
            <div className="flex items-center justify-end gap-2">
              <Settings className="h-4 w-4" />
              Actions
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {specialities.map((speciality) => (
          <TableRow key={speciality.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">
                    <b>{speciality.name}</b>
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="font-mono text-sm font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-md">
                {speciality.code}
              </span>
            </TableCell>
            <TableCell>
              {speciality.description ? (
                <span className="text-sm line-clamp-2">{speciality.description}</span>
              ) : (
                <span className="text-muted-foreground text-sm">-</span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={speciality.active ? 'success' : 'secondary'}>
                {speciality.active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(speciality.createdAt)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1.5">
                {/* View */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(speciality.id)}
                  title="View Details"
                  className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 group/btn"
                >
                  <Eye className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Edit */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(speciality)}
                  title="Edit"
                  className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-all duration-200 group/btn"
                >
                  <Edit className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Toggle Status */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleStatus(speciality.id, speciality.active)}
                  title={speciality.active ? 'Deactivate' : 'Activate'}
                  className={`h-9 w-9 rounded-lg transition-all duration-200 group/btn ${
                    speciality.active
                      ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700'
                      : 'bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700'
                  }`}
                >
                  {speciality.active ? (
                    <PowerOff className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                  ) : (
                    <Power className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                  )}
                </Button>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(speciality.id, speciality.name)}
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
