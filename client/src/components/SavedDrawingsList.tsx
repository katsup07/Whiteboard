import React from 'react';
import { WithThemeProps, WithFocusProps, Drawing } from '../types';
import { getButtonStyle } from '../utils/themeUtils';

interface SavedDrawingsListProps extends WithThemeProps, WithFocusProps {
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
  theme,
  activeThemeColors,
  focusedButton,
  setFocusedButton
}) => {
  return (
    <>
      <h3 style={{ marginTop: '25px' }}>Saved Drawings</h3>
      {drawings.length === 0 && <p>No drawings saved yet.</p>}
      <ul className="saved-drawings-list" style={{
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
              onClick={() => loadDrawing(drawing.id!, drawing.dataUrl)} // The filter above ensures drawing.id exits
              style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {drawing.name} - {new Date(drawing.timestamp).toLocaleDateString()} - {new Date(drawing.timestamp).toLocaleTimeString()}
            </span>
            <div className="saved-drawing-buttons">
              <button 
                onClick={() => updateDrawing(drawing.id!)} // The filter above ensures drawing.id exits
                style={getButtonStyle(`load-${drawing.id}`, focusedButton, theme, activeThemeColors)}
                onFocus={() => setFocusedButton(`load-${drawing.id}`)}
                onBlur={() => setFocusedButton(null)}
                className="action-button"
              >
                Update
              </button>
              <button 
                onClick={() => deleteDrawing(drawing.id!)} // The filter above ensures drawing.id exits
                style={getButtonStyle(`delete-${drawing.id}`, focusedButton, theme, activeThemeColors)}
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
