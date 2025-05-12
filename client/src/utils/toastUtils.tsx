import { toast, ToastOptions, Zoom } from 'react-toastify';
import { Theme } from '../types';

// Common options generator for all toasts
const getCommonOptions = (theme: Theme): ToastOptions => ({
  pauseOnHover: true,
  draggable: false,
  closeOnClick: true,
  hideProgressBar: false,
  position: 'top-right',
  transition: Zoom,
  theme: theme
});

// Success toast
export const showSuccess = (message: string, theme: Theme) => {
  toast.success(message, {
    ...getCommonOptions(theme),
    toastId: message // Prevent duplicate toasts
  });
};

// Error toast
export const showError = (message: string, theme: Theme) => {
  toast.error(message, {
    ...getCommonOptions(theme),
    toastId: message // Prevent duplicate toasts
  });
};

// Info toast
export const showInfo = (message: string, theme: Theme) => {
  toast.info(message, {
    ...getCommonOptions(theme),
    toastId: message // Prevent duplicate toasts
  });
};

// Warning toast
export const showWarning = (message: string, theme: Theme) => {
  toast.warn(message, {
    ...getCommonOptions(theme),
    toastId: message // Prevent duplicate toasts
  });
};

// Confirmation toast promise
export const showConfirm = (message: string, theme: Theme): Promise<boolean> => {
  return new Promise((resolve) => {
    toast.warn(
      <div>
        <p>{message}</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={() => {
              toast.dismiss();
              resolve(true);
            }}
            style={{
              padding: '5px 10px',
              border: '1px solid 000000',
              borderRadius: '4px',
              backgroundColor: '#6100c9c5',
              color: theme === 'dark' ? '#ffffff' : '#ffffff',
              cursor: 'pointer'
            }}
          >
            Confirm
          </button>
          <button 
            onClick={() => {
              toast.dismiss();
              resolve(false);
            }}
            style={{
              padding: '5px 10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        ...getCommonOptions(theme),
        autoClose: false,
        closeButton: false,
      }
    );
  });
};
