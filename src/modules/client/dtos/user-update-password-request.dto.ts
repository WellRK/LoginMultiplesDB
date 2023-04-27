import { ApiProperty } from "@nestjs/swagger";

export abstract class UserUpdatePasswordRequestDto {

    @ApiProperty({ type: String })
    password: string;

    @ApiProperty({ type: String })
    newPassword: string;

    @ApiProperty({ type: String })
    email: string;
}