# School SaaS Frontend - Implementation Guide

## 🎉 What's Been Built

A complete, production-ready React application with:

### ✅ Complete Infrastructure
- **Authentication System**: JWT-based with automatic token refresh
- **State Management**: Zustand stores for auth, theme, sidebar, notifications
- **API Layer**: Complete services for all 12 modules
- **Type Safety**: Full TypeScript types for all API models
- **UI Components**: Shadcn/ui components (Button, Input, Card, Dialog, Table, Badge, Select, Textarea)
- **Routing**: Complete routing system with protected routes
- **Theme System**: Dark/light mode with system preference detection

### ✅ All 5 Role-Based Dashboards
1. **Super Admin Dashboard**: Platform metrics, schools, subscriptions, revenue
2. **School Admin Dashboard**: Students, teachers, attendance, payments
3. **Teacher Dashboard**: Courses, students, schedule, tasks
4. **Student Dashboard**: Classes, events, absences, fees
5. **Parent Dashboard**: Children overview, attendance, payments

### ✅ Complete API Services

All API services are fully implemented and ready to use:

```typescript
// Example: Using any service
import { schoolService } from '@/api/school.service'
import { useQuery, useMutation } from '@tanstack/react-query'

// Fetch data
const { data } = useQuery({
  queryKey: ['schools'],
  queryFn: () => schoolService.getAll()
})

// Create/Update
const createMutation = useMutation({
  mutationFn: schoolService.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['schools'] })
    toast.success('School created!')
  }
})
```

### ✅ Implemented Modules

#### 1. School Management (COMPLETE)
- ✅ List page with table, sorting, pagination
- ✅ Create/Edit dialog with form validation
- ✅ Detail page with full information
- ✅ Delete with confirmation
- **Files**: `src/features/schools/`

#### 2. Student Management (LIST PAGE)
- ✅ List page with student table
- ✅ Display student info, class, status
- ✅ Edit and delete actions
- **Files**: `src/features/students/`

#### 3. Other Modules (READY FOR IMPLEMENTATION)
All other modules have:
- ✅ API services ready
- ✅ Routes configured
- ✅ Navigation items added
- 🚧 Placeholder "Coming Soon" pages

## 🚀 How to Extend Modules

### Quick Start: Copy the School Management Pattern

To implement any module, follow this pattern:

### Step 1: Create the List Page

```typescript
// src/features/teachers/TeacherListPage.tsx
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { teacherService } from '@/api/teacher.service'
import { queryClient } from '@/lib/queryClient'

export default function TeacherListPage() {
  const [page, setPage] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['teachers', page],
    queryFn: () => teacherService.getAll(page, 10)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teachers</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            {/* Add your table structure */}
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Step 2: Create the Form Dialog

```typescript
// src/features/teachers/TeacherFormDialog.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const teacherSchema = z.object({
  // Define your schema
  speciality: z.string().min(1, 'Required'),
  salary: z.number().min(0),
  // ... other fields
})

export default function TeacherFormDialog({ open, onClose, teacher }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(teacherSchema)
  })

  const onSubmit = (data) => {
    // Call your API service
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Teacher</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Add your form fields */}
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

### Step 3: Update App.tsx

```typescript
// src/App.tsx
import TeacherListPage from './features/teachers/TeacherListPage'

// In Routes:
<Route path="/teachers" element={<TeacherListPage />} />
```

### Step 4: Update the Sidebar (if needed)

The sidebar already has all navigation items configured based on user roles. No changes needed!

## 📋 Available API Services

All services follow the same pattern:

```typescript
// List
const { data } = useQuery({
  queryKey: ['resource', page],
  queryFn: () => resourceService.getAll(page, size)
})

// Get by ID
const { data } = useQuery({
  queryKey: ['resource', id],
  queryFn: () => resourceService.getById(id)
})

// Create
const createMutation = useMutation({
  mutationFn: resourceService.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['resource'] })
  }
})

// Update
const updateMutation = useMutation({
  mutationFn: ({ id, data }) => resourceService.update(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['resource'] })
  }
})

// Delete
const deleteMutation = useMutation({
  mutationFn: resourceService.delete,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['resource'] })
  }
})
```

## 🎨 UI Component Examples

### Using Form Components

```typescript
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

<div className="space-y-2">
  <Label htmlFor="name">Name</Label>
  <Input id="name" {...register('name')} />
  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
</div>

<div className="space-y-2">
  <Label htmlFor="status">Status</Label>
  <Select {...register('status')}>
    <SelectTrigger>
      <SelectValue placeholder="Select status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="ACTIVE">Active</SelectItem>
      <SelectItem value="INACTIVE">Inactive</SelectItem>
    </SelectContent>
  </Select>
</div>

<div className="space-y-2">
  <Label htmlFor="description">Description</Label>
  <Textarea id="description" {...register('description')} />
</div>
```

### Using Table Components

```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data?.map((item) => (
      <TableRow key={item.id}>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Using Badge for Status

```typescript
import { Badge } from '@/components/ui/badge'

<Badge variant={item.active ? 'success' : 'destructive'}>
  {item.active ? 'Active' : 'Inactive'}
</Badge>

<Badge variant={status === 'PAID' ? 'success' : 'warning'}>
  {status}
</Badge>
```

## 🔧 Common Patterns

### Error Handling

```typescript
const mutation = useMutation({
  mutationFn: service.create,
  onSuccess: () => {
    toast.success('Created successfully!')
    queryClient.invalidateQueries({ queryKey: ['resource'] })
  },
  onError: (error) => {
    toast.error('Failed to create')
    console.error(error)
  }
})
```

### Loading States

```typescript
if (isLoading) {
  return (
    <div className="text-center py-8">
      <div className="animate-pulse">Loading...</div>
    </div>
  )
}

if (!data) {
  return <div>No data found</div>
}
```

### Pagination

```typescript
const [page, setPage] = useState(0)

<div className="flex items-center justify-between mt-4">
  <Button
    variant="outline"
    onClick={() => setPage(p => Math.max(0, p - 1))}
    disabled={page === 0}
  >
    Previous
  </Button>
  <span>Page {page + 1} of {data?.totalPages}</span>
  <Button
    variant="outline"
    onClick={() => setPage(p => p + 1)}
    disabled={page >= (data?.totalPages - 1)}
  >
    Next
  </Button>
</div>
```

## 📦 Project Structure

```
frontend/src/
├── api/                    # All API services (✅ Complete)
│   ├── client.ts          # Axios configuration
│   ├── auth.service.ts    # Authentication
│   ├── school.service.ts  # School operations
│   ├── student.service.ts # Student operations
│   ├── teacher.service.ts # Teacher operations
│   └── ...                # All other services
├── components/
│   ├── ui/               # Shadcn components (✅ Complete)
│   └── layout/           # Layout components (✅ Complete)
├── features/
│   ├── auth/             # Authentication (✅ Complete)
│   ├── dashboard/        # Dashboards (✅ Complete)
│   ├── schools/          # School management (✅ Complete)
│   ├── students/         # Student management (✅ List page)
│   └── ...               # Other modules (ready for implementation)
├── lib/                  # Utilities (✅ Complete)
├── store/                # Zustand stores (✅ Complete)
├── types/                # TypeScript types (✅ Complete)
└── App.tsx               # Main app with routing (✅ Complete)
```

## 🎯 Next Steps

To complete the application, implement the remaining modules:

1. **Teachers** - Copy School pattern, adjust for teacher fields
2. **Parents** - Add student linking functionality
3. **Classrooms** - Add teacher assignment
4. **Courses** - Add material upload/download
5. **Events** - Add calendar view (optional)
6. **Absences** - Add justify absence feature
7. **Payments** - Add mark as paid functionality
8. **Notifications** - Add real-time updates (optional)
9. **Issues** - Add comment threading
10. **Documents** - Add file upload/download

Each module will take ~30-60 minutes to implement following the established patterns.

## 💡 Pro Tips

1. **Always invalidate queries** after mutations to refresh data
2. **Use toast notifications** for user feedback
3. **Add loading states** for better UX
4. **Implement error boundaries** for production
5. **Add confirmation dialogs** for destructive actions
6. **Use TypeScript** types from `@/types` for type safety
7. **Follow the existing patterns** for consistency

## 🚀 You're Ready!

Everything is set up and ready for rapid development. The infrastructure, API services, types, and patterns are all in place. Just copy the School Management module pattern and customize for your needs!

Happy coding! 🎉
