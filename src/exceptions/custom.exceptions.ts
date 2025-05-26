import { HttpException, HttpStatus } from '@nestjs/common';

export class DocumentProcessingException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class InvalidDocumentUrlException extends HttpException {
  constructor() {
    super('Invalid Google Document URL', HttpStatus.BAD_REQUEST);
  }
}

export class OpenAIException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class GoogleDocsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class ValidationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
