import React from 'react';
import { WithFocusProps } from '../../types'; 
import { defaultTheme } from '../../utils/themeUtils'; 
import ToolControls from './ToolControls';
import ThicknessSlider from './ThicknessSlider';
import DrawingNameInput from './DrawingNameInput';
import ActionButtons from './ActionButtons';


interface ToolbarProps extends WithFocusProps { 
  penThickness: number;
  setPenThickness: (thickness: number) => void;
  drawingMode: 'draw' | 'erase';
  setDrawingMode: (mode: 'draw' | 'erase') => void;
  clearCanvas: () => void;
  saveDrawing: () => void;
  exportToPdf: () => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  currentDrawingName: string;
  setCurrentDrawingName: (name: string) => void;
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
  setStrokeColor,
  currentDrawingName,
  setCurrentDrawingName
}) => {
  const activeThemeColors = defaultTheme; 

  const getButtonStyle = (buttonId: string) => ({
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
      border: `1px solid ${activeThemeColors.containerBorderColor}`,
      borderRadius: '8px',
      backgroundColor: activeThemeColors.uiBackground,
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
      <ToolControls 
        setDrawingMode={setDrawingMode}
        drawingMode={drawingMode}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        getButtonStyle={getButtonStyle}
        setFocusedButton={setFocusedButton}
      />

      <ThicknessSlider 
        penThickness={penThickness}
        setPenThickness={setPenThickness}
      />

      <DrawingNameInput 
        currentDrawingName={currentDrawingName}
        setCurrentDrawingName={setCurrentDrawingName}
        focusedButton={focusedButton}
        setFocusedButton={setFocusedButton}
      />

      <ActionButtons 
        setFocusedButton={setFocusedButton}
        getButtonStyle={getButtonStyle}
        clearCanvas={clearCanvas}
        focusedButton={focusedButton}
        saveDrawing={saveDrawing}
        exportToPdf={exportToPdf}
      />
    </div>
  );
};

export default Toolbar;
