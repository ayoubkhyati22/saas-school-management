import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface StudentSearchBarProps {
  searchKeyword: string
  isSearching: boolean
  onSearchKeywordChange: (keyword: string) => void
  onSearch: () => void
  onClearSearch: () => void
}

export default function StudentSearchBar({
  searchKeyword,
  isSearching,
  onSearchKeywordChange,
  onSearch,
  onClearSearch,
}: StudentSearchBarProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or registration number..."
              value={searchKeyword}
              onChange={(e) => onSearchKeywordChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              className="pl-10"
            />
          </div>
          <Button
            onClick={onSearch}
            disabled={!searchKeyword.trim()}
            className="border-2 border-blue-200 hover:border-blue-400 hover:bg-emerald-50 text-blue-700 transition-all disabled:cursor-not-allowed"
          >
            Search
          </Button>
          {isSearching && (
            <Button
              variant="outline"
              onClick={onClearSearch}
              className="border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-medium transition-all"
            >
              Clear
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-700 transition-all"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
