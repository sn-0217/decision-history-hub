
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { FileText, XCircle } from 'lucide-react';
// import SubmissionCard from './SubmissionCard';

// interface Submission {
//   id: string;
//   appName: string;
//   changeNo: string;
//   approverName: string;
//   approverEmail?: string;
//   decision: 'Approved' | 'Rejected' | 'Timed';
//   timestamp: string;
//   comments?: string;
//   startTime?: string;
//   endTime?: string;
//   environment: string;
// }

// interface SubmissionsListProps {
//   submissions: Submission[];
//   searchTerm: string;
//   statusFilter: string;
//   onClearFilters: () => void;
// }

// const SubmissionsList = ({ submissions, searchTerm, statusFilter, onClearFilters }: SubmissionsListProps) => {
//   if (submissions.length === 0) {
//     return (
//       <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
//         <CardContent className="p-16 text-center">
//           <div className="relative mb-8">
//             <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
//               <FileText className="w-12 h-12 text-slate-400" />
//             </div>
//           </div>
//           <h3 className="text-xl font-bold text-slate-700 mb-3">No submissions found</h3>
//           <p className="text-slate-500 max-w-md mx-auto mb-6">
//             {searchTerm || statusFilter !== 'all'
//               ? "Try adjusting your search criteria or filters to find submissions."
//               : "No approval submissions have been recorded yet. Submit your first change request to get started!"
//             }
//           </p>
//           {(searchTerm || statusFilter !== 'all') && (
//             <Button variant="outline" onClick={onClearFilters} className="gap-2">
//               <XCircle className="w-4 h-4" />
//               Clear Filters
//             </Button>
//           )}
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-4" data-section="submissions-list">
//       {submissions
//         .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
//         .map((submission, index) => (
//           <SubmissionCard
//             key={submission.id}
//             submission={submission}
//             index={index}
//           />
//         ))
//       }
//     </div>
//   );
// };

// export default SubmissionsList;

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, XCircle } from 'lucide-react';
import SubmissionCard from './SubmissionCard';

// Updated interface to match backend response
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

// Transform function to convert backend data to frontend format
const transformSubmission = (backendSubmission: BackendSubmission, index: number): Submission => {
  return {
    id: `${backendSubmission.appData.appName}-${backendSubmission.formSubmission.changeNumber}-${index}`,
    appName: backendSubmission.appData.appName,
    changeNo: backendSubmission.formSubmission.changeNumber,
    approverName: backendSubmission.formSubmission.approverName,
    approverEmail: backendSubmission.formSubmission.approverEmail,
    decision: backendSubmission.formSubmission.decision,
    timestamp: backendSubmission.submittedAt,
    comments: backendSubmission.formSubmission.comments,
    startTime: backendSubmission.formSubmission.startTime,
    endTime: backendSubmission.formSubmission.endTime,
    environment: backendSubmission.formSubmission.environment,
    // Include backend data for details
    applicationOwner: backendSubmission.appData.applicationOwner,
    maintenanceWindow: backendSubmission.appData.maintenanceWindow,
    changeDescription: backendSubmission.appData.changeDescription,
    infrastructureImpact: backendSubmission.appData.infrastructureImpact,
    hosts: backendSubmission.appData.hosts,
  };
};

// Keep your original Submission interface for the UI components
interface Submission {
  id: string;
  appName: string;
  changeNo: string;
  approverName: string;
  approverEmail?: string;
  decision: 'Approved' | 'Rejected' | 'Timed';
  timestamp: string;
  comments?: string;
  startTime?: string;
  endTime?: string;
  environment: string;
  // Additional backend data for details
  applicationOwner?: string;
  maintenanceWindow?: string;
  changeDescription?: string;
  infrastructureImpact?: string;
  hosts?: string[];
}

interface SubmissionsListProps {
  submissions: BackendSubmission[]; // Changed to accept backend format
  searchTerm: string;
  statusFilter: string;
  onClearFilters: () => void;
}

const SubmissionsList = ({ submissions, searchTerm, statusFilter, onClearFilters }: SubmissionsListProps) => {
  // Transform backend submissions to frontend format
  const transformedSubmissions: Submission[] = submissions.map((submission, index) =>
    transformSubmission(submission, index)
  );

  if (transformedSubmissions.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-16 text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-3">No submissions found</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            {searchTerm || statusFilter !== 'all'
              ? "Try adjusting your search criteria or filters to find submissions."
              : "No approval submissions have been recorded yet. Submit your first change request to get started!"
            }
          </p>
          {(searchTerm || statusFilter !== 'all') && (
            <Button variant="outline" onClick={onClearFilters} className="gap-2">
              <XCircle className="w-4 h-4" />
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-section="submissions-list">
      {transformedSubmissions
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .map((submission, index) => (
          <SubmissionCard
            key={submission.id}
            submission={submission}
            index={index}
          />
        ))
      }
    </div>
  );
};

export default SubmissionsList;