import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DrawingsController } from 'src/controllers/drawings/drawings.controller';
import { Drawing, DrawingSchema } from 'src/models/drawing.model';
import { DrawingsRepository } from 'src/repositories/DrawingsRepository';
import { DrawingsService } from 'src/services/drawings-service/drawings.service';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Drawing.name,
      schema: DrawingSchema,
    },
  ])],  controllers: [DrawingsController],
  providers: [DrawingsService, DrawingsRepository],
  exports: [DrawingsService],
})
export class DrawingsModule {}
