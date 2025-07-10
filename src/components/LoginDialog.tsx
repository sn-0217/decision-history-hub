import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, User, Lock, LogIn, AlertTriangle } from 'lucide-react';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<boolean>;
  isLoading: boolean;
}

const LoginDialog: React.FC<LoginDialogProps> = ({
  isOpen,
  onClose,
  onLogin,
  isLoading
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      const success = await onLogin(username, password);
      if (success) {
        setUsername('');
        setPassword('');
        onClose();
      } else {
        setError('Authentication failed: Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof SyntaxError) {
        setError('Server error: Received invalid response format. Please contact administrator.');
      } else if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('network'))) {
        setError('Network error: Unable to connect to the server. Please check your connection.');
      } else {
        setError('Authentication error: Please try again later');
      }
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-slate-900">
                Admin Authentication
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600 mt-1">
                Please enter your credentials to access the admin panel
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <div>
              <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <div className="w-4 h-4 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-2.5 h-2.5 text-blue-600" />
                </div>
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="transition-all duration-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <div className="w-4 h-4 bg-red-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-2.5 h-2.5 text-red-600" />
                </div>
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="transition-all duration-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 gap-2 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Login
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-600 text-center">
            <Shield className="w-3 h-3 inline mr-1" />
            Secure authentication required for administrative access
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;