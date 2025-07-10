import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadEnvironment } from '@/utils/testData';

interface EnvironmentContextType {
  currentEnv: string;
  setCurrentEnv: (env: string) => void;
  isLoading: boolean;
  error: string | null;
  refreshEnvironment: () => Promise<void>;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export const EnvironmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentEnv, setCurrentEnv] = useState('DEV');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshEnvironment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const envData = await loadEnvironment();
      setCurrentEnv(envData.environment || 'DEV');
    } catch (err) {
      console.error('Failed to load environment:', err);
      setError(err instanceof Error ? err.message : 'Failed to load environment');
      // Keep the current environment on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshEnvironment();
  }, []);

  return (
    <EnvironmentContext.Provider value={{
      currentEnv,
      setCurrentEnv,
      isLoading,
      error,
      refreshEnvironment
    }}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
};