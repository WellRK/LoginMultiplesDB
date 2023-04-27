// import { Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
// import * as SendGrid from '@sendgrid/mail';
// //import { EnviromentVariablesEnum } from "../enums/enviroment.variables.enum";

// @Injectable()
// export class EmailService {

//     constructor(
//         @InjectSendGrid() private readonly client: SendGridService,
//         private readonly configService: ConfigService,
//     ) { 

//     }

//     async sendEmail(to: string, subject: string, text: string, html: string) {

//         const msg = {
//             to,
//             from: this.configService.get('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2VjZGFmMTYzYzk5N2M2NzYxZjA4OTQiLCJlbWFpbCI6Im1hdGhldXNyZGVvbGl2MUBnbWFpbC5jb20iLCJpYXQiOjE2Nzc1MjY4OTUsImV4cCI6MTY3NzU1NTY5NX0.k-UiJpE7TB6P8P3VXHV6vLjnW5GlC5E-fYggxJyGGG4'),
//             //from: this.configService.get(EnviromentVariablesEnum.SENDGRID_EMAIL_SENDER),
//             subject,
//             text,
//             html
//         };

//         await this.client.send(msg);
//     }
// }