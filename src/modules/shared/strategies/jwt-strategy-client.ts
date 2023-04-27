import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnviromentVariablesEnum } from "../enums/enviroment.variables.enum";
import { JwtPayloadClientInterface } from "../interfaces/jwt-payload-client.interface";

@Injectable()
export class JwtStrategyClient extends PassportStrategy(Strategy, 'jwt-client') {

    constructor(
        readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get(EnviromentVariablesEnum.JWT_KEY_CLIENT),
        });
    }

    async validate(payload: JwtPayloadClientInterface) {
        return payload;
    }
}