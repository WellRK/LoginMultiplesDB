import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { authenticator } from "otplib";
import { TfaDeleteRequestDto } from "../dtos/tfa/tfa-delete-request.dto";
import { TfaGenerateResponseDto } from "../dtos/tfa/tfa-generate-response.dto";
import { TfaGetResponseDto } from "../dtos/tfa/tfa-get-response.dto";
import { TfaRegisterRequestDto } from "../dtos/tfa/tfa-register-request.dto";
import { TfaRegisterResponseDto } from "../dtos/tfa/tfa-register-response.dto";
import { ClientStatusEnum } from "../enums/client-status.enum";
import { TfaInterface } from "../interface/tfa.interface";
import { Tfa } from "../schemas/tfa-schema";
import { ClientService } from "./client.service";
import * as bcrypt from 'bcryptjs';
import { TfaVerifyRequestDto } from "../dtos/tfa/tfa-verify-request.dto";
import { TfaVerifyAuthRequestDto } from "../dtos/tfa/tfa-verify-auth-request.dto";

export class TFAService {

  constructor(
    @InjectModel(Tfa.name) private readonly model: Model<TfaInterface>,
    private userService: ClientService,
  ) { }

  async save(dto: TfaRegisterRequestDto): Promise<TfaInterface> {
    const data = await new this.model(dto);
    return data.save();
  }

  async getByUserId(userId: string): Promise<TfaGetResponseDto> {
    const tfa = await this.model.findOne({ user: userId });

    return new TfaGetResponseDto(
      tfa?._id,
      tfa?.url,
      tfa?.user._id,
      tfa?.secret,
    );
  }

  async create(email: string): Promise<TfaGenerateResponseDto> {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(email, 'Xeque Mate', secret);
    return new TfaGenerateResponseDto(secret, otpauthUrl);
  }

  async register(dto: TfaRegisterRequestDto): Promise<TfaRegisterResponseDto> {
    dto.user = await this.userService.getById(dto.userId);

    const tfa: TfaInterface = await this.model.findOne({ user: dto.user });

    if (tfa) throw new ForbiddenException('2fa already registered!');

    const result = await new this.model(dto);
    result.save();

    return new TfaRegisterResponseDto(result._id, dto.user._id);
  }

  async delete(dto: TfaDeleteRequestDto) {

    dto.user = await this.userService.getById(dto.userId);

    if (!dto.user)
      throw new NotFoundException('Email ou senha inválido(s)!');

    if (dto.user.status === ClientStatusEnum.inactive)
      throw new UnauthorizedException('Erro ao realizar a autenticação!');

    if (dto.user && await bcrypt.compare(dto.password, dto.user.password)) {
      await this.model.deleteOne({ user: dto.user });
    }
    else
      throw new BadRequestException('Erro ao deletar 2fa!');
  }

  verify(dto: TfaVerifyRequestDto): boolean {
    return authenticator.verify({ token: dto.code.toString(), secret: dto.secret });
  }

  async verifyAuth(userId: string, dto: TfaVerifyAuthRequestDto): Promise<boolean> {
    const tfa: TfaInterface = await this.model.findOne({ user: userId });

    if (!tfa)
      throw new NotFoundException('2fa not found!');
    return authenticator.verify({ token: dto.code.toString(), secret: tfa.secret });
  }

}