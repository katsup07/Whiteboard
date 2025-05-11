import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SketchesController } from 'src/controllers/sketches/sketches.controller';
import { SketchesService } from 'src/services/sketches-service/sketches.service';

@Module({
  imports: [MongooseModule.forFeature([
    // {
    //   name: 'Sketch',
    //   schema: SketchSchema,
    // },
  ])],
  controllers: [SketchesController],
  providers: [SketchesService],
  exports: [SketchesService],
})
export class SketchesModule {}