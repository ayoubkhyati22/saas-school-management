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
import { Shield, GraduationCap, CheckCircle2, LayoutDashboard } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid business email'),
  password: z.string().min(1, 'Password is required'),
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
      toast.success('Signed in successfully', { position: 'bottom-right' })
      navigate('/dashboard')
    } catch (error) {
      toast.error('Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (role: 'super' | 'school') => {
    const credentials = {
      super: { email: 'admin@schoolsaas.com', password: 'SuperAdmin@123' },
      school: { email: 'admin@greenvalley.edu', password: 'SchoolAdmin@123' },
    }
    setValue('email', credentials[role].email)
    setValue('password', credentials[role].password)
    await onSubmit(credentials[role])
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAFAFB] text-slate-900 selection:bg-blue-100">
      {/* Branding Section (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 relative bg-white border-r border-slate-200 overflow-hidden items-center justify-center">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="relative z-10 max-w-md w-full px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2.5 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight uppercase">EduFlow <span className="text-blue-600">SaaS</span></span>
          </div>
          
          <h2 className="text-4xl font-semibold leading-[1.1] mb-6">
            The modern OS for <span className="text-blue-600">Educational Excellence.</span>
          </h2>
          
          <div className="space-y-6">
            {[
              { title: "Centralized Management", desc: "Automate admissions and student lifecycle." },
              { title: "Academic Insights", desc: "Powerful analytics to track performance and growth." },
              { title: "Bank-Grade Security", desc: "Your data is encrypted and protected 24/7." }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
                <div>
                  <h4 className="font-medium text-slate-900">{feature.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 lg:hidden flex justify-center">
             <div className="bg-blue-600 p-2 rounded-lg inline-flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-white" />
             </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-slate-500">Log in to manage your institution</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Work Email</Label>
              <Input
                id="email"
                {...register('email')}
                className={`h-12 border-slate-200 focus:ring-0 focus:border-blue-600 transition-all rounded-md ${errors.email ? 'border-red-500' : ''}`}
                placeholder="name@company.com"
              />
              {errors.email && <p className="text-xs font-medium text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
                <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700">Forgot password?</a>
              </div>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className={`h-12 border-slate-200 focus:ring-0 focus:border-blue-600 transition-all rounded-md ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-xs font-medium text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all rounded-md shadow-none"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Sign in to account"}
            </Button>
          </form>

          {/* Demo Login Buttons */}
          <div className="mt-10 pt-8 border-t border-slate-200">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-6">
              Preview Demo Accounts
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleQuickLogin('super')}
                className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50/30 transition-all group"
              >
                <Shield className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mb-2" />
                <span className="text-[13px] font-semibold text-slate-600 group-hover:text-blue-700">Super Admin</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleQuickLogin('school')}
                className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50/30 transition-all group"
              >
                <GraduationCap className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mb-2" />
                <span className="text-[13px] font-semibold text-slate-600 group-hover:text-blue-700">School Admin</span>
              </button>
            </div>
          </div>
          
          <footer className="mt-12 text-center">
             <p className="text-slate-400 text-[13px]">
               &copy; {new Date().getFullYear()} EduFlow Platforms Inc.
             </p>
          </footer>
        </div>
      </div>
    </div>
  )
}