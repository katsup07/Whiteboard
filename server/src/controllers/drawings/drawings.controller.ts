import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateDrawingInput, DrawingOutput, UpdateDrawingInput } from '../../dtos/drawing.dto';
import { DrawingsService } from '../../services/drawings-service/drawings.service';

@Controller('drawings') // Update the route to match the new resource name
export class DrawingsController {
  constructor(private readonly drawingsService: DrawingsService) {}  @Get()
  async getDrawings(): Promise<DrawingOutput[]> {
    return await this.drawingsService.getDrawings();
  }

  @Post()
  async saveDrawing(@Body() drawingData: CreateDrawingInput): Promise<DrawingOutput> {
    return this.drawingsService.saveDrawing(drawingData);
  }

  @Put(':id')
  async updateDrawing(@Param('id') drawingId: string, @Body() drawingData: UpdateDrawingInput): Promise<DrawingOutput> {
    return this.drawingsService.updateDrawing(drawingId, drawingData);
  }

  @Delete(':id')
  async deleteDrawing(@Param('id') drawingId: string): Promise<DrawingOutput[]> {
    return this.drawingsService.deleteDrawing(drawingId);
  }
}
