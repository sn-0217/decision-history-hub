
import React from 'react';
import NotificationToast from './NotificationToast';
import { useNotificationToast } from '@/hooks/useNotificationToast';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotificationToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            transform: `translateY(${index * 10}px)`,
            zIndex: 1000 - index,
          }}
        >
          <NotificationToast
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
