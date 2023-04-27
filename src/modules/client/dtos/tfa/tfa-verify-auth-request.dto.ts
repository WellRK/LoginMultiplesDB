import { ApiProperty } from "@nestjs/swagger";

export abstract class TfaVerifyAuthRequestDto {

    @ApiProperty({ type: String })
    code: string;
}