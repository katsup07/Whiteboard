import React from 'react';
import { toast } from 'react-toastify';

interface ToastTestButtonProps {
  theme: 'light' | 'dark';
}

const ToastTestButton: React.FC<ToastTestButtonProps> = ({ theme }) => {
  const showTestToasts = () => {
    // Test all toast types
    toast.success('Success toast example');
    
    setTimeout(() => {
      toast.error('Error toast example');
    }, 1000);
    
    setTimeout(() => {
      toast.info('Info toast example');
    }, 2000);
    
    setTimeout(() => {
      toast.warning('Warning toast example');
    }, 3000);
  };

  return (
    <button 
      onClick={showTestToasts}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '8px 16px',
        backgroundColor: theme === 'dark' ? '#7119d0' : '#7119d0',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        zIndex: 1000,
        fontSize: '14px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      Test Toasts
    </button>
  );
};

export default ToastTestButton;
