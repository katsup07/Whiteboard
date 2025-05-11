import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SketchesService } from 'src/services/sketches-service/sketches.service';
import { Sketch } from 'types/sketches';

@Controller('sketches')
export class SketchesController {
  constructor(private readonly sketchesService: SketchesService) {}

  @Get()
  async getSketches() {
    return await this.sketchesService.getSketches();
  }

  @Post()
  async saveSketch(@Body() sketchData: Sketch) {
    return this.sketchesService.saveSketch(sketchData);
  }

  @Put(':id')
  async updateSketch(@Param('id') sketchId: string, @Body() sketchData: Sketch) {
    return this.sketchesService.updateSketch(sketchId, sketchData);
  }

  @Delete(':id')
  async deleteSketch(@Param('id') sketchId: string) {
    return this.sketchesService.deleteSketch(sketchId);
  }

}