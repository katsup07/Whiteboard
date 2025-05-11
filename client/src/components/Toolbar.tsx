import React from 'react';
import { WithThemeProps, WithFocusProps } from '../types';

interface ToolbarProps extends WithThemeProps, WithFocusProps {
  penThickness: number;
  setPenThickness: (thickness: number) => void;
  drawingMode: 'draw' | 'erase';
  setDrawingMode: (mode: 'draw' | 'erase') => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  penThickness,
  setPenThickness,
  drawingMode,
  setDrawingMode,
  activeThemeColors,
  focusedButton,
  setFocusedButton
}) => {
  return (
    <div style={{
      margin: '10px 0',
      padding: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '450px',
      border: `1px solid ${activeThemeColors.borderColor}`,
      borderRadius: '4px',
      backgroundColor: activeThemeColors.uiBackground,
    }}>
      {/* Thickness Slider */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label htmlFor="penThickness" style={{ marginRight: '10px', color: activeThemeColors.uiText }}>
          Thickness:
        </label>
        <input
          type="range"
          id="penThickness"
          min="1"
          max="50"
          value={penThickness}
          onChange={(e) => setPenThickness(Number(e.target.value))}
          style={{ cursor: 'pointer', width: '120px' }}
        />
        <span style={{ marginLeft: '10px', color: activeThemeColors.uiText, minWidth: '20px' }}>
          {penThickness}
        </span>
      </div>

      {/* Tool Controls (Pen/Eraser) */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => setDrawingMode('draw')}
          title='Switch to Pen'
          onFocus={() => setFocusedButton('penTool')}
          onBlur={() => setFocusedButton(null)}
          className="tool-button"
          style={{
            background: drawingMode === 'draw' ? `${activeThemeColors.listItemHover}` : 'transparent',
            border: (drawingMode === 'draw' || focusedButton === 'penTool') ? 
                  `1px solid ${activeThemeColors.activeBorderColor}` : 
                  'none',
            borderRadius: '4px',
            cursor: 'pointer',
            padding: '5px',
            marginRight: '10px',
            display: 'flex',
            alignItems: 'center',
            outline: 'none',
            boxShadow: (drawingMode === 'draw' || focusedButton === 'penTool') ?
                      `0 0 8px 1px rgba(157, 93, 224, 0.3)` :
                      'none',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <img
            src="/pen-icon.svg"
            alt="Pen Tool"
            style={{ 
              width: '24px', 
              height: '24px', 
              filter: activeThemeColors.iconFilter,
              opacity: drawingMode === 'draw' ? 1 : 0.6
            }}
          />
        </button>
        <button
          onClick={() => setDrawingMode('erase')}
          title='Switch to Eraser'
          onFocus={() => setFocusedButton('eraserTool')}
          onBlur={() => setFocusedButton(null)}
          className="tool-button"
          style={{
            background: drawingMode === 'erase' ? `${activeThemeColors.listItemHover}` : 'transparent',
            border: (drawingMode === 'erase' || focusedButton === 'eraserTool') 
              ? `1px solid ${activeThemeColors.activeBorderColor}` 
              : 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            outline: 'none',
            boxShadow: (drawingMode === 'erase' || focusedButton === 'eraserTool')
              ? `0 0 8px 1px rgba(157, 93, 224, 0.3)`
              : 'none',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <img
            src="/eraser-icon.svg"
            alt="Eraser Tool"
            style={{ 
              width: '24px', 
              height: '24px', 
              filter: activeThemeColors.iconFilter,
              opacity: drawingMode === 'erase' ? 1 : 0.6
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
