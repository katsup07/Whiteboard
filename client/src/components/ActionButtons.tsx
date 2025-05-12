import React from 'react';
import { WithThemeProps, WithFocusProps } from '../types';
import { getButtonStyle } from '../utils/themeUtils';

interface ActionButtonsProps extends WithThemeProps, WithFocusProps {
  clearCanvas: () => void;
  saveDrawing: () => void;
  exportToPdf: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  clearCanvas,
  saveDrawing,
  exportToPdf,
  theme,
  activeThemeColors,
  focusedButton,
  setFocusedButton
}) => {
  return (
    <div style={{ marginTop: '20px', display: 'flex' }}>
      <button 
        onClick={clearCanvas} 
        style={getButtonStyle('clearCanvas', focusedButton, theme, activeThemeColors)}
        onFocus={() => setFocusedButton('clearCanvas')}
        onBlur={() => setFocusedButton(null)}
        className="action-button"
      >
        <img 
          src="/clear-icon.svg" 
          alt="Clear" 
          style={{ 
            width: '16px', 
            height: '16px', 
            filter: activeThemeColors.iconFilter === 'none' ? 'brightness(5)' : activeThemeColors.iconFilter 
          }} 
        />
        Clear
      </button>
      <button 
        onClick={saveDrawing} 
        style={getButtonStyle('saveDrawing', focusedButton, theme, activeThemeColors)}
        onFocus={() => setFocusedButton('saveDrawing')}
        onBlur={() => setFocusedButton(null)}
        className="action-button"
      >
        <img 
          src="/save-icon.svg" 
          alt="Save" 
          style={{ 
            width: '16px',            height: '16px', 
            filter: activeThemeColors.iconFilter === 'none' ? 'brightness(5)' : activeThemeColors.iconFilter 
          }} 
        />
        Save Drawing
      </button>
      <button 
        onClick={exportToPdf} 
        style={getButtonStyle('exportToPdf', focusedButton, theme, activeThemeColors)}
        onFocus={() => setFocusedButton('exportToPdf')}
        onBlur={() => setFocusedButton(null)}
        className="action-button"
      >
        <img 
          src="/pdf-icon.svg" 
          alt="PDF" 
          style={{ 
            width: '16px', 
            height: '16px', 
            filter: activeThemeColors.iconFilter === 'none' ? 'brightness(5)' : activeThemeColors.iconFilter 
          }} 
        />
        Export to PDF
      </button>
    </div>
  );
};

export default ActionButtons;
