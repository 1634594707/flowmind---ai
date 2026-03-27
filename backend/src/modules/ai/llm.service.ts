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

  /**
   * 流式调用 LLM，通过 onChunk 回调逐块返回内容。
   * 适用于 SSE 场景，避免长时间等待。
   */
  async chatStream(
    messages: LlmChatMessage[],
    onChunk: (chunk: string) => void,
    opts?: { temperature?: number },
  ): Promise<string> {
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
        stream: true,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `DeepSeek request failed: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`,
      );
    }

    if (!response.body) {
      throw new Error('No response body for streaming');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (!trimmed.startsWith('data: ')) continue;

        try {
          const json = JSON.parse(trimmed.slice(6)) as {
            choices?: Array<{ delta?: { content?: string } }>;
          };
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) {
            fullContent += delta;
            onChunk(delta);
          }
        } catch {
          // 忽略解析失败的行
        }
      }
    }

    return fullContent;
  }
}
