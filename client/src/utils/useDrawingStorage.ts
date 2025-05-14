import { useState, useEffect, useCallback } from 'react';
import { Drawing, ThemeColors } from '../types';
import { ApiClient } from '../api/ApiClient';
import { handleSaveError, initializeContext, decideQuality } from './drawingStorageUtils';
import { toast } from 'react-toastify';
import { showConfirm } from './toastUtils.tsx';

/**
 * Custom hook for managing drawing storage operations
 * @param clearCanvas Function to clear the canvas
 * @param canvasRef Reference to the canvas element
 * @param canvasSize Canvas size dimensions
 * @param canvasTheme Current theme for the canvas ('light' | 'dark')
 * @param uiThemeColors Colors for the UI (using defaultTheme - dark)
 */
export const useDrawingStorage = (
  clearCanvas: () => void,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  canvasSize: { width: number, height: number },
  canvasTheme: 'light' | 'dark',
  uiThemeColors: ThemeColors
) => {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [currentDrawingName, setCurrentDrawingName] = useState<string>('My Drawing');
  const apiClient = ApiClient.getInstance();

  // Determine canvas background color based on canvasTheme for saving/exporting
  const canvasBackgroundColorForStorage = canvasTheme === 'light' ? '#FFFFFF' : uiThemeColors.background; // Use uiThemeColors for dark bg

  // Load drawings from db
  useEffect(() => {
    const fetchDrawings = async () => {
      try {
        const savedDrawings = await apiClient.getDrawings();
        if (!savedDrawings || savedDrawings.length === 0) return;

        setDrawings(savedDrawings);
      } catch (error) {
        console.error('Error fetching drawings:', error);
      }
    };
    fetchDrawings();
  }, [apiClient]);

  // Helper function to prepare a new drawing
  const prepareNewDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasSize.width;
    tempCanvas.height = canvasSize.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) return;

    // Use canvasBackgroundColorForStorage for consistent background in saved/exported images
    initializeContext(tempCtx, canvasBackgroundColorForStorage, canvas, tempCanvas);

    // JPEG with quality compression to reduce payload size for network operations
    const qualitySetting = decideQuality(canvasSize);
    const dataUrl = tempCanvas.toDataURL('image/jpeg', qualitySetting);
    const newDrawing: Drawing = {
      name: currentDrawingName || 'Untitled Drawing',
      dataUrl,
      timestamp: Date.now(),
    };

    return newDrawing;
  }, [canvasBackgroundColorForStorage, canvasRef, canvasSize, currentDrawingName]);

  // Save drawing
  const saveDrawing = useCallback(() => {
    const newDrawing = prepareNewDrawing();
    if (!newDrawing) return;
    apiClient.saveDrawing(newDrawing)
      .then((savedDrawing) => {
        setDrawings(prev => [...prev, savedDrawing]);
        toast.success('Drawing saved!', { theme: 'dark' });
      })
      .catch(error => {
        handleSaveError(error);
      });
  }, [prepareNewDrawing, apiClient]);

  // Update existing drawing
  const updateDrawing = useCallback((drawingId: string) => {
    const existingDrawing = drawings.find(d => d.id === drawingId);
    if (!existingDrawing) return;

    const newDrawing = prepareNewDrawing();
    if (!newDrawing) return;

    newDrawing.id = drawingId;
    apiClient.updateDrawing(drawingId, newDrawing)
      .then(updatedDrawing => {
        setDrawings(prevDrawings => {
          const updatedDrawings = prevDrawings.map(d => d.id === drawingId ? updatedDrawing : d);
          return updatedDrawings;
        });
        toast.success('Drawing updated!', { theme: 'dark' });
      })
      .catch(error => {
        handleSaveError(error);
      });
  }, [drawings, prepareNewDrawing, apiClient]);

  // Load drawings
  const loadDrawing = useCallback((drawingId: string, drawingDataUrl: string) => {
    const drawing = drawings.find(d => d.id === drawingId);
    if (drawing) {
      setCurrentDrawingName(drawing.name);
    } else {
      setCurrentDrawingName('New Drawing');
    }

    clearCanvas();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const img = new Image();
    img.onload = () => {
      context.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
      // Ensure strokeStyle is set based on the uiThemeColors for consistency,
      // as the canvas content itself doesn't inherently have a "theme" after loading.
      // The canvasTheme prop primarily dictates the visual background of the canvas element,
      // while uiThemeColors.stroke provides the drawing color.
      context.strokeStyle = uiThemeColors.stroke;
    };
    img.onerror = () => {
      console.error('Error loading image from data URL');
      toast.error('Error loading drawing. The image data may be corrupted.', { theme: 'dark' });
    };
    img.src = drawingDataUrl;
  }, [canvasRef, canvasSize, clearCanvas, drawings, uiThemeColors.stroke, setCurrentDrawingName]); // Added setCurrentDrawingName

  // Delete drawing
  const deleteDrawing = useCallback(async (drawingId: string) => {
    const confirmed = await showConfirm('Are you sure you want to delete this drawing?', 'dark');
    if (!confirmed) return;

    apiClient.deleteDrawing(drawingId)
      .then(() => {
        setDrawings(prevDrawings =>
          prevDrawings.filter(d => d.id !== drawingId)
        );
        toast.success('Drawing deleted successfully!', { theme: 'dark' });
      })
      .catch(error => {
        console.error('Error deleting drawing from database:', error);
        toast.error('Error deleting drawing. Please try again.', { theme: 'dark' });
      });
  }, [apiClient]);

  // Export to PDF
  const exportToPdf = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    import('jspdf').then(({ default: jsPDF }) => {
      const tempExportCanvas = document.createElement('canvas');
      tempExportCanvas.width = canvasSize.width;
      tempExportCanvas.height = canvasSize.height;
      const tempExportCtx = tempExportCanvas.getContext('2d');
      if (!tempExportCtx) {
        toast.error('Could not prepare canvas for PDF export.', { theme: 'dark' });
        return;
      }

      initializeContext(tempExportCtx, canvasBackgroundColorForStorage, canvas, tempExportCanvas);

      const imgData = tempExportCanvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: tempExportCanvas.width > tempExportCanvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [tempExportCanvas.width, tempExportCanvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, tempExportCanvas.width, tempExportCanvas.height);
      pdf.save(`${currentDrawingName.replace(/\s+/g, '_') || 'drawing'}.pdf`);
      toast.success('PDF exported successfully!', { theme: 'dark' });
    }).catch(error => {
      console.error('Error exporting to PDF:', error);
      toast.error('Error exporting drawing to PDF. Please try again.', { theme: 'dark' });
    });
  }, [canvasBackgroundColorForStorage, canvasRef, canvasSize, currentDrawingName]);

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
