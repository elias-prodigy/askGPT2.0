import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleDocsModule } from './apps/google-docs/google-docs.module';
import { OpenAIModule } from './apps/openai/openai.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GoogleDocsModule,
    OpenAIModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
