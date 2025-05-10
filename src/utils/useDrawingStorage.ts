import { useState, useEffect, useCallback } from 'react';
import { Drawing, ThemeColors } from '../types';

/**
 * Custom hook for managing drawing storage operations
 * @param clearCanvas Function to clear the canvas
 * @param canvasRef Reference to the canvas element
 * @param canvasSize Canvas size dimensions
 * @param activeThemeColors Current theme colors
 */
export const useDrawingStorage = (
  clearCanvas: () => void, 
  canvasRef: React.RefObject<HTMLCanvasElement>,
  canvasSize: { width: number, height: number },
  activeThemeColors: ThemeColors
) => {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [currentDrawingName, setCurrentDrawingName] = useState<string>('My Sketch');

  // Load initial drawings from localStorage
  useEffect(() => {
    const savedDrawings = localStorage.getItem('whiteboardDrawings');
    if (savedDrawings) {
      setDrawings(JSON.parse(savedDrawings));
    }
  }, []);

  // Save drawings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('whiteboardDrawings', JSON.stringify(drawings));
  }, [drawings]);

  // Save drawing function
  const saveDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasSize.width;
    tempCanvas.height = canvasSize.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) return;

    tempCtx.fillStyle = activeThemeColors.background;
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, tempCanvas.width, tempCanvas.height);

    const dataUrl = tempCanvas.toDataURL('image/png');
    const newDrawing: Drawing = {
      id: new Date().toISOString(),
      name: currentDrawingName || 'Untitled Sketch',
      dataUrl,
      timestamp: Date.now(),
    };
    setDrawings(prevDrawings => [...prevDrawings, newDrawing]);
    alert('Sketch saved!');
  }, [activeThemeColors.background, canvasRef, canvasSize, currentDrawingName]);

  // Load drawing function
  const loadDrawing = useCallback((drawingDataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    clearCanvas();

    const img = new Image();
    img.onload = () => {
      context.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
      context.strokeStyle = activeThemeColors.stroke;
    };
    img.src = drawingDataUrl;
  }, [activeThemeColors.stroke, canvasRef, canvasSize, clearCanvas]);

  // Delete drawing function
  const deleteDrawing = useCallback((drawingId: string) => {
    setDrawings(prevDrawings => prevDrawings.filter(d => d.id !== drawingId));
  }, []);

  // Export to PDF function
  const exportToPdf = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Dynamically import jsPDF to avoid issues with SSR
    import('jspdf').then(({ default: jsPDF }) => {
      const tempExportCanvas = document.createElement('canvas');
      tempExportCanvas.width = canvasSize.width;
      tempExportCanvas.height = canvasSize.height;
      const tempExportCtx = tempExportCanvas.getContext('2d');
  
      if (!tempExportCtx) {
        alert('Could not prepare canvas for PDF export.');
        return;
      }
  
      tempExportCtx.fillStyle = activeThemeColors.background;
      tempExportCtx.fillRect(0, 0, tempExportCanvas.width, tempExportCanvas.height);
      tempExportCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, tempExportCanvas.width, tempExportCanvas.height);
  
      const imgData = tempExportCanvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: tempExportCanvas.width > tempExportCanvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [tempExportCanvas.width, tempExportCanvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, tempExportCanvas.width, tempExportCanvas.height);
      pdf.save(`${currentDrawingName.replace(/\s+/g, '_') || 'sketch'}.pdf`);
    });
  }, [activeThemeColors.background, canvasRef, canvasSize, currentDrawingName]);

  return {
    drawings,
    currentDrawingName,
    setCurrentDrawingName,
    saveDrawing,
    loadDrawing,
    deleteDrawing,
    exportToPdf
  };
};
