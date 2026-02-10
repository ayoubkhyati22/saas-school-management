import { Eye, Mail, Phone, Edit, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Parent } from '../api/parent.service'

interface ParentCardProps {
  parent: Parent
  onView: (id: string) => void
  onEdit: (parent: Parent) => void
  onDelete: (id: string, name: string) => void
}

export default function ParentCard({ parent, onView, onEdit, onDelete }: ParentCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-base font-bold">
              {parent.firstName?.[0]}
              {parent.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">
                {parent.firstName} {parent.lastName}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{parent.email}</p>
              {parent.occupation && (
                <Badge variant="secondary" className="mt-1">
                  {parent.occupation}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground truncate">{parent.phoneNumber}</span>
          </div>
          {parent.address && (
            <div className="flex items-start gap-2">
              <Users className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
              <span className="text-muted-foreground text-xs line-clamp-2">{parent.address}</span>
            </div>
          )}
          <div className="flex justify-between pt-1">
            <span className="text-xs text-muted-foreground">Joined:</span>
            <span className="text-xs font-medium">{formatDate(parent.createdAt)}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(parent.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.location.href = `mailto:${parent.email}`}
          >
            <Mail className="h-4 w-4 mr-1" />
            Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(parent)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(parent.id, `${parent.firstName} ${parent.lastName}`)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
