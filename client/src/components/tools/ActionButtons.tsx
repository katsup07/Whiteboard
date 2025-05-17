import { defaultTheme } from "../../utils/themeUtils";

interface Props {
  setFocusedButton: (id: string | null) => void;
  getButtonStyle: (buttonId: string) => React.CSSProperties;
  clearCanvas: () => void;
  focusedButton: string | null;
  saveDrawing: () => void;
  exportToPdf: () => void;
}

const ActionButtons: React.FC<Props> = ({ setFocusedButton, clearCanvas, getButtonStyle, saveDrawing, exportToPdf }) => {
  const activeThemeColors = defaultTheme;

  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={clearCanvas}
          style={getButtonStyle('clearCanvas')}
          onFocus={() => setFocusedButton('clearCanvas')}
          onBlur={() => setFocusedButton(null)}
          className="action-button"
          title="Clear Canvas"
        >
          <img
            src="/icons/clear-all-icon.svg"
            alt="Clear"
            style={{
              width: '20px',
              height: '20px',
              filter: activeThemeColors.iconFilter
            }}
          />
        </button>
        <button
          onClick={saveDrawing}
          style={getButtonStyle('saveDrawing')}
          onFocus={() => setFocusedButton('saveDrawing')}
          onBlur={() => setFocusedButton(null)}
          className="action-button"
          title="Save Drawing"
        >
          <img
            src="/icons/save-icon.svg"
            alt="Save"
            style={{
              width: '20px',
              height: '20px',
              filter: activeThemeColors.iconFilter
            }}
          />
        </button>
        <button
          onClick={exportToPdf}
          style={getButtonStyle('exportToPdf')}
          onFocus={() => setFocusedButton('exportToPdf')}
          onBlur={() => setFocusedButton(null)}
          className="action-button"
          title="Export to PDF"
        >
          <img
            src="/icons/export-pdf-icon.svg"
            alt="Export PDF"
            style={{
              width: '20px',
              height: '20px',
              filter: activeThemeColors.iconFilter
            }}
          />
        </button>
      </div>
   );
}
 
export default ActionButtons;