// DrawingsRepository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Drawing, DrawingDocument } from 'src/models/drawing.model';
import { DrawingOutput, CreateDrawingInput, UpdateDrawingInput } from 'src/dtos/drawing.dto';

@Injectable()
export class DrawingsRepository {  
  
  constructor(
    @InjectModel(Drawing.name) private readonly drawingModel: Model<DrawingDocument>,
  ) {}

  async findAll(): Promise<DrawingOutput[]> {
    const drawings = await this.drawingModel.find().exec();
    return drawings.map(drawing => this.toClientFormat(drawing));
  }

  async create(drawingData: CreateDrawingInput): Promise<DrawingOutput> {
    const newDrawing = new this.drawingModel({
      name: drawingData.name,
      dataUrl: drawingData.dataUrl,
      timestamp: drawingData.timestamp || Date.now(),
    });
    const savedDrawing = await newDrawing.save();
    return this.toClientFormat(savedDrawing);
  }  
  
  async findByIdAndUpdate(id: string, drawingData: UpdateDrawingInput): Promise<DrawingOutput> {
    const updatedDrawing = await this.drawingModel.findByIdAndUpdate(
      id,
      {
        name: drawingData.name,
        dataUrl: drawingData.dataUrl,
        timestamp: drawingData.timestamp,
      },
      { new: true }
    ).exec();
    return updatedDrawing ? this.toClientFormat(updatedDrawing) : null;
  }  
  
  async findByIdAndDelete(id: string): Promise<DrawingOutput> {
    const deletedDrawing = await this.drawingModel.findByIdAndDelete(id).exec();
    return deletedDrawing ? this.toClientFormat(deletedDrawing) : null;
  }
  
  private toClientFormat(drawing: DrawingDocument): DrawingOutput {
    const drawingObject = drawing.toObject();
    return {
      id: drawingObject._id.toString(),
      name: drawingObject.name,
      dataUrl: drawingObject.dataUrl,
      timestamp: drawingObject.timestamp,
    };
  }
}