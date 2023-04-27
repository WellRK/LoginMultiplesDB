export class TfaGetResponseDto {
    constructor(
        public _id: string,
        public url: string,
        public userId: string,
        public secret: string,
    ) { }
}