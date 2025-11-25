import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches } from 'class-validator';
import { PasswordDifferentFromCurrent } from '../../common/validators/password-different-from-current.validator.js';
import { StrongPassword } from '../../common/validators/strong-password.validator.js';

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPassword123!' })
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString()
  @MinLength(8)
  // 1) Не совпадает и не слишком похож на currentPassword

  // @PasswordDifferentFromCurrent()
  // 2) Достаточно сильный по zxcvbn

  // @StrongPassword()
  //   @Matches(
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
  //     { message: 'Пароль должен содержать заглавную, строчную букву, цифру и спецсимвол' },
  //   )
  newPassword: string;
}
