export class AuthenticateClientResponseDto {
    constructor(
        public email: string,
        public token: string,
    ) { }
}