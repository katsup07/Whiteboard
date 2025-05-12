import { Drawing } from "../types";

export class DrawingsService {
  private drawingsEndpoint = "/drawings";

  async getDrawings(): Promise<Drawing[]> {
      const response = await fetch(this.drawingsEndpoint);

      if (!response.ok) 
        throw new Error('Network response was not ok');

      const data = await response.json();
      console.log('Fetched drawings:', data);

      return data ?? [];
    }

    async saveDrawing(drawing: Drawing): Promise<Drawing> {
      const response = await fetch(this.drawingsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(drawing),
      });
  
      if (!response.ok) 
        throw new Error('Network response was not ok');
      
      const data = await response.json();
      console.log('Saved drawing:', data);
      return data;
    }
  
    async updateDrawing(id: string, drawing: Drawing): Promise<Drawing> {
      const response = await fetch(`${this.drawingsEndpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(drawing),
      });
  
      if (!response.ok) 
        throw new Error('Network response was not ok');
      
      const data = await response.json();
      console.log('Updated drawing:', data);
      return data;
    }

    async deleteDrawing(id: string): Promise<Drawing[]> {
      const response = await fetch(`${this.drawingsEndpoint}/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) 
        throw new Error('Network response was not ok');
      
      const data = await response.json();
      console.log('Deleted drawing:', data);
      return data;
    }
}