import { IsNotEmpty, IsOptional, IsString, IsUrl, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GPT_MODELS } from './openAiConfig.dto';

export class ProcessDocumentDto {
  @ApiProperty({
    description: 'URL of the Google Document to process',
    example: 'https://docs.google.com/document/d/1234567890abcdef/edit',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({
    description: 'Title for the new document (if creating a new document)',
    example: 'Processed Questions and Answers',
  })
  @IsString()
  @IsNotEmpty()
  newDocTitle: string;

  @ApiPropertyOptional({
    description: 'Custom prompt to use for processing questions',
    example: 'Please provide a detailed explanation for the following question',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiPropertyOptional({
    description: 'GPT model to use for processing',
    enum: GPT_MODELS,
    example: 'gpt-4',
  })
  @IsString()
  @IsOptional()
  @IsIn(GPT_MODELS, {
    message: `gptModel must be one of the following values: ${GPT_MODELS.join(', ')}`,
  })
  gptModel: string;
}
