import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { ProcessDocumentDto } from './dto/processDocument.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async processDocument(@Body() body: ProcessDocumentDto) {
    try{
      await this.appService.processDocument(body);
      return 'Document processed and updated successfully';
    } catch (e) {
      throw new Error(`Error occured while processing document: ${e}`);
    }
  }
}
