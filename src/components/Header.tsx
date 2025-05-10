import React from 'react';
import { WithThemeProps, WithFocusProps } from '../types';

interface HeaderProps extends WithThemeProps, WithFocusProps {
  currentDrawingName: string;
  setCurrentDrawingName: (name: string) => void;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentDrawingName,
  setCurrentDrawingName,
  toggleTheme,
  theme,
  activeThemeColors,
  focusedButton,
  setFocusedButton
}) => {
  return (
    <>
      <button 
        onClick={toggleTheme}
        className="theme-toggle-button"
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: focusedButton === 'themeToggle' ? '6px 10px' : '8px 12px',
          backgroundColor: activeThemeColors.buttonBackground,
          color: activeThemeColors.buttonText,
          border: focusedButton === 'themeToggle' 
                ? `1px solid ${activeThemeColors.activeBorderColor}` 
                : `1px solid ${activeThemeColors.borderColor}`,
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 1000,
          outline: 'none',
          boxShadow: focusedButton === 'themeToggle' 
                    ? `0 0 8px 1px rgba(157, 93, 224, 0.5)` 
                    : 'none',
          transition: 'all 0.2s ease-in-out'
        }}
        onFocus={() => setFocusedButton('themeToggle')}
        onBlur={() => setFocusedButton(null)}
      >
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>

      <div className="whiteboard-header">
        <h2>Whiteboard</h2>
        <img src="/whiteboard-2.png" alt="Marker" style={{ width: '100px', height: '50px', marginBottom: '20px' }} />
      </div>
      
      <input 
        type="text" 
        value={currentDrawingName} 
        onChange={(e) => setCurrentDrawingName(e.target.value)}
        placeholder="Sketch Name"
        style={{
          marginBottom: '10px',
          padding: '8px',
          border: `1px solid ${activeThemeColors.borderColor}`,
          backgroundColor: activeThemeColors.listBackground,
          color: activeThemeColors.uiText,
          width: '300px',
          borderRadius: '4px',
        }}
      />
    </>
  );
};

export default Header;
