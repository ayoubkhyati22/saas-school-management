import { Eye, Mail, Phone, Edit, Trash2, User, Users, Briefcase, MapPin, Calendar, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Parent } from '../api/parent.service'

interface ParentTableProps {
  parents: Parent[]
  onView: (id: string) => void
  onEdit: (parent: Parent) => void
  onDelete: (id: string, name: string) => void
}

export default function ParentTable({ parents, onView, onEdit, onDelete }: ParentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Parent
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Occupation
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Joined Date
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
        {parents.map((parent) => (
          <TableRow key={parent.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                  {parent.firstName?.[0]}
                  {parent.lastName?.[0]}
                </div>
                <div>
                  <div className="font-medium">
                    <b>{parent.firstName} {parent.lastName}</b>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-gray-500">{parent.email}</span>
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm">{parent.phoneNumber}</span>
            </TableCell>
            <TableCell>
              {parent.occupation ? (
                <Badge variant="secondary">{parent.occupation}</Badge>
              ) : (
                <span className="text-muted-foreground text-sm">-</span>
              )}
            </TableCell>
            <TableCell>
              {parent.address ? (
                <span className="text-sm line-clamp-2">{parent.address}</span>
              ) : (
                <span className="text-muted-foreground text-sm">-</span>
              )}
            </TableCell>
            <TableCell>{formatDate(parent.createdAt)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1.5">
                {/* View */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(parent.id)}
                  title="View Details"
                  className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 group/btn"
                >
                  <Eye className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Email */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.location.href = `mailto:${parent.email}`}
                  title="Send Email"
                  className="h-9 w-9 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700 transition-all duration-200 group/btn"
                >
                  <Mail className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Call */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.location.href = `tel:${parent.phoneNumber}`}
                  title="Call"
                  className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200 group/btn"
                >
                  <Phone className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Edit */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(parent)}
                  title="Edit"
                  className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-all duration-200 group/btn"
                >
                  <Edit className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(parent.id, `${parent.firstName} ${parent.lastName}`)}
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
