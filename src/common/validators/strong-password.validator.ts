import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import zxcvbn from 'zxcvbn';

@ValidatorConstraint({ name: 'StrongPassword', async: false })
export class StrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    if (typeof value !== 'string' || !value) return false;

    const result = zxcvbn(value);
    // score: 0..4 — требуем минимум 3
    return result.score >= 3;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Пароль слишком слабый. Добавьте длину, цифры, заглавные буквы и спецсимволы.';
  }
}

export function StrongPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: StrongPasswordConstraint,
    });
  };
}
