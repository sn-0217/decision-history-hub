import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { CustomToast } from './custom-toast';

export function CustomToaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => {
        // Map toast variant to custom toast type
        let type: 'success' | 'error' | 'info' | 'warning' = 'info';
        
        // Map variants to types
        if (toast.variant === 'destructive') {
          type = 'error';
        } else if (toast.variant === 'default') {
          // Check title to determine success/info/warning
          const title = toast.title?.toString().toLowerCase() || '';
          if (title.includes('success') || title.includes('submitted') || title.includes('completed')) {
            type = 'success';
          } else if (title.includes('warning') || title.includes('caution')) {
            type = 'warning';
          } else {
            type = 'info';
          }
        }
        
        return (
          <CustomToast
            key={toast.id}
            id={toast.id}
            type={type}
            title={toast.title || ''}
            message={toast.description?.toString()}
            duration={5000}
            onClose={() => dismiss(toast.id)}
          />
        );
      })}
    </div>
  );
}