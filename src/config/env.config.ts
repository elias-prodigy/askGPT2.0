import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService {
  private readonly logger = new Logger(EnvConfigService.name);

  constructor(private configService: ConfigService) {}

  validate() {
    this.logger.log('Starting environment variables validation...');

    const allEnvVars = this.configService.get('OPENAI_API_KEY')
      ? 'OPENAI_API_KEY is set'
      : 'OPENAI_API_KEY is not set';
    this.logger.log(allEnvVars);
    this.logger.log(
      `KEYFILEPATH: ${this.configService.get('KEYFILEPATH') ? 'is set' : 'is not set'}`,
    );
    this.logger.log(
      `CHAT_COMPLETION_CHOICES: ${this.configService.get('CHAT_COMPLETION_CHOICES')}`,
    );
    this.logger.log(`MAX_TOKENS: ${this.configService.get('MAX_TOKENS')}`);
    this.logger.log(`TEMPERATURE: ${this.configService.get('TEMPERATURE')}`);
    this.logger.log(`NODE_ENV: ${this.configService.get('NODE_ENV')}`);
    this.logger.log(`PORT: ${this.configService.get('PORT')}`);

    const requiredEnvVars = ['OPENAI_API_KEY', 'KEYFILEPATH'];

    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !this.configService.get(envVar),
    );

    if (missingEnvVars.length > 0) {
      this.logger.error(
        `Missing required environment variables: ${missingEnvVars.join(', ')}`,
      );
      throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(', ')}`,
      );
    }

    const openaiApiKey = this.configService.get('OPENAI_API_KEY');
    if (!openaiApiKey.startsWith('sk-')) {
      this.logger.error(
        'Invalid OpenAI API Key format. It should start with "sk-"',
      );
      throw new Error('Invalid OpenAI API Key format');
    }

    const chatCompletionChoices = this.configService.get(
      'CHAT_COMPLETION_CHOICES',
    );
    if (chatCompletionChoices && isNaN(Number(chatCompletionChoices))) {
      this.logger.error('CHAT_COMPLETION_CHOICES must be a number');
      throw new Error('Invalid CHAT_COMPLETION_CHOICES value');
    }

    const maxTokens = this.configService.get('MAX_TOKENS');
    if (maxTokens && isNaN(Number(maxTokens))) {
      this.logger.error('MAX_TOKENS must be a number');
      throw new Error('Invalid MAX_TOKENS value');
    }

    const temperature = this.configService.get('TEMPERATURE');
    if (
      temperature &&
      (isNaN(Number(temperature)) ||
        Number(temperature) < 0 ||
        Number(temperature) > 1)
    ) {
      this.logger.error('TEMPERATURE must be a number between 0 and 1');
      throw new Error('Invalid TEMPERATURE value');
    }

    this.logger.log('Environment variables validated successfully');
  }
}
