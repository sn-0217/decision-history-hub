
import React, { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { toast } from '@/hooks/use-toast';

interface ToastContextType {
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const showSuccess = useCallback((title: string, message?: string) => {
    toast({
      title,
      description: message,
      variant: "default", // Uses emerald gradient
    });
  }, []);

  const showError = useCallback((title: string, message?: string) => {
    toast({
      title,
      description: message,
      variant: "destructive", // Uses rose gradient
    });
  }, []);

  const showInfo = useCallback((title: string, message?: string) => {
    toast({
      title,
      description: message,
      variant: "info" as any, // Uses blue gradient
    });
  }, []);

  const showWarning = useCallback((title: string, message?: string) => {
    toast({
      title,
      description: message,
      variant: "warning" as any, // Uses amber gradient
    });
  }, []);

  const contextValue = useMemo(() => ({
    showSuccess,
    showError,
    showInfo,
    showWarning
  }), [showSuccess, showError, showInfo, showWarning]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
