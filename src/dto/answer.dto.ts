import { IsInt, IsString } from 'class-validator';

export class AnswerDto {
  @IsInt()
  key: number;

  @IsString()
  question: string;

  @IsString()
  answer: string;
}
