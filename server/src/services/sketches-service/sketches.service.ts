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
  }

  async deleteSketch(sketchId: string) {
    console.log('Deleting sketch...', sketchId);
    const index = dataUrls.findIndex((sketch) => sketch.id === sketchId);
    if (index !== -1) 
      dataUrls.splice(index, 1);

    return dataUrls;
  }
}
// TODO: Implement interactions with a real database in repository layer
// Temp Database
const dataUrls = [];