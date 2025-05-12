import { ThemeColors } from "../types";
import { toast } from 'react-toastify';

export const handleSaveError = (error: {message: string}) => {
  console.error('Error saving drawing to database:', error);
  // Check if the error is due to payload size
  if (error.message && error.message.includes('request entity too large')) {
    toast.error('Drawing is too large to save. Try reducing the complexity of your drawing or export to PDF instead.');
    return;
  }
  
  toast.error('Error saving drawing. Please try again.');
}
// Calculate drawing complexity to determine quality settings
// A simple estimation based on canvas size
// Use lower quality for larger drawings
// Start with higher quality and reduce as canvas gets larger
export const decideQuality = (canvasSize: { width: number, height: number}) => {
  const canvasArea = canvasSize.width * canvasSize.height;
  let quality = 0.9;
  if (canvasArea > 500000) quality = 0.8; // Medium size
  if (canvasArea > 800000) quality = 0.7; // Large size
  if (canvasArea > 1200000) quality = 0.6; // Very large size
  if (canvasArea > 2000000) quality = 0.5; // Extremely large size

  return quality;
}

export const initializeContext = (tempCtx: CanvasRenderingContext2D, activeThemeColors: ThemeColors, canvas: HTMLCanvasElement, tempCanvas: HTMLCanvasElement) => {
  tempCtx.fillStyle = activeThemeColors.background;
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, tempCanvas.width, tempCanvas.height);
}