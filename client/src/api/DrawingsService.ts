import { Drawing } from "../types";
import { fetchWithRetry } from "./apiUtils";
import { BASE_API_URL } from "./urls";

export class DrawingsService {
  private drawingsEndpoint = `${BASE_API_URL}/drawings`;
  
  async getDrawings(): Promise<Drawing[]> {
      const response = await fetchWithRetry(this.drawingsEndpoint);

      if (!response.ok) 
        throw new Error('Network response was not ok');

      const data = await response.json();
    
      return data ?? [];
    }
    
  async saveDrawing(drawing: Drawing): Promise<Drawing> {
      const response = await fetchWithRetry(this.drawingsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(drawing),
      });
  
      if (!response.ok) {
        if (response.status === 413)
          throw new Error('request entity too large');
        
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      
      const data = await response.json();
    
      return data;
    }
  
    async updateDrawing(id: string, drawing: Drawing): Promise<Drawing> {
      const response = await fetchWithRetry(`${this.drawingsEndpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(drawing),
      });
  
      if (!response.ok) {
        if (response.status === 413)
          throw new Error('request entity too large');
    
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      
      const data = await response.json();
     
      return data;
    }

    async deleteDrawing(id: string): Promise<Drawing> {
      const response = await fetchWithRetry(`${this.drawingsEndpoint}/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) 
        throw new Error('Network response was not ok');
      
      const data = await response.json();
    
      return data;
    }
}