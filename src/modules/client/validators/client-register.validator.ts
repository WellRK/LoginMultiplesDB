import { Injectable } from "@nestjs/common";
import { ValidatorContractInterface } from "../../shared/interfaces/validator-contract.interface";
import { ValidatorsUtil } from "../../shared/utils/validators.util";
import { ClientRegisterRequestDto } from "../dtos/client-register-request.dto";
@Injectable()
export class ClientRegisterValidator implements ValidatorContractInterface {

    errors: any[];

    validate(dto: ClientRegisterRequestDto): boolean {

        const validator = new ValidatorsUtil();

        validator.isRequired(dto.email, 'email is required!');
        validator.isEmail(dto.email, 'invalid email!');

        validator.isRequired(dto.password, 'password is required!');

        validator.isRequired(dto.name, 'name is required!');

        validator.isRequired(dto.profile, 'profile is required!');

        validator.isRequired(dto.cpf || dto.cnpj, 'CPF or CNPJ is required!')

        this.errors = validator.errors;
        return validator.isValid();
    }
}