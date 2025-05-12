import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DrawingsController } from 'src/controllers/drawings/drawings.controller';
import { DrawingsService } from 'src/services/drawings-service/drawings.service';

@Module({
  imports: [MongooseModule.forFeature([
    // {
    //   name: 'Drawing',
    //   schema: DrawingSchema,
    // },
  ])],
  controllers: [DrawingsController],
  providers: [DrawingsService],
  exports: [DrawingsService],
})
export class DrawingsModule {}
