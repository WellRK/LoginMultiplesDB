import { ApiProperty } from "@nestjs/swagger";

export class UserUpdateImageRequestDto {

    @ApiProperty({ type: String })
    image: string;
}
