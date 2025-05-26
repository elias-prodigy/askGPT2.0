import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ProcessDocumentDto } from './dto/processDocument.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('documents')
@Controller('documents')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Process a Google Document' })
  @ApiResponse({
    status: 200,
    description: 'Document processed and updated successfully',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or document URL',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during document processing',
  })
  async processDocument(@Body() body: ProcessDocumentDto) {
    try {
      await this.appService.processDocument(body);
      return 'Document processed and updated successfully';
    } catch (e) {
      throw new Error(`Error occurred while processing document: ${e}`);
    }
  }
}
