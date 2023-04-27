import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnviromentVariablesEnum } from "../enums/enviroment.variables.enum";
import { JwtPayloadBackofficeInterface } from "../interfaces/jwt-payload-backoffice.interface";

@Injectable()
export class JwtStrategyBackoffice extends PassportStrategy(Strategy,'jwt-backoffice') {

    constructor(
        readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get(EnviromentVariablesEnum.JWT_KEY_BACKOFFICE),
        });
    }

    async validate(payload: JwtPayloadBackofficeInterface) {
        return payload;
    }
}