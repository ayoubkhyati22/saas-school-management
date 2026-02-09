import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  School,
  Users,
  GraduationCap,
  UserCircle,
  BookOpen,
  Calendar,
  UserX,
  CreditCard,
  Bell,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useSidebarStore } from '@/store/sidebar.store'
import { Role } from '@/types'
import { Button } from '@/components/ui/button'

const navigationItems = {
  [Role.SUPER_ADMIN]: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: School, label: 'Schools', path: '/schools' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: CreditCard, label: 'Subscriptions', path: '/subscriptions' },
    { icon: AlertCircle, label: 'Issues', path: '/issues' },
  ],
  [Role.SCHOOL_ADMIN]: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Students', path: '/students' },
    { icon: GraduationCap, label: 'Teachers', path: '/teachers' },
    { icon: UserCircle, label: 'Parents', path: '/parents' },
    { icon: School, label: 'Classrooms', path: '/classrooms' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: UserX, label: 'Absences', path: '/absences' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: FileText, label: 'Documents', path: '/documents' },
  ],
  [Role.TEACHER]: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'My Courses', path: '/courses' },
    { icon: Users, label: 'Students', path: '/students' },
    { icon: UserX, label: 'Absences', path: '/absences' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
  ],
  [Role.STUDENT]: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'My Classes', path: '/courses' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: UserX, label: 'My Absences', path: '/absences' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
  ],
  [Role.PARENT]: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'My Children', path: '/students' },
    { icon: UserX, label: 'Absences', path: '/absences' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
  ],
}

export default function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const { isCollapsed, toggle } = useSidebarStore()
  console.log('Sidebar - User object:', user)

  const navItems = user?.role ? navigationItems[user.role] || [] : []

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-primary">
              School SaaS
            </h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                } ${isCollapsed ? 'justify-center' : ''}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {!isCollapsed && user && user.firstName && user.lastName && (
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                {user.firstName[0]?.toUpperCase()}
                {user.lastName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.role.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
