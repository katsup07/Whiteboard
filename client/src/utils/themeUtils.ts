import { Theme, ThemeColors } from "../types";

// Theme colors definitions
export const themes: Record<Theme, ThemeColors> = {
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
    activeBorderColor: '#7119d0', // Purple color for active/focused state
    iconFilter: 'invert(100%) brightness(1.5)',
  },
};

// Reusable button styles with focus/active states
export const getButtonStyle = (
  buttonId: string, 
  focusedButton: string | null, 
  theme: Theme, 
  activeThemeColors: ThemeColors
) => {
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
