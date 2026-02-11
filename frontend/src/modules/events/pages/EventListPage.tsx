import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Calendar as CalendarIcon, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { eventService, type Event, type TargetRole, TARGET_ROLE_LABELS } from '../api/event.service'
import { queryClient } from '@/lib/queryClient'
import EventFormDialog from '../components/EventFormDialog'
import EventDetailDialog from '../components/EventDetailDialog'
import EventTable from '../components/EventTable'
import EventCard from '../components/EventCard'
import EventPagination from '../components/EventPagination'
import UpcomingEventsWidget from '../components/UpcomingEventsWidget'

export default function EventListPage() {
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [viewingEventId, setViewingEventId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [filterRole, setFilterRole] = useState<TargetRole | 'ALL'>('ALL')
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null)
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['events', page, activeTab, filterRole],
    queryFn: () => {
      if (activeTab === 'upcoming') {
        return eventService.getUpcomingEvents().then(events => ({
          content: events,
          totalElements: events.length,
          totalPages: 1,
          number: 0,
        }))
      }
      return eventService.getAll(page, pageSize)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: eventService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events-upcoming'] })
      toast.success('Event deleted successfully', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
    onError: () => {
      toast.error('Failed to delete event', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
  })

  const totalEvents = data?.totalElements || 0
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number ?? 0

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirmation({ id, name })
  }

  const confirmDelete = () => {
    if (deleteConfirmation) {
      deleteMutation.mutate(deleteConfirmation.id)
    }
  }

  // Filter events by target role
  const filteredEvents = filterRole === 'ALL' 
    ? data?.content || []
    : (data?.content || []).filter(event => 
        event.targetRole === filterRole || event.targetRole === 'ALL'
      )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            Events
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage school events and activities · {totalEvents} total
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="mr-2 size-4" />
            <span className="hidden sm:inline">Add Event</span>
          </Button>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid grid-cols-2 bg-gray-100 p-2 rounded-xl w-full sm:w-auto gap-2">
            <TabsTrigger
              value="all"
              className="flex items-center gap-2 rounded-lg transition-all hover:bg-blue-50 hover:text-blue-600"
            >
              <CalendarIcon className="size-4" />
              <span className="hidden sm:inline">All Events</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="flex items-center gap-2 rounded-lg transition-all hover:bg-blue-50 hover:text-blue-600"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Upcoming</span>
              <span className="sm:hidden">Upcoming</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filter by Target Role */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={filterRole}
            onValueChange={(value) => setFilterRole(value as TargetRole | 'ALL')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Audiences</SelectItem>
              {Object.entries(TARGET_ROLE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Upcoming Events Widget (shown on all events tab) */}
      {/* {activeTab === 'all' && (
        <UpcomingEventsWidget />
      )} */}

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'upcoming' ? 'Upcoming Events' : 'All Events'}
            {filterRole !== 'ALL' && ` (${TARGET_ROLE_LABELS[filterRole]})`}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg font-medium text-muted-foreground">
                No events found
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {activeTab === 'upcoming' 
                  ? 'There are no upcoming events scheduled'
                  : 'Click "Add Event" to create your first event'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <EventTable
                  events={filteredEvents}
                  onView={setViewingEventId}
                  onEdit={setEditingEvent}
                  onDelete={handleDelete}
                />
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredEvents.map((event: Event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onView={setViewingEventId}
                    onEdit={setEditingEvent}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Pagination (only for all events) */}
              {activeTab === 'all' && (
                <EventPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalEvents}
                  pageSize={pageSize}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <EventFormDialog
        open={isCreateOpen || !!editingEvent}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingEvent(null)
        }}
        event={editingEvent}
      />

      {viewingEventId && (
        <EventDetailDialog
          open={!!viewingEventId}
          onClose={() => setViewingEventId(null)}
          eventId={viewingEventId}
        />
      )}

      <ConfirmationDialog
        open={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={confirmDelete}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        itemName={deleteConfirmation?.name}
        confirmText="Delete Event"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
