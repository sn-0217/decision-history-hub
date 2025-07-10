import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, BarChart3, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SubmissionResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(7);
  
  // Get app name from location state or search params
  const appName = location.state?.appName || searchParams.get('app') || 'Application';
  const decodedAppName = decodeURIComponent(appName);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 7000);

    const countdownTimer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6" data-page="submission-result">
      <div className="text-center max-w-2xl mx-auto">
        {/* Success Icon with Animation */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
            <CheckCircle className="w-16 h-16 text-emerald-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center animate-bounce">
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Request Submitted!</h1>
          <p className="text-lg text-slate-600 mb-4">
            Your change request for <span className="font-semibold text-emerald-700">{decodedAppName}</span> has been successfully submitted.
          </p>
          
          {/* Countdown Badge */}
          <Badge className="gap-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200 px-4 py-2 text-sm font-medium">
            <Clock className="w-4 h-4" />
            Auto-closing in {countdown}s...
          </Badge>
        </div>

        {/* Action Cards */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dashboard Button */}
            <Button
              onClick={() => navigate('/home')}
              className="group relative gap-3 w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl font-medium"
              size="lg"
            >
              <div className="relative">
                <Home className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
              </div>
              <span className="relative z-10">Go to Dashboard</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            
            {/* View Submission Button */}
            <Button
              onClick={() => navigate(`/submissions?search=${encodeURIComponent(decodedAppName)}`)}
              className="group relative gap-3 w-full h-12 border-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 hover:from-blue-100 hover:via-indigo-100 hover:to-purple-100 text-blue-700 hover:text-blue-800 shadow-sm hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 hover:scale-[1.02] rounded-xl font-medium backdrop-blur-sm"
              size="lg"
              variant="outline"
            >
              <div className="relative">
                <BarChart3 className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-blue-400/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
              </div>
              <span className="relative z-10">View My Submission</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-sm text-slate-500">
          You will receive email notifications about the status of your request.
        </p>
      </div>
    </div>
  );
};

export default SubmissionResult;

