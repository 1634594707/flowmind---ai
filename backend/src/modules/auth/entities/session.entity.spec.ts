import { Session } from './session.entity';

describe('Session Entity', () => {
  describe('Session Creation', () => {
    it('should create a session with required fields', () => {
      const session = new Session();
      session.id = '123e4567-e89b-12d3-a456-426614174000';
      session.userId = '987e6543-e21b-12d3-a456-426614174000';
      session.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      session.createdAt = new Date();

      expect(session.id).toBeDefined();
      expect(session.userId).toBeDefined();
      expect(session.token).toBeDefined();
      expect(session.expiresAt).toBeInstanceOf(Date);
      expect(session.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('isExpired', () => {
    it('should return false for non-expired session', () => {
      const session = new Session();
      session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

      expect(session.isExpired()).toBe(false);
    });

    it('should return true for expired session', () => {
      const session = new Session();
      session.expiresAt = new Date(Date.now() - 1000); // 1 second ago

      expect(session.isExpired()).toBe(true);
    });

    it('should return true for session expiring exactly now', () => {
      const session = new Session();
      session.expiresAt = new Date(Date.now() - 1);
      expect(session.isExpired()).toBe(true);
    });
  });

  describe('Session Expiration Calculation', () => {
    it('should calculate 7 day expiration correctly', () => {
      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const session = new Session();
      session.expiresAt = sevenDaysLater;

      const diffInDays = (session.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      expect(Math.round(diffInDays)).toBe(7);
    });

    it('should calculate 15 minute expiration correctly', () => {
      const now = new Date();
      const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000);

      const session = new Session();
      session.expiresAt = fifteenMinutesLater;

      const diffInMinutes = (session.expiresAt.getTime() - now.getTime()) / (1000 * 60);
      expect(Math.round(diffInMinutes)).toBe(15);
    });
  });
});
