
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
  // Get category and colors based on status
  const getCardConfig = () => {
    switch (status.text) {
      case 'Approved':
        return { 
          bg: 'bg-emerald-500', 
          category: 'Orchestration',
          time: '8-15 min',
          description: 'Orchestrate container deployments and manage cluster resources'
        };
      case 'Rejected':
        return { 
          bg: 'bg-red-500', 
          category: 'Infrastructure',
          time: '5-10 min',
          description: 'Automate infrastructure provisioning and configuration management'
        };
      case 'Timed Approval':
        return { 
          bg: 'bg-amber-500', 
          category: 'Application Server',
          time: '10-20 min',
          description: 'Configure and deploy Java enterprise applications'
        };
      case 'Pending':
        return { 
          bg: 'bg-blue-500', 
          category: 'Container',
          time: '3-8 min',
          description: 'Deploy and manage containerized applications and services'
        };
      default:
        return { 
          bg: 'bg-slate-400', 
          category: 'System',
          time: '5-15 min',
          description: 'Configure and manage system components'
        };
    }
  };

  const config = getCardConfig();

  return (
    <Card 
      className={`group relative transition-all duration-300 hover:shadow-lg bg-white border border-slate-200 rounded-xl overflow-hidden ${hasValidSubmissions ? 'cursor-pointer' : 'cursor-default'} hover:border-slate-300 hover:-translate-y-1`}
      style={{
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }} 
      onClick={() => onAppClick(app)} 
      data-app={app.toLowerCase().replace(/\s+/g, '-')}
    >
      <CardContent className="p-6 h-full flex flex-col">
        {/* Top section - Icon and Category */}
        <div className="flex items-start justify-between mb-6">
          <div className={`${config.bg} rounded-xl p-3 flex items-center justify-center`}>
            <Layers className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm text-slate-500 font-medium">{config.category}</span>
        </div>

        {/* Main content */}
        <div className="flex-1 mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{app}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* Bottom section - Time and Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-slate-500 text-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {config.time}
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onStatusClick(app, e);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
          >
            Start
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppCard;
