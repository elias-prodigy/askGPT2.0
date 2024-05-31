# AskGPT2.0

This API allows users to process a Google Document by extracting questions, generating answers using OpenAI's GPT models, and creating a new Google Document with the answers. The main features of this API include:

- Extracting questions from a Google Document
- Generating answers using OpenAI's GPT models
- Creating a new Google Document with the generated answers

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Request and Response Examples](#request-and-response-examples)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/elias-prodigy/askGPT2.0.git
   cd askGPT2.0

2. Install dependencies:
   ```bash
   npm install

## Configuration

Create a `.env` file in the root directory of the project and add your environment variables:

```bash
    OPENAI_API_KEY=your_openai_api_key
    KEYFILEPATH=path_to_your_service_account_file.json
    CHAT_COMPLETION_CHOICES=1
    MAX_TOKENS=
    TEMPERATURE=0.5
    DEFAULT_GPT_MODEL=gpt-3.5-turbo
```
- **OPENAI_API_KEY**: This is your API key for OpenAI. You need to [sign up](#https://platform.openai.com/) on the OpenAI platform to obtain this key. Also you'll need to top up your account balance minimum with 5 USD to start making requests with this application.
- **KEYFILEPATH**: This is the path to your Google Cloud service account credentials JSON file. You need to create a service account on [Google Cloud](#https://console.cloud.google.com/) and download the JSON key file.
- **CHAT_COMPLETION_CHOICES**: This specifies the number of choices to return from the OpenAI API. Typically, this is set to 1 for a single response.
- **MAX_TOKENS**: This specifies the maximum number of tokens to generate in the OpenAI response. Adjust this value based on your requirements. For no limitations just leave it blank.
- **TEMPERATURE**: What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
- **DEFAULT_GPT_MODEL**: ID of the model to use. By default `gpt-3.5-turbo`. Available options: `['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4.5', 'gpt-4.5-turbo']`


## Usage
   
   To start the server, run:

```bash
   npm start
``` 
The server will start on http://localhost:3000.

## API Endpoints

### POST /

Process a Google Document by extracting questions, generating answers, and creating a new Google Document with the answers.

#### Request Body

- `url` (string, required): The URL of the Google Document to process.
- `prompt` (string, optional): The prompt to use for generating answers with OpenAI's GPT model.
- `gptModel` (string, optional): The GPT model to use for generating answers (e.g., `gpt-3.5-turbo`).

## Request and Response Examples

### Example Request

```bash
curl -X POST http://localhost:3000/ \
  -H 'Content-Type: application/json' \
  -d '{
        "url": "https://docs.google.com/document/d/your-document-id",
        "prompt": "Provide a detailed answer",
        "gptModel": "gpt-3.5-turbo"
      }'

```
#### Example Response

```json
{
  "message": "Document processed and created successfully"
}
