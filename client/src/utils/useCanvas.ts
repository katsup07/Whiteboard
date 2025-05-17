import { useRef, useState, useEffect, useCallback } from 'react';
import { Point, Theme } from '../types'; // Removed Theme type import
import { defaultTheme } from './themeUtils'; // Import defaultTheme

/**
 * Custom hook for canvas management and drawing operations
 * @param canvasTheme Current theme for the canvas (light or dark)
 */
export const useCanvas = (canvasTheme: Theme) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<Point | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth - 40, height: 600 });
  const [drawingMode, setDrawingMode] = useState<'draw' | 'erase'>('draw');
  const [penThickness, setPenThickness] = useState<number>(2);
  
  // Determine canvas background and stroke colors based on canvasTheme
  const canvasBackgroundColor = canvasTheme === 'light' ? '#FFFFFF' : defaultTheme.background;
  const [strokeColor, setStrokeColor] = useState<string>(
    canvasTheme === 'light' ? '#000000' : defaultTheme.stroke
  );

  // Load initial pen thickness from localStorage
  useEffect(() => {
    const savedPenThickness = localStorage.getItem('whiteboardPenThickness');
    if (savedPenThickness) {
      setPenThickness(parseFloat(savedPenThickness));
    }
  }, []);

  // Save pen thickness to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('whiteboardPenThickness', penThickness.toString());
  }, [penThickness]);
  // Clear canvas function
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvasSize.width || !canvasSize.height) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = canvasBackgroundColor;
    context.fillRect(0, 0, canvasSize.width, canvasSize.height);
    // Don't set strokeStyle here - we'll set it when needed in drawing operations
  }, [canvasBackgroundColor, canvasSize.width, canvasSize.height]);

  // Setup canvas and handle window resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    const handleResize = () => {
      const newWidth = window.innerWidth - 40;
      const newHeight = 600;

      const ratio = window.devicePixelRatio || 1;
      canvas.width = newWidth * ratio;
      canvas.height = newHeight * ratio;
      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      setCanvasSize({ width: newWidth, height: newHeight });
      clearCanvas();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [clearCanvas]);
  // Clear canvas and update when theme changes
  useEffect(() => {
    localStorage.setItem('whiteboardCanvasTheme', canvasTheme); // Save canvasTheme
    
    const canvas = canvasRef.current;
    if (canvas && canvas.getContext('2d') && canvasSize.width > 0 && canvasSize.height > 0)
      clearCanvas();

  }, [canvasTheme, clearCanvas, canvasSize.width, canvasSize.height]);

  // Handle color changes when theme changes to prevent invisible strokes
  useEffect(() => {
    // Change stroke color to black when switching to light theme if using white
    if(canvasTheme === 'light' && strokeColor === '#FFFFFF')
      setStrokeColor('#000000')
  }, [canvasTheme, strokeColor]);

  // Utility function to get mouse position relative to canvas
  const getMousePosition = useCallback((event: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }, []);

  // Start drawing function
  const startDrawing = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;

    const pos = getMousePosition(event);
    setIsDrawing(true);
    setLastPosition(pos);

    // Setup context for drawing or erasing
    context.beginPath();
    context.lineWidth = penThickness;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    if (drawingMode === 'draw') {
      context.strokeStyle = strokeColor;
      context.globalCompositeOperation = 'source-over'; // Default drawing mode
    } else if (drawingMode === 'erase') {
      context.strokeStyle = canvasBackgroundColor; // Eraser uses background color
      context.globalCompositeOperation = 'destination-out'; // Erasing mode
    }
    context.moveTo(pos.x, pos.y);
  }, [getMousePosition, penThickness, drawingMode, strokeColor, canvasBackgroundColor]);

  // Draw function
  const draw = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPosition) return;

    const context = canvasRef.current?.getContext('2d');
    if (!context) return;

    const currentPosition = getMousePosition(event);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    setLastPosition(currentPosition);
  }, [isDrawing, lastPosition, getMousePosition]);

  // Stop drawing function
  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastPosition(null);
  }, []);

  return {
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
  };
};
