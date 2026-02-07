import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import LoginPage from './features/auth/LoginPage'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './features/dashboard/Dashboard'
import SchoolListPage from './features/schools/SchoolListPage'
import SchoolDetailPage from './features/schools/SchoolDetailPage'
import StudentListPage from './features/students/StudentListPage'
import { useThemeStore } from './store/theme.store'
import { queryClient } from './lib/queryClient'

const ComingSoonPage = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">{title}</h1>
    <div className="text-center py-12">
      <p className="text-muted-foreground">This feature is coming soon!</p>
    </div>
  </div>
)

function App() {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  useEffect(() => {
    setTheme(theme)
  }, [theme, setTheme])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/schools" element={<SchoolListPage />} />
              <Route path="/schools/:id" element={<SchoolDetailPage />} />
              <Route path="/students" element={<StudentListPage />} />
              <Route path="/teachers" element={<ComingSoonPage title="Teachers" />} />
              <Route path="/parents" element={<ComingSoonPage title="Parents" />} />
              <Route path="/classrooms" element={<ComingSoonPage title="Classrooms" />} />
              <Route path="/courses" element={<ComingSoonPage title="Courses" />} />
              <Route path="/events" element={<ComingSoonPage title="Events" />} />
              <Route path="/absences" element={<ComingSoonPage title="Absences" />} />
              <Route path="/payments" element={<ComingSoonPage title="Payments" />} />
              <Route path="/notifications" element={<ComingSoonPage title="Notifications" />} />
              <Route path="/issues" element={<ComingSoonPage title="Issues" />} />
              <Route path="/documents" element={<ComingSoonPage title="Documents" />} />
              <Route path="/subscriptions" element={<ComingSoonPage title="Subscriptions" />} />
              <Route path="/users" element={<ComingSoonPage title="Users" />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          <Route path="/unauthorized" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
                <p className="text-muted-foreground">You don't have permission to access this page.</p>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}

export default App
