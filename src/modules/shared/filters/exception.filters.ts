import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseDto } from '../dtos/response.dto';
import { EnviromentVariablesEnum } from '../enums/enviroment.variables.enum';
import BooleanUtil from '../utils/boolean.util';

@Catch(HttpException)
export class ServerExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    let messsageErros: string[] = [];
    if (exception.response.errors && exception.response.errors.length > 0)
      messsageErros += exception.response.errors;
    if (exception.response.message && exception.response.message.length > 0)
      messsageErros += exception.response.message;
    response
      .status(status)
      .json(new ResponseDto(false, null, messsageErros));
  }
}
