import { useState, useEffect, useCallback } from 'react';
import { Drawing, ThemeColors } from '../types';
import { ApiClient } from '../api/ApiClient';

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
) => {  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [currentDrawingName, setCurrentDrawingName] = useState<string>('My Drawing');
  const apiClient = ApiClient.getInstance();
  // Load drawings from db
  useEffect(() => {
    const fetchDrawings = async () => {
      try {
        const savedDrawings = await apiClient.getDrawings();
        if(!savedDrawings || savedDrawings.length === 0)
          return;
  
        setDrawings(savedDrawings);
      } catch (error) {
        console.error('Error fetching drawings:', error);
      }
    };
    fetchDrawings();

  }, [apiClient]);

  const prepareNewDrawing = useCallback(() => {
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
      name: currentDrawingName || 'Untitled Drawing',
      dataUrl,
      timestamp: Date.now(),
    };    

    return newDrawing;
  }, [activeThemeColors.background, canvasRef, canvasSize, currentDrawingName]);

  // Save drawing function
  const saveDrawing = useCallback(() => {
    const newDrawing = prepareNewDrawing();
    if (!newDrawing) return;

    setDrawings(prevDrawings => [...prevDrawings, newDrawing]);

    apiClient.saveDrawing(newDrawing)
        .then(() => {
          alert('Drawing saved!');
        })
        .catch(error => {
          console.error('Error saving drawing to database:', error);
          setDrawings(prevDrawings => prevDrawings.filter(d => d.id !== newDrawing.id));
          alert('Error saving drawing. Please try again.');
        });
  }, [prepareNewDrawing, apiClient]);

  // Update existing drawing with new drawing data
  const updateDrawing = useCallback((drawingId: string) => {
    // Find the existing drawing to get its ID
    const existingDrawing = drawings.find(d => d.id === drawingId);
    if (!existingDrawing) return;
    
    // Create new drawing but preserve the original ID
    const newDrawing = prepareNewDrawing();
    if (!newDrawing) return;
    
    // Keep the original ID instead of generating a new one
    newDrawing.id = drawingId;

    const previousDrawings = [...drawings];

    setDrawings(prevDrawings => {
      const updatedDrawings = prevDrawings.map(d => d.id === drawingId ? newDrawing : d);
     
      return updatedDrawings;
    });

    apiClient.updateDrawing(drawingId, newDrawing)
        .catch(error => {
          console.error('Error updating drawing in database:', error);
          setDrawings(previousDrawings);
          alert('Error updating drawing. Please try again.');
        });
  }, [drawings, prepareNewDrawing, apiClient]);
  // Load drawing function
  const loadDrawing = useCallback((drawingId: string, drawingDataUrl: string) => {
    // Find the drawing by ID and get its name
    const drawing = drawings.find(d => d.id === drawingId);
    if (drawing) {
      setCurrentDrawingName(drawing.name);
    } else {
      setCurrentDrawingName('New Drawing');
    }

    // Clear the canvas before loading a new drawing
    clearCanvas();

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    const img = new Image();
    img.onload = () => {
      context.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
      context.strokeStyle = activeThemeColors.stroke;    };
    img.onerror = () => {
      console.error('Error loading image from data URL');
      alert('Error loading drawing. The image data may be corrupted.');
    };
    img.src = drawingDataUrl;
  }, [activeThemeColors.stroke, canvasRef, canvasSize, clearCanvas, drawings]);
  // Delete drawing function
  const deleteDrawing = useCallback((drawingId: string) => {
    setDrawings(prevDrawings => {
      const updatedDrawings = prevDrawings.filter(d => d.id !== drawingId);
    
      return updatedDrawings;
    });

    if(!window.confirm('Are you sure you want to delete this drawing?')) return;
    apiClient.deleteDrawing(drawingId)
      .catch(error => {
        console.error('Error deleting drawing from database:', error);
        alert('Error deleting drawing. Please try again.');
        setDrawings(prevDrawings => [...prevDrawings, drawings.find(d => d.id === drawingId)!]);
      });
  }, [apiClient, drawings]);

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
      pdf.save(`${currentDrawingName.replace(/\s+/g, '_') || 'drawing'}.pdf`);
    });
  }, [activeThemeColors.background, canvasRef, canvasSize, currentDrawingName]);

  return {
    drawings,
    currentDrawingName,
    setCurrentDrawingName,
    saveDrawing,
    updateDrawing,
    loadDrawing,
    deleteDrawing,
    exportToPdf
  };
};
