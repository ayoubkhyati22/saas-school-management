import { Eye, Edit, Trash2, Calendar, MapPin, Users, Clock, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import type { Event } from '../api/event.service'
import { EVENT_TYPE_LABELS, EVENT_TYPE_COLORS, TARGET_ROLE_LABELS } from '../api/event.service'

interface EventTableProps {
  events: Event[]
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

export default function EventTable({ events, onView, onEdit, onDelete }: EventTableProps) {
  const isUpcoming = (date: string) => new Date(date) > new Date()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Event
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Date & Time
            </div>
          </TableHead>
          <TableHead>Type</TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Target
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </div>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">
            <div className="flex items-center justify-end gap-2">
              <Settings className="h-4 w-4" />
              Actions
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id} className={!isUpcoming(event.eventDate) ? 'opacity-60' : ''}>
            <TableCell className="font-medium">
              <div>
                <div className="font-semibold text-base">{event.title}</div>
                {event.description && (
                  <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                    {event.description}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formatDateTime(event.eventDate)}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getEventTypeBadgeClass(event.eventType)}>
                {EVENT_TYPE_LABELS[event.eventType]}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                <Users className="h-3 w-3 mr-1" />
                {TARGET_ROLE_LABELS[event.targetRole]}
              </Badge>
            </TableCell>
            <TableCell>
              {event.location ? (
                <span className="text-sm">{event.location}</span>
              ) : (
                <span className="text-muted-foreground text-sm">Not specified</span>
              )}
            </TableCell>
            <TableCell>
              {isUpcoming(event.eventDate) ? (
                <Badge variant="default" className="bg-green-100 text-green-700 border-green-300">
                  Upcoming
                </Badge>
              ) : (
                <Badge variant="secondary">Past</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1.5">
                {/* View */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(event.id)}
                  title="View Details"
                  className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 group/btn"
                >
                  <Eye className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Edit */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(event)}
                  title="Edit"
                  className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-all duration-200 group/btn"
                >
                  <Edit className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                </Button>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(event.id, event.title)}
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
