import { useCallback } from 'react';
import { toast, ToastOptions } from 'react-toastify';

/**
 * Types of toasts
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Default configuration options for toasts
 */
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  className: 'whiteboard-toast',
  progressClassName: 'toast-progress',
  style: {
    borderRadius: '4px',
  }
};

/**
 * Custom hook for displaying toast notifications
 * @returns Object with functions to show different types of toasts
 */
export const useToast = () => {
  /**
   * Show a toast notification
   * @param message Message to display
   * @param type Type of toast (success, error, info, warning)
   * @param options Optional toast configuration
   */
  const showToast = useCallback((message: string, type: ToastType, options?: ToastOptions) => {
    const toastOptions = { ...defaultOptions, ...options };
    
    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'info':
        toast.info(message, toastOptions);
        break;
      case 'warning':
        toast.warning(message, toastOptions);
        break;
    }
  }, []);

  // Convenience methods for specific toast types
  const success = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'success', options);
  }, [showToast]);

  const error = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'error', options);
  }, [showToast]);

  const info = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'info', options);
  }, [showToast]);

  const warning = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'warning', options);
  }, [showToast]);

  return {
    showToast,
    success,
    error,
    info,
    warning
  };
};
