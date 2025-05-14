import React from 'react';
import { WithThemeProps, WithFocusProps } from '../types';
import './Header.css'; // Import a new CSS file for header styles

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
    <header className="app-header" style={{ backgroundColor: activeThemeColors.headerBackground, borderBottomColor: activeThemeColors.borderColor }}>
      <div className="logo-container">
        <img src="/whiteboard-2.png" alt="Whiteboard Logo" className="logo-image" />
        <h1 className="logo-text" style={{ color: activeThemeColors.uiText }}>Whiteboard</h1>
      </div>

      <div className="header-controls">
        <input
          type="text"
          value={currentDrawingName}
          onChange={(e) => setCurrentDrawingName(e.target.value)}
          placeholder="Drawing Name"
          className="drawing-name-input"
          onFocus={() => setFocusedButton('drawingNameInput')}
          onBlur={() => setFocusedButton(null)}
          style={{
            backgroundColor: activeThemeColors.listBackground,
            color: activeThemeColors.uiText,
            borderColor: focusedButton === 'drawingNameInput' ? activeThemeColors.activeBorderColor : activeThemeColors.borderColor,
            boxShadow: focusedButton === 'drawingNameInput' ? `0 0 8px 1px ${activeThemeColors.focusShadowColor}` : 'none'
          }}
        />
        <label className="theme-switch" title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
          <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
          <span 
            className="slider round" 
            style={{ 
              backgroundColor: theme === 'dark' ? activeThemeColors.activeBackground : '#ccc',
            }}
          >
          </span>
        </label>
      </div>
    </header>
  );
};

export default Header;
