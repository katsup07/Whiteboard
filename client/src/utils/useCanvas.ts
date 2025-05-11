import { useRef, useState, useEffect, useCallback } from 'react';
import { Point, Theme } from '../types';
import { themes } from './themeUtils';

/**
 * Custom hook for canvas management and drawing operations
 * @param theme Current theme (light or dark)
 */
export const useCanvas = (theme: Theme) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<Point | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth - 40, height: 600 });
  const [drawingMode, setDrawingMode] = useState<'draw' | 'erase'>('draw');
  const [penThickness, setPenThickness] = useState<number>(2);
  
  const activeThemeColors = themes[theme];

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

    context.fillStyle = activeThemeColors.background;
    context.fillRect(0, 0, canvasSize.width, canvasSize.height);
    context.strokeStyle = activeThemeColors.stroke;
  }, [activeThemeColors, canvasSize.width, canvasSize.height]);

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
    localStorage.setItem('whiteboardTheme', theme);
    
    const canvas = canvasRef.current;
    if (canvas && canvas.getContext('2d') && canvasSize.width > 0 && canvasSize.height > 0) {
      clearCanvas();
    }
  }, [theme, clearCanvas, canvasSize.width, canvasSize.height]);

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

    setIsDrawing(true);
    const currentPosition = getMousePosition(event);
    setLastPosition(currentPosition);

    context.beginPath();
    context.moveTo(currentPosition.x, currentPosition.y);
    context.fillStyle = drawingMode === 'draw' ? activeThemeColors.stroke : activeThemeColors.background;
    context.arc(currentPosition.x, currentPosition.y, penThickness / 2, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  }, [activeThemeColors, drawingMode, getMousePosition, penThickness]);

  // Draw function
  const draw = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context || !lastPosition) return;

    const currentPosition = getMousePosition(event);

    context.beginPath();
    context.moveTo(lastPosition.x, lastPosition.y);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.strokeStyle = drawingMode === 'draw' ? activeThemeColors.stroke : activeThemeColors.background;
    context.lineWidth = penThickness;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
    context.closePath();

    setLastPosition(currentPosition);
  }, [activeThemeColors, drawingMode, getMousePosition, isDrawing, lastPosition, penThickness]);

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
    drawingMode,
    setDrawingMode,
    clearCanvas,
    startDrawing,
    draw,
    stopDrawing
  };
};
