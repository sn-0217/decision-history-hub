
import React from 'react';
import { CheckCircle, Sparkles, Zap } from 'lucide-react';

const HomeHero: React.FC = () => {
  return (
    <div className="text-center mb-12 space-y-6">
      <div className="flex items-center justify-center gap-6 mb-8">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="text-left">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent mb-2 mx-0 my-0 py-[11px]">
            Change Control Center
          </h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <p className="text-xl text-slate-600 leading-relaxed mb-6">
          Streamline your change approval workflow with our intelligent platform. Review, approve, and track change requests across your entire application portfolio with enhanced visibility and control.
        </p>
        <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>Real-time Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Audit Trail</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Automated Workflows</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
