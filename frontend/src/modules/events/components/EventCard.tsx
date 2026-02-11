import { Eye, Edit, Trash2, Calendar, MapPin, Users, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatDateTime } from '@/lib/utils'
import type { Event } from '../api/event.service'
import { EVENT_TYPE_LABELS, EVENT_TYPE_COLORS, TARGET_ROLE_LABELS } from '../api/event.service'

interface EventCardProps {
  event: Event
  onView: (id: string) => void
  onEdit: (event: Event) => void
  onDelete: (id: string, name: string) => void
}

const getEventTypeBadgeClass = (eventType: string) => {
  const color = EVENT_TYPE_COLORS[eventType as keyof typeof EVENT_TYPE_COLORS] || 'gray'
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 border-blue-300',
    red: 'bg-red-100 text-red-700 border-red-300',
    green: 'bg-green-100 text-green-700 border-green-300',
    orange: 'bg-orange-100 text-orange-700 border-orange-300',
    purple: 'bg-purple-100 text-purple-700 border-purple-300',
    cyan: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    pink: 'bg-pink-100 text-pink-700 border-pink-300',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    gray: 'bg-gray-100 text-gray-700 border-gray-300',
  }
  return colorMap[color] || colorMap.gray
}

export default function EventCard({ event, onView, onEdit, onDelete }: EventCardProps) {
  const isUpcoming = new Date(event.eventDate) > new Date()

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${!isUpcoming ? 'opacity-75' : ''}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
              isUpcoming ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gray-400'
            }`}>
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(event.eventDate)}
              </p>
            </div>
          </div>
          {!isUpcoming && (
            <Badge variant="secondary" className="text-xs">
              Past Event
            </Badge>
          )}
        </div>

        {event.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Badge className={getEventTypeBadgeClass(event.eventType)}>
              {EVENT_TYPE_LABELS[event.eventType]}
            </Badge>
            <Badge variant="outline">
              <Users className="h-3 w-3 mr-1" />
              {TARGET_ROLE_LABELS[event.targetRole]}
            </Badge>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{event.location}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(event.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(event)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(event.id, event.title)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
