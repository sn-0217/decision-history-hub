
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Start content animation after a brief delay
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 200);

    // Show loader after content appears
    const loaderTimer = setTimeout(() => {
      setShowLoader(true);
    }, 800);

    // Hide splash screen after 3 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      // Complete after fade-out animation
      setTimeout(onComplete, 700);
    }, 3000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(loaderTimer);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 transition-all duration-700 ease-out opacity-0 pointer-events-none">
        {/* Content placeholder for smooth transition */}
        <div className="text-center transform translate-y-8 scale-95 opacity-0">
          <div className="mb-12">
            <h1 className="text-8xl font-black text-slate-800 mb-4 tracking-tight">
              Apptech
            </h1>
            <div className="h-1.5 w-32 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
          </div>
          <p className="text-2xl font-medium text-slate-500 tracking-wide">
            Knitwell Group
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 transition-all duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 opacity-[0.03] transition-all transition-duration-[4000ms] ease-out ${showContent ? 'transform scale-110' : 'transform scale-100'}`}>
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Floating Abstract Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Right Blob */}
        <div className={`absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl transition-all transition-duration-[5000ms] ease-out ${showContent ? 'transform scale-150 rotate-45 translate-x-8 translate-y-8' : 'transform scale-100 rotate-0'}`}></div>
        
        {/* Bottom Left Blob */}
        <div className={`absolute -bottom-40 -left-40 w-[28rem] h-[28rem] bg-gradient-to-tr from-slate-100/60 to-blue-50/60 rounded-full blur-3xl transition-all transition-duration-[6000ms] ease-out delay-300 ${showContent ? 'transform scale-125 -rotate-12 -translate-x-4 translate-y-4' : 'transform scale-100 rotate-0'}`}></div>
        
        {/* Center Accent Blob */}
        <div className={`absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-indigo-50/30 to-blue-100/30 rounded-full blur-2xl transition-all transition-duration-[4500ms] ease-out delay-500 ${showContent ? 'transform scale-110 rotate-180' : 'transform scale-100 rotate-0'}`}></div>
      </div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-white/20 to-white/40 pointer-events-none"></div>

      {/* Main Content */}
      <div className="text-center relative z-10">
        <div className="mb-12">
          <h1 className={`text-8xl font-black text-slate-800 mb-4 tracking-tight transition-all duration-1000 ease-out ${showContent ? 'opacity-100 transform translate-y-0 scale-100' : 'opacity-0 transform translate-y-8 scale-95'}`}>
            Apptech
          </h1>
          <div className={`h-1.5 w-32 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full transition-all duration-1200 ease-out delay-300 ${showContent ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
        </div>
        
        <p className={`text-2xl font-medium text-slate-500 tracking-wide mb-16 transition-all duration-1000 ease-out delay-500 ${showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-6'}`}>
          Knitwell Group
        </p>

        {/* Premium Loading Indicator */}
        <div className={`transition-all duration-800 ease-out delay-800 ${showLoader ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
          <div className="flex items-center justify-center space-x-2">
            {/* Pulsating Dots */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-4 font-medium tracking-wider">Loading your experience</p>
        </div>
      </div>

      {/* Subtle Corner Accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-slate-200/60 pointer-events-none"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-slate-200/60 pointer-events-none"></div>
    </div>
  );
};

export default SplashScreen;
