import { Sketch } from "types/sketches";

export class SketchesService {
  
  async getSketches() {
    console.log('Fetching sketches...');
    return dataUrls;
  }

  async saveSketch(sketchData: Sketch) {
    console.log('Saving sketch...', sketchData);
    dataUrls.push(sketchData);
    return sketchData;
  }

  async updateSketch(sketchId: string, sketchData: Sketch) {
    console.log('Updating sketch...', sketchId, sketchData);
    const index = dataUrls.findIndex((sketch) => sketch.id === sketchId);
    if (index === -1) return;
      
    dataUrls[index] = sketchData;
    return dataUrls[index];
  }

  async deleteSketch(sketchId: string) {
    console.log('Deleting sketch...', sketchId);
    const index = dataUrls.findIndex((sketch) => sketch.id === sketchId);
    if (index !== -1) 
      dataUrls.splice(index, 1);

    return dataUrls;
  }
}
// TODO: 1) Implement real database interactions in repository layer. 
// TODO: 2) Convert data to binary data on client side and store it in the database in order to save space.
// Temporary Database
const dataUrls = [];