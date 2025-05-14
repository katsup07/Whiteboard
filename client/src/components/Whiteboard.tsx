import React, { useState } from 'react';

import './Whiteboard.css';

// Import components
import Header from './Header';
import Toolbar from './Toolbar';
import DrawingCanvas from './DrawingCanvas';
// import ActionButtons from './ActionButtons'; // ActionButtons are now part of Toolbar
import SavedDrawingsList from './SavedDrawingsList';

// Import custom hooks and utils
import { useCanvas, useDrawingStorage } from '../utils';
import { themes } from '../utils/themeUtils';
import { Theme } from '../types';
import { showConfirm } from '../utils/toastUtils.tsx';

interface WhiteboardProps {
  theme: Theme;
  onThemeChange: () => void;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ theme, onThemeChange }) => {
  const [focusedButton, setFocusedButton] = useState<string | null>(null); // Track which button has focus
  const activeThemeColors = themes[theme];

  // Use custom hooks to manage canvas and drawing storage
  const { 
    canvasRef, 
    canvasSize, 
    penThickness, 
    setPenThickness, 
    drawingMode, 
    setDrawingMode, 
    clearCanvas, 
    startDrawing, 
    draw, 
    stopDrawing 
  } = useCanvas(theme);

  const {
    drawings,
    currentDrawingName,
    setCurrentDrawingName,
    saveDrawing,
    loadDrawing,
    updateDrawing,
    deleteDrawing,
    exportToPdf
  } = useDrawingStorage(clearCanvas, canvasRef, canvasSize, activeThemeColors, theme);

  // Handle theme toggle with confirmation
  const toggleTheme = async () => {
    const confirmed = await showConfirm(
      'Switching themes after drawing will discard your current drawing. Are you sure you want to switch themes?', 
      theme
    );
    if (confirmed) {
      onThemeChange();
    }
  };
  
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // backgroundColor: activeThemeColors.uiBackground,
        color: activeThemeColors.uiText,
        minHeight: '100vh',
        position: 'relative'
      }}>
      
      <Header 
        currentDrawingName={currentDrawingName}
        setCurrentDrawingName={setCurrentDrawingName}
        toggleTheme={toggleTheme}
        theme={theme}
        activeThemeColors={activeThemeColors}
        focusedButton={focusedButton}
        setFocusedButton={setFocusedButton}
      />

      {/* Main content area (Toolbar, Canvas, SavedDrawingsList) */}
      <div style={{ padding: '70px 20px 20px 20px', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Toolbar with thickness slider and drawing tools */}
        <Toolbar 
          penThickness={penThickness}
          setPenThickness={setPenThickness}
          drawingMode={drawingMode}
          setDrawingMode={setDrawingMode}
          clearCanvas={clearCanvas} // Pass clearCanvas
          saveDrawing={saveDrawing} // Pass saveDrawing
          exportToPdf={exportToPdf} // Pass exportToPdf
          theme={theme}
          activeThemeColors={activeThemeColors}
          focusedButton={focusedButton}
          setFocusedButton={setFocusedButton}
        />

        {/* Canvas for drawing */}
        <DrawingCanvas 
          canvasRef={canvasRef}
          canvasSize={canvasSize}
          drawingMode={drawingMode}
          startDrawing={startDrawing}
          draw={draw}
          stopDrawing={stopDrawing}
          activeThemeColors={activeThemeColors}
          theme={theme}
        />
        
        {/* List of saved drawings */}
        <SavedDrawingsList 
          drawings={drawings}
          loadDrawing={loadDrawing}
          updateDrawing={updateDrawing}
          deleteDrawing={deleteDrawing}
          theme={theme}
          activeThemeColors={activeThemeColors}
          focusedButton={focusedButton}
          setFocusedButton={setFocusedButton}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
