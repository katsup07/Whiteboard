import React from 'react';
import { WithThemeProps, WithFocusProps, Drawing } from '../types';
import { getButtonStyle } from '../utils/themeUtils';

interface SavedSketchesListProps extends WithThemeProps, WithFocusProps {
  drawings: Drawing[];
  loadDrawing: (dataUrl: string) => void;
  deleteDrawing: (id: string) => void;
}

const SavedSketchesList: React.FC<SavedSketchesListProps> = ({
  drawings,
  loadDrawing,
  deleteDrawing,
  theme,
  activeThemeColors,
  focusedButton,
  setFocusedButton
}) => {
  return (
    <>
      <h3 style={{ marginTop: '25px' }}>Saved Sketches</h3>
      {drawings.length === 0 && <p>No sketches saved yet.</p>}
      <ul className="saved-sketches-list" style={{
        listStyle: 'none',
        padding: '10px',
        maxHeight: '200px',
        overflowY: 'auto',
        border: `1px solid ${activeThemeColors.borderColor}`,
        backgroundColor: activeThemeColors.listBackground,
        width: '100%',
        maxWidth: '800px',
        borderRadius: '4px',
      }}>
        {drawings.sort((a, b) => b.timestamp - a.timestamp).map((drawing) => (
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
              onClick={() => loadDrawing(drawing.dataUrl)} 
              style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {drawing.name} - {new Date(drawing.timestamp).toLocaleDateString()} - {new Date(drawing.timestamp).toLocaleTimeString()}
            </span>
            <div className="saved-sketch-buttons">
              <button 
                onClick={() => loadDrawing(drawing.dataUrl)} 
                style={getButtonStyle(`load-${drawing.id}`, focusedButton, theme, activeThemeColors)}
                onFocus={() => setFocusedButton(`load-${drawing.id}`)}
                onBlur={() => setFocusedButton(null)}
                className="action-button"
              >
                Load
              </button>
              <button 
                onClick={() => deleteDrawing(drawing.id)} 
                style={getButtonStyle(`delete-${drawing.id}`, focusedButton, theme, activeThemeColors)}
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
    </>
  );
};

export default SavedSketchesList;
