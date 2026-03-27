import { PasswordValidator } from './password.validator';

describe('PasswordValidator', () => {
  describe('validateComplexity', () => {
    it('should validate a strong password', () => {
      const result = PasswordValidator.validateComplexity('Test@1234');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password shorter than 8 characters', () => {
      const result = PasswordValidator.validateComplexity('Test@12');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password without uppercase letter', () => {
      const result = PasswordValidator.validateComplexity('test@1234');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without lowercase letter', () => {
      const result = PasswordValidator.validateComplexity('TEST@1234');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without number', () => {
      const result = PasswordValidator.validateComplexity('Test@Test');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special character', () => {
      const result = PasswordValidator.validateComplexity('Test1234');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Password must contain at least one special character (@$!%*?&)',
      );
    });

    it('should return multiple errors for weak password', () => {
      const result = PasswordValidator.validateComplexity('test');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors).toContain('Password must be at least 8 characters long');
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
      expect(result.errors).toContain('Password must contain at least one number');
      expect(result.errors).toContain(
        'Password must contain at least one special character (@$!%*?&)',
      );
    });

    it('should handle empty password', () => {
      const result = PasswordValidator.validateComplexity('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should accept all valid special characters', () => {
      const specialChars = ['@', '$', '!', '%', '*', '?', '&'];
      specialChars.forEach((char) => {
        const result = PasswordValidator.validateComplexity(`Test1234${char}`);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('hasMinLength', () => {
    it('should return true for password with 8 or more characters', () => {
      expect(PasswordValidator.hasMinLength('12345678')).toBe(true);
      expect(PasswordValidator.hasMinLength('123456789')).toBe(true);
    });

    it('should return false for password with less than 8 characters', () => {
      expect(PasswordValidator.hasMinLength('1234567')).toBe(false);
      expect(PasswordValidator.hasMinLength('123')).toBe(false);
    });

    it('should return false for empty password', () => {
      expect(PasswordValidator.hasMinLength('')).toBe(false);
    });
  });

  describe('hasUppercase', () => {
    it('should return true for password with uppercase letter', () => {
      expect(PasswordValidator.hasUppercase('Test')).toBe(true);
      expect(PasswordValidator.hasUppercase('TEST')).toBe(true);
      expect(PasswordValidator.hasUppercase('tEst')).toBe(true);
    });

    it('should return false for password without uppercase letter', () => {
      expect(PasswordValidator.hasUppercase('test')).toBe(false);
      expect(PasswordValidator.hasUppercase('123')).toBe(false);
    });
  });

  describe('hasLowercase', () => {
    it('should return true for password with lowercase letter', () => {
      expect(PasswordValidator.hasLowercase('test')).toBe(true);
      expect(PasswordValidator.hasLowercase('Test')).toBe(true);
      expect(PasswordValidator.hasLowercase('TEST')).toBe(false);
    });

    it('should return false for password without lowercase letter', () => {
      expect(PasswordValidator.hasLowercase('TEST')).toBe(false);
      expect(PasswordValidator.hasLowercase('123')).toBe(false);
    });
  });

  describe('hasNumber', () => {
    it('should return true for password with number', () => {
      expect(PasswordValidator.hasNumber('test1')).toBe(true);
      expect(PasswordValidator.hasNumber('123')).toBe(true);
      expect(PasswordValidator.hasNumber('test123')).toBe(true);
    });

    it('should return false for password without number', () => {
      expect(PasswordValidator.hasNumber('test')).toBe(false);
      expect(PasswordValidator.hasNumber('TEST')).toBe(false);
    });
  });

  describe('hasSpecialChar', () => {
    it('should return true for password with special character', () => {
      expect(PasswordValidator.hasSpecialChar('test@')).toBe(true);
      expect(PasswordValidator.hasSpecialChar('test$')).toBe(true);
      expect(PasswordValidator.hasSpecialChar('test!')).toBe(true);
      expect(PasswordValidator.hasSpecialChar('test%')).toBe(true);
      expect(PasswordValidator.hasSpecialChar('test*')).toBe(true);
      expect(PasswordValidator.hasSpecialChar('test?')).toBe(true);
      expect(PasswordValidator.hasSpecialChar('test&')).toBe(true);
    });

    it('should return false for password without special character', () => {
      expect(PasswordValidator.hasSpecialChar('test')).toBe(false);
      expect(PasswordValidator.hasSpecialChar('test123')).toBe(false);
      expect(PasswordValidator.hasSpecialChar('Test123')).toBe(false);
    });

    it('should return false for password with invalid special characters', () => {
      expect(PasswordValidator.hasSpecialChar('test#')).toBe(false);
      expect(PasswordValidator.hasSpecialChar('test^')).toBe(false);
      expect(PasswordValidator.hasSpecialChar('test(')).toBe(false);
    });
  });
});
