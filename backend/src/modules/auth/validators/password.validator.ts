import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

/**
 * Password complexity validation rules
 * Requirements: 9.4 - Password complexity requirements
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export interface PasswordComplexityResult {
  isValid: boolean;
  errors: string[];
}

export class PasswordValidator {
  private static readonly MIN_LENGTH = 8;
  private static readonly UPPERCASE_REGEX = /[A-Z]/;
  private static readonly LOWERCASE_REGEX = /[a-z]/;
  private static readonly NUMBER_REGEX = /\d/;
  private static readonly SPECIAL_CHAR_REGEX = /[@$!%*?&]/;

  /**
   * Validate password complexity
   * @param password - Password to validate
   * @returns PasswordComplexityResult with validation status and errors
   */
  static validateComplexity(password: string): PasswordComplexityResult {
    const errors: string[] = [];

    if (!password || password.length < this.MIN_LENGTH) {
      errors.push(`Password must be at least ${this.MIN_LENGTH} characters long`);
    }

    if (!this.UPPERCASE_REGEX.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!this.LOWERCASE_REGEX.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!this.NUMBER_REGEX.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!this.SPECIAL_CHAR_REGEX.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if password meets minimum length requirement
   */
  static hasMinLength(password: string): boolean {
    return !!password && password.length >= this.MIN_LENGTH;
  }

  /**
   * Check if password contains uppercase letter
   */
  static hasUppercase(password: string): boolean {
    return this.UPPERCASE_REGEX.test(password);
  }

  /**
   * Check if password contains lowercase letter
   */
  static hasLowercase(password: string): boolean {
    return this.LOWERCASE_REGEX.test(password);
  }

  /**
   * Check if password contains number
   */
  static hasNumber(password: string): boolean {
    return this.NUMBER_REGEX.test(password);
  }

  /**
   * Check if password contains special character
   */
  static hasSpecialChar(password: string): boolean {
    return this.SPECIAL_CHAR_REGEX.test(password);
  }
}

/**
 * Custom decorator for password complexity validation
 * Usage: @IsPasswordComplex() on password fields
 */
export function IsPasswordComplex(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPasswordComplex',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return false;
          }
          const result = PasswordValidator.validateComplexity(value);
          return result.isValid;
        },
        defaultMessage(args: ValidationArguments) {
          if (typeof args.value !== 'string') {
            return 'Password must be a string';
          }
          const result = PasswordValidator.validateComplexity(args.value);
          return result.errors.join('; ');
        },
      },
    });
  };
}
