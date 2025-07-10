import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, BarChart3, Zap, FileText, AlertTriangle, RefreshCw, WifiOff, Shield, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import ChangeRequestDetails from '@/components/ChangeRequestDetails';
import ApprovalForm from '@/components/ApprovalForm';
import EnvironmentBadge from '@/components/EnvironmentBadge';

interface AppDetailData {
  appName: string;
  changeNumber: string;
  applicationOwner: string;
  maintenanceWindow: string;
  changeDescription: string;
  teamDl: string;
  hosts: string[];
}

interface ChangeRequest {
  changeNo: string;
  requestedBy: string;
  requestDate: string;
  deploymentWindow: string;
  description: string;
  teamDl: string;
  affectedServers: string[];
}

const AppDetail = () => {
  const { appName } = useParams<{ appName: string }>();
  const navigate = useNavigate();
  const { currentEnv } = useEnvironment();
  const [appData, setAppData] = useState<AppDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch app-specific details
  useEffect(() => {
    const fetchAppDetails = async () => {
      if (!appName) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Fetching app details for: ${appName}`);
        
        const response = await fetch(`/api/app/${encodeURIComponent(appName)}`);
        console.log('App detail response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Application not found');
          }
          throw new Error(`Failed to load application details (HTTP ${response.status})`);
        }
        
        const data = await response.json();
        console.log('App detail data received:', data);
        setAppData(data);
      } catch (err) {
        console.error('Failed to fetch app details:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        // Set default data when there's an error
        setAppData({
          appName: appName || 'N/A',
          changeNumber: 'N/A',
          applicationOwner: 'N/A',
          maintenanceWindow: 'N/A',
          changeDescription: 'N/A',
          teamDl: 'N/A',
          hosts: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppDetails();
  }, [appName]);

  // Convert API data to ChangeRequest format for the existing component
  const getChangeRequest = (): ChangeRequest | null => {
    if (!appData) return null;
    
    return {
      changeNo: appData.changeNumber,
      requestedBy: appData.applicationOwner,
      requestDate: new Date().toLocaleDateString(),
      deploymentWindow: appData.maintenanceWindow,
      description: appData.changeDescription,
      teamDl: appData.teamDl,
      affectedServers: appData.hosts
    };
  };

  const changeRequest = getChangeRequest();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-blue-400 rounded-full animate-spin mx-auto" style={{
              animationDirection: 'reverse',
              animationDuration: '1.5s'
            }}></div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-700 font-semibold text-lg">Loading Application Details...</p>
            <p className="text-slate-500 text-sm">Fetching {appName} configuration</p>
          </div>
        </div>
      </div>
    );
  }

  if (!changeRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-700 mb-3">Application Not Found</h3>
          <p className="text-slate-600 mb-6">
            The application "{appName}" could not be found or is not available.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/home')} 
              className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white w-full"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="gap-2 w-full"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" data-page="app-detail">
      {/* Modern Header with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4" data-section="header-info">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{appData.appName} - Change Approval</h1>
                <p className="text-slate-600 text-sm mt-1">Enterprise change management workflow</p>
              </div>
            </div>
            <div className="flex items-center gap-3" data-section="header-actions">
              <EnvironmentBadge currentEnv={currentEnv} />
              
              {/* Analytics Button - Modern Blue Theme */}
              <Button 
                variant="outline" 
                size="sm" 
                className="group relative gap-2.5 h-9 px-4 border-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 hover:from-blue-100 hover:via-indigo-100 hover:to-purple-100 text-blue-700 hover:text-blue-800 shadow-sm hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 hover:scale-[1.02] rounded-xl font-medium backdrop-blur-sm"
                onClick={() => navigate('/submissions')}
                data-action="view-submissions"
              >
                <div className="relative">
                  <BarChart3 className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
                </div>
                <span className="relative z-10">Analytics</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              
              {/* Dashboard Button - Modern Purple Theme */}
              <Button 
                variant="outline" 
                size="sm" 
                className="group relative gap-2.5 h-9 px-4 border-0 bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 hover:from-purple-100 hover:via-violet-100 hover:to-indigo-100 text-purple-700 hover:text-purple-800 shadow-sm hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300 hover:scale-[1.02] rounded-xl font-medium backdrop-blur-sm"
                onClick={() => navigate('/home')}
                data-action="back-home"
              >
                <div className="relative">
                  <Home className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-[5deg]" />
                  <div className="absolute inset-0 bg-purple-400/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
                </div>
                <span className="relative z-10">Dashboard</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 to-indigo-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8" data-main="app-detail-content">
        {/* Enhanced Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert className="border-0 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 shadow-lg rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 via-orange-100/20 to-red-100/20"></div>
              <div className="relative z-10 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <WifiOff className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        Connection Issue
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                          Using Defaults
                        </Badge>
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.reload()}
                        className="gap-2 hover:bg-amber-50 border-amber-200 text-amber-700 hover:text-amber-800"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retry
                      </Button>
                    </div>
                    <AlertDescription className="text-slate-600 text-sm leading-relaxed mb-3">
                      {error}. The system has loaded default values to allow you to continue working.
                    </AlertDescription>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                        <span>Offline Mode Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Data Preserved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Alert>
          </div>
        )}

        {/* Unified Change Request & Approval Card */}
        <Card className="group hover:shadow-2xl transition-all duration-700 border-0 shadow-xl bg-white/90 backdrop-blur-lg relative overflow-hidden" data-card="unified-workflow">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <CardHeader className="bg-gradient-to-r from-slate-50/90 to-blue-50/90 border-b border-slate-200/50 relative z-10 backdrop-blur-sm px-8 py-6">
            <CardTitle className="flex items-center justify-between text-slate-900">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Change Request Workflow</span>
                  <p className="text-sm text-slate-600 font-normal mt-1">Review details and provide approval decision</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-2 text-sm font-semibold">
                {changeRequest.changeNo}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 relative z-10">
            <div className="grid grid-cols-1 xl:grid-cols-5 min-h-[600px]">
              <div className="xl:col-span-3">
                <ChangeRequestDetails changeRequest={changeRequest} />
              </div>
              <div className="xl:col-span-2">
                <ApprovalForm 
                  appName={appData.appName}
                  changeNo={changeRequest.changeNo}
                  currentEnv={currentEnv}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppDetail;