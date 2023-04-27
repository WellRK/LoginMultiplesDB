import { ClientInterface } from "../interface/user.interface";

export class VerificationRegisterRequestDto {
    constructor(
      public user: ClientInterface,
      public attempt: number,
      public deadline: Date,
      public code: number,
    ) { }
  }