import { ClientProfileEnum } from "../enums/client-profile.enum";
import { ClientStatusEnum } from "../enums/client-status.enum";

export class UserGetResponseDto {
    constructor(
        public _id: string,
        public name: string,
        public email: string,
        public cpf: string,
        public cnpj: string,
        public status: ClientStatusEnum,
        public profile: ClientProfileEnum
    ) { }
}