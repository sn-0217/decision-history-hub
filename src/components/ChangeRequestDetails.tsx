
import { Calendar, Clock, User, MessageSquare, Database, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ChangeRequest {
  changeNo: string;
  requestedBy: string;
  requestDate: string;
  deploymentWindow: string;
  description: string;
  teamDl: string;
  affectedServers: string[];
}

interface ChangeRequestDetailsProps {
  changeRequest: ChangeRequest;
}

const ChangeRequestDetails = ({
  changeRequest
}: ChangeRequestDetailsProps) => {
  return (
    <div className="p-5 border-r border-slate-200/50 bg-gradient-to-br from-slate-50/30 to-white/30" data-section="change-details">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3 py-[12px]">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Request Details</h3>
        </div>

        <div className="grid grid-cols-1 gap-3" data-content="change-info">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="space-y-1.5" data-field="change-number">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-2.5 h-2.5 text-blue-600" />
                </div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Change No</p>
              </div>
              <p className="font-medium text-slate-900 text-sm pl-6">{changeRequest.changeNo}</p>
            </div>
            
            <div className="space-y-1.5" data-field="requested-by">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <User className="w-2.5 h-2.5 text-emerald-600" />
                </div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Application Owner</p>
              </div>
              <p className="font-medium text-slate-900 text-sm pl-6">{changeRequest.requestedBy}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="space-y-1.5" data-field="deployment-window">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-2.5 h-2.5 text-amber-600" />
                </div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">MAINTENANCE WINDOW</p>
              </div>
              <p className="font-medium text-slate-900 text-sm pl-6">{changeRequest.deploymentWindow}</p>
            </div>
            
            <div className="space-y-1.5" data-field="team-dl">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-100 rounded-lg flex items-center justify-center">
                  <User className="w-2.5 h-2.5 text-purple-600" />
                </div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Team DL</p>
              </div>
              <p className="font-medium text-slate-900 text-sm pl-6">{changeRequest.teamDl}</p>
            </div>
          </div>
          
          <Separator className="my-3" />

          <div className="space-y-3" data-field="description">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <MessageSquare className="w-3 h-3 text-white" />
              </div>
              <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Change Description</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600 rounded-l-xl"></div>
                <p className="text-slate-700 leading-relaxed text-sm font-medium pl-3">{changeRequest.description}</p>
              </div>
            </div>
          </div>

          <Separator className="my-3" />

          <div className="space-y-2" data-section="affected-servers">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded-lg flex items-center justify-center">
                <Database className="w-2.5 h-2.5 text-green-600" />
              </div>
              <h4 className="font-medium text-slate-900 text-sm">Infrastructure Impact ({changeRequest.affectedServers.length} {changeRequest.affectedServers.length === 1 ? 'server' : 'servers'} affected)</h4>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="absolute top-0 left-0 w-1 bg-gradient-to-b from-green-500 to-emerald-600" style={{height: '100%'}}></div>
                <div className="max-h-40 overflow-y-auto p-3 pl-6">
                  <div className="space-y-1">
                    {changeRequest.affectedServers.map((server, index) => (
                      <div key={index} className="flex items-center gap-2 py-1 text-xs text-slate-600" data-server={`server-${index}`}>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0"></div>
                        <span className="font-mono">{server}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeRequestDetails;
