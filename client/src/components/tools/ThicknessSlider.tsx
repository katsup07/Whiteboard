import React from "react";
import { defaultTheme } from "../../utils/themeUtils";

interface Props {
  penThickness: number;
  setPenThickness: (thickness: number) => void;
}

const ThicknessSlider: React.FC<Props> = ({ penThickness, setPenThickness }) => {
  const activeThemeColors = defaultTheme;
  return ( 
    <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, marginRight: '20px', minWidth: '200px' }}>
        <input
          type="range"
          id="penThickness"
          min="1"
          max="50"
          value={penThickness}
          onChange={(e) => setPenThickness(Number(e.target.value))}
          style={{ cursor: 'pointer', width: '100%', maxWidth: '150px' }}
          title={`Pen thickness: ${penThickness}px`}
        />
        <span style={{ marginLeft: '10px', color: activeThemeColors.uiText, minWidth: '25px', fontSize: '0.9em' }}>
          {penThickness}px
        </span>
      </div>
   );
}
 
export default ThicknessSlider;