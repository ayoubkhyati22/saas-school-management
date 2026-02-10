import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TeacherPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export default function TeacherPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: TeacherPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="text-sm text-muted-foreground order-2 sm:order-1">
        Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalItems)} of {totalItems} teachers
      </div>
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <Button variant="outline" size="sm" onClick={() => onPageChange(0)} disabled={currentPage === 0}>
          <ChevronsLeft className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">First</span>
        </Button>
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>
          <ChevronLeft className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        <div className="text-sm whitespace-nowrap">
          Page {currentPage + 1} of {totalPages}
        </div>
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}>
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4 sm:ml-1" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onPageChange(totalPages - 1)} disabled={currentPage >= totalPages - 1}>
          <span className="hidden sm:inline mr-1">Last</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
