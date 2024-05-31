import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { QuestionDto } from 'src/dto/question.dto';
import { AnswerDto } from 'src/dto/answer.dto';
import { OpenAiConfigDTO } from 'src/dto/openAiConfig.dto';


@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async getAnswers(questions: QuestionDto[], { prompt, gptModel }: OpenAiConfigDTO): Promise<AnswerDto[]> {
    return Promise.all(questions.map(async ({ key, question }) => {
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
      return ({
        key,
        question,
        answer: answer.choices[0].message.content,
      });
    }));
  }
}
