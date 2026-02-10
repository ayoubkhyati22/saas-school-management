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
  Award,
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
    { icon: Award, label: 'Specialities', path: '/specialities' },
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
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { isCollapsed, toggle } = useSidebarStore()

  // Debug logs
  console.log('=== SIDEBAR DEBUG ===')
  console.log('User object:', user)
  console.log('User role:', user?.role)
  console.log('Is authenticated:', isAuthenticated)
  console.log('Available roles:', Object.keys(navigationItems))

  // Get navigation items, with fallback to SCHOOL_ADMIN if role is missing
  let navItems: typeof navigationItems[keyof typeof navigationItems] = []

  if (user?.role && navigationItems[user.role]) {
    navItems = navigationItems[user.role]
    console.log('Using role:', user.role, 'Items count:', navItems.length)
  } else {
    console.warn('No valid role found, using SCHOOL_ADMIN as fallback')
    navItems = navigationItems[Role.SCHOOL_ADMIN]
  }

  console.log('Final nav items:', navItems)
  console.log('==================')

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen border-r bg-slate-900 text-slate-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'
        }`}
    >
      <div className="flex h-full flex-col">

        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-white">
              School SaaS
            </h1>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="h-8 w-8 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {navItems.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400">
              No menu items available
            </div>
          ) : (
            navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))
          )}
        </nav>

        {/* User Profile */}
        {!isCollapsed && user && (
          <div className="border-t border-slate-800 p-4">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                {user.firstName?.[0]?.toUpperCase() || 'U'}
                {user.lastName?.[0]?.toUpperCase() || 'U'}
              </div>

              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate text-white">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email || 'User'}
                </p>

                <p className="text-xs text-slate-400 truncate">
                  {user.role?.replace(/_/g, ' ') || 'No role'}
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </aside>
  )

}