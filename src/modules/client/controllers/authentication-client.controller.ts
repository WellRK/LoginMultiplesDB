import { Body, Controller, HttpCode, HttpException, HttpStatus, Logger, Post, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "../../shared/dtos/response.dto";
import { AuthenticateClientRequestDto } from "../dtos/authenticate-client-request.dto";
import { AuthenticationClientService } from "../services/authentication-client.service";

@ApiTags('client')
@Controller('client/authetication')
export class AuthenticationClientController {

  private readonly _logger = new Logger(AuthenticationClientController.name);

  constructor(
    private readonly _authenticationClientService: AuthenticationClientService,
  ) { }

  @Post('/authenticate')
  @HttpCode(200)
  async authenticate(
    @Body() dto: AuthenticateClientRequestDto,
  ) {

    try {

      const response = await this._authenticationClientService.authenticate(dto);

      return new ResponseDto(
        true,
        response,
        null,
      );

    } catch (error) {

      this._logger.error(error.message);

      throw new HttpException(
        new ResponseDto(
          false,
          null,
          [error.message]), HttpStatus.BAD_REQUEST);
    }
  }
}