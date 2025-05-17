import { defaultTheme } from "../../utils/themeUtils";

interface Props {
  currentDrawingName: string;
  setCurrentDrawingName: (name: string) => void;
  focusedButton: string | null;
  setFocusedButton: (id: string | null) => void;
}

const DrawingNameInput: React.FC<Props> = ({
  currentDrawingName,
  setCurrentDrawingName,
  focusedButton,
  setFocusedButton
}) => {
  const activeThemeColors = defaultTheme; 
  return ( 
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
        <input
          type="text"
          value={currentDrawingName}
          onChange={(e) => setCurrentDrawingName(e.target.value)}
          placeholder="Drawing Name"
          className="drawing-name-input"
          onFocus={() => setFocusedButton('drawingNameInput')}
          onBlur={() => setFocusedButton(null)}
          style={{
            backgroundColor: activeThemeColors.listBackground,
            color: activeThemeColors.uiText,
            borderColor: focusedButton === 'drawingNameInput' ? activeThemeColors.activeBorderColor : activeThemeColors.borderColor,
            boxShadow: focusedButton === 'drawingNameInput' ? `0 0 8px 1px ${activeThemeColors.focusShadowColor}` : 'none',
            padding: '6px 10px',
            borderRadius: '4px',
            border: `1px solid ${activeThemeColors.containerBorderColor}`,
            width: '150px'
          }}
        />
      </div>
 );
}
 
export default DrawingNameInput;