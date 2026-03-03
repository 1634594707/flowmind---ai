import { LlmService } from './llm.service';
import { ConfigService } from '@nestjs/config';

describe('LlmService', () => {
  const configService = {
    get: jest.fn(),
  } as unknown as ConfigService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chat() should throw when api key missing', async () => {
    (configService.get as any).mockImplementation((key: string, def?: string) => {
      if (key === 'DEEPSEEK_API_KEY') return '';
      return def;
    });

    const service = new LlmService(configService);
    await expect(service.chat([{ role: 'user', content: 'hi' }])).rejects.toThrow(
      'Missing DEEPSEEK_API_KEY',
    );
  });

  it('chat() should return content when ok', async () => {
    (configService.get as any).mockImplementation((key: string, def?: string) => {
      if (key === 'DEEPSEEK_API_KEY') return 'k';
      if (key === 'DEEPSEEK_BASE_URL') return 'https://api.deepseek.com/v1';
      if (key === 'DEEPSEEK_MODEL') return 'm';
      return def;
    });

    const fetchSpy = jest
      .spyOn(global as any, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ choices: [{ message: { content: 'ok' } }] }),
      });

    const service = new LlmService(configService);
    const result = await service.chat([{ role: 'user', content: 'hi' }]);

    expect(result).toBe('ok');
    expect(fetchSpy).toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
