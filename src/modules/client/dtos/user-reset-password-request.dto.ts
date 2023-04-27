import { ApiProperty } from "@nestjs/swagger";

export abstract class UserResetPasswordRequestDto {

    @ApiProperty({ type: String })
    email: string;
}