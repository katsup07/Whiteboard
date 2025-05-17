import React from 'react';
import { WithFocusProps } from '../types'; // Removed WithThemeProps
import { defaultTheme } from '../utils/themeUtils'; // Import defaultTheme

interface ToolbarProps extends WithFocusProps { // Removed WithThemeProps
  penThickness: number;
  setPenThickness: (thickness: number) => void;
  drawingMode: 'draw' | 'erase';
  setDrawingMode: (mode: 'draw' | 'erase') => void;
  clearCanvas: () => void;
  saveDrawing: () => void;
  exportToPdf: () => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  penThickness,
  setPenThickness,
  drawingMode,
  setDrawingMode,
  clearCanvas,
  saveDrawing,
  exportToPdf,
  focusedButton,
  setFocusedButton,
  strokeColor,
  setStrokeColor
}) => {
  const activeThemeColors = defaultTheme; // Use defaultTheme

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
          className="action-button"          style={{
            ...getActionButtonStyle('penTool'),
            ...(drawingMode === 'draw' ? {
              background: activeThemeColors.activeBackground,
              border: `2px solid ${activeThemeColors.activeBorderColor}`,
              boxShadow: `0 0 8px 2px ${activeThemeColors.focusShadowColor}`
            } : {})
          }}
        >
          <img
            src="/icons/pen-icon.svg"
            alt="Pen Tool"
            style={{
              width: '20px',
              height: '20px',
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
          className="action-button"          style={{
            ...getActionButtonStyle('eraserTool'),
            ...(drawingMode === 'erase' ? {
              background: activeThemeColors.activeBackground,
              border: `2px solid ${activeThemeColors.activeBorderColor}`,
              boxShadow: `0 0 8px 2px ${activeThemeColors.focusShadowColor}`
            } : {})
          }}
        >
          <img
            src="/icons/eraser-icon.svg"
            alt="Eraser Tool"
            style={{
              width: '20px',
              height: '20px',
              filter: activeThemeColors.iconFilter,
              opacity: drawingMode === 'erase' ? 1 : 0.7
            }}
          />
        </button>
        <div
          style={getActionButtonStyle('colorPicker')}
          className="action-button"
          title="Choose pen color"
        >
          <input
            type="color"            
            value={strokeColor}
            onChange={e => setStrokeColor(e.target.value)}
            title="Choose pen color"
            className="color-picker"
            onFocus={() => setFocusedButton('colorPicker')}
            onBlur={() => setFocusedButton(null)}
          />
        </div>
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
            src="/icons/clear-all-icon.svg"
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
            src="/icons/save-icon.svg"
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
            src="/icons/export-pdf-icon.svg"
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
