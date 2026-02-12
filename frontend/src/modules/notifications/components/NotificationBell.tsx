import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Bell, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { notificationService } from '../notification.service'
import { queryClient } from '@/lib/queryClient'
import { formatDate } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

export default function NotificationBell() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const { data: unreadCount } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const { data: unreadNotifications } = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: () => notificationService.getUnread(),
    enabled: open,
  })

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount && unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount && unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              className="h-6 text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-96 overflow-y-auto">
          {!unreadNotifications || unreadNotifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No new notifications
            </div>
          ) : (
            <>
              {unreadNotifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start p-3 cursor-pointer"
                  onClick={() => {
                    markAsReadMutation.mutate(notification.id)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(notification.sentAt)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs ml-2 shrink-0">
                      {notification.notificationType}
                    </Badge>
                  </div>
                </DropdownMenuItem>
              ))}
            </>
          )}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-center text-sm text-blue-600 cursor-pointer justify-center"
          onClick={() => {
            navigate('/notifications')
            setOpen(false)
          }}
        >
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
