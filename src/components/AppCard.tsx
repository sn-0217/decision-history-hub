
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
  return (
    <Card 
      key={app} 
      className={`group relative transition-all duration-700 ease-out hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_20px_40px_-8px_rgba(147,51,234,0.3),0_0_0_1px_rgba(147,51,234,0.1)] hover:-translate-y-6 bg-white/90 backdrop-blur-lg border-0 shadow-lg overflow-hidden ${hasValidSubmissions ? 'cursor-pointer' : 'cursor-default'} hover:scale-[1.03] hover:bg-white/95`} 
      style={{
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }} 
      onClick={() => onAppClick(app)} 
      data-app={app.toLowerCase().replace(/\s+/g, '-')}
    >
      {/* Premium multi-layer gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-purple-500/0 to-fuchsia-500/0 group-hover:from-violet-500/12 group-hover:via-purple-500/8 group-hover:to-fuchsia-500/12 transition-all duration-700 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-blue-500/8 group-hover:via-indigo-500/6 group-hover:to-purple-500/8 transition-all duration-700 pointer-events-none" />
      
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-out" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-200/10 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1400 ease-out delay-200" />
      </div>
      
      {/* Premium border glow with multiple layers */}
      <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-purple-200/60 transition-all duration-700" />
      <div className="absolute inset-0 rounded-lg group-hover:shadow-[inset_0_0_20px_rgba(147,51,234,0.15),inset_0_0_40px_rgba(79,70,229,0.1)] transition-all duration-700" />
      
      <CardContent className="p-6 text-center relative z-10">
        <div className="relative mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-100/80 to-slate-200/80 group-hover:from-gradient-to-br group-hover:from-purple-100/90 group-hover:via-violet-100/80 group-hover:to-blue-100/90 rounded-2xl flex items-center justify-center mx-auto transition-all duration-700 group-hover:scale-[1.18] shadow-lg group-hover:shadow-[0_20px_40px_-8px_rgba(147,51,234,0.35)] group-hover:rotate-6 backdrop-blur-sm border border-white/20 group-hover:border-purple-200/40">
            <Layers className="w-8 h-8 text-slate-600 group-hover:text-purple-600 transition-all duration-700 group-hover:scale-125 group-hover:drop-shadow-sm" />
          </div>
          {/* Premium status indicator with enhanced glow */}
          <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-700 ${status.text === 'Approved' ? 'bg-emerald-500 group-hover:bg-emerald-400 group-hover:shadow-emerald-400/50' : status.text === 'Rejected' ? 'bg-rose-500 group-hover:bg-rose-400 group-hover:shadow-rose-400/50' : status.text === 'Timed Approval' ? 'bg-amber-500 group-hover:bg-amber-400 group-hover:shadow-amber-400/50' : 'bg-slate-400 group-hover:bg-slate-300 group-hover:shadow-slate-300/50'} group-hover:scale-[1.35] group-hover:animate-pulse group-hover:shadow-lg`}></div>
        </div>
        <h3 className="font-bold text-slate-900 mb-3 text-lg group-hover:text-purple-900 transition-all duration-700 leading-tight group-hover:scale-[1.08] group-hover:drop-shadow-sm">{app}</h3>
        <Badge 
          className={`${status.bgColor} ${status.borderColor} ${status.color} border gap-2 font-medium transition-all duration-700 group-hover:scale-[1.12] shadow-sm group-hover:shadow-lg backdrop-blur-sm ${
            hasValidSubmissions ? 'cursor-pointer' : 'cursor-default'
          } ${
            status.text === 'Approved' 
              ? 'hover:bg-emerald-100 hover:border-emerald-300 hover:text-emerald-800 group-hover:bg-emerald-50/80 group-hover:shadow-emerald-400/25' 
              : status.text === 'Rejected' 
              ? 'hover:bg-rose-100 hover:border-rose-300 hover:text-rose-800 group-hover:bg-rose-50/80 group-hover:shadow-rose-400/25'
              : status.text === 'Timed Approval'
              ? 'hover:bg-amber-100 hover:border-amber-300 hover:text-amber-800 group-hover:bg-amber-50/80 group-hover:shadow-amber-400/25'
              : 'hover:bg-slate-100 hover:border-slate-300 hover:text-slate-700 group-hover:bg-slate-50/80 group-hover:shadow-slate-400/25'
          }`}
          onClick={e => onStatusClick(app, e)} 
          data-status={status.text.toLowerCase().replace(/\s+/g, '-')}
        >
          {status.icon}
          {status.text}
        </Badge>
      </CardContent>
      
      {/* Modern clean bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
      
    </Card>
  );
};

export default AppCard;
