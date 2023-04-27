import { ApiProperty } from "@nestjs/swagger";

export abstract class TfaVerifyRequestDto {

    @ApiProperty({ type: String })
    secret: string;

    @ApiProperty({ type: String })
    code: string;
}