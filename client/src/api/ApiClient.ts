import { Drawing } from "../types/drawing";
import { DrawingsService } from "./DrawingsService";

// Singleton class to manage API calls
// Serves as a Facade to other API services
export class ApiClient {
  private static instance: ApiClient;
  private drawingsService: DrawingsService;

  private constructor() {
    this.drawingsService = new DrawingsService();
  }

  static getInstance(){
    if(!ApiClient.instance)
      ApiClient.instance = new ApiClient();

    return ApiClient.instance;
  }  
  
  async getDrawings(): Promise<Drawing[]> {
    return await this.drawingsService.getDrawings();
  }

  async saveDrawing(drawing: Drawing): Promise<Drawing> {
   return this.drawingsService.saveDrawing(drawing);
  }

  async updateDrawing(id: string, drawing: Drawing): Promise<Drawing> {
    return this.drawingsService.updateDrawing(id, drawing);
  }

  async deleteDrawing(id: string): Promise<Drawing> {
    return this.drawingsService.deleteDrawing(id);
  }
}