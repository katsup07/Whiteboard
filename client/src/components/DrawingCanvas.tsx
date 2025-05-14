import React from 'react';
import { defaultTheme } from '../utils/themeUtils';

interface DrawingCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvasSize: { width: number; height: number };
  drawingMode: 'draw' | 'erase';
  startDrawing: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  draw: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  stopDrawing: () => void;
  canvasTheme: 'light' | 'dark';
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  canvasRef,
  canvasSize,
  drawingMode,
  startDrawing,
  draw,
  stopDrawing,
  canvasTheme
}) => {
  const canvasBackgroundColor = canvasTheme === 'light' ? '#FFFFFF' : defaultTheme.background;

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
      <canvas
        ref={canvasRef}
        style={{
          border: `1px solid #646cff`,
          cursor: drawingMode === 'draw' ? `url(/icons/pen-icon.svg) 0 24, auto` : `url(/icons/eraser-icon.svg) 0 24, auto`,
          backgroundColor: canvasBackgroundColor,
          borderRadius: '4px',
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};

export default DrawingCanvas;
