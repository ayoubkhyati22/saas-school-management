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
import SpecialityListPage from './modules/specialities/pages/SpecialityListPage'
import StudentListPage from './modules/students/pages/StudentListPage'
import TeacherListPage from './modules/teachers/pages/TeacherListPage'
import ParentListPage from './modules/parents/pages/ParentListPage'
import ClassroomListPage from './modules/classrooms/pages/ClassRoomListPage'
import CourseListPage from './modules/courses/pages/CourseListPage'
import EventListPage from './modules/events/pages/EventListPage'
import AbsenceListPage from './modules/absences/pages/AbsenceListPage'
import TransportListPage from './modules/transports/pages/TransportListPage'
import TimeListPage from './modules/times/pages/TimeListPage'
import ExamListPage from './modules/exams/pages/ExamListPage'
import NoteListPage from './modules/notes/pages/NoteListPage'
import PaymentListPage from './modules/payments/pages/PaymentListPage'
import NotificationListPage from './modules/notifications/pages/NotificationListPage'
import IssueListPage from './features/issues/IssueListPage'
import DocumentListPage from './features/documents/DocumentListPage'
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
              <Route path="/teachers" element={<TeacherListPage />} />
              <Route path="/parents" element={<ParentListPage />} />
              <Route path="/classrooms" element={<ClassroomListPage />} />
              <Route path="/specialities" element={<SpecialityListPage />} />
              <Route path="/courses" element={<CourseListPage />} />
              <Route path="/events" element={<EventListPage />} />
              <Route path="/absences" element={<AbsenceListPage />} />
              <Route path="/transports" element={<TransportListPage />} />
              <Route path="/times" element={<TimeListPage />} />
              <Route path="/exams" element={<ExamListPage />} />
              <Route path="/notes" element={<NoteListPage />} />

              <Route path="/payments" element={<PaymentListPage />} />
              <Route path="/notifications" element={<NotificationListPage />} />
              <Route path="/issues" element={<IssueListPage />} />
              <Route path="/documents" element={<DocumentListPage />} />
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
