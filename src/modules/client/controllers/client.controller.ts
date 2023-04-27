import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtClientAuthGuard } from 'src/modules/shared/guards/jwt-client-auth.guard';
import { EncryptInterceptor } from 'src/modules/shared/interceptors/encrypt.interceptor';
import { ResponseDto } from '../../shared/dtos/response.dto';
import { ValidatorInterceptor } from '../../shared/interceptors/validator.interceptor';
import { ClientRegisterRequestDto } from '../dtos/client-register-request.dto';
import { UserChangePasswordConfirmationDto } from '../dtos/user-change-password-confirmation.dto';
import { UserUpdateImageRequestDto } from '../dtos/user-update-image-request.dto';
import { UserUpdateRequestDto } from '../dtos/user-update-request.dto';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { ClientInterface } from '../interface/user.interface';
import { ClientService } from '../services/client.service';
import { VerificationService } from '../services/verification.service';
import { ClientRegisterValidator } from '../validators/client-register.validator';
import * as bcrypt from 'bcryptjs';
import { ClientStatusEnum } from '../enums/client-status.enum';
import { UserUpdatePasswordValidator } from '../validators/user-update-password.validator';
import { UserUpdatePasswordRequestDto } from '../dtos/user-update-password-request.dto';
import { UserResetPasswordRequestDto } from '../dtos/user-reset-password-request.dto';
import { ClientRepository } from '../repositories/client.repository';
import { UserNewPasswordDto } from '../dtos/userNewPassword.dto';


@ApiTags('client')
@Controller('client/user')
export class ClientController {
  private readonly logger = new Logger(ClientController.name);

  constructor(
    private readonly _clientService: ClientService,
    private readonly verificationService: VerificationService,
    private readonly _clientRepository: ClientRepository
  ) { }

  @Get('id/:id')
  @HttpCode(200)
  @UseGuards(JwtClientAuthGuard)
  @ApiBearerAuth()
  async get(@Param('id') _id: string) {
    try {
      const response = await this._clientService.getById(_id);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @HttpCode(200)
  @UseGuards(JwtClientAuthGuard)
  @ApiBearerAuth()
  async getClientAuth(@Req() request) {
    try {
      const payload = request.user;

      const response = await this._clientService.getByEmail(payload.email);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('list')
  @HttpCode(200)
  @UseGuards(JwtClientAuthGuard)
  @ApiBearerAuth()
  async list() {
    try {
      const response = await this._clientService.list();

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Get('list/:cnpj')
  @HttpCode(200)
  @UseGuards(JwtClientAuthGuard)
  @ApiBearerAuth()
  async getByCnpj(@Param('cnpj') cnpj: string) {
    try {
      const response = await this._clientService.getByCnpj(cnpj);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('register')
  @HttpCode(201)
  @UseInterceptors(new ValidatorInterceptor(new ClientRegisterValidator()))
  async register(@Body() dto: ClientRegisterRequestDto) {
    try {
      const response = await this._clientService.register(
        dto as ClientInterface,
      );

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('edit-user')
  @HttpCode(200)
  @UseGuards(JwtClientAuthGuard)
  @ApiBearerAuth()
  async editUser(
    @Body() dto: UserUpdateRequestDto,
    @Req() request,
  ) {
    try {
      const payload: JwtPayload = request.user;
      const response = await this._clientService.updateUser(
        payload.userId,
        dto
      );
      return new ResponseDto(true, response, null);
    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('upload-image')
  @HttpCode(200)
  @UseGuards(JwtClientAuthGuard)
  @ApiBearerAuth()
  async uploadImage(@Req() request, @Body() dto: UserUpdateImageRequestDto) {
    try {
      // const user = await this._clientService.getById(request.user.userId);

      const result = await this._clientService.updateImage(request.user.userId, dto);

      return new ResponseDto(true, result, null);

    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @Get('verify-code/:email/:code')
  // @HttpCode(200)
  // async verifyCode(@Param('email') email: string, @Param('code') code: number) {

  //   let result = false;

  //   const user = await this._clientService.getByEmail(email);

  //   const verification = await this.verificationService.getByUser(user);

  //   if (!verification)
  //     throw new NotFoundException('Email de verificação não enviado!');

  //   const now = new Date();
  //   if (now > verification.deadline) {
  //     await this.verificationService.delete(verification._id);
  //     throw new UnauthorizedException('Email expirado!');
  //   }

  //   if (verification.attempt == 5) {
  //     await this.verificationService.delete(verification._id);
  //     throw new UnauthorizedException(
  //       'Você excedeu o limite de 5 tentativas!',
  //     );
  //   }

  //   if (verification.code != code) {
  //     const attempt = verification.attempt + 1;

  //     this.verificationService.incrementAttempt(verification._id, attempt);
  //   } else {
  //     result = true;
  //   }

  //   return new ResponseDto(true, { isValid: result }, null);
  // }

  @Put('password-confirmation')
  @HttpCode(200)
  @UseInterceptors(
    new EncryptInterceptor(),
    // new ValidatorInterceptor(new UserChangePasswordConfirmationValidator()),
  )
  async updatePassword(@Body() dto: UserChangePasswordConfirmationDto) {

    console.log(dto);

    const user = await this._clientService.getByEmail(dto.email);

    const verification = await this.verificationService.getByUser(user);

    if (!verification)
      throw new NotFoundException('Email de verificação não enviado!');

    const now = new Date();
    if (now > verification.deadline) {
      await this.verificationService.delete(verification._id);
      throw new UnauthorizedException('Email expirado!');
    }

    if (verification.attempt == 5) {
      await this.verificationService.delete(verification._id);
      throw new UnauthorizedException(
        'Você excedeu o limite de 5 tentativas!',
      );
    }

    if (verification.code != dto.code) {
      const attempt = verification.attempt + 1;

      this.verificationService.incrementAttempt(verification._id, attempt);

      throw new UnauthorizedException('Código inválido!');
    }

    await this.verificationService.delete(verification._id);

    const result = await this._clientRepository.updatePassword(
      user._id,
      await bcrypt.hash(dto.newPassword, 13),
    );

    if (user.status === ClientStatusEnum.inactive)
      await this._clientService.updateStatus(user._id, ClientStatusEnum.active);

    return new ResponseDto(
      true,
      {
        _id: result._id,
        email: result.email,
      },
      null,
    );

  }

  @Get('get-user')
  @HttpCode(200)
  @UseGuards(JwtClientAuthGuard)
  @ApiBearerAuth()
  async getUserByJWT(@Req() request) {

    const payload: JwtPayload = request.user;
    const result = await this._clientRepository.getByEmailWithoutPassword(
      payload.userId,
    );
    return new ResponseDto(true, result, null);
  }



  // @Post('resend-email/:email')
  // @HttpCode(200)
  // async resendEmail(@Param('email') email: string) {

  //   const user = await this._clientService.getByEmail(email);
  //   const result = await this.verificationService.send(user); //dto.email

  //   console.log(result);

  //   return new ResponseDto(true, result, null);

  // }

  @Put('forgot-password')
  @HttpCode(200)
  @UseInterceptors(new ValidatorInterceptor(new UserUpdatePasswordValidator()))
  async redefinePassword(@Body() dto: UserUpdatePasswordRequestDto) {

    
    try {
      let user = await this._clientService.getByEmail(dto.email);
  
      const response = await this._clientRepository.updatePassword(
        user.id,
        await bcrypt.hash(dto.newPassword, 13),
      );
  
      return new ResponseDto(true, response, null);
    } catch (error) {
      console.log(error);
  
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }


    
    
    // let user = await this._clientService.getByEmail(dto.email);

    // const response = await this._clientService.updatePassword(
    //   user.id,
    //   await bcrypt.hash(dto.newPassword, 13),
    // );

    // return new ResponseDto(true, response, null);
  
  }


  @Put('alterar-senha/:id')
  @HttpCode(200)
  // @ApiBearerAuth()
  // @UseGuards(JwtBackofficeAuthGuard, FuncoesGuard)
  // @Funcoes(FuncaoEnum.administrator)
  async changePassword(
    @Param('id') _id: string, @Body() dto: UserNewPasswordDto
  ) {

    try {
      const response = await this._clientService.changePassword(_id, dto);
      console.log('response sem password',response)
      return new ResponseDto(
        true,
        response,
        null,
      );


    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }














  // @Post('reset-password-verification')
  // @HttpCode(200)
  // async resetPassword(@Body() dto: UserResetPasswordRequestDto) {

  //   const user = await this._clientService.getByEmail(dto.email);
  //   const result = await this.verificationService.send(user); //dto.email

  //   console.log(result);

  //   return new ResponseDto(true, result, null);

  // }
}