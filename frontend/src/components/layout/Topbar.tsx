import { Bell, Moon, Sun, LogOut, User, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { useThemeStore } from '@/store/theme.store'
import { useNotificationStore } from '@/store/notification.store'


export default function Topbar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const unreadCount = useNotificationStore((state) => state.unreadCount)

  // Debug log
  console.log('=== TOPBAR DEBUG ===')
  console.log('User in topbar:', user)
  console.log('User firstName:', user?.firstName)
  console.log('==================')

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Get display name with fallback
  const displayName = user?.firstName || user?.email?.split('@')[0] || 'User'

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-white">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">
            Welcome, {displayName}!
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title="Toggle theme"
            className="text-slate-900 hover:bg-slate-800 hover:text-white transition"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button> */}

         
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (window.location.href = "/notifications")}
            className="relative text-slate-900 hover:bg-slate-800 hover:text-white transition"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </Button>


          <Button
            variant="ghost"
            size="icon"
            title="Profile"
            onClick={() => (window.location.href = "/profile")}
            className="text-slate-900 hover:bg-slate-800 hover:text-white transition"
          >
            <User className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Logout"
            className="text-slate-900 hover:bg-red-500 hover:text-white transition"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}