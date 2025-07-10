import React, { useState, useCallback } from 'react';
import { BarChart3, Shield, Workflow, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import LoginDialog from './LoginDialog';
import EnvironmentBadge from './EnvironmentBadge';

interface HomeHeaderProps {
  currentEnv: string;
  onViewSubmissions: () => void;
  onAdminClick: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ 
  currentEnv, 
  onViewSubmissions, 
  onAdminClick 
}) => {
  const { login, isLoading } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleAdminClick = useCallback(() => {
    setShowLoginDialog(true);
  }, []);

  const handleLogin = useCallback(async (username: string, password: string) => {
    const success = await login(username, password);
    if (success) {
      onAdminClick();
    }
    return success;
  }, [login, onAdminClick]);

  const handleViewSubmissions = useCallback(() => {
    onViewSubmissions();
  }, [onViewSubmissions]);

  const handleCloseLoginDialog = useCallback(() => {
    setShowLoginDialog(false);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4" data-section="header-brand">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Workflow className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Apptech Knitwell</h1>
                <p className="text-slate-600 text-sm">Enterprise Change Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3" data-section="header-actions">
              <EnvironmentBadge currentEnv={currentEnv} />
              
              {/* Analytics Button - Modern Blue Theme */}
              <Button 
                variant="outline" 
                size="sm" 
                className="group relative gap-2.5 h-9 px-4 border-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 hover:from-blue-100 hover:via-indigo-100 hover:to-purple-100 text-blue-700 hover:text-blue-800 shadow-sm hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 hover:scale-[1.02] rounded-xl font-medium backdrop-blur-sm"
                onClick={handleViewSubmissions} 
                data-action="view-submissions"
              >
                <div className="relative">
                  <BarChart3 className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
                </div>
                <span className="relative z-10">Analytics</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              
              {/* Admin Button - Modern Orange/Red Theme */}
              <Button 
                variant="outline" 
                size="sm" 
                className="group relative gap-2.5 h-9 px-4 border-0 bg-gradient-to-r from-orange-50 via-red-50 to-rose-50 hover:from-orange-100 hover:via-red-100 hover:to-rose-100 text-orange-700 hover:text-red-700 shadow-sm hover:shadow-lg hover:shadow-orange-100/50 transition-all duration-300 hover:scale-[1.02] rounded-xl font-medium backdrop-blur-sm"
                onClick={handleAdminClick} 
                data-action="admin"
              >
                <div className="relative">
                  <Shield className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]" />
                  <div className="absolute inset-0 bg-orange-400/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
                </div>
                <span className="relative z-10">Admin</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 to-red-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <LoginDialog
        isOpen={showLoginDialog}
        onClose={handleCloseLoginDialog}
        onLogin={handleLogin}
        isLoading={isLoading}
      />
    </>
  );
};

export default HomeHeader;