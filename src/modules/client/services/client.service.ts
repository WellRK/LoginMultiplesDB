/* eslint-disable prettier/prettier */
import { BaseService } from "../../shared/services/base.service";
import * as bcrypt from 'bcryptjs';
import { BadRequestException, Injectable } from "@nestjs/common";
import { ClientInterface } from "../interface/user.interface";
import { ClientRepository } from "../repositories/client.repository";
import { UserUpdateRequestDto } from "../dtos/user-update-request.dto";
import { UserUpdateImageRequestDto } from "../dtos/user-update-image-request.dto";
import { ClientStatusEnum } from "../enums/client-status.enum";
import { UserUpdatePasswordRequestDto } from "../dtos/user-update-password-request.dto";
import { UserUpdateResponseDto } from "../dtos/user-update-response.dto";
import { UserGetResponseDto } from "../dtos/user-get-response.dto";
import { VerificationService } from "./verification.service";
import { Client } from "../schemas/client.chema";
import { ProductStatusEnum } from "../enums/product-status.enum";
import { UserNewPasswordDto } from "../dtos/userNewPassword.dto";

@Injectable()
export class ClientService extends BaseService<ClientInterface> {

    constructor(
        private _repository: ClientRepository,
        private readonly _verificationService: VerificationService,
    ) {
        super(_repository)
    }

    override async register(item: ClientInterface): Promise<ClientInterface> {

        item.password = await bcrypt.hash(item.password, 13);
        if (item.profile == "client") {
            item.status = await ClientStatusEnum.active
        }
        if (item.profile == "provider") {
            item.status = await ClientStatusEnum.inactive
        }

        return this._repository.register(item);
    }

    async getByEmail(email: string): Promise<ClientInterface> {
        return await this._repository.getByEmail(email);
    }

    async getByCnpj(cnpj: string): Promise<ClientInterface> {
        return await this._repository.getByCnpj(cnpj);
    }


    // async getByEmailWithoutPassword(email: string): Promise<ClientInterface> {
    //   return await this._repository.({ email }).select('-password');
    // }

    async updateUser(_id: string, dto: UserUpdateRequestDto): Promise<boolean> {
        const result = this._repository.update(
            _id,
            dto
        )
        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async updateImage(_id: string, dto: UserUpdateImageRequestDto): Promise<boolean> {
        const result = this._repository.update(
            _id,
            dto
        )
        if (result) {
            return true;
        } else {
            return false;
        }
    }

    // async updatePassword(
    //     _id: string,
    //     dto: UserUpdatePasswordRequestDto,
    // ): Promise<UserUpdateResponseDto> {
    //     const user = await this._repository.getById(_id);

    //     if (!user) throw new BadRequestException('user not found!');

    //     if (!(await bcrypt.compare(dto.password, user.password)))
    //         throw new BadRequestException('wrong password!');

    //     dto.password = await bcrypt.hash(dto.newPassword, 13);

    //     const result = await this._repository.updatePassword(
    //         _id,
    //         dto,
    //     );

    //     return new UserUpdateResponseDto(_id, result.email);
    // }

    async changePassword(_id: string, dto: UserNewPasswordDto):  Promise<Omit<ClientInterface, "password">> {

        const user =  await this._repository.getById(_id);
        if( user) {
            const checkPassword = await bcrypt.compare(dto.oldPassword, user.password)
            if (checkPassword) {
                const newPassword = await bcrypt.hash(dto.newPassword, 13)
                return await this._repository.updatePassword(_id, newPassword)
            } else {
                throw new Error('Senha incorreta')
            }
        }
}



    async updateStatus(id: string, status: ClientStatusEnum) {
        await this._repository.updateStatus(id, status);
    }


    async listByUserStatus(status: ClientStatusEnum[]) {
        return this._repository.listByUserStatus(status);
    }

    async countUsers(): Promise<number> {
        const users = await this._repository.findAll();
        return users.length;
    }


    async deleteUser(_id: string): Promise<ClientInterface> {
        return await this._repository.deleteUser(_id);
    }
}