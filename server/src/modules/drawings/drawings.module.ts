import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DrawingsController } from 'src/controllers/drawings/drawings.controller';
import { Drawing, DrawingSchema } from 'src/models/drawing.model';
import { MongoDrawingsRepository } from 'src/repositories/mongo-drawings-repository';
import { DrawingsService } from 'src/services/drawings-service/drawings.service';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Drawing.name,
      schema: DrawingSchema,
    },
  ])],
  controllers: [DrawingsController],
  providers: [
    DrawingsService,
    {
      provide: 'DrawingsRepository',
      useClass: MongoDrawingsRepository,
    },
  ],
  exports: [DrawingsService],
})
export class DrawingsModule {}
