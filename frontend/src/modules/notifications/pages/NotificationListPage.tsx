import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Bell, CheckCheck, Send, Users, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { notificationService, type Notification } from '../notification.service'
import { queryClient } from '@/lib/queryClient'
import NotificationCard from '../components/NotificationCard'
import NotificationPagination from '../components/NotificationPagination'
import SendNotificationDialog from '../components/SendNotificationDialog'
import SendBulkNotificationDialog from '../components/SendBulkNotificationDialog'

export default function NotificationListPage() {
  const [page, setPage] = useState(0)
  const [activeTab, setActiveTab] = useState('all')
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string } | null>(null)
  const pageSize = 20

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => notificationService.getAll(page, pageSize),
  })

  const { data: unreadCount } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
  })

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
      toast.success('Marked as read', { position: 'bottom-right' })
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
      toast.success(`Marked ${count} notifications as read`, { position: 'bottom-right' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: notificationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
      toast.success('Notification deleted', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
    onError: () => {
      toast.error('Failed to delete notification', { position: 'bottom-right' })
      setDeleteConfirmation(null)
    },
  })

  const totalNotifications = data?.totalElements || 0
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number ?? 0

  const handleDelete = (id: string) => setDeleteConfirmation({ id })
  const confirmDelete = () => {
    if (deleteConfirmation) deleteMutation.mutate(deleteConfirmation.id)
  }

  const unreadNotifications = data?.content.filter(n => !n.readStatus) || []
  const readNotifications = data?.content.filter(n => n.readStatus) || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="h-8 w-8" />
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all notifications · {totalNotifications} total
            {unreadCount && unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">{unreadCount} unread</Badge>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount && unreadCount > 0 && (
            <Button
              onClick={() => markAllAsReadMutation.mutate()}
              variant="outline"
              size="sm"
              disabled={markAllAsReadMutation.isPending}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Mark All Read</span>
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => setIsSendDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsBulkDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Users className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Bulk Send</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 bg-gray-100 p-2 rounded-xl w-full sm:w-auto gap-2">
          <TabsTrigger value="all" className="flex items-center gap-2 rounded-lg">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">All</span>
            <Badge variant="secondary" className="ml-1">{totalNotifications}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center gap-2 rounded-lg">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Unread</span>
            {unreadCount && unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read" className="flex items-center gap-2 rounded-lg">
            <CheckCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Read</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : data?.content.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-lg font-medium">No notifications yet</p>
                  <p className="text-sm text-muted-foreground">
                    You'll see your notifications here
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {data?.content.map((notification: Notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                  <NotificationPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalNotifications}
                    pageSize={pageSize}
                    onPageChange={setPage}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {unreadNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCheck className="h-16 w-16 mx-auto text-green-500 mb-4" />
                  <p className="text-lg font-medium">All caught up!</p>
                  <p className="text-sm text-muted-foreground">
                    No unread notifications
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {unreadNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="read" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Read Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {readNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-lg font-medium">No read notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {readNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SendNotificationDialog
        open={isSendDialogOpen}
        onClose={() => setIsSendDialogOpen(false)}
      />

      <SendBulkNotificationDialog
        open={isBulkDialogOpen}
        onClose={() => setIsBulkDialogOpen(false)}
      />

      <ConfirmationDialog
        open={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={confirmDelete}
        title="Delete Notification"
        description="Are you sure you want to delete this notification? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
