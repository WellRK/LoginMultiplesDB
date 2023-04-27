import { ForbiddenException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { VerificationInterface } from '../interface/verification.interface';
import { Model } from "mongoose";
import { Verification } from "../schemas/verification.schema";
import { ClientService } from "./client.service";
import { ClientInterface } from "../interface/user.interface";
import NumberUtil from "src/modules/shared/utils/number.util";
//import { EmailService } from "./email.service";
import { SendgridRepository } from "../repositories/send-grid.repository";
import { ClientRepository } from "../repositories/client.repository";
import { VerificationRepository } from "../repositories/verification.repository";
import { UserGetResponseDto } from "../dtos/user-get-response.dto";
import { ClientStatusEnum } from "../enums/client-status.enum";
import { BaseRepository } from "src/modules/shared/repositories/base.repository";
import { Client } from "../schemas/client.chema";
//import { VerificationRegisterRequestDto } from "src/modules/backoffice/dtos/verification-register-request.dto";
import { VerificationRegisterResponseDto } from "../dtos/vertification-register-response.dto";
import { VerificationRegisterRequestDto } from "../dtos/verification-register-request.dto";

@Injectable()
export class VerificationService {

    private readonly logger = new Logger(VerificationService.name);

    constructor(
        @InjectModel(Verification.name) private readonly model: Model<VerificationInterface>,
        //private readonly emailService: EmailService,
        //private readonly userService: ClientService,
        private readonly sendGrid: SendgridRepository,
        //private readonly clientRepository: ClientRepository,
        private readonly verificationRepository: VerificationRepository,
    ) {
        //super(model);
    }

    async delete(id: string) {
        return await this.model.findByIdAndDelete(id);
    }

    async sendVerificationEmail(
        user: ClientInterface,
        to: string,
        subject: string,
        text: string,
        html: string,
    ) {
        const verificacao = await this.getByUser(user);

        const result = await this.sendGrid.sendEmail(
            to,
            subject,
            text,
            html,
        );

        return result;
    }


    async incrementAttempt(_id: string, attempt: number) {
        return await this.model.findOneAndUpdate(
            { _id },
            {
                $set: {
                    attempt,
                },
            },
        );
    }

    async getByUser(user: ClientInterface): Promise<VerificationInterface> {
        return await this.model.findOne({ user })
            .populate('user');
    }

    async save(dto: VerificationRegisterRequestDto): Promise<VerificationInterface> {

        const verification = {
            user: dto.user,
            attempt: dto.attempt,
            deadline: dto.deadline,
            code: dto.code,
        };

        const data = new this.model(verification);

        return await data.save();
    }

    async send(user: ClientInterface): Promise<VerificationRegisterResponseDto> {

        let verificationModel = await this.getByUser(user);

        if (verificationModel) {
            const now = new Date();
            if (now < verificationModel.deadline) {
                await this.verificationRepository.delete(verificationModel._id);
            } else
                await this.verificationRepository.delete(verificationModel._id);
        }

        let deadline: Date = new Date();
        deadline.setMinutes(deadline.getMinutes() + 2);

        const code = NumberUtil.generateRandomNumber();

        const verificationRegisterRequestDto = new VerificationRegisterRequestDto(
            user,
            0,
            deadline,
            code,
        );

        await this.save(verificationRegisterRequestDto);

        await this.sendGrid.sendEmail(
            user.email,
            'Xeque-Mate app: Código de verificação',
            `Xeque-Mate app: Código de verificação`,
            `Olá ${user.name}, seu código de verificação é ${verificationRegisterRequestDto.code}`,
        );

        return new VerificationRegisterResponseDto(
            user.email
        );
    }
}