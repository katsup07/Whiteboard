import React from 'react';
import { WithThemeProps, WithFocusProps } from '../types';

interface ToolbarProps extends WithThemeProps, WithFocusProps {
  penThickness: number;
  setPenThickness: (thickness: number) => void;
  drawingMode: 'draw' | 'erase';
  setDrawingMode: (mode: 'draw' | 'erase') => void;
  clearCanvas: () => void;
  saveDrawing: () => void;
  exportToPdf: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  penThickness,
  setPenThickness,
  drawingMode,
  setDrawingMode,
  clearCanvas,
  saveDrawing,
  exportToPdf,
  activeThemeColors,
  focusedButton,
  setFocusedButton
}) => {
  const getToolButtonStyle = (buttonId: string) => ({
    background: (drawingMode === buttonId || focusedButton === buttonId) ? activeThemeColors.activeBackground : 'transparent',
    border: (drawingMode === buttonId || focusedButton === buttonId) ?
              `2px solid ${activeThemeColors.activeBorderColor}` :
              `2px solid transparent`,
    borderRadius: '6px',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    boxShadow: (drawingMode === buttonId || focusedButton === buttonId) ?
                  `0 0 8px 2px ${activeThemeColors.focusShadowColor}` :
                  'none',
    transition: 'all 0.2s ease-in-out',
  });

  const getActionButtonStyle = (buttonId: string) => ({
    background: focusedButton === buttonId ? activeThemeColors.activeBackground : activeThemeColors.buttonBackground,
    color: activeThemeColors.buttonText,
    border: focusedButton === buttonId ? `2px solid ${activeThemeColors.activeBorderColor}` : `1px solid ${activeThemeColors.borderColor}`,
    borderRadius: '6px',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    boxShadow: focusedButton === buttonId ? `0 0 8px 2px ${activeThemeColors.focusShadowColor}` : 'none',
    transition: 'all 0.2s ease-in-out',
  });

  return (
    <div style={{
      margin: '10px 0 20px 0',
      padding: '10px 15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: '15px',
      width: 'auto',
      minWidth: 'fit-content',
      border: `1px solid ${activeThemeColors.borderColor}`,
      borderRadius: '8px',
      backgroundColor: activeThemeColors.uiBackground,
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
      {/* Tool Controls (Pen/Eraser) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => setDrawingMode('draw')}
          title='Switch to Pen'
          onFocus={() => setFocusedButton('penTool')}
          onBlur={() => setFocusedButton(null)}
          className="tool-button"
          style={getToolButtonStyle('draw')}
        >
          <img
            src="/pen-icon.svg"
            alt="Pen Tool"
            style={{
              width: '22px',
              height: '22px',
              filter: activeThemeColors.iconFilter,
              opacity: drawingMode === 'draw' ? 1 : 0.7
            }}
          />
        </button>
        <button
          onClick={() => setDrawingMode('erase')}
          title='Switch to Eraser'
          onFocus={() => setFocusedButton('eraserTool')}
          onBlur={() => setFocusedButton(null)}
          className="tool-button"
          style={getToolButtonStyle('erase')}
        >
          <img
            src="/eraser-icon.svg"
            alt="Eraser Tool"
            style={{
              width: '22px',
              height: '22px',
              filter: activeThemeColors.iconFilter,
              opacity: drawingMode === 'erase' ? 1 : 0.7
            }}
          />
        </button>
      </div>

      {/* Thickness Slider */}
      <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, marginRight: '20px', minWidth: '200px' }}>
        
        <input
          type="range"
          id="penThickness"
          min="1"
          max="50"
          value={penThickness}
          onChange={(e) => setPenThickness(Number(e.target.value))}
          style={{ cursor: 'pointer', width: '100%', maxWidth: '150px' }}
          title={`Pen thickness: ${penThickness}px`}
        />
        <span style={{ marginLeft: '10px', color: activeThemeColors.uiText, minWidth: '25px', fontSize: '0.9em' }}>
          {penThickness}px
        </span>
      </div>

      {/* Action Buttons (Clear, Save, Export) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={clearCanvas}
          style={getActionButtonStyle('clearCanvas')}
          onFocus={() => setFocusedButton('clearCanvas')}
          onBlur={() => setFocusedButton(null)}
          className="action-button"
          title="Clear Canvas"
        >
          <img
            src="/clear-all-icon.svg"
            alt="Clear"
            style={{
              width: '20px',
              height: '20px',
              filter: activeThemeColors.iconFilter
            }}
          />
        </button>
        <button
          onClick={saveDrawing}
          style={getActionButtonStyle('saveDrawing')}
          onFocus={() => setFocusedButton('saveDrawing')}
          onBlur={() => setFocusedButton(null)}
          className="action-button"
          title="Save Drawing"
        >
          <img
            src="/save-icon.svg"
            alt="Save"
            style={{
              width: '20px',
              height: '20px',
              filter: activeThemeColors.iconFilter
            }}
          />
        </button>
        <button
          onClick={exportToPdf}
          style={getActionButtonStyle('exportToPdf')}
          onFocus={() => setFocusedButton('exportToPdf')}
          onBlur={() => setFocusedButton(null)}
          className="action-button"
          title="Export to PDF"
        >
          <img
            src="/export-pdf-icon.svg"
            alt="Export PDF"
            style={{
              width: '20px',
              height: '20px',
              filter: activeThemeColors.iconFilter
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
