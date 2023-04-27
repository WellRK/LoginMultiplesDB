import { ApiProperty } from "@nestjs/swagger";

export abstract class AuthenticateClientRequestDto {
    
    @ApiProperty({ type: String })
    email: string;

    @ApiProperty({ type: String })
    password: string;
}