import { Injectable, Inject } from "@nestjs/common";
import { CreateDrawingInput, DrawingOutput, UpdateDrawingInput } from "src/dtos/drawing.dto";
import { DrawingsRepository } from "src/interfaces/drawings-repository.interface";

@Injectable()
export class DrawingsService {

  constructor(
    @Inject('DrawingsRepository') private readonly drawingsRepository: DrawingsRepository,
  ) {} 
  
  async getDrawings(): Promise<DrawingOutput[]> {
    return this.drawingsRepository.findAll();
  }

  async saveDrawing(drawingData: CreateDrawingInput): Promise<DrawingOutput> {
    return this.drawingsRepository.create(drawingData);
  }

  async updateDrawing(drawingId: string, drawingData: UpdateDrawingInput): Promise<DrawingOutput> {
    return this.drawingsRepository.findByIdAndUpdate(drawingId, drawingData);
  }
  async deleteDrawing(drawingId: string): Promise<DrawingOutput[]> {
    await this.drawingsRepository.findByIdAndDelete(drawingId);
    return this.getDrawings();
  }
}