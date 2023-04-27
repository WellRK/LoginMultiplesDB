import { ApiProperty } from "@nestjs/swagger";
export class UserNewPasswordDto {
  @ApiProperty({ type: String })
    oldPassword: string;

    @ApiProperty({ type: String })
    newPassword: string;

}