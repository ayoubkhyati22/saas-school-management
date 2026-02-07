import { useAuthStore } from '@/store/auth.store'
import { Role } from '@/types'
import SuperAdminDashboard from './SuperAdminDashboard'
import SchoolAdminDashboard from './SchoolAdminDashboard'
import TeacherDashboard from './TeacherDashboard'
import StudentDashboard from './StudentDashboard'
import ParentDashboard from './ParentDashboard'

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)

  if (!user) return null

  switch (user.role) {
    case Role.SUPER_ADMIN:
      return <SuperAdminDashboard />
    case Role.SCHOOL_ADMIN:
      return <SchoolAdminDashboard />
    case Role.TEACHER:
      return <TeacherDashboard />
    case Role.STUDENT:
      return <StudentDashboard />
    case Role.PARENT:
      return <ParentDashboard />
    default:
      return <div>Invalid role</div>
  }
}
