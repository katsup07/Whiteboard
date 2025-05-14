// Common types used across components

export interface Point {
  x: number;
  y: number;
}

export interface Drawing {
  id?: string; // Optional for new drawings
  name: string;
  dataUrl: string; // Store drawing as data URL
  timestamp: number;
}

// Theme Definitions
export type Theme = 'light' | 'dark'; // This will be simplified to just affect canvas background

export interface ThemeColors {
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
  activeBackground: string; // Background color for active/selected buttons
  focusShadowColor: string; // Shadow color for focused elements
  headerBackground: string; // Added for header background color
  iconFilter?: string;      // Optional filter for icons (e.g., invert for dark mode)
}

// Common props
export interface WithFocusProps {
  focusedButton: string | null;
  setFocusedButton: (id: string | null) => void;
}
