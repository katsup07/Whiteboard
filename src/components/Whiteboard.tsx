import React, { useRef, useEffect, useState, useCallback } from 'react';
import jsPDF from 'jspdf';

interface Point {
  x: number;
  y: number;
}

interface Drawing {
  id: string;
  name: string;
  dataUrl: string; // Store drawing as data URL
  timestamp: number;
}

// Simplified Theme Definitions
type Theme = 'light' | 'dark';

interface ThemeColors {
  background: string;       // Canvas background
  stroke: string;           // Drawing stroke color
  uiBackground: string;     // Component background
  uiText: string;           // Text color for UI elements
  buttonBackground: string;
  buttonText: string;
  listBackground: string;
  listItemHover: string;
  borderColor: string;      // Border color for canvas, lists, etc.
  iconFilter?: string;      // Optional filter for icons (e.g., invert for dark mode)
}

const themes: Record<Theme, ThemeColors> = {
  light: {
    background: '#FFFFFF',
    stroke: '#000000',
    uiBackground: '#f4f4f4',
    uiText: '#333333',
    buttonBackground: '#007bff',
    buttonText: '#FFFFFF',
    listBackground: '#FFFFFF',
    listItemHover: '#e9ecef',
    borderColor: '#CCCCCC',
    iconFilter: 'none',
  },
  dark: {
    background: '#1A1A1A',
    stroke: '#FFFFFF',
    uiBackground: '#242424',
    uiText: '#E0E0E0',
    buttonBackground: '#3B3B3B',
    buttonText: '#E0E0E0',
    listBackground: '#2C2C2C',
    listItemHover: '#383838',
    borderColor: '#4A4A4A',
    iconFilter: 'invert(100%) brightness(1.5)',
  },
};

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<Point | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [currentDrawingName, setCurrentDrawingName] = useState<string>('My Sketch');
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');
  const [penThickness, setPenThickness] = useState<number>(2);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 }); // Logical size

  const activeThemeColors = themes[currentTheme];

  // Effect to setup canvas scaling (runs once or if logical dimensions were to change)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const ratio = window.devicePixelRatio || 1;
    const logicalWidth = 800; // Assuming fixed logical size for now
    const logicalHeight = 600;

    canvas.width = logicalWidth * ratio;
    canvas.height = logicalHeight * ratio;

    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;

    // Use setTransform to apply scale. This is idempotent.
    // It replaces the current transform, so it won't compound.
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    setCanvasSize({ width: logicalWidth, height: logicalHeight });
    // Initial clear is handled by the theme/initialization effect below
  }, [canvasRef]); // Dependencies: canvasRef. If logicalWidth/Height were state/props, add them.

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    // Ensure canvasSize is initialized before using its properties
    if (!canvas || !canvasSize.width || !canvasSize.height) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Context is already scaled by setTransform in the scaling effect.
    // fillRect coordinates are in the scaled coordinate system (logical coordinates).
    context.fillStyle = activeThemeColors.background;
    context.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Re-apply stroke style for subsequent drawing operations
    context.strokeStyle = activeThemeColors.stroke;
  }, [activeThemeColors, canvasRef, canvasSize.width, canvasSize.height]); // Added canvasSize dependencies

  useEffect(() => {
    const savedDrawings = localStorage.getItem('whiteboardDrawings');
    if (savedDrawings) {
      setDrawings(JSON.parse(savedDrawings));
    }
    const savedTheme = localStorage.getItem('whiteboardTheme') as Theme | null;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    } else {
      setCurrentTheme('light');
    }
    const savedPenThickness = localStorage.getItem('whiteboardPenThickness');
    if (savedPenThickness) {
      setPenThickness(parseFloat(savedPenThickness));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('whiteboardDrawings', JSON.stringify(drawings));
  }, [drawings]);

  // Save theme to local storage and clear canvas when it changes or on init
  useEffect(() => {
    localStorage.setItem('whiteboardTheme', currentTheme);
    
    const canvas = canvasRef.current;
    // Ensure canvas is ready and canvasSize is initialized before clearing
    if (canvas && canvas.getContext('2d') && canvasSize.width > 0 && canvasSize.height > 0) {
        clearCanvas();
    }
    // Dependencies: currentTheme (so it runs on theme change),
    // clearCanvas (so it uses the updated clear function with new theme colors),
    // and canvasSize (so it runs after canvas is scaled and sized).
  }, [currentTheme, clearCanvas, canvasSize.width, canvasSize.height]);

  useEffect(() => {
    localStorage.setItem('whiteboardPenThickness', penThickness.toString());
  }, [penThickness]);

  const getMousePosition = (event: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;

    setIsDrawing(true);
    const currentPosition = getMousePosition(event);
    setLastPosition(currentPosition);

    context.beginPath();
    context.moveTo(currentPosition.x, currentPosition.y);
    context.fillStyle = activeThemeColors.stroke;
    context.arc(currentPosition.x, currentPosition.y, penThickness / 2, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context || !lastPosition) return;

    const currentPosition = getMousePosition(event);

    context.beginPath();
    context.moveTo(lastPosition.x, lastPosition.y);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.strokeStyle = activeThemeColors.stroke;
    context.lineWidth = penThickness;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
    context.closePath();

    setLastPosition(currentPosition);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPosition(null);
  };

  const saveDrawing = () => {
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
    setDrawings([...drawings, newDrawing]);
    alert('Sketch saved!');
  };

  const loadDrawing = (drawingDataUrl: string) => {
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
  };

  const deleteDrawing = (drawingId: string) => {
    setDrawings(drawings.filter(d => d.id !== drawingId));
  };

  const exportToPdf = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
  };

  const toggleTheme = () => {
    confirm('Switching themes after drawing will discard your current sketch. Are you sure you want to switch themes?') &&
    setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: activeThemeColors.uiBackground,
      color: activeThemeColors.uiText,
      minHeight: '100vh',
      padding: '20px',
      position: 'relative'
    }}>
      <button 
        onClick={toggleTheme}
        title={`Switch to ${currentTheme === 'light' ? 'Dark' : 'Light'} Mode`}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '8px 12px',
          backgroundColor: activeThemeColors.buttonBackground,
          color: activeThemeColors.buttonText,
          border: `1px solid ${activeThemeColors.borderColor}`,
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        {currentTheme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>

      <h2>Whiteboard</h2>
      <input 
        type="text" 
        value={currentDrawingName} 
        onChange={(e) => setCurrentDrawingName(e.target.value)}
        placeholder="Sketch Name"
        style={{
          marginBottom: '10px',
          padding: '8px',
          border: `1px solid ${activeThemeColors.borderColor}`,
          backgroundColor: activeThemeColors.listBackground,
          color: activeThemeColors.uiText,
          width: '300px',
          borderRadius: '4px',
        }}
      />
      <div style={{ margin: '10px 0', display: 'flex', alignItems: 'center', width: '300px' }}>
        <label htmlFor="penThickness" style={{ marginRight: '10px', color: activeThemeColors.uiText }}>Thickness:</label>
        <input 
          type="range" 
          id="penThickness" 
          min="1" 
          max="20" 
          value={penThickness} 
          onChange={(e) => setPenThickness(Number(e.target.value))} 
          style={{ flexGrow: 1, cursor: 'pointer' }}
        />
        <span style={{ marginLeft: '10px', color: activeThemeColors.uiText, minWidth: '20px' }}>{penThickness}</span>
      </div>
      <div style={{ position: 'relative', width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }}>
        <canvas
          ref={canvasRef}
          style={{
            border: `1px solid ${activeThemeColors.borderColor}`,
            cursor: 'url(/pen-icon.svg) 0 24, crosshair',
            backgroundColor: activeThemeColors.background,
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
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={clearCanvas} 
          style={{ 
            marginRight: '10px', 
            backgroundColor: activeThemeColors.buttonBackground, 
            color: activeThemeColors.buttonText, 
            border: 'none', 
            padding: '10px 15px', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Clear
        </button>
        <button 
          onClick={saveDrawing} 
          style={{ 
            marginRight: '10px', 
            backgroundColor: activeThemeColors.buttonBackground, 
            color: activeThemeColors.buttonText, 
            border: 'none', 
            padding: '10px 15px', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Save Sketch
        </button>
        <button 
          onClick={exportToPdf} 
          style={{ 
            backgroundColor: activeThemeColors.buttonBackground, 
            color: activeThemeColors.buttonText, 
            border: 'none', 
            padding: '10px 15px', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Export to PDF
        </button>
      </div>
      <h3 style={{ marginTop: '25px' }}>Saved Sketches</h3>
      {drawings.length === 0 && <p>No sketches saved yet.</p>}
      <ul style={{
        listStyle: 'none',
        padding: '10px',
        maxHeight: '200px',
        overflowY: 'auto',
        border: `1px solid ${activeThemeColors.borderColor}`,
        backgroundColor: activeThemeColors.listBackground,
        width: '800px',
        borderRadius: '4px',
      }}>
        {drawings.sort((a,b) => b.timestamp - a.timestamp).map((drawing) => (
          <li 
            key={drawing.id} 
            style={{
              borderBottom: `1px solid ${activeThemeColors.borderColor}`,
              padding: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              color: activeThemeColors.uiText,
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = activeThemeColors.listItemHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span onClick={() => loadDrawing(drawing.dataUrl)} >
              {drawing.name} - {new Date(drawing.timestamp).toLocaleDateString()} - {new Date(drawing.timestamp).toLocaleTimeString()}
            </span>
            <div>
              <button 
                onClick={() => loadDrawing(drawing.dataUrl)} 
                style={{ 
                  marginRight: '5px', 
                  backgroundColor: activeThemeColors.buttonBackground, 
                  color: activeThemeColors.buttonText, 
                  border: 'none', 
                  padding: '5px 8px', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                Load
              </button>
              <button 
                onClick={() => deleteDrawing(drawing.id)} 
                style={{ 
                  backgroundColor: activeThemeColors.buttonBackground, 
                  color: activeThemeColors.buttonText, 
                  border: 'none', 
                  padding: '5px 8px', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Whiteboard;
