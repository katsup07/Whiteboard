import { CreateDrawingInput, DrawingOutput, UpdateDrawingInput } from "../dtos/drawing.dto";

export interface DrawingsRepository {
  findAll(): Promise<DrawingOutput[]>;
  create(drawingData: CreateDrawingInput): Promise<DrawingOutput>;
  findByIdAndUpdate(id: string, drawingData: UpdateDrawingInput): Promise<DrawingOutput>;
  findByIdAndDelete(id: string): Promise<DrawingOutput>;
}