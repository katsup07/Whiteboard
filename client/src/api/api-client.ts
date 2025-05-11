import { Sketch } from "../types/sketches";

// Singleton class to manage API calls
export class ApiClient {
  private static instance: ApiClient;

  private constructor() {}

  static getInstance(){
    if(!ApiClient.instance)
      ApiClient.instance = new ApiClient();

    return ApiClient.instance;
  }
  async getSketches(): Promise<Sketch[]> {
    const response = await fetch('/sketches');

    if (!response.ok)
      throw new Error('Network response was not ok');
    
    const data = await response.json();

    console.log('Fetched sketches:', data);
    return data;
  }

  async saveSketch(drawing: Sketch): Promise<void> {
    const response = await fetch('/sketches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(drawing),
    });

    if (!response.ok)
      throw new Error('Network response was not ok');
    
    const data = await response.json();
    console.log('Saved sketch:', data);
    return data;
  }

}