import React from 'react';
import { WithFocusProps } from '../../types'; 
import '../../styles/header.css'; 
import { defaultTheme } from '../../utils/themeUtils';

interface HeaderProps extends WithFocusProps { 
  toggleCanvasTheme: () => void; 
  canvasTheme: 'light' | 'dark'; 
}

const Header: React.FC<HeaderProps> = ({
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
      </div>      <div className="header-controls">
        <label className="theme-switch" title={`Switch Canvas to ${canvasTheme === 'light' ? 'Dark' : 'Light'} Mode`}>
          <input 
            type="checkbox" 
            onChange={toggleCanvasTheme} 
            checked={canvasTheme === 'dark'} 
            onFocus={() => setFocusedButton('themeToggle')}
            onBlur={() => setFocusedButton(null)}
          />
          <span 
            className={`slider round ${focusedButton === 'themeToggle' ? 'focused' : ''}`}
          >
          </span>
        </label>
      </div>
    </header>
  );
};

export default Header;
