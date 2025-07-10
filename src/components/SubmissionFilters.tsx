
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, SortDesc } from 'lucide-react';

interface SubmissionFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

const SubmissionFilters = ({ searchTerm, statusFilter, onSearchChange, onStatusFilterChange }: SubmissionFiltersProps) => {
  return (
    <Card className="mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-xl" data-section="filters">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Filter & Search</h3>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
            <Input 
              placeholder="Search by app, change number, approver..." 
              value={searchTerm} 
              onChange={e => onSearchChange(e.target.value)} 
              className="pl-12 bg-white/50 border-slate-200 focus:border-purple-300 focus:ring-purple-100 transition-all duration-300 h-12" 
              data-input="search" 
            />
          </div>
          <div className="relative group">
            <SortDesc className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-600 transition-colors pointer-events-none" />
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-full sm:w-48 bg-white/50 border-slate-200 pl-12 h-12">
                <SelectValue placeholder="All Decisions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Decisions</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="timed">Timed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionFilters;
