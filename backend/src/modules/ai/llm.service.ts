import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type LlmChatRole = 'system' | 'user' | 'assistant';

export interface LlmChatMessage {
  role: LlmChatRole;
  content: string;
}

interface OpenAiLikeChatCompletionResponse {
  choices?: Array<{
    message?: {
      role?: string;
      content?: string;
    };
  }>;
}

@Injectable()
export class LlmService {
  constructor(private readonly configService: ConfigService) {}

  private getBaseUrl(): string {
    return this.configService.get<string>('DEEPSEEK_BASE_URL', 'https://api.deepseek.com/v1');
  }

  private getApiKey(): string {
    return this.configService.get<string>('DEEPSEEK_API_KEY', '');
  }

  private getModel(): string {
    return this.configService.get<string>('DEEPSEEK_MODEL', 'deepseek-chat');
  }

  async chat(messages: LlmChatMessage[], opts?: { temperature?: number }): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Missing DEEPSEEK_API_KEY');
    }

    const baseUrl = this.getBaseUrl().replace(/\/$/, '');
    const url = `${baseUrl}/chat/completions`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.getModel(),
        messages,
        temperature: opts?.temperature ?? 0.3,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `DeepSeek request failed: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`,
      );
    }

    const data = (await response.json()) as OpenAiLikeChatCompletionResponse;
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('DeepSeek returned empty content');
    }

    return content;
  }
}
