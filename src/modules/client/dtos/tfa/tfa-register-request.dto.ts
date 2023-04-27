import { ApiProperty } from "@nestjs/swagger";
import { ClientInterface } from "../../interface/user.interface";

export abstract class TfaRegisterRequestDto {

    @ApiProperty({ type: String })
    secret: string;

    @ApiProperty({ type: String })
    url: string;

    userId: string;

    user: ClientInterface;
}