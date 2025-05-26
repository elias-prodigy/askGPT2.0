import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleDocsModule } from './apps/google-docs/google-docs.module';
import { OpenAIModule } from './apps/openai/openai.module';
import { UserModule } from './apps/user/user.module';
import { AuthModule } from './apps/auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { EnvConfigService } from './config/env.config';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot(winstonConfig),
    GoogleDocsModule,
    OpenAIModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, EnvConfigService],
})
export class AppModule {
  constructor(private readonly envConfigService: EnvConfigService) {
    this.envConfigService.validate();
  }
}
