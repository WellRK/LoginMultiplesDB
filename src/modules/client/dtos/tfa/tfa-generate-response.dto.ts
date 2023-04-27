export class TfaGenerateResponseDto {
    constructor(
      public secret: string,
      public otpauthUrl: string,
    ) { }
  }