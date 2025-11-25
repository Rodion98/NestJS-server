import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import levenshtein from 'js-levenshtein';

@ValidatorConstraint({ name: 'PasswordDifferentFromCurrent', async: false })
export class PasswordDifferentFromCurrentConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const obj = args.object as any;

    const currentPassword: string | undefined = obj['currentPassword'];
    const newPassword: string | undefined = value;

    // Если что-то не заполнено — пусть другие валидаторы скажут своё слово
    if (!currentPassword || !newPassword) {
      return true;
    }

    // 1) Не должны совпадать буквально
    if (currentPassword === newPassword) {
      return false;
    }

    // 2) Не должны быть "слишком похожими"
    const distance = levenshtein(currentPassword, newPassword);

    // Порог можно подстроить. Например:
    // - длина пароля до 8 — расстояние >= 2
    // - длина 9-12 — расстояние >= 3
    // - длина >12 — расстояние >= 4
    const len = Math.min(currentPassword.length, newPassword.length);

    let minDistance = 2;
    if (len >= 9 && len <= 12) minDistance = 3;
    if (len > 12) minDistance = 4;

    return distance >= minDistance;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Новый пароль не должен совпадать или быть слишком похожим на текущий.';
  }
}

export function PasswordDifferentFromCurrent(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: PasswordDifferentFromCurrentConstraint,
    });
  };
}
