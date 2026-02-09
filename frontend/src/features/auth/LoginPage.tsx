import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authService } from '@/api/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { Shield, GraduationCap } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await authService.login(data)
      setAuth(response, response.accessToken, response.refreshToken)
      toast.success('Login successful!', { position: 'bottom-right' })
      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please check your credentials.', { position: 'bottom-right' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (role: 'super' | 'school') => {
    const credentials = {
      super: {
        email: 'admin@schoolsaas.com',
        password: 'SuperAdmin@123',
      },
      school: {
        email: 'admin@greenvalley.edu',
        password: 'SchoolAdmin@123',
      },
    }

    setValue('email', credentials[role].email)
    setValue('password', credentials[role].password)
    
    await onSubmit(credentials[role])
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">School SaaS</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@schoolsaas.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Quick Demo Access
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickLogin('super')}
                disabled={isLoading}
                className="w-full"
              >
                <Shield className="mr-2 h-4 w-4" />
                Super Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickLogin('school')}
                disabled={isLoading}
                className="w-full"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                School Admin
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Click the buttons above to instantly log in with demo credentials
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}