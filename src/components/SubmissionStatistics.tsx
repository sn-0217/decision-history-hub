
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle, XCircle, Timer } from 'lucide-react';

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

interface SubmissionStatisticsProps {
  submissions: BackendSubmission[];
  statusFilter: string;
  onStatisticClick: (filterType: string) => void;
}

const SubmissionStatistics = ({ submissions, statusFilter, onStatisticClick }: SubmissionStatisticsProps) => {
  const statistics = {
    total: submissions.length,
    approved: submissions.filter(s => s.formSubmission && s.formSubmission.decision === 'Approved').length,
    rejected: submissions.filter(s => s.formSubmission && s.formSubmission.decision === 'Rejected').length,
    timed: submissions.filter(s => s.formSubmission && s.formSubmission.decision === 'Timed').length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-section="statistics">
      <Card 
        className="group relative overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
        onClick={() => onStatisticClick('all')}
      >
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1 tracking-wide">Total Submissions</p>
              <p className="text-3xl font-bold text-blue-600 group-hover:scale-105 transition-transform">{statistics.total}</p>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7 text-blue-600" />
            </div>
          </div>
          {statusFilter === 'all' && (
            <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-lg"></div>
          )}
        </CardContent>
      </Card>

      <Card 
        className="group relative overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
        onClick={() => onStatisticClick('approved')}
      >
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1 tracking-wide">Approved</p>
              <p className="text-3xl font-bold text-green-600 group-hover:scale-105 transition-transform">{statistics.approved}</p>
            </div>
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
          </div>
          {statusFilter === 'approved' && (
            <div className="absolute inset-0 bg-green-500/10 border-2 border-green-500 rounded-lg"></div>
          )}
        </CardContent>
      </Card>

      <Card 
        className="group relative overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
        onClick={() => onStatisticClick('rejected')}
      >
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1 tracking-wide">Rejected</p>
              <p className="text-3xl font-bold text-red-600 group-hover:scale-105 transition-transform">{statistics.rejected}</p>
            </div>
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <XCircle className="w-7 h-7 text-red-600" />
            </div>
          </div>
          {statusFilter === 'rejected' && (
            <div className="absolute inset-0 bg-red-500/10 border-2 border-red-500 rounded-lg"></div>
          )}
        </CardContent>
      </Card>

      <Card 
        className="group relative overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
        onClick={() => onStatisticClick('timed')}
      >
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1 tracking-wide">Timed Approvals</p>
              <p className="text-3xl font-bold text-amber-600 group-hover:scale-105 transition-transform">{statistics.timed}</p>
            </div>
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Timer className="w-7 h-7 text-amber-600" />
            </div>
          </div>
          {statusFilter === 'timed' && (
            <div className="absolute inset-0 bg-amber-500/10 border-2 border-amber-500 rounded-lg"></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionStatistics;
