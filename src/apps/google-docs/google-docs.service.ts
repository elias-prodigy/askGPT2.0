import { Injectable, Logger } from '@nestjs/common';
import { docs_v1, google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { GoogleDocsException } from '../../exceptions/custom.exceptions';

@Injectable()
export class GoogleDocsService {
  private readonly logger = new Logger(GoogleDocsService.name);
  private docs: docs_v1.Docs;
  private authClient;

  constructor(private configService: ConfigService) {
    this.initializeAuth();
  }

  private async initializeAuth() {
    const auth = new google.auth.GoogleAuth({
      keyFile: this.configService.get<string>('KEYFILEPATH'),
      scopes: [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive',
      ],
    });
    this.authClient = await auth.getClient();
    this.docs = google.docs({ version: 'v1', auth: this.authClient });
  }

  async getDocumentContent(
    documentId: string,
  ): Promise<docs_v1.Schema$Document> {
    try {
      const response = await this.docs.documents.get({ documentId });
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get document content: ${error.message}`);
      throw new GoogleDocsException('Failed to retrieve document content');
    }
  }

  async createDocument(
    title: string,
    requests: docs_v1.Schema$Request[],
  ): Promise<void> {
    try {
      const document = await this.docs.documents.create({
        requestBody: { title },
      });

      await this.docs.documents.batchUpdate({
        documentId: document.data.documentId,
        requestBody: { requests },
      });
    } catch (error) {
      this.logger.error(`Failed to create new document: ${error.message}`);
      throw new GoogleDocsException('Failed to create new document');
    }
  }

  async updateDocument(
    documentId: string,
    requests: docs_v1.Schema$Request[],
  ): Promise<void> {
    try {
      await this.docs.documents.batchUpdate({
        documentId,
        requestBody: { requests },
      });
    } catch (error) {
      this.logger.error(`Failed to update document: ${error.message}`);
      throw new GoogleDocsException('Failed to update document');
    }
  }
}
