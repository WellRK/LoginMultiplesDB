import { ApiProperty } from '@nestjs/swagger';

export abstract class UserUpdateRequestDto {

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  cpf: string;
}