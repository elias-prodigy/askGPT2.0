import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { QuestionDto } from 'src/dto/question.dto';
import { AnswerDto } from 'src/dto/answer.dto';
import { OpenAiConfigDTO } from 'src/dto/openAiConfig.dto';
import { OpenAIException } from '../../exceptions/custom.exceptions';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  private async processQuestion(
    { key, question }: QuestionDto,
    { prompt, gptModel }: OpenAiConfigDTO,
  ): Promise<AnswerDto> {
    const answer = await this.openai.chat.completions.create({
      model: gptModel ?? this.configService.get<string>('DEFAULT_GPT_MODEL'),
      messages: [
        {
          role: 'user',
          content: prompt ? `${prompt}: ${question}` : question,
        },
      ],
      max_tokens: parseInt(this.configService.get<string>('MAX_TOKENS')) ?? null,
      n: parseInt(this.configService.get<string>('CHAT_COMPLETION_CHOICES')) ?? null,
      temperature: parseFloat(this.configService.get<string>('TEMPERATURE')) ?? null,
    });

    return {
      key,
      question,
      answer: answer.choices[0].message.content,
    };
  }

  async getAnswers(
    questions: QuestionDto[],
    config: OpenAiConfigDTO,
  ): Promise<AnswerDto[]> {
    try {
      const answers = await Promise.all(
        questions.map((question) => this.processQuestion(question, config))
      );
      return answers;
    } catch (error) {
      this.logger.error(
        `Failed to process questions with OpenAI: ${error.message}`,
      );
      throw new OpenAIException('Failed to process questions with OpenAI');
    }
  }
}
