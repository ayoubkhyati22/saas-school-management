import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { eventService, EVENT_TYPE_LABELS, EVENT_TYPE_COLORS, TARGET_ROLE_LABELS } from '../api/event.service'
import { formatDate, formatDateTime } from '@/lib/utils'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  User,
  FileText
} from 'lucide-react'

interface EventDetailDialogProps {
  open: boolean
  onClose: () => void
  eventId: string
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

export default function EventDetailDialog({ open, onClose, eventId }: EventDetailDialogProps) {
  const { data: event, isLoading } = useQuery({
    queryKey: ['events', eventId],
    queryFn: () => eventService.getById(eventId),
    enabled: open && !!eventId,
  })

  const isUpcoming = event ? new Date(event.eventDate) > new Date() : false

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Event Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : event ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className={`h-16 w-16 rounded-lg flex items-center justify-center ${
                isUpcoming 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gray-400'
              }`}>
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{event.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getEventTypeBadgeClass(event.eventType)}>
                    {EVENT_TYPE_LABELS[event.eventType]}
                  </Badge>
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    {TARGET_ROLE_LABELS[event.targetRole]}
                  </Badge>
                  {isUpcoming ? (
                    <Badge variant="default" className="bg-green-100 text-green-700 border-green-300">
                      Upcoming
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Past Event</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-4">
              
              {/* Date & Time */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Date & Time
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-md bg-white dark:bg-gray-900">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Event Date</p>
                        <p className="font-medium text-lg">{formatDateTime(event.eventDate)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              {event.description && (
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Description
                    </h3>
                    <div className="p-3 rounded-md bg-white dark:bg-gray-900">
                      <p className="text-sm whitespace-pre-wrap">{event.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Location & Target Audience */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Additional Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm p-3 rounded-md bg-white dark:bg-gray-900">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span>Location</span>
                      </div>
                      <span className="font-medium text-right">
                        {event.location || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-3 rounded-md bg-white dark:bg-gray-900">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <span>Target Audience</span>
                      </div>
                      <span className="font-medium">{TARGET_ROLE_LABELS[event.targetRole]}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Information */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    System Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <span className="text-muted-foreground">Created At</span>
                      <span className="font-medium">{formatDate(event.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="font-medium">{formatDate(event.updatedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        ) : (
          <div className="text-center py-8">Event not found</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
