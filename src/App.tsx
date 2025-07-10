
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from '@/contexts/ToastContext';
import { EnvironmentProvider } from '@/contexts/EnvironmentContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { useSplashScreen } from '@/hooks/useSplashScreen';
import SplashScreen from '@/components/SplashScreen';
import Home from './pages/Home';
import AppDetail from './pages/AppDetail';
import Index from './pages/Index';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import SubmissionResult from './components/SubmissionResult';

function App() {
  const { showSplash, handleSplashComplete } = useSplashScreen();

  return (
    <Router>
      <EnvironmentProvider>
        <AuthProvider>
          <ToastProvider>
            <div className="App">
              {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
              <div className={`transition-all duration-600 ease-out ${showSplash ? 'opacity-0 transform scale-95 pointer-events-none' : 'opacity-100 transform scale-100'}`}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/submissions" element={<Index />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/app/:appName" element={<AppDetail />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/submission-result" element={<SubmissionResult />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </div>
            </div>
          </ToastProvider>
        </AuthProvider>
      </EnvironmentProvider>
    </Router>
  );
}

export default App;
