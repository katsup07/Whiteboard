import { IsNotEmpty, IsOptional, IsString, IsNumber, Matches } from 'class-validator';
const dataUrlFormat = /^data:image\/(png|jpeg|jpg|svg\+xml|webp);base64,/;
export class DrawingOutput {
  @IsString()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(dataUrlFormat, {
    message: 'Invalid data URL format. Must be a base64 encoded image.'
  })
  dataUrl: string;

  @IsNumber()
  timestamp: number;
}

export class CreateDrawingInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(dataUrlFormat, {
    message: 'Invalid data URL format. Must be a base64 encoded image.'
  })
  dataUrl: string;

  @IsNumber()
  @IsOptional()
  timestamp?: number; // Optional, server can set default
}

export class UpdateDrawingInput {
  @IsString()
  name: string;

  @IsString()
  @Matches(dataUrlFormat, {
    message: 'Invalid data URL format. Must be a base64 encoded image.'
  })
  dataUrl: string;

  @IsNumber()
  @IsOptional()
  timestamp?: number;
}
