import { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToastContext } from '@/contexts/ToastContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { loadSubmissions } from '@/utils/testData';
import SubmissionStatistics from '@/components/SubmissionStatistics';
import SubmissionFilters from '@/components/SubmissionFilters';
import SubmissionsList from '@/components/SubmissionsList';
import EnvironmentBadge from '@/components/EnvironmentBadge';

// Backend submission interface to match the API response
interface BackendSubmission {
  appData: {
    appName: string;
    changeNumber: string;
    applicationOwner: string;
    maintenanceWindow: string;
    changeDescription: string;
    infrastructureImpact: string;
    hosts: string[];
  };
  formSubmission: {
    changeNumber: string;
    approverName: string;
    approverEmail: string;
    decision: 'Approved' | 'Rejected' | 'Timed';
    environment: string;
    startTime?: string;
    endTime?: string;
    comments?: string;
  };
  submittedAt: string;
  status: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { showError } = useToastContext();
  const { currentEnv } = useEnvironment();
  const [searchParams] = useSearchParams();
  const [submissions, setSubmissions] = useState<BackendSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load submissions from API
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);

        console.log('Loading submissions from API...');
        
        // Load submissions from API
        const submissionsData = await loadSubmissions();
        
        // Log the environment values in the submissions for debugging
        console.log('Submission environments:', submissionsData.map(sub => sub.formSubmission?.environment));
        console.log('Current environment filter:', currentEnv);
        
        // Filter by current environment
        const envSubmissions = submissionsData.filter((sub: BackendSubmission) => 
          sub.formSubmission && sub.formSubmission.environment === currentEnv);
        setSubmissions(envSubmissions);
        
        console.log('Submissions loaded and filtered:', envSubmissions);

      } catch (error) {
        console.error('Failed to load submissions:', error);
        setSubmissions([]);
        showError(
          'Failed to Load Submissions',
          'Unable to fetch submission data. Please check your connection and try again.'
        );
      } finally {
        // Check for search parameter in URL
        const searchQuery = searchParams.get('search');
        if (searchQuery) {
          setSearchTerm(searchQuery);
        }

        setTimeout(() => setIsLoading(false), 600);
      }
    };
    fetchSubmissions();
  }, [currentEnv, searchParams, showError]);

  const handleStatisticClick = (filterType: string) => {
    setStatusFilter(filterType);
    setSearchTerm(''); // Clear search term when clicking filter cards
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(submission => {
      if (!submission.appData || !submission.formSubmission) return false;
      
      const matchesSearch = !searchTerm || 
        submission.appData.appName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        submission.formSubmission.changeNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
        submission.formSubmission.approverName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        submission.formSubmission.approverEmail?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        submission.formSubmission.comments?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        submission.formSubmission.decision.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchTerm, statusFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-blue-400 rounded-full animate-spin mx-auto" style={{
              animationDirection: 'reverse',
              animationDuration: '1.5s'
            }}></div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-700 font-semibold text-lg">Loading submissions...</p>
            <p className="text-slate-500 text-sm">Fetching approval history</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" data-page="submissions">
      {/* Enhanced Header with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4" data-section="header-brand">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Submission Analytics</h1>
                <p className="text-slate-600 text-sm">Comprehensive approval history & insights</p>
              </div>
            </div>
            <div className="flex items-center gap-4" data-section="header-actions">
              <EnvironmentBadge currentEnv={currentEnv} />
              
              {/* Dashboard Button - Modern Purple Theme */}
              <Button 
                variant="outline" 
                size="sm" 
                className="group relative gap-2.5 h-9 px-4 border-0 bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 hover:from-purple-100 hover:via-violet-100 hover:to-indigo-100 text-purple-700 hover:text-purple-800 shadow-sm hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300 hover:scale-[1.02] rounded-xl font-medium backdrop-blur-sm"
                onClick={() => navigate('/home')} 
                data-action="back-home"
              >
                <div className="relative">
                  <Home className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-[5deg]" />
                  <div className="absolute inset-0 bg-purple-400/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
                </div>
                <span className="relative z-10">Dashboard</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 to-indigo-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8" data-main="submissions-content">
        <SubmissionStatistics 
          submissions={submissions}
          statusFilter={statusFilter}
          onStatisticClick={handleStatisticClick}
        />

        <SubmissionFilters 
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />

        <SubmissionsList 
          submissions={filteredSubmissions}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Enhanced Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-slate-600 text-sm">
              © 2025 Apptech Knitwell. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-slate-500">Powered by Modern Web Technologies</span>
              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;