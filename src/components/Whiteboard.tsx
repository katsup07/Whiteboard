import React, { useRef, useEffect, useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import './Whiteboard.css';

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
  activeBorderColor: string; // Border color for active/focused buttons
  iconFilter?: string;      // Optional filter for icons (e.g., invert for dark mode)
}

const themes: Record<Theme, ThemeColors> = {
  light: {
    background: '#FFFFFF',
    stroke: '#000000',
    uiBackground: '#f4f4f4',
    uiText: '#333333',
    buttonBackground: '#17122db8',
    buttonText: '#FFFFFF',
    listBackground: '#FFFFFF',
    listItemHover: '#e9ecef',
    borderColor: '#CCCCCC',
    activeBorderColor: '#7119d0',
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
    activeBorderColor: '#7119d0', // Nice purple color for active/focused state
    iconFilter: 'invert(100%) brightness(1.5)',
  },
};

interface WhiteboardProps {
  theme: Theme;
  onThemeChange: () => void;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ theme, onThemeChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<Point | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [currentDrawingName, setCurrentDrawingName] = useState<string>('My Sketch');
  const [penThickness, setPenThickness] = useState<number>(2);
  const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth - 40, height: 600 }); // Initialize canvas width to full screen width minus padding
  const [drawingMode, setDrawingMode] = useState<'draw' | 'erase'>('draw'); // New state for draw/erase mode
  const [focusedButton, setFocusedButton] = useState<string | null>(null); // Track which button has focus

  const activeThemeColors = themes[theme];
  
  // Use parent's theme
  useEffect(() => {
    const savedDrawings = localStorage.getItem('whiteboardDrawings');
    if (savedDrawings) {
      setDrawings(JSON.parse(savedDrawings));
    }
    const savedPenThickness = localStorage.getItem('whiteboardPenThickness');
    if (savedPenThickness) {
      setPenThickness(parseFloat(savedPenThickness));
    }
  }, []);

  // Create reusable button styles with focus/active states
  const getButtonStyle = (buttonId: string) => {
    const isFocused = focusedButton === buttonId;
    const baseStyle = {
      marginRight: '10px', 
      backgroundColor: activeThemeColors.buttonBackground, 
      color: activeThemeColors.buttonText, 
      border: `1px solid ${isFocused ? activeThemeColors.activeBorderColor : 'transparent'}`, 
      padding: '10px 15px', 
      borderRadius: '4px', 
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      outline: 'none', // Remove default focus outline
      transition: 'all 0.2s ease-in-out',
    };
    
    // Add the dark theme glow effect using the CSS class
    if (isFocused && theme === 'dark') {
      return {
        ...baseStyle,
        className: 'dark-theme-active',
        boxShadow: `0 0 8px 1px ${activeThemeColors.activeBorderColor}`,
      };
    }
    
    // For light theme focused state, add a subtle border
    if (isFocused && theme === 'light') {
      return {
        ...baseStyle,
        boxShadow: `0 0 5px 1px ${activeThemeColors.activeBorderColor}`,
      };
    }
    
    return baseStyle;
  };

  // Define clearCanvas before the useEffect that uses it as a dependency
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

  // Effect to setup canvas scaling and handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const handleResize = () => {
      // Adjust width based on window, subtracting padding (20px on each side from the main container)
      const newWidth = window.innerWidth - 40;
      // Keep height fixed or make it responsive, e.g., window.innerHeight * 0.6
      const newHeight = 600; 

      const ratio = window.devicePixelRatio || 1;
      canvas.width = newWidth * ratio;
      canvas.height = newHeight * ratio;
      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      setCanvasSize({ width: newWidth, height: newHeight });
      // It's important to clear the canvas after resize to apply new dimensions and background
      // and redraw content if necessary.
      clearCanvas(); 
    };

    handleResize(); // Call on initial mount to set initial size
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef, clearCanvas]); // clearCanvas is a dependency

  useEffect(() => {
    const savedDrawings = localStorage.getItem('whiteboardDrawings');
    if (savedDrawings) {
      setDrawings(JSON.parse(savedDrawings));
    }
    const savedPenThickness = localStorage.getItem('whiteboardPenThickness');
    if (savedPenThickness) {
      setPenThickness(parseFloat(savedPenThickness));
    }
    // We no longer need to set theme here as it's passed as a prop
  }, []);

  useEffect(() => {
    localStorage.setItem('whiteboardDrawings', JSON.stringify(drawings));
  }, [drawings]);
  
  // Save theme to local storage and clear canvas when it changes or on init
  useEffect(() => {
    localStorage.setItem('whiteboardTheme', theme);
    
    const canvas = canvasRef.current;
    // Ensure canvas is ready and canvasSize is initialized before clearing
    if (canvas && canvas.getContext('2d') && canvasSize.width > 0 && canvasSize.height > 0) {
        clearCanvas();
    }
    // Dependencies: theme (so it runs on theme change),
    // clearCanvas (so it uses the updated clear function with new theme colors),
    // and canvasSize (so it runs after canvas is scaled and sized).
  }, [theme, clearCanvas, canvasSize.width, canvasSize.height]);

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
    // Use strokeStyle for drawing and backgroundStyle for erasing for the initial dot
    context.fillStyle = drawingMode === 'draw' ? activeThemeColors.stroke : activeThemeColors.background;
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
    // Use strokeStyle for drawing and backgroundStyle for erasing
    context.strokeStyle = drawingMode === 'draw' ? activeThemeColors.stroke : activeThemeColors.background;
    context.lineWidth = penThickness; // Eraser uses the same thickness for now
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
      }}>      <button 
        onClick={toggleTheme}
        className="theme-toggle-button"
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',          padding: focusedButton === 'themeToggle' ? '6px 10px' : '8px 12px',
          backgroundColor: activeThemeColors.buttonBackground,
          color: activeThemeColors.buttonText,
          border: focusedButton === 'themeToggle' 
                 ? `1px solid ${activeThemeColors.activeBorderColor}` 
                 : `1px solid ${activeThemeColors.borderColor}`,
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 1000,
          outline: 'none',
          boxShadow: focusedButton === 'themeToggle' 
                     ? `0 0 8px 1px rgba(157, 93, 224, 0.5)` 
                     : 'none',
          transition: 'all 0.2s ease-in-out'
        }}
        onFocus={() => setFocusedButton('themeToggle')}
        onBlur={() => setFocusedButton(null)}
      >
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>

      <div className="whiteboard-header">
        <h2>Whiteboard</h2>
        <img src="public/whiteboard-2.png" alt="Marker" style={{ width: '100px', height: '50px', marginBottom: '20px' }} />
      </div>
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
      {/* Toolbar for Thickness, Tool Selection (Pen/Eraser) */}
      <div style={{
        margin: '10px 0',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // Distributes space between items
        width: '450px', // Adjust as needed
        border: `1px solid ${activeThemeColors.borderColor}`,
        borderRadius: '4px',
        backgroundColor: activeThemeColors.uiBackground,
      }}>
        {/* Thickness Slider */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="penThickness" style={{ marginRight: '10px', color: activeThemeColors.uiText }}>Thickness:</label>
          <input
            type="range"
            id="penThickness"
            min="1"
            max="50" // Increased max thickness for eraser
            value={penThickness}
            onChange={(e) => setPenThickness(Number(e.target.value))}
            style={{ cursor: 'pointer', width: '120px' }}
          />
          <span style={{ marginLeft: '10px', color: activeThemeColors.uiText, minWidth: '20px' }}>{penThickness}</span>
        </div>

        {/* Tool Controls (Pen/Eraser) - Removed Save button */}
        <div style={{ display: 'flex', alignItems: 'center' }}>          <button
            onClick={() => setDrawingMode('draw')}
            title={'Switch to Pen'}
            onFocus={() => setFocusedButton('penTool')}
            onBlur={() => setFocusedButton(null)}
            className="tool-button"
            style={{
              background: drawingMode === 'draw' ? `${activeThemeColors.listItemHover}` : 'transparent',
              border: (drawingMode === 'draw' || focusedButton === 'penTool') ? 
                     `1px solid ${activeThemeColors.activeBorderColor}` : 
                     'none',
              borderRadius: '4px',
              cursor: 'pointer',
              padding: '5px',
              marginRight: '10px',
              display: 'flex',
              alignItems: 'center',
              outline: 'none',
              boxShadow: (drawingMode === 'draw' || focusedButton === 'penTool') ?
                         `0 0 8px 1px rgba(157, 93, 224, 0.3)` :
                         'none',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <img
              src={'/pen-icon.svg'}
              alt={'Pen Tool'}
              style={{ 
                width: '24px', 
                height: '24px', 
                filter: activeThemeColors.iconFilter,
                opacity: drawingMode === 'draw' ? 1 : 0.6
              }}
            />
          </button>          <button
            onClick={() => setDrawingMode('erase')}
            title={'Switch to Eraser'}
            onFocus={() => setFocusedButton('eraserTool')}
            onBlur={() => setFocusedButton(null)}
            className="tool-button"
            style={{
              background: drawingMode === 'erase' ? `${activeThemeColors.listItemHover}` : 'transparent',
              border: (drawingMode === 'erase' || focusedButton === 'eraserTool') 
                ? `1px solid ${activeThemeColors.activeBorderColor}` 
                : 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              outline: 'none',
              boxShadow: (drawingMode === 'erase' || focusedButton === 'eraserTool')
                ? `0 0 8px 1px rgba(157, 93, 224, 0.3)`
                : 'none',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <img
              src={'/eraser-icon.svg'}
              alt={'Eraser Tool'}
              style={{ 
                width: '24px', 
                height: '24px', 
                filter: activeThemeColors.iconFilter,
                opacity: drawingMode === 'erase' ? 1 : 0.6
              }}
            />
          </button>
        </div>
      </div>

      {/* Container for the canvas, this will take full width */}
      <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <canvas
          ref={canvasRef}
          style={{
            border: `1px solid ${activeThemeColors.borderColor}`,
            cursor: drawingMode === 'draw' ? `url(/pen-icon.svg) 0 24, auto` : `url(/eraser-icon.svg) 0 24, auto`, // Removed crosshairs
            backgroundColor: activeThemeColors.background,
            borderRadius: '4px',
            width: `${canvasSize.width}px`, // Controlled by state
            height: `${canvasSize.height}px`, // Controlled by state
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
      
      <div style={{ marginTop: '20px', display: 'flex' }}>
        <button 
          onClick={clearCanvas} 
          style={getButtonStyle('clearCanvas')}
          onFocus={() => setFocusedButton('clearCanvas')}
          onBlur={() => setFocusedButton(null)}
          className="action-button"
        >
          <img 
            src="/clear-icon.svg" 
            alt="Clear" 
            style={{ 
              width: '16px', 
              height: '16px', 
              filter: activeThemeColors.iconFilter === 'none' ? 'brightness(5)' : activeThemeColors.iconFilter 
            }} 
          />
          Clear
        </button>
        <button 
          onClick={saveDrawing} 
          style={getButtonStyle('saveDrawing')}
          onFocus={() => setFocusedButton('saveDrawing')}
          onBlur={() => setFocusedButton(null)}
          className="action-button"
        >
          <img 
            src="/save-icon.svg" 
            alt="Save" 
            style={{ 
              width: '16px', 
              height: '16px', 
              filter: activeThemeColors.iconFilter === 'none' ? 'brightness(5)' : activeThemeColors.iconFilter 
            }} 
          />
          Save Sketch
        </button>
        <button 
          onClick={exportToPdf} 
          style={getButtonStyle('exportToPdf')}
          onFocus={() => setFocusedButton('exportToPdf')}
          onBlur={() => setFocusedButton(null)}
          className="action-button"
        >
          <img 
            src="/pdf-icon.svg" 
            alt="PDF" 
            style={{ 
              width: '16px', 
              height: '16px', 
              filter: activeThemeColors.iconFilter === 'none' ? 'brightness(5)' : activeThemeColors.iconFilter 
            }} 
          />
          Export to PDF
        </button>
      </div>
      
      <h3 style={{ marginTop: '25px' }}>Saved Sketches</h3>
      {drawings.length === 0 && <p>No sketches saved yet.</p>}      <ul className="saved-sketches-list" style={{
        listStyle: 'none',
        padding: '10px',
        maxHeight: '200px',
        overflowY: 'auto',
        border: `1px solid ${activeThemeColors.borderColor}`,
        backgroundColor: activeThemeColors.listBackground,
        width: '100%', // List takes full width of its centered parent block
        maxWidth: '800px', // But capped at 800px
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
              flexWrap: 'nowrap'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = activeThemeColors.listItemHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span onClick={() => loadDrawing(drawing.dataUrl)} style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {drawing.name} - {new Date(drawing.timestamp).toLocaleDateString()} - {new Date(drawing.timestamp).toLocaleTimeString()}
            </span>            <div className="saved-sketch-buttons" style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: '10px', 
              width: 'auto',
              minWidth: '150px',
              whiteSpace: 'nowrap',
              flexWrap: 'nowrap'
            }}>
              <button 
                onClick={() => loadDrawing(drawing.dataUrl)} 
                style={getButtonStyle(`load-${drawing.id}`)}
                onFocus={() => setFocusedButton(`load-${drawing.id}`)}
                onBlur={() => setFocusedButton(null)}
                className="action-button"
              >
                Load
              </button>
              <button 
                onClick={() => deleteDrawing(drawing.id)} 
                style={getButtonStyle(`delete-${drawing.id}`)}
                onFocus={() => setFocusedButton(`delete-${drawing.id}`)}
                onBlur={() => setFocusedButton(null)}
                className="action-button"
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
