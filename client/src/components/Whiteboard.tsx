import React, { useState } from 'react';
import './Whiteboard.css';

// Import components
import Header from './Header';
import Toolbar from './Toolbar';
import DrawingCanvas from './DrawingCanvas';
import ActionButtons from './ActionButtons';
import SavedSketchesList from './SavedSketchesList';

// Import custom hooks and utils
import { useCanvas, useDrawingStorage } from '../utils';
import { themes } from '../utils/themeUtils';
import { Theme } from '../types';

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
    deleteDrawing,
    exportToPdf
  } = useDrawingStorage(clearCanvas, canvasRef, canvasSize, activeThemeColors);

  // Handle theme toggle with confirmation
  const toggleTheme = () => {
    confirm('Switching themes after drawing will discard your current sketch. Are you sure you want to switch themes?') &&
    onThemeChange();
  };
  
  return (
    <div 
      className={theme === 'dark' ? 'dark-mode' : ''}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: activeThemeColors.uiBackground,
        color: activeThemeColors.uiText,
        minHeight: '100vh',
        padding: '20px',
        position: 'relative'
      }}>
      
      {/* Header with theme toggle and drawing name input */}
      <Header 
        currentDrawingName={currentDrawingName}
        setCurrentDrawingName={setCurrentDrawingName}
        toggleTheme={toggleTheme}
        theme={theme}
        activeThemeColors={activeThemeColors}
        focusedButton={focusedButton}
        setFocusedButton={setFocusedButton}
      />

      {/* Toolbar with thickness slider and drawing tools */}
      <Toolbar 
        penThickness={penThickness}
        setPenThickness={setPenThickness}
        drawingMode={drawingMode}
        setDrawingMode={setDrawingMode}
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
      
      {/* Action buttons for clear, save, export */}
      <ActionButtons 
        clearCanvas={clearCanvas}
        saveDrawing={saveDrawing}
        exportToPdf={exportToPdf}
        theme={theme}
        activeThemeColors={activeThemeColors}
        focusedButton={focusedButton}
        setFocusedButton={setFocusedButton}
      />
      
      {/* List of saved sketches */}
      <SavedSketchesList 
        drawings={drawings}
        loadDrawing={loadDrawing}
        deleteDrawing={deleteDrawing}
        theme={theme}
        activeThemeColors={activeThemeColors}
        focusedButton={focusedButton}
        setFocusedButton={setFocusedButton}
      />
    </div>
  );
};

export default Whiteboard;
