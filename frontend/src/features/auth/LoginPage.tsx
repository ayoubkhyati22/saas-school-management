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
import { Shield, GraduationCap, BookOpen } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 px-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                School SaaS
              </h1>
            </div>
            <p className="text-xl text-slate-600 leading-relaxed">
              Comprehensive school management platform for modern educational institutions
            </p>
          </div>
          
          <div className="space-y-4 pt-8">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Secure & Reliable</h3>
                <p className="text-sm text-slate-600">Enterprise-grade security for your data</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Multi-Role Access</h3>
                <p className="text-sm text-slate-600">Tailored dashboards for every user type</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="w-full shadow-2xl border-0">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">Welcome Back</CardTitle>
            <CardDescription className="text-slate-600">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@schoolsaas.com"
                  className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/30 transition-all" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-500 font-medium">
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
                  className="h-11 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-700 font-medium transition-all"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Super Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleQuickLogin('school')}
                  disabled={isLoading}
                  className="h-11 border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-700 font-medium transition-all"
                >
                  <GraduationCap className="mr-2 h-4 w-4" />
                  School Admin
                </Button>
              </div>

              <p className="text-xs text-center text-slate-500 pt-2">
                Click the buttons above to instantly access demo accounts
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}