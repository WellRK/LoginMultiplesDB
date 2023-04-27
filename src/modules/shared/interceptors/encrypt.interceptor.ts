
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ResponseDto } from '../dtos/response.dto';
import CryptoUtil from '../utils/crypto.util';
import BooleanUtil from '../utils/boolean.util';
import { EnviromentVariablesEnum } from '../enums/enviroment.variables.enum';

export class EncryptInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const payloadKey = process.env[EnviromentVariablesEnum.PAYLOAD_ENCRYPT_KEY];
    const payload = context.switchToHttp().getRequest().body.payload;

    if (
      BooleanUtil.getBoolean(process.env[EnviromentVariablesEnum.ENABLE_DOCS])
    ) {
      if (
        !!context
          .switchToHttp()
          .getRequest()
          .headers.referer.match(
            new RegExp(
              `http://localhost:${process.env.PORT}/docs`,
              'g',
            ),
          )
      ) {
        return next.handle();
      }
    }

    if (!payload)
      throw new HttpException(
        new ResponseDto(false, null, ['payload is mandatory!']),
        HttpStatus.BAD_REQUEST,
      );

    const decryptedBody = JSON.parse(
      CryptoUtil.decrypt(
        payloadKey,
        context.switchToHttp().getRequest().body.payload,
      ),
    );

    if (!decryptedBody)
      throw new HttpException(
        new ResponseDto(false, null, ['error trying to decrypt the payload!']),
        HttpStatus.BAD_REQUEST,
      );

    context.switchToHttp().getRequest().body = decryptedBody;

    return next.handle();
  }
}