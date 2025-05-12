import { Drawing } from "types/drawing";

export class DrawingsService {
  
  async getDrawings() {
    console.log('Fetching drawings...');
    return dataUrls;
  }

  async saveDrawing(drawingData: Drawing) {
    console.log('Saving drawing...', drawingData);
    dataUrls.push(drawingData);
    return drawingData;
  }

  async updateDrawing(drawingId: string, drawingData: Drawing) {
    console.log('Updating drawing...', drawingId, drawingData);
    const index = dataUrls.findIndex((drawing) => drawing.id === drawingId);
    if (index === -1) return;
      
    dataUrls[index] = drawingData;
    return dataUrls[index];
  }

  async deleteDrawing(drawingId: string) {
    console.log('Deleting drawing...', drawingId);
    const index = dataUrls.findIndex((drawing) => drawing.id === drawingId);
    if (index !== -1) 
      dataUrls.splice(index, 1);

    return dataUrls;
  }
}
// TODO: 1) Implement real database interactions in repository layer. 
// TODO: 2) Convert data to binary data on client side and store it in the database in order to save space.
// Temporary Database
const dataUrls = [];
