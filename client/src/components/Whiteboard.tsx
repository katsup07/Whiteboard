import React, { useState, useEffect } from 'react'; // Added useEffect

import './Whiteboard.css';

// Import components
import Header from './Header';
import Toolbar from './Toolbar';
import DrawingCanvas from './DrawingCanvas';
import SavedDrawingsList from './SavedDrawingsList';

// Import custom hooks and utils
import { useCanvas, useDrawingStorage } from '../utils';
import { defaultTheme } from '../utils/themeUtils'; 
import { showConfirm } from '../utils/toastUtils.tsx';
import { Theme } from '../types.ts';

interface WhiteboardProps {
  canvasTheme: Theme; 
  onCanvasThemeChange: () => void; 
}

const Whiteboard: React.FC<WhiteboardProps> = ({ canvasTheme, onCanvasThemeChange }) => {
  const [focusedButton, setFocusedButton] = useState<string | null>(null); 
  const activeThemeColors = defaultTheme; // This is our main UI theme (dark)

  // Effect to update body attribute if needed (though App.tsx handles initial)
  useEffect(() => {
    document.body.setAttribute('data-theme', 'dark'); // Ensure body always has dark theme
  }, []);

  const { 
    canvasRef, 
    canvasSize, 
    penThickness, 
    setPenThickness, 
    strokeColor,
    setStrokeColor,
    drawingMode, 
    setDrawingMode, 
    clearCanvas, 
    startDrawing, 
    draw, 
    stopDrawing 
  } = useCanvas(canvasTheme); 

  const {
    drawings,
    currentDrawingName,
    setCurrentDrawingName,
    saveDrawing,
    loadDrawing,
    updateDrawing,
    deleteDrawing,
    exportToPdf
  } = useDrawingStorage(clearCanvas, canvasRef, canvasSize, canvasTheme, activeThemeColors); // Pass canvasTheme and activeThemeColors (for UI)

  const toggleCanvasTheme = async () => {
    const confirmed = await showConfirm(
      'Switching canvas themes after drawing will discard your current drawing. Are you sure you want to switch themes?', 
      'dark' 
    );
    if (confirmed) {
      onCanvasThemeChange();
    }
  };
  
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: activeThemeColors.uiText,
        minHeight: '100vh',
        position: 'relative'
      }}>
      
      <Header 
        currentDrawingName={currentDrawingName}
        setCurrentDrawingName={setCurrentDrawingName}
        toggleCanvasTheme={toggleCanvasTheme} 
        canvasTheme={canvasTheme} 
        focusedButton={focusedButton}
        setFocusedButton={setFocusedButton}
      />

      <div style={{ padding: '70px 20px 20px 20px', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Toolbar 
          penThickness={penThickness}
          setPenThickness={setPenThickness}
          drawingMode={drawingMode}
          setDrawingMode={setDrawingMode}
          clearCanvas={clearCanvas}
          saveDrawing={saveDrawing}
          exportToPdf={exportToPdf}
          strokeColor={strokeColor}
          setStrokeColor={setStrokeColor}
          focusedButton={focusedButton}
          setFocusedButton={setFocusedButton}
        />

        <DrawingCanvas 
          canvasRef={canvasRef}
          canvasSize={canvasSize}
          drawingMode={drawingMode}
          startDrawing={startDrawing}
          draw={draw}
          stopDrawing={stopDrawing}
          canvasTheme={canvasTheme} 
        />
        
        <SavedDrawingsList 
          drawings={drawings}
          loadDrawing={loadDrawing}
          updateDrawing={updateDrawing}
          deleteDrawing={deleteDrawing}
          focusedButton={focusedButton}
          setFocusedButton={setFocusedButton}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
