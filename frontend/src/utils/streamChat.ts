/**
 * 通过 fetch + ReadableStream 消费 SSE 流式 AI 响应。
 * 参考 golutra 的 terminalBridge 缓冲模式，逐块回调避免 UI 阻塞。
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface StreamChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface StreamChatOptions {
  messages: StreamChatMessage[];
  temperature?: number;
  onChunk: (delta: string) => void;
  onDone?: (fullContent: string) => void;
  onError?: (err: string) => void;
}

export async function streamChat(opts: StreamChatOptions): Promise<string> {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/ai/design/stream/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      messages: opts.messages,
      temperature: opts.temperature,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Stream request failed: ${response.status} ${text}`);
  }

  if (!response.body) {
    throw new Error('No response body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';
  let buffer = '';

  let reading = true;
  while (reading) {
    const { done, value } = await reader.read();
    if (done) {
      reading = false;
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    // 保留最后一个可能不完整的行
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'data: [DONE]') continue;
      if (!trimmed.startsWith('data: ')) continue;

      try {
        const json = JSON.parse(trimmed.slice(6)) as { delta?: string; error?: string };
        if (json.error) {
          opts.onError?.(json.error);
          return fullContent;
        }
        if (json.delta) {
          fullContent += json.delta;
          opts.onChunk(json.delta);
        }
      } catch {
        // 忽略解析失败的行
      }
    }
  }

  opts.onDone?.(fullContent);
  return fullContent;
}
