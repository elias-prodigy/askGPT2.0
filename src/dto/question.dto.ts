import { IsInt, IsString } from 'class-validator';

export class QuestionDto {
  @IsInt()
  key: number;

  @IsString()
  question: string;
}
