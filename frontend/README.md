# School SaaS Platform - Frontend

A modern, production-ready React application for managing school operations with role-based dashboards, real-time features, and comprehensive school management capabilities.

## 🚀 Features

### Core Features
- **Role-Based Access Control** - 5 distinct user roles with customized dashboards
- **Authentication & Authorization** - JWT-based authentication with automatic token refresh
- **Dark/Light Mode** - System-aware theme switching
- **Real-time Notifications** - Toast notifications and notification center
- **Responsive Design** - Mobile-first, works on all screen sizes
- **Type-Safe** - Full TypeScript support throughout the application

### User Roles & Dashboards

#### 1. Super Admin
- Platform-wide metrics and analytics
- School management and subscriptions
- System-wide issue tracking
- Revenue and growth analytics

#### 2. School Admin
- Student and teacher management
- Classroom and course organization
- Event scheduling and management
- Payment tracking and financial overview
- Attendance monitoring

#### 3. Teacher
- Course and class management
- Student attendance tracking
- Assignment and material uploads
- Communication with students and parents

#### 4. Student
- Class schedule and materials
- Attendance records
- Event calendar
- Payment status

#### 5. Parent
- Children's academic progress
- Attendance monitoring
- Payment management
- Communication with teachers

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **Shadcn/ui** - UI component library
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Sonner** - Toast notifications

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8080`

## 🚀 Getting Started

### 1. Installation

```bash
cd frontend
npm install
```

### 2. Environment Configuration

The `.env` file is already configured for local development:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

## 🔐 Demo Credentials

### Super Admin
- **Email**: `admin@schoolsaas.com`
- **Password**: `SuperAdmin@123`

### School Admin (Green Valley High School)
- **Email**: `admin@greenvalley.edu`
- **Password**: `SchoolAdmin@123`

### Teacher
- **Email**: `math.teacher@greenvalley.edu`
- **Password**: `Teacher@123`

### Student
- **Email**: `alice.student@greenvalley.edu`
- **Password**: `Student@123`

### Parent
- **Email**: `parent1@example.com`
- **Password**: `Parent@123`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/                    # API client and services
│   ├── components/
│   │   ├── ui/                # Shadcn UI components
│   │   └── layout/            # Layout components (Sidebar, Topbar)
│   ├── features/              # Feature modules
│   │   ├── auth/              # Authentication
│   │   └── dashboard/         # Role-based dashboards
│   ├── lib/                   # Utilities and helpers
│   ├── store/                 # Zustand state stores
│   ├── types/                 # TypeScript type definitions
│   ├── App.tsx                # Main app with routing
│   └── main.tsx               # Entry point
├── .env                       # Environment variables
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
└── vite.config.ts             # Vite configuration
```

## 🎨 Design System

### Theme
- **Primary Color**: Blue (Professional, trustworthy)
- **Dark/Light Mode**: Fully supported with smooth transitions
- **Typography**: System fonts for optimal performance
- **Spacing**: 4px, 8px, 12px, 16px grid system

### Components
- Compact, dense layouts for maximum content visibility
- Consistent spacing and padding
- Subtle shadows and borders
- Smooth transitions and hover effects

## 🔧 Key Features Explained

### Authentication
- JWT-based authentication with automatic token refresh
- Protected routes based on user roles
- Persistent login state across browser sessions

### State Management
- **Auth Store**: User authentication state
- **Theme Store**: Dark/light mode preference
- **Sidebar Store**: Sidebar collapsed/expanded state
- **Notification Store**: Notification management

### API Integration
- Centralized Axios instance with interceptors
- Automatic JWT token injection
- Token refresh on 401 errors
- Global error handling with user-friendly messages

### Routing
- Role-based navigation menus
- Protected routes with automatic redirects
- Unauthorized access handling

## 🚀 Development Workflow

### Running the Application

1. Ensure the backend is running on `http://localhost:8080`
2. Start the frontend dev server: `npm run dev`
3. Open `http://localhost:3000` in your browser
4. Login with any of the demo credentials

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📦 Available Scripts

```json
{
  "dev": "vite",           // Start development server
  "build": "vite build",   // Build for production
  "preview": "vite preview" // Preview production build
}
```

## 🔒 Security Features

- JWT token storage in localStorage
- Automatic token refresh mechanism
- Protected routes with role-based access control
- XSS protection through React
- CORS handling

## 🎯 Current Implementation Status

### ✅ Completed
- Project setup and configuration
- TypeScript types for all API models
- API client with Axios interceptors
- Authentication system (login, protected routes)
- Zustand stores for state management
- Layout components (Sidebar, Topbar, AppLayout)
- Dark/light theme system
- All 5 role-based dashboards
- Core UI components (Button, Input, Card, Label)

### 🔄 Ready for Extension
- Feature modules (Students, Teachers, Courses, etc.)
- Data visualization with Recharts
- Form validation with React Hook Form + Zod
- Advanced CRUD operations
- Real-time notifications
- Document management
- Payment processing

## 🤝 Development Guidelines

### Adding New Features

1. Create a new folder in `src/features/[feature-name]/`
2. Add API service in `src/api/[feature-name].service.ts`
3. Create components and pages
4. Add routes in `App.tsx`
5. Update navigation in `Sidebar.tsx` if needed

### Using UI Components

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click Me</Button>
      </CardContent>
    </Card>
  )
}
```

### API Calls with React Query

```tsx
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/client'

const { data, isLoading, error } = useQuery({
  queryKey: ['students'],
  queryFn: async () => {
    const response = await apiClient.get('/students')
    return response.data.data
  },
})
```

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)
- [React Query Documentation](https://tanstack.com/query/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

## 💬 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ using modern web technologies**
