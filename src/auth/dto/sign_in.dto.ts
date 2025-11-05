import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example:'user@example.com'})
  email: string;

  @IsString()
  @MinLength(8)
  //   @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
//     message:
//       'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
//   })
//   @ApiProperty({
//     example: 'StrongP@ssw0rd',
//     description: 'Password must include uppercase, lowercase, number, and special character',
//   })
  @ApiProperty({example:'aaaaaaaa'})
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @ApiProperty({ required: false, example: 'John' })
  firstName: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @ApiProperty({ required: false , example: 'Doe'})
  lastName: string;

}