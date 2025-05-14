import { ThemeColors } from './types';

// Muted Purple: #A082B3 (Desaturated, sophisticated purple)
// Light Theme Accent (Active Purple): #9D5DE0
// Dark Theme Accent (Active Purple): #BB86FC

export const lightThemeColors: ThemeColors = {
  background: '#FFFFFF',
  stroke: '#000000',
  uiBackground: '#F0F0F0',
  uiText: '#333333',
  buttonBackground: '#E0E0E0',
  buttonText: '#333333',
  listBackground: '#FFFFFF',
  listItemHover: '#E8E8E8',
  borderColor: '#CCCCCC',
  activeBorderColor: '#9D5DE0',
  activeBackground: '#E8DCF9',
  focusShadowColor: 'rgba(157, 93, 224, 0.5)',
  headerBackground: '#A082B3', // Muted purple for header
  iconFilter: 'none',
};

export const darkThemeColors: ThemeColors = {
  background: '#2C2C2C',
  stroke: '#FFFFFF',
  uiBackground: '#383838',
  uiText: '#F0F0F0',
  buttonBackground: '#4A4A4A',
  buttonText: '#F0F0F0',
  listBackground: '#333333',
  listItemHover: '#404040',
  borderColor: '#555555',
  activeBorderColor: '#BB86FC',
  activeBackground: '#4A3F5E',
  focusShadowColor: 'rgba(187, 134, 252, 0.6)',
  headerBackground: '#A082B3', // Muted purple for header (can be same or adjusted for dark theme)
  iconFilter: 'invert(1) hue-rotate(180deg)', // Basic filter for dark mode icons
};

export const themes = {
  light: lightThemeColors,
  dark: darkThemeColors,
};
