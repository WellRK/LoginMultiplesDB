import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Logger, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "src/modules/shared/dtos/response.dto";
import { JwtClientAuthGuard } from "src/modules/shared/guards/jwt-client-auth.guard";
import { EncryptInterceptor } from "src/modules/shared/interceptors/encrypt.interceptor";
import { ValidatorInterceptor } from "src/modules/shared/interceptors/validator.interceptor";
import { TfaDeleteRequestDto } from "../dtos/tfa/tfa-delete-request.dto";
import { TfaRegisterRequestDto } from "../dtos/tfa/tfa-register-request.dto";
import { TfaVerifyAuthRequestDto } from "../dtos/tfa/tfa-verify-auth-request.dto";
import { TfaVerifyRequestDto } from "../dtos/tfa/tfa-verify-request.dto";
import { JwtPayload } from "../interface/jwt-payload.interface";
import { AuthenticationClientService } from "../services/authentication-client.service";
import { ClientService } from "../services/client.service";
import { TFAService } from "../services/tfa.service";
import { TfaVerifyValidator } from "../validators/tfa-verify-validator";

@ApiTags('2fa')
@Controller('2fa')
export class TfaController {
  private readonly logger = new Logger(TfaController.name);

  constructor(
    private readonly _tfaService: TFAService,
    private readonly _clientService: ClientService,
    private readonly authenticationClientService: AuthenticationClientService,
  ) { }

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtClientAuthGuard)
  async get(@Req() request): Promise<any> {
    try {
      const payload: JwtPayload = request.user;
      const response = await this._tfaService.getByUserId(payload.userId);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('generate')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtClientAuthGuard)
  async generate(@Req() request) {
    try {
      const payload: JwtPayload = request.user;

      const response = await this._tfaService.create(payload.email);

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
  @ApiBearerAuth()
  @UseGuards(JwtClientAuthGuard)
  // @UseInterceptors(new ValidatorInterceptor(new TfaRegisterValidator()))
  async registrar(@Req() request, @Body() dto: TfaRegisterRequestDto) {
    try {
      const payload: JwtPayload = request.user;
      dto.userId = payload.userId;

      const response = await this._tfaService.register(dto);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('delete')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtClientAuthGuard)
  async delete(@Req() request, @Body() dto: TfaDeleteRequestDto) {
    try {
      const payload: JwtPayload = request.user;

      dto.userId = payload.userId;

      // const isValid = this._tfaService.verify(dto);

      // if (!isValid) throw new BadRequestException('Código inválido!');

      await this._tfaService.delete(dto);

      return new ResponseDto(true, {}, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('verify')
  @HttpCode(200)
  @UseGuards(JwtClientAuthGuard)
  @ApiBearerAuth()
  async verify(@Body() dto: TfaVerifyRequestDto) {
    try {
      const response = this._tfaService.verify(dto);
      return new ResponseDto(
        true,
        {
          isValid: response,
        },
        null,
      );
    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('verify/auth')
  @HttpCode(200)
  @UseGuards(JwtClientAuthGuard)
  @ApiBearerAuth()
  async verifyRegistered(@Req() request, @Body() dto: TfaVerifyAuthRequestDto) {
    try {
      const payload: JwtPayload = request.user;

      const user = await this._clientService.getById(payload.userId);

      const isValid = await this._tfaService.verifyAuth(user._id, dto);

      return new ResponseDto(
        true,
        {
          isValid: isValid,
        },
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

}