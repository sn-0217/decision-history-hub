import React from 'react';
import { Search, Layers, AlertTriangle, XCircle, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AppCard from './AppCard';
interface AppStatus {
  text: string;
  color: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
}
interface ApplicationsGridProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
  error: string | null;
  filteredApps: string[];
  getAppStatus: (appName: string) => AppStatus;
  handleAppClick: (appName: string) => void;
  handleStatusClick: (appName: string, e: React.MouseEvent) => void;
}
const ApplicationsGrid: React.FC<ApplicationsGridProps> = ({
  searchTerm,
  setSearchTerm,
  isLoading,
  error,
  filteredApps,
  getAppStatus,
  handleAppClick,
  handleStatusClick
}) => {
  return <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden" data-section="applications">
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5 opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
      
      <CardContent className="p-8 relative z-10">
        <div className="flex items-center justify-between mb-8" data-section="apps-header">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                {!error && !isLoading ? filteredApps.length : '0'}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Application Portfolio</h2>
              <p className="text-slate-600 text-sm">Select an application to initiate change requests</p>
            </div>
          </div>
          <div className="relative group" data-component="search">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors duration-300" />
            <Input placeholder="Search applications..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-12 w-80 bg-white/50 border-slate-200 focus:border-purple-300 focus:ring-purple-100 transition-all duration-300 focus:w-96 hover:bg-white/70" data-input="search" />
          </div>
        </div>

        {/* Enhanced Apps Grid */}
        {isLoading ? <div className="text-center py-20" data-state="loading">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-blue-400 rounded-full animate-spin mx-auto" style={{
            animationDirection: 'reverse',
            animationDuration: '1.5s'
          }}></div>
            </div>
            <div className="space-y-2 mt-6">
              <p className="text-slate-700 font-semibold text-lg">Loading Applications...</p>
              <p className="text-slate-500 text-sm">Fetching application portfolio from server</p>
            </div>
          </div> : error ? <div className="text-center py-20" data-state="error">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
              
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-3">Failed to Load Applications</h3>
            <p className="text-slate-600 max-w-md mx-auto mb-2">
              Unable to connect to the server. Please contact admin for assistance.
            </p>
            
            <Button onClick={() => window.location.reload()} className="gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white">
              <Activity className="w-4 h-4" />
              Retry
            </Button>
          </div> : filteredApps.length === 0 ? <div className="text-center py-20" data-state="no-results">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-3">No Applications Found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Your search didn't match any applications in the current environment. Try adjusting your search criteria.
            </p>
            <Button variant="outline" onClick={() => setSearchTerm('')} className="gap-2 hover:scale-105 transition-transform">
              <XCircle className="w-4 h-4" />
              Clear Search
            </Button>
          </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" data-grid="applications">
            {filteredApps.map((app, index) => {
          const status = getAppStatus(app);
          return <AppCard key={app} app={app} index={index} status={status} hasValidSubmissions={status.text !== 'No Changes'} onAppClick={handleAppClick} onStatusClick={handleStatusClick} />;
        })}
          </div>}
      </CardContent>
    </Card>;
};
export default ApplicationsGrid;