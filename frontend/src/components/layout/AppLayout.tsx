import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useSidebarStore } from '@/store/sidebar.store'

export default function AppLayout() {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Topbar />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
