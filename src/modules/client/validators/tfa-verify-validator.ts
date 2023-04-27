import { Injectable } from "@nestjs/common";
import { ValidatorsUtil } from "src/modules/shared/utils/validators.util";
import { TfaVerifyRequestDto } from "../dtos/tfa/tfa-verify-request.dto";
import { ValidatorContractInterface } from "../interface/validator-contract.interface";

@Injectable()
export class TfaVerifyValidator implements ValidatorContractInterface {

  errors: any[];

  validate(dto: TfaVerifyRequestDto): boolean {

    const validator = new ValidatorsUtil();

    validator.isRequired(dto.secret, 'secret é obrigatório!');

    validator.isRequired(dto.code, 'code é obrigatório!');
    // validator.isSixDigitNumber(dto.code, 'code deve ser um número com 6 posições!');

    this.errors = validator.errors;
    return validator.isValid();
  }
}