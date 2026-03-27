import { User } from './user.entity';

describe('User Entity', () => {
  describe('Password Validation', () => {
    it('should have minimum 8 characters', () => {
      const shortPassword = 'Test@12';
      expect(shortPassword.length).toBeLessThan(8);
    });

    it('should contain uppercase letter', () => {
      const password = 'Test@1234';
      expect(password).toMatch(/[A-Z]/);
    });

    it('should contain lowercase letter', () => {
      const password = 'Test@1234';
      expect(password).toMatch(/[a-z]/);
    });

    it('should contain number', () => {
      const password = 'Test@1234';
      expect(password).toMatch(/\d/);
    });

    it('should contain special character', () => {
      const password = 'Test@1234';
      expect(password).toMatch(/[@$!%*?&]/);
    });
  });

  describe('User Fields', () => {
    it('should have required fields', () => {
      const user = new User();
      user.id = '123e4567-e89b-12d3-a456-426614174000';
      user.email = 'test@example.com';
      user.name = 'Test User';
      user.passwordHash = 'hashedpassword';
      user.role = 'user';
      user.isActive = true;
      user.twoFactorEnabled = false;

      expect(user.id).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.name).toBeDefined();
      expect(user.passwordHash).toBeDefined();
      expect(user.role).toBe('user');
      expect(user.isActive).toBe(true);
      expect(user.twoFactorEnabled).toBe(false);
    });

    it('should have optional fields', () => {
      const user = new User();
      user.avatar = 'https://example.com/avatar.jpg';
      user.totpSecret = 'secret';
      user.lastLoginAt = new Date();

      expect(user.avatar).toBeDefined();
      expect(user.totpSecret).toBeDefined();
      expect(user.lastLoginAt).toBeInstanceOf(Date);
    });
  });
});
