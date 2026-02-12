import { Bell, CheckCheck, Trash2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Notification, NotificationType } from '../notification.service'

interface NotificationCardProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

const getTypeColor = (type: NotificationType): string => {
  switch (type) {
    case 'SUCCESS':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'WARNING':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
    case 'ERROR':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'INFO':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'ANNOUNCEMENT':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    case 'REMINDER':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    case 'ASSIGNMENT':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
    case 'GRADE':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400'
    case 'ATTENDANCE':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
    case 'PAYMENT':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
    case 'EVENT':
      return 'bg-violet-100 text-violet-800 dark:bg-violet-900/20 dark:text-violet-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

export default function NotificationCard({ notification, onMarkAsRead, onDelete }: NotificationCardProps) {
  return (
    <Card className={`overflow-hidden transition-all ${!notification.readStatus ? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${!notification.readStatus ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <Bell className={`h-5 w-5 ${!notification.readStatus ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-base">{notification.title}</h3>
                  {!notification.readStatus && (
                    <Badge variant="default" className="text-xs bg-blue-600">New</Badge>
                  )}
                  <Badge className={`text-xs ${getTypeColor(notification.notificationType)}`}>
                    {notification.notificationType}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatDate(notification.sentAt)}</span>
                {notification.readAt && (
                  <span className="text-xs text-green-600 dark:text-green-400">• Read</span>
                )}
              </div>

              <div className="flex gap-1">
                {!notification.readStatus && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="h-8 px-2"
                  >
                    <CheckCheck className="h-4 w-4 mr-1" />
                    <span className="text-xs">Mark Read</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(notification.id)}
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
