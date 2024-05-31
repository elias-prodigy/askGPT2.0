import { Injectable } from '@nestjs/common';
import { docs_v1, google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleDocsService {
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

  async getDocumentContent(documentId: string): Promise<docs_v1.Schema$Document> {
    const res = await this.docs.documents.get({ documentId });
    return res.data;
  }

  async createDocument(title: string, requests: docs_v1.Schema$Request[]) {
    const res = await this.docs.documents.create({
      requestBody: {
        title,
      },
    });
    
    await this.updateDocument(res.data.documentId, requests);
  }

  async updateDocument(documentId: string, requests: docs_v1.Schema$Request[]) {
    await this.docs.documents.batchUpdate({
      documentId,
      requestBody: { requests },
    });
  }
}