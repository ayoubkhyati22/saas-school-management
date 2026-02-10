import { Eye, Edit, Trash2, BookOpen, Code, Power, PowerOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Speciality } from '../api/speciality.service'

interface SpecialityCardProps {
  speciality: Speciality
  onView: (id: string) => void
  onEdit: (speciality: Speciality) => void
  onDelete: (id: string, name: string) => void
  onToggleStatus: (id: string, currentStatus: boolean) => void
}

export default function SpecialityCard({ 
  speciality, 
  onView, 
  onEdit, 
  onDelete,
  onToggleStatus 
}: SpecialityCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-12 w-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-base font-bold">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">
                {speciality.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Code className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{speciality.code}</span>
              </div>
            </div>
          </div>
          <Badge variant={speciality.active ? 'success' : 'secondary'}>
            {speciality.active ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {speciality.description && (
          <div className="mb-3">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {speciality.description}
            </p>
          </div>
        )}

        <div className="flex justify-between text-xs text-muted-foreground mb-3">
          <span>Created: {formatDate(speciality.createdAt)}</span>
        </div>

        <div className="flex gap-2 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(speciality.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(speciality)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(speciality.id, speciality.active)}
            className={speciality.active ? 'text-amber-600' : 'text-green-600'}
          >
            {speciality.active ? (
              <PowerOff className="h-4 w-4" />
            ) : (
              <Power className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(speciality.id, speciality.name)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
