
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers } from 'lucide-react';

interface AppStatus {
  text: string;
  color: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
}

interface AppCardProps {
  app: string;
  index: number;
  status: AppStatus;
  hasValidSubmissions: boolean;
  onAppClick: (appName: string) => void;
  onStatusClick: (appName: string, e: React.MouseEvent) => void;
}

const AppCard: React.FC<AppCardProps> = ({
  app,
  index,
  status,
  hasValidSubmissions,
  onAppClick,
  onStatusClick
}) => {
  // Get status color mapping
  const getStatusColor = () => {
    switch (status.text) {
      case 'Approved':
        return { bg: 'bg-emerald-500', text: 'text-emerald-700', icon: 'text-white' };
      case 'Rejected':
        return { bg: 'bg-red-500', text: 'text-red-700', icon: 'text-white' };
      case 'Timed Approval':
        return { bg: 'bg-amber-500', text: 'text-amber-700', icon: 'text-white' };
      case 'Pending':
        return { bg: 'bg-blue-500', text: 'text-blue-700', icon: 'text-white' };
      default:
        return { bg: 'bg-slate-400', text: 'text-slate-700', icon: 'text-white' };
    }
  };

  const statusColors = getStatusColor();

  return (
    <Card 
      className={`group relative transition-all duration-300 hover:shadow-lg bg-white border border-slate-200 rounded-xl overflow-hidden ${hasValidSubmissions ? 'cursor-pointer' : 'cursor-default'} hover:border-slate-300`}
      style={{
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }} 
      onClick={() => onAppClick(app)} 
      data-app={app.toLowerCase().replace(/\s+/g, '-')}
    >
      {/* Status Badge - Top Right */}
      <div className="absolute top-3 right-3 z-20">
        <div className={`${statusColors.bg} text-white text-xs px-2 py-1 rounded-full font-medium`}>
          {status.text}
        </div>
      </div>

      <CardContent className="p-0 relative">
        {/* Left Icon Section */}
        <div className="flex">
          <div className={`${statusColors.bg} w-20 h-24 flex items-center justify-center flex-shrink-0`}>
            <Layers className={`w-8 h-8 ${statusColors.icon}`} />
          </div>
          
          {/* Content Section */}
          <div className="flex-1 p-4 flex flex-col justify-between min-h-[6rem]">
            <div>
              <h3 className="font-semibold text-slate-900 text-base mb-1 leading-tight">{app}</h3>
              <p className="text-slate-600 text-sm">
                {status.text === 'Approved' ? 'Ready for deployment and management' :
                 status.text === 'Rejected' ? 'Review required before proceeding' :
                 status.text === 'Timed Approval' ? 'Scheduled maintenance window active' :
                 'Configure and manage application deployment'}
              </p>
            </div>
            
            {/* Time indicator */}
            <div className="flex items-center text-slate-500 text-xs mt-2">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {status.text === 'Approved' ? '5-10 min' :
               status.text === 'Rejected' ? '3-8 min' :
               status.text === 'Timed Approval' ? '8-15 min' :
               '10-20 min'}
            </div>
          </div>
          
          {/* Action Button */}
          <div className="p-4 flex items-center">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onStatusClick(app, e);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            >
              Start
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppCard;
