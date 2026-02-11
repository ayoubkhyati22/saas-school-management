import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { eventService, EVENT_TYPE_LABELS, EVENT_TYPE_COLORS, TARGET_ROLE_LABELS } from '../api/event.service'
import { formatDateTime } from '@/lib/utils'

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

export default function UpcomingEventsWidget() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events-upcoming'],
    queryFn: () => eventService.getUpcomingEvents(),
  })

  if (isLoading) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  const upcomingEvents = events?.slice(0, 5) || []

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Events
          {upcomingEvents.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {upcomingEvents.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-base">{event.title}</h4>
                  <Badge className={`${getEventTypeBadgeClass(event.eventType)} text-xs`}>
                    {EVENT_TYPE_LABELS[event.eventType]}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDateTime(event.eventDate)}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{TARGET_ROLE_LABELS[event.targetRole]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No upcoming events</p>
            <p className="text-sm mt-2">Check back later for new events</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
