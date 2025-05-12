import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DrawingsService } from 'src/services/drawings-service/drawings.service';
import { Drawing } from 'types/drawing';

@Controller('drawings') // Update the route to match the new resource name
export class DrawingsController {
  constructor(private readonly drawingsService: DrawingsService) {}

  @Get()
  async getDrawings() {
    return await this.drawingsService.getDrawings();
  }

  @Post()
  async saveDrawing(@Body() drawingData: Drawing) {
    return this.drawingsService.saveDrawing(drawingData);
  }

  @Put(':id')
  async updateDrawing(@Param('id') drawingId: string, @Body() drawingData: Drawing) {
    return this.drawingsService.updateDrawing(drawingId, drawingData);
  }

  @Delete(':id')
  async deleteDrawing(@Param('id') drawingId: string) {
    return this.drawingsService.deleteDrawing(drawingId);
  }
}
