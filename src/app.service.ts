import { Injectable } from '@nestjs/common';
import { GoogleDocsService } from './apps/google-docs/google-docs.service';
import { OpenAIService } from './apps/openai/openai.service';
import { QuestionDto } from './dto/question.dto';
import { AnswerDto } from './dto/answer.dto';
import { ProcessDocumentDto } from './dto/processDocument.dto';
import { docs_v1 } from 'googleapis';

@Injectable()
export class AppService {
  constructor(
    private googleDocsService: GoogleDocsService,
    private openAIService: OpenAIService,
  ) {}

  async processDocument(body: ProcessDocumentDto) {
    const { url, newDocTitle, ...config } = body;
    const documentId = this.getIdFromUrl(url);
    const content = await this.googleDocsService.getDocumentContent(documentId);
    const questions = this.extractQuestions(content);
    const answers = await this.openAIService.getAnswers(questions, config);
    const requests = this.prepareContent(answers);
    if (newDocTitle) {
      await this.googleDocsService.createDocument(newDocTitle, requests);
    } else {
      await this.googleDocsService.updateDocument(documentId, requests);
    }
  }

  getIdFromUrl(url: string): string { return url.match(/[-\w]{25,}/)[0]; }

  private extractQuestions(content: docs_v1.Schema$Document): QuestionDto[] {
    return content.body.content.reduce((acc: QuestionDto[], element) => {
      if (element.paragraph && element.paragraph.elements) {
        const text = element.paragraph.elements.map(e => e.textRun ? e.textRun.content : '').join('').trim();
        const key = text.match(/^\d*/)[0];
        if (key) {
          acc.push({
            key: Number(key),
            question: text.replace(`${key}.`, '').trim()
          });
        } else if (acc.length) {
          const lastQuestion = acc.length-1;
          acc[lastQuestion].question = acc[lastQuestion].question + ' ' + text;
        }
      }
      return acc;
    }, []);
  }

  private prepareContent(answers: AnswerDto[]): docs_v1.Schema$Request[] {
    const text = answers.reduce((acc, { key, question, answer }) => {
      const content = `${key}. ${question.toUpperCase()}\n${answer}`;
      acc += acc.length ? `\n${content}\n` : `${content}\n`;
      return acc;
    }, '');
    return [{
      insertText: {
        location: {
          index: 1,
        },
        text,
      },
    }];
  }
}
