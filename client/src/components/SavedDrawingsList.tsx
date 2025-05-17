import React from 'react';
import { WithFocusProps, Drawing } from '../types'; 
import { defaultTheme } from '../utils/themeUtils'; 

interface SavedDrawingsListProps extends WithFocusProps { 
  drawings: Drawing[];
  loadDrawing: (id: string, dataUrl: string) => void;
  deleteDrawing: (id: string) => void;
  updateDrawing: (id: string) => void;
}

const SavedDrawingsList: React.FC<SavedDrawingsListProps> = ({
  drawings,
  loadDrawing,
  updateDrawing,
  deleteDrawing,
  focusedButton,
  setFocusedButton
}) => {
  const activeThemeColors = defaultTheme;

  const getButtonStyle = (buttonId: string) => ({
    marginRight: '10px', 
    backgroundColor: activeThemeColors.buttonBackground, 
    color: activeThemeColors.buttonText, 
    border: `1px solid ${focusedButton === buttonId ? activeThemeColors.activeBorderColor : 'transparent'}`, 
    padding: '10px 15px', 
    borderRadius: '4px', 
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    boxShadow: focusedButton === buttonId ? `0 0 8px 1px ${activeThemeColors.activeBorderColor}` : 'none',
  });

  return (
    <>
      <h3 style={{ marginTop: '25px', marginBottom: "0px", color: activeThemeColors.uiText }}>Saved Drawings</h3>
      {drawings.length === 0 && <p style={{ color: activeThemeColors.uiText }}>No drawings saved yet.</p>}
      <ul className="saved-drawings-list" style={{
        listStyle: 'none',
        padding: '10px',
        maxHeight: '200px',
        overflowY: 'auto',
        border: `1px solid ${activeThemeColors.containerBorderColor}`,
        backgroundColor: activeThemeColors.listBackground,
        width: '100%',
        maxWidth: '800px',
        borderRadius: '4px',
        borderColor: "1px solid #646cff !important"
      }}>
        {drawings.filter(drawing => !!drawing.id).sort((a, b) => b.timestamp - a.timestamp).map((drawing) => { 
          return (
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
            <span 
              onClick={() => loadDrawing(drawing.id!, drawing.dataUrl)} 
              style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {drawing.name} - {new Date(drawing.timestamp).toLocaleDateString()} - {new Date(drawing.timestamp).toLocaleTimeString()}
            </span>
            <div className="saved-drawing-buttons">
              <button 
                onClick={() => updateDrawing(drawing.id!)} 
                style={getButtonStyle(`load-${drawing.id}`)}
                onFocus={() => setFocusedButton(`load-${drawing.id}`)}
                onBlur={() => setFocusedButton(null)}
                className="action-button"
              >
                Update
              </button>
              <button 
                onClick={() => deleteDrawing(drawing.id!)} 
                style={getButtonStyle(`delete-${drawing.id}`)}
                onFocus={() => setFocusedButton(`delete-${drawing.id}`)}
                onBlur={() => setFocusedButton(null)}
                className="action-button"
              >
                Delete
              </button>
            </div>
          </li>
        )})}
      </ul>
    </>
  );
};

export default SavedDrawingsList;
