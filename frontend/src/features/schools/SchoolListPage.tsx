import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Eye, Search, MoreHorizontal, Globe, Phone, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { schoolService } from '@/api/school.service'
import { queryClient } from '@/lib/queryClient'
import SchoolFormDialog from './SchoolFormDialog'
import { useNavigate } from 'react-router-dom'
import type { School } from '@/types'

export default function SchoolListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingSchool, setEditingSchool] = useState<School | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['schools', page],
    queryFn: () => schoolService.getAll(page, 10),
  })

  const deleteMutation = useMutation({
    mutationFn: schoolService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] })
      toast.success('School deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete school')
    },
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this school?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto transition-all animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Schools</h1>
          <p className="text-muted-foreground text-lg">
            Manage your educational network and institution details.
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-primary hover:bg-primary/90 transition-all active:scale-95 shadow-none rounded-lg h-11 px-6"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add School
        </Button>
      </div>

      {/* Control Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search schools..." 
            className="pl-10 h-10 border-slate-200 focus-visible:ring-1 focus-visible:ring-primary shadow-none bg-white/50"
          />
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 text-xs font-medium border-none rounded-full">
              {data?.totalElements || 0} Total Schools
            </Badge>
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-none transition-all">
        {isLoading ? (
          <div className="flex items-center justify-center py-24 italic text-muted-foreground animate-pulse">
            Fetching institution data...
          </div>
        ) : (
          <div className="relative">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-b border-slate-200">
                  <TableHead className="font-semibold text-slate-900 h-12">Name</TableHead>
                  <TableHead className="font-semibold text-slate-900 h-12">Contact</TableHead>
                  {/* <TableHead className="font-semibold text-slate-900 h-12">Address</TableHead> */}
                  <TableHead className="font-semibold text-slate-900 h-12">Status</TableHead>
                  <TableHead className="text-right font-semibold text-slate-900 h-12 pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.content.map((school) => (
                  <TableRow 
                    key={school.id} 
                    className="group border-b border-slate-100 transition-colors hover:bg-slate-50/80 last:border-0"
                  >
                    <TableCell className="py-4">
                      <div className="font-bold text-slate-800 group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/schools/${school.id}`)}>
                        {school.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">ID: {school.id.slice(0,8)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center text-sm text-slate-600"><Mail className="w-3 h-3 mr-2" /> {school.email}</span>
                        <span className="flex items-center text-xs text-slate-400"><Phone className="w-3 h-3 mr-2" /> {school.phone}</span>
                      </div>
                    </TableCell>
                    {/* <TableCell className="max-w-[200px]">
                      <span className="text-sm text-slate-600 line-clamp-2">
                        {school.address}
                      </span>
                    </TableCell> */}
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`shadow-none rounded-md px-2.5 py-0.5 border font-medium flex items-center w-fit gap-1.5 ${
                          school.active 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${school.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {school.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white border">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 shadow-none border-slate-200 p-1">
                            <DropdownMenuLabel className="text-xs text-slate-500 font-normal">Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigate(`/schools/${school.id}`)} className="cursor-pointer rounded-md">
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingSchool(school)} className="cursor-pointer rounded-md text-blue-600 focus:text-blue-600">
                              <Edit className="mr-2 h-4 w-4" /> Edit School
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(school.id)} className="cursor-pointer rounded-md text-red-600 focus:text-red-600 focus:bg-red-50">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Institution
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Improved Pagination Footer */}
        {data && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-200">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-slate-900">{page * 10 + 1}</span> to <span className="font-medium text-slate-900">{Math.min((page + 1) * 10, data.totalElements)}</span> of <span className="font-medium text-slate-900">{data.totalElements}</span> results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="shadow-none h-9 px-4 disabled:bg-transparent"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1 mx-2">
                {[...Array(data.totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-8 h-8 text-sm rounded-md transition-all ${page === i ? 'bg-primary text-white font-bold' : 'hover:bg-slate-200 text-slate-600'}`}
                    >
                        {i + 1}
                    </button>
                )).slice(Math.max(0, page - 1), Math.min(data.totalPages, page + 2))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shadow-none h-9 px-4 disabled:bg-transparent"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <SchoolFormDialog
        open={isCreateOpen || !!editingSchool}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingSchool(null)
        }}
        school={editingSchool}
      />
    </div>
  )
}