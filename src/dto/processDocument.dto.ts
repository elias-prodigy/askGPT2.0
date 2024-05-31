import { IsNotEmpty, IsOptional, IsString, IsUrl, IsIn } from 'class-validator';

const GPT_MODELS = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4.5', 'gpt-4.5-turbo'];

export class ProcessDocumentDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  newDocTitle: string;

  @IsString()
  @IsOptional()
  prompt: string;

  @IsString()
  @IsOptional()
  @IsIn(GPT_MODELS, { message: `gptModel must be one of the following values: ${GPT_MODELS.join(', ')}` })
  gptModel: string;
}
