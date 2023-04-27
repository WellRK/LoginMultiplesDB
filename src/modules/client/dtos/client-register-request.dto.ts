import { ApiProperty } from "@nestjs/swagger";
import { ClientProfileEnum } from "../enums/client-profile.enum";
import { ClientStatusEnum } from "../enums/client-status.enum";

export class ClientRegisterRequestDto {

    @ApiProperty({ type: String })
    email: string;

    @ApiProperty({ type: String })
    password: string;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: String, required: false })
    cpf: string;

    @ApiProperty({ type: String, required: false })
    cnpj: string;

    // @ApiProperty({ type: String, enum: Object.keys(ClientStatusEnum) })
    // status: ClientStatusEnum;

    @ApiProperty({ type: String, enum: Object.keys(ClientProfileEnum) })
    profile: ClientProfileEnum;

    @ApiProperty({ type: String, required: false })
    document: string;

    @ApiProperty({ type: String, required: false })
    phone: string;
}