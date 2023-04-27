import { ApiProperty } from "@nestjs/swagger";
import { ClientInterface} from "../../interface/user.interface";

export abstract class TfaDeleteRequestDto {

    // @ApiProperty({ type: Number })
    // code: number;

    // @ApiProperty({ type: String })
    // secret: string;

    @ApiProperty({ type: String })
    password: string;

    userId: string;

    user: ClientInterface;
}