import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): { message: string; apiDocs: string } {
    return { 
      message: 'Welcome to the Whiteboard API', 
      apiDocs: 'Access API endpoints at /sketches' 
    };
  }

}
