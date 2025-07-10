
import React from 'react';

const HomeFooter: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center">
          <p className="text-slate-600 text-sm">
            © 2025 Apptech Knitwell. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-500">Enterprise-Grade Change Management Platform</span>
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
