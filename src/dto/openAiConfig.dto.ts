import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const GPT_MODELS = [
  'gpt-4',
  'gpt-4-turbo-preview',
  'gpt-4-32k',
  'gpt-4-vision-preview',
];

export class OpenAiConfigDTO {
  @ApiPropertyOptional({
    description: 'Custom prompt to use for processing questions',
    example: 'Please provide a detailed explanation for the following question',
  })
  @IsString()
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
  gptModel?: string;
}
