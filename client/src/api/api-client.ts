import { Drawing } from "../types/drawing";

// Singleton class to manage API calls
export class ApiClient {
  private static instance: ApiClient;

  private constructor() {}

  static getInstance(){
    if(!ApiClient.instance)
      ApiClient.instance = new ApiClient();

    return ApiClient.instance;
  }  async getDrawings(): Promise<Drawing[]> {
    const response = await fetch('/drawings');

    if (!response.ok)
      throw new Error('Network response was not ok');
      const data = await response.json();

    console.log('Fetched drawings:', data);
    return data;
  }  async saveDrawing(drawing: Drawing): Promise<void> {
    const response = await fetch('/drawings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(drawing),
    });

    if (!response.ok)      throw new Error('Network response was not ok');
    
    const data = await response.json();
    console.log('Saved drawing:', data);
    return data;
  }
  async deleteDrawing(id: string): Promise<void> {
    const response = await fetch(`/drawings/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok)      throw new Error('Network response was not ok');
    
    const data = await response.json();
    console.log('Deleted drawing:', data);
    return data;
  }  async updateDrawing(id: string, drawing: Drawing): Promise<void> {
    const response = await fetch(`/drawings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(drawing),
    });

    if (!response.ok)      throw new Error('Network response was not ok');
    
    const data = await response.json();
    console.log('Updated drawing:', data);
    return data;
  }

}