import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerDto {
  @ApiProperty({
    description: 'Question number/key',
    minimum: 1,
    example: 1,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  key: number;

  @ApiProperty({
    description: 'The question text',
    example: 'What is the capital of France?',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    description: 'The answer to the question',
    example: 'Paris is the capital of France.',
  })
  @IsString()
  @IsNotEmpty()
  answer: string;
}
