import React from 'react';
import { WithFocusProps } from '../types'; 
import './Header.css'; 
import { defaultTheme } from '../utils/themeUtils';

interface HeaderProps extends WithFocusProps { 
  currentDrawingName: string;
  setCurrentDrawingName: (name: string) => void;
  toggleCanvasTheme: () => void; 
  canvasTheme: 'light' | 'dark'; 
}

const Header: React.FC<HeaderProps> = ({
  currentDrawingName,
  setCurrentDrawingName,
  toggleCanvasTheme, 
  canvasTheme, 
  focusedButton,
  setFocusedButton
}) => {
  const activeThemeColors = defaultTheme;

  return (
    <header className="app-header" >      
    <div className="logo-container">
        <img src="/images/whiteboard-2.png" alt="Whiteboard Logo" className="logo-image" />
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
        <label className="theme-switch" title={`Switch Canvas to ${canvasTheme === 'light' ? 'Dark' : 'Light'} Mode`}>
          <input type="checkbox" onChange={toggleCanvasTheme} checked={canvasTheme === 'dark'} />
          <span 
            className="slider round"
          >
          </span>
        </label>
      </div>
    </header>
  );
};

export default Header;
