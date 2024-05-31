import { IsString } from 'class-validator';

export class OpenAiConfigDTO {
  @IsString()
  prompt?: string;
  
  @IsString()
  gptModel?: string;
}
