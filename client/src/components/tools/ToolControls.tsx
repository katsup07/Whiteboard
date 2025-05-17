import { defaultTheme } from "../../utils/themeUtils";

interface Props {
  setDrawingMode: (mode: 'draw' | 'erase') => void;
  drawingMode: 'draw' | 'erase';
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  getButtonStyle: (buttonId: string) => React.CSSProperties;

  setFocusedButton: (id: string | null) => void;
}

const ToolControls: React.FC<Props> = ({
  setDrawingMode,
  drawingMode,
  strokeColor,
  setStrokeColor,
  getButtonStyle,
  setFocusedButton
}) => {
  const activeThemeColors = defaultTheme; 
  return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => setDrawingMode('draw')}
          title='Switch to Pen'
          onFocus={() => setFocusedButton('penTool')}
          onBlur={() => setFocusedButton(null)}
          className="action-button"          style={{
            ...getButtonStyle('penTool'),
            ...(drawingMode === 'draw' ? {
              background: activeThemeColors.activeBackground,
              border: `2px solid ${activeThemeColors.activeBorderColor}`,
              boxShadow: `0 0 8px 2px ${activeThemeColors.focusShadowColor}`
            } : {})
          }}
        >
          <img
            src="/icons/pen-icon.svg"
            alt="Pen Tool"
            style={{
              width: '20px',
              height: '20px',
              filter: activeThemeColors.iconFilter,
              opacity: drawingMode === 'draw' ? 1 : 0.7
            }}
          />
        </button>
        <button
          onClick={() => setDrawingMode('erase')}
          title='Switch to Eraser'
          onFocus={() => setFocusedButton('eraserTool')}
          onBlur={() => setFocusedButton(null)}
          className="action-button"          style={{
            ...getButtonStyle('eraserTool'),
            ...(drawingMode === 'erase' ? {
              background: activeThemeColors.activeBackground,
              border: `2px solid ${activeThemeColors.activeBorderColor}`,
              boxShadow: `0 0 8px 2px ${activeThemeColors.focusShadowColor}`
            } : {})
          }}
        >
          <img
            src="/icons/eraser-icon.svg"
            alt="Eraser Tool"
            style={{
              width: '20px',
              height: '20px',
              filter: activeThemeColors.iconFilter,
              opacity: drawingMode === 'erase' ? 1 : 0.7
            }}
          />
        </button>
        <div
          style={getButtonStyle('colorPicker')}
          className="action-button"
          title="Choose pen color"
        >
          <input
            type="color"            
            value={strokeColor}
            onChange={e => setStrokeColor(e.target.value)}
            title="Choose pen color"
            className="color-picker"
            onFocus={() => setFocusedButton('colorPicker')}
            onBlur={() => setFocusedButton(null)}
          />
        </div>
      </div>
    );
}
 
export default ToolControls;