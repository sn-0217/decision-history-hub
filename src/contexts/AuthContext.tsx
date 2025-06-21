import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  userRole: string | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is already authenticated on mount
  useEffect(() => {
    const storedAuth = sessionStorage.getItem('auth');
    const storedRole = sessionStorage.getItem('userRole');
    
    if (storedAuth) {
      setIsAuthenticated(true);
      if (storedRole) {
        setUserRole(storedRole);
        setIsAdmin(storedRole === 'ADMIN');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Create basic auth header
      const credentials = btoa(`${username}:${password}`);
      
      // Test authentication with a simple API call
      console.log('Attempting login with credentials for user:', username);
      const response = await fetch('/admin', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include'
      });
      
      console.log('Login response status:', response.status);
      console.log('Login response headers:', [...response.headers.entries()]);

      // Check if response is ok (status 200-299) and parse the JSON response
      if (response.ok) {
        // Check content type to ensure it's JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Login error: Server returned non-JSON response');
          console.error('Content-Type:', contentType);
          
          // Try to get the response text for debugging
          try {
            const responseText = await response.text();
            console.error('Response text (first 200 chars):', responseText.substring(0, 200));
          } catch (textError) {
            console.error('Failed to get response text:', textError);
          }
          
          setIsAuthenticated(false);
          setUserRole(null);
          setIsAdmin(false);
          return false;
        }
        
        try {
          const data = await response.json();
          console.log('Login response data:', data);
          
          // Verify that the server confirmed authentication
          // If data.success is explicitly false, authentication failed
          // If data.success is undefined but we got a 200 OK, assume success
          if (data && (data.success === true || (data.success === undefined && response.ok))) {
          setIsAuthenticated(true);
          // Store credentials for subsequent requests
          sessionStorage.setItem('auth', credentials);
          
          // For this implementation, we'll assume the username 'admin' has ADMIN role
          // In a real application, this would come from the server response
          const role = username.toLowerCase() === 'admin' ? 'ADMIN' : 'USER';
          setUserRole(role);
          setIsAdmin(role === 'ADMIN');
          sessionStorage.setItem('userRole', role);
          
          return true;
        } else {
          console.error('Authentication failed: Server did not confirm authentication');
          setIsAuthenticated(false);
          setUserRole(null);
          setIsAdmin(false);
          return false;
        }
        } catch (parseError) {
          console.error('Login error: Failed to parse JSON response', parseError);
          setIsAuthenticated(false);
          setUserRole(null);
          setIsAdmin(false);
          return false;
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setIsAdmin(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // First call logout endpoint
    fetch('/logout', {
      method: 'POST',
      credentials: 'include'
    }).catch(console.error);
    
    // Add a small delay before updating state to ensure proper synchronization
    setTimeout(() => {
      // Then update state
      setIsAuthenticated(false);
      setUserRole(null);
      setIsAdmin(false);
      sessionStorage.removeItem('auth');
      sessionStorage.removeItem('userRole');
      
      // Show logout toast notification
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        variant: "default"
      });
    }, 50);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      isLoading, 
      userRole, 
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};